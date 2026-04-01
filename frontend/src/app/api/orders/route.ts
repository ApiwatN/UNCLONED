import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer_name, customer_address, customer_phone, items, total_amount, payment_slip_url } = body;
        
        // 1. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                customer_name,
                customer_address,
                customer_phone,
                total_amount,
                payment_slip_url,
                status: payment_slip_url ? 'verifying_payment' : 'pending_payment'
            }])
            .select()
            .single();
            
        if (orderError) throw orderError;
        
        // 2. Insert order items and Deduct Stock
        if (items && items.length > 0) {
            const orderItems = items.map((item: any) => ({
                order_id: order.id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price_at_time: item.price
            }));
            
            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            // 3. ระบบตัดสต็อกอัตโนมัติ (Auto-Deduct Inventory)
            for (const item of items) {
                const { data: variant } = await supabase.from('product_variants').select('stock_quantity').eq('id', item.variant_id).single();
                
                if (variant) {
                    if (variant.stock_quantity >= item.quantity) {
                        // ปรับลดจำนวนสต็อกลงตามจำนวนที่ลูกค้าสั่ง หยิบของออกจากโกดังเว็บทันที!
                        await supabase.from('product_variants').update({ stock_quantity: variant.stock_quantity - item.quantity }).eq('id', item.variant_id);
                    } else {
                        // ถ้าสต็อกไม่พอ ให้ลบออเดอร์ทิ้ง (Rollback) แล้วเด้งแจ้งลูกค้ารู้ตัว
                        await supabase.from('orders').delete().eq('id', order.id);
                        throw new Error(`ขออภัยครับ สินค้าที่คุณสั่งมีสต็อกไม่เพียงพอ`);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
