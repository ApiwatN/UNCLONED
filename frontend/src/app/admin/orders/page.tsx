'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Check, Clock, Truck, Save } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Store temp edit states by order ID
    const [editStates, setEditStates] = useState<Record<string, any>>({});
    
    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await axios.get('/api/admin/orders');
            setOrders(res.data);
            
            // Pre-fill edit states
            const states: any = {};
            res.data.forEach((o: any) => {
                states[o.id] = { tracking_number: o.tracking_number || '', tracking_company: o.tracking_company || 'Flash Express' };
            });
            setEditStates(states);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateOrder = async (orderId: string) => {
        try {
            const tracking_number = editStates[orderId].tracking_number;
            const tracking_company = editStates[orderId].tracking_company;
            if (!tracking_number) return alert('กรุณากรอกเลขพัสดุก่อนบันทึก');

            await axios.patch('/api/admin/orders', { 
                id: orderId, 
                tracking_number, 
                tracking_company, 
                status: 'shipped' 
            });
            
            alert('อัปเดตและแจ้งเลขพัสดุสำเร็จ!');
            loadOrders(); // reload
        } catch (e: any) {
            alert('เกิดข้อผิดพลาด: ' + e.message);
        }
    };
    
    if (loading) return <div className="p-8 max-w-7xl mx-auto"><div className="h-40 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 animate-pulse">กำลังซิงค์ข้อมูลคำสั่งซื้อ...</div></div>;
    
    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <PackageIcon className="w-6 h-6 mr-3 text-craft-600"/> 
                        คำสั่งซื้อลูกค้า <span className="bg-craft-100 text-craft-800 text-sm px-3 py-1 rounded-full ml-3">{orders.length}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">ตรวสอบใบสั่งซื้อ เช็คสลิปการโอนเงิน และคีย์เลขพัสดุ</p>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                            <th className="p-4 font-medium w-32">รหัส / วันที่</th>
                            <th className="p-4 font-medium min-w-[200px]">ข้อมูลจัดส่ง</th>
                            <th className="p-4 font-medium">สลิปหลักฐาน & ยอดเงิน</th>
                            <th className="p-4 font-medium text-right min-w-[300px]">จัดการสถานะ / เลขพัสดุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">ยังไม่มีรายการสั่งซื้อเข้ามาในระบบครับ</td></tr>
                        )}
                        {orders.map((o: any) => (
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4 align-top">
                                    <div className="text-sm font-bold text-craft-800 bg-craft-100 px-2 py-1 rounded w-max mb-2">#{o.id.split('-')[0]}</div>
                                    <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString('th-TH')}</div>
                                    <div className="mt-3 text-xs text-gray-400">
                                        {o.order_items?.map((item: any) => (
                                            <div key={item.id} className="mb-1">
                                                • {item.product_variants?.products?.name} <span className="text-craft-600 ml-1">[{item.product_variants?.size}]</span> x{item.quantity}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                
                                <td className="p-4 align-top">
                                    <div className="font-medium text-gray-800 flex items-center">{o.customer_name} {o.user_id && <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded uppercase font-bold">สมาชิก</span>}</div>
                                    <div className="text-sm text-craft-600 mt-1 font-mono">{o.customer_phone}</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-white border border-gray-100 p-2 rounded leading-relaxed">{o.customer_address}</div>
                                </td>
                                
                                <td className="p-4 align-top">
                                    <div className="font-bold text-craft-800 text-xl mb-3">฿{Number(o.total_amount).toLocaleString()}</div>
                                    {o.payment_slip_url ? (
                                        <a href={o.payment_slip_url} target="_blank" className="text-craft-700 hover:text-white flex items-center text-xs font-medium bg-craft-100 hover:bg-craft-800 px-3 py-2 rounded-md transition-colors w-max shadow-sm border border-craft-200"><ExternalLink className="w-3 h-3 mr-2"/> ตรวจสอบสลิป</a>
                                    ) : (
                                        <span className="text-red-400 text-xs bg-red-50 px-3 py-2 rounded-md block w-max font-medium">ไม่พบสลิป</span>
                                    )}
                                </td>
                                
                                <td className="p-4 text-right align-top bg-gray-50/50">
                                    <div className="flex flex-col items-end space-y-3">
                                        {o.status === 'verifying_payment' || o.status === 'pending_payment' ? (
                                            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold inline-flex items-center"><Clock className="w-3 h-3 mr-1.5"/> รอตรวจสอบ & ส่งของ</span>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-semibold inline-flex items-center"><Truck className="w-3 h-3 mr-1.5"/> จัดส่งเรียบร้อยแล้ว</span>
                                        )}
                                        
                                        <div className="flex items-center space-x-2 w-full max-w-[280px] bg-white p-2 rounded-lg border border-gray-200 shadow-sm mt-2">
                                            <select 
                                                className="w-1/3 border-none bg-transparent text-xs text-gray-600 outline-none cursor-pointer"
                                                value={editStates[o.id]?.tracking_company || 'Flash Express'}
                                                onChange={e => setEditStates({...editStates, [o.id]: {...editStates[o.id], tracking_company: e.target.value}})}
                                            >
                                                <option>Flash Express</option>
                                                <option>Kerry</option>
                                                <option>J&T</option>
                                                <option>THAIPOST</option>
                                            </select>
                                            <div className="h-6 w-px bg-gray-200"></div>
                                            <input 
                                                type="text" 
                                                placeholder="กรอกเลขพัสดุ (Tracking)" 
                                                className="w-full text-xs outline-none bg-transparent px-2 text-gray-800 font-mono"
                                                value={editStates[o.id]?.tracking_number || ''}
                                                onChange={e => setEditStates({...editStates, [o.id]: {...editStates[o.id], tracking_number: e.target.value}})}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handleUpdateOrder(o.id)}
                                            className="w-full max-w-[280px] bg-craft-800 text-white hover:bg-black text-xs font-semibold py-2 rounded shadow-sm transition-colors flex justify-center items-center"
                                        >
                                            <Save className="w-3 h-3 mr-2" />
                                            {o.status === 'shipped' ? 'อัปเดตเลขพัสดุคลิกที่นี่' : 'ยืนยันสลิปและใส่เลขพัสดุจัดส่ง'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PackageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  )
}
