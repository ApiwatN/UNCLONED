import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uncloned.com';

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
                        await supabase.from('product_variants').update({ stock_quantity: variant.stock_quantity - item.quantity }).eq('id', item.variant_id);
                    } else {
                        await supabase.from('orders').delete().eq('id', order.id);
                        throw new Error(`ขออภัยครับ สินค้าที่คุณสั่งมีสต็อกไม่เพียงพอ`);
                    }
                }
            }
        }

        // 4. ส่ง Email แจ้ง Admin (non-blocking — ถ้า email ล้มเหลวออเดอร์ยังบันทึกได้ปกติ)
        try {
            const shortId = order.id.split('-')[0].toUpperCase();
            const itemList = items.map((item: any) => 
                `<li>Variant: ${item.variant_id} × ${item.quantity} ชิ้น — ฿${item.price.toLocaleString()}</li>`
            ).join('');

            await resend.emails.send({
                from: 'UNCLONED Orders <onboarding@resend.dev>',
                to: ADMIN_EMAIL,
                subject: `🛍️ ออเดอร์ใหม่! #${shortId} — ฿${Number(total_amount).toLocaleString()} (${customer_name})`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #4a3728; border-bottom: 2px solid #e8d5c4; padding-bottom: 10px;">
                            🛍️ ออเดอร์ใหม่เข้ามาแล้ว!
                        </h2>
                        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                            <tr>
                                <td style="padding: 8px; color: #666; width: 140px;">เลขออเดอร์</td>
                                <td style="padding: 8px; font-weight: bold; color: #1a1a1a;">#${shortId}</td>
                            </tr>
                            <tr style="background: #f9f5f1;">
                                <td style="padding: 8px; color: #666;">ลูกค้า</td>
                                <td style="padding: 8px; font-weight: bold;">${customer_name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; color: #666;">เบอร์โทร</td>
                                <td style="padding: 8px;">${customer_phone}</td>
                            </tr>
                            <tr style="background: #f9f5f1;">
                                <td style="padding: 8px; color: #666;">ที่อยู่จัดส่ง</td>
                                <td style="padding: 8px;">${customer_address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; color: #666;">ยอดชำระ</td>
                                <td style="padding: 8px; font-weight: bold; font-size: 20px; color: #7c5c46;">฿${Number(total_amount).toLocaleString()}</td>
                            </tr>
                        </table>
                        <h3 style="color: #4a3728;">รายการสินค้า</h3>
                        <ul style="line-height: 2;">${itemList}</ul>
                        ${payment_slip_url ? `<p><a href="${payment_slip_url}" style="background: #4a3728; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 10px;">📄 ดูสลิปการโอนเงิน</a></p>` : ''}
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e8d5c4;"/>
                        <p style="text-align: center;"><a href="https://uncloned-frontend.vercel.app/admin/orders" style="background: #7c5c46; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">จัดการออเดอร์ใน Admin Panel →</a></p>
                    </div>
                `,
            });
        } catch (emailError) {
            // Log แต่ไม่ throw — ไม่ให้ email ล้มเหลวกระทบ order
            console.error('[Email notification failed]', emailError);
        }

        return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
