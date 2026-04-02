import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        
        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate + 'T23:59:59.999Z');

        const { data: orders, error: ordersError } = await query;

        if (ordersError) throw ordersError;

        let orderItems: any[] = [];
        if (orders && orders.length > 0) {
            const orderIds = orders.map((o: any) => o.id);
            // Fetch in chunks if too many, but for simple apps doing it directly is fine (Supabase typically handles 1000 items in IN clause)
            const { data, error: itemsError } = await supabase
                .from('order_items')
                .select(`
                    quantity,
                    price_at_time,
                    product_variants (
                        size,
                        products (
                            name,
                            category
                        )
                    )
                `)
                .in('order_id', orderIds);
            
            if (itemsError) throw itemsError;
            orderItems = data || [];
        }

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);
        const totalOrders = orders.length;
        const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.status === 'shipped').length;
        const pendingOrders = orders.filter((o: any) => o.status === 'pending_payment' || o.status === 'verifying_payment').length;

        // 1. Product Analysis
        const productSales: Record<string, { qty: number, revenue: number, category: string }> = {};
        for (const item of orderItems) {
            if (item.product_variants?.products?.name) {
                const pName = item.product_variants.products.name;
                const cat = item.product_variants.products.category || 'other';
                if (!productSales[pName]) productSales[pName] = { qty: 0, revenue: 0, category: cat };
                productSales[pName].qty += item.quantity;
                productSales[pName].revenue += (Number(item.price_at_time) * item.quantity);
            }
        }
        const topProducts = Object.entries(productSales)
            .map(([name, data]) => ({ name, qty: data.qty, revenue: data.revenue, category: data.category }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 10);

        // 2. Customer Analysis
        const customersData: Record<string, { spend: number, ordersCount: number }> = {};
        for (const o of orders) {
            const phone = o.customer_phone || 'unknown';
            if (!customersData[phone]) customersData[phone] = { spend: 0, ordersCount: 0 };
            customersData[phone].spend += Number(o.total_amount || 0);
            customersData[phone].ordersCount += 1;
        }
        
        let returningCustomers = 0;
        let newCustomers = 0;
        const topCustomers = Object.entries(customersData)
            .map(([, data]) => {
                if (data.ordersCount > 1) returningCustomers++;
                else newCustomers++;
                return data;
            })
            .sort((a, b) => b.spend - a.spend);

        // 3. Time Analysis (Sales by Hours, Days, Months)
        const salesByHour: Record<string, number> = {};
        const salesByDay: Record<string, number> = { 'อา.': 0, 'จ.': 0, 'อ.': 0, 'พ.': 0, 'พฤ.': 0, 'ศ.': 0, 'ส.': 0 };
        const salesByMonth: Record<string, number> = {};
        
        const dayMap = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
        const monthMap = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

        for (let i = 0; i < 24; i++) salesByHour[`${i}:00`.padStart(5, '0')] = 0;

        for (const o of orders) {
            if (!o.created_at) continue;
            const d = new Date(o.created_at);
            const hour = `${d.getHours()}:00`.padStart(5, '0');
            const day = dayMap[d.getDay()];
            const month = `${monthMap[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
            
            salesByHour[hour] += Number(o.total_amount || 0);
            salesByDay[day] += Number(o.total_amount || 0);
            
            if (!salesByMonth[month]) salesByMonth[month] = 0;
            salesByMonth[month] += Number(o.total_amount || 0);
        }

        // 4. Marketing/Promotions Analysis (Conversion Proxy)
        // If pending_payment is extremely high, meaning drop-off at payment (abandoned checkout).
        const paymentConversionRate = totalOrders > 0 ? (totalOrders - pendingOrders) / totalOrders * 100 : 0;

        return NextResponse.json({
            success: true,
            totalRevenue,
            totalOrders,
            completedOrders,
            pendingOrders,
            topProducts,
            customers: {
                totalActive: returningCustomers + newCustomers,
                returning: returningCustomers,
                new: newCustomers,
                topSpenderValue: topCustomers[0]?.spend || 0
            },
            timeAnalysis: {
                salesByHour,
                salesByDay,
                salesByMonth
            },
            promotions: {
                paymentConversionRate: Math.round(paymentConversionRate)
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
