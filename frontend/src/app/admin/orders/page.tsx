'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Check, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadOrders() {
            try {
                const res = await axios.get('/api/admin/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, []);
    
    if (loading) return <div className="p-8 max-w-7xl mx-auto"><div className="h-40 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 animate-pulse">กำลังซิงค์ข้อมูลคำสั่งซื้อ...</div></div>;
    
    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">คำสั่งซื้อลูกค้า <span className="bg-craft-100 text-craft-800 text-sm px-3 py-1 rounded-full ml-2">{orders.length}</span></h1>
                    <p className="text-gray-500 text-sm mt-1">ตรวสอบใบสั่งซื้อ เช็คสลิปการโอนเงิน และดูยอดล่าสุด</p>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                            <th className="p-4 font-medium">รหัส / วันที่</th>
                            <th className="p-4 font-medium">ข้อมูลลูกค้า</th>
                            <th className="p-4 font-medium">รายการสินค้าในตะกร้า</th>
                            <th className="p-4 font-medium">ยอดเงิน (฿)</th>
                            <th className="p-4 font-medium">สลิปหลักฐาน</th>
                            <th className="p-4 font-medium text-right">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr><td colSpan={6} className="p-12 text-center text-gray-400">ยังไม่มีรายการสั่งซื้อเข้ามาในระบบครับ</td></tr>
                        )}
                        {orders.map((o: any) => (
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4 align-top">
                                    <div className="text-xs text-gray-400 font-mono mb-1">#{o.id.split('-')[0]}</div>
                                    <div className="text-sm text-gray-800">{new Date(o.created_at).toLocaleDateString('th-TH')}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="font-medium text-gray-800">{o.customer_name}</div>
                                    <div className="text-sm text-gray-500 mt-1">{o.customer_phone}</div>
                                    <div className="text-xs text-gray-400 mt-1 bg-gray-100 p-2 rounded">{o.customer_address}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 align-top">
                                    {o.order_items?.map((item: any) => (
                                        <div key={item.id} className="mb-2 pb-2 last:mb-0 last:pb-0 border-b border-gray-100 last:border-0">
                                            <div className="font-medium text-gray-700">{item.product_variants?.products?.name || 'สินค้า'}</div>
                                            <span className="text-xs text-craft-600 bg-craft-50 px-2 py-0.5 rounded mr-2">ไซส์ {item.product_variants?.size || '-'}</span> 
                                            <span className="text-gray-500 font-medium">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </td>
                                <td className="p-4 font-medium text-craft-800 align-top text-lg">
                                    {Number(o.total_amount).toLocaleString()}
                                </td>
                                <td className="p-4 align-top">
                                    {o.payment_slip_url ? (
                                        <a href={o.payment_slip_url} target="_blank" className="text-blue-500 hover:text-blue-600 flex items-center text-sm font-medium bg-blue-50 px-3 py-2 rounded-md transition-colors w-max"><ExternalLink className="w-4 h-4 mr-2"/> ดูสลิปโอนเงิน</a>
                                    ) : (
                                        <span className="text-gray-400 text-sm bg-gray-50 px-3 py-2 rounded-md block w-max">ไม่พบสลิป</span>
                                    )}
                                </td>
                                <td className="p-4 text-right align-top">
                                    {o.status === 'pending_payment' && <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium inline-flex items-center"><Clock className="w-3 h-3 mr-1"/> รอโอนเงิน</span>}
                                    {o.status === 'verifying_payment' && <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-medium inline-flex items-center shadow-sm"><Check className="w-3 h-3 mr-1"/> รอการตรวจสอบ</span>}
                                    {o.status === 'paid' && <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-medium inline-flex items-center"><Check className="w-3 h-3 mr-1"/> จ่ายแล้ว</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
