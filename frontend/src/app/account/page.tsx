'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, MapPin, User, LogOut, PackageOpen, Truck } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({ phone: '', address: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/';
                return;
            }
            setUser(session.user);

            // Fetch Profile
            const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (prof) {
                setProfile({ phone: prof.phone || '', address: prof.address || '' });
            }

            // Fetch Orders
            const { data: ords } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', session.user.id).order('created_at', { ascending: false });
            if (ords) setOrders(ords as any);
            
            setLoading(false);
        }
        fetchUserData();
    }, []);

    const updateProfile = async () => {
        if (!user) return;
        try {
            await supabase.from('profiles').upsert({ id: user.id, phone: profile.phone, address: profile.address });
            alert('อัปเดตข้อมูลจัดส่งเรียบร้อย!');
        } catch (e: any) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (loading) return <div className="min-h-screen flex text-gray-500 items-center justify-center bg-craft-50">กำลังตรวจสอบสิทธิ์...</div>;

    return (
        <div className="min-h-screen bg-craft-50 pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">บัญชีของฉัน</h1>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex items-center text-sm font-medium transition-colors">
                        <LogOut className="w-4 h-4 mr-2" /> ออกจากระบบ
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ข้อมูลส่วนตัว */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-craft-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-craft-800" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">{user?.user_metadata?.full_name || 'ลูกค้าคนสำคัญ'}</h2>
                                    <p className="text-xs text-gray-500 truncate w-40">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm mt-4 border-t border-gray-100 pt-4">
                                <h3 className="font-semibold text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-2"/> ที่อยู่สำหรับจัดส่งเริ่มต้น</h3>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">เบอร์โทรศัพท์ (ใส่แล้วไม่ต้องกรอกซ้ำตอนซื้อ)</label>
                                    <input type="tel" className="w-full border p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-craft-500 outline-none" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">ที่อยู่ที่บ้าน</label>
                                    <textarea rows={3} className="w-full border p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-craft-500 outline-none" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                                </div>
                                <button onClick={updateProfile} className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition shadow-sm font-medium">บันทึกข้อมูลส่วนตัว</button>
                            </div>
                        </div>
                    </div>

                    {/* ประวัติการสั่งซื้อและเลขพัสดุ */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><Package className="w-5 h-5 mr-3 text-craft-600"/> สถานะการจัดส่ง และประวัติสั่งซื้อ</h2>
                            
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                                        <PackageOpen className="w-12 h-12 mb-3 text-gray-300" />
                                        <p>คุณยังไม่มีประวัติการสั่งซื้อ</p>
                                    </div>
                                ) : (
                                    orders.map((o: any) => (
                                        <div key={o.id} className="border border-gray-200 rounded-xl p-5 hover:border-craft-400 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs bg-gray-100 text-gray-600 font-mono px-2 py-1 rounded">#{o.id.split('-')[0]}</span>
                                                    <div className="text-xs text-gray-400 mt-2">{new Date(o.created_at).toLocaleString('th-TH')}</div>
                                                </div>
                                                
                                                <div className="text-right flex flex-col items-end">
                                                    {o.status === 'shipped' ? (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center"><Truck className="w-3 h-3 mr-1" /> จัดส่งพัสดุแล้ว!</span>
                                                    ) : (
                                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">กำลังดำเนินการ หรือ รอตรวจสลิป</span>
                                                    )}
                                                    <div className="font-bold text-gray-800 mt-2">฿{Number(o.total_amount).toLocaleString()}</div>
                                                </div>
                                            </div>

                                            {/* Tracking UI */}
                                            {o.tracking_number && (
                                                <div className="mt-4 bg-craft-50 p-4 rounded-lg flex items-center justify-between border border-craft-100">
                                                    <div>
                                                        <span className="text-xs text-craft-600 font-bold block mb-1">เลขพัสดุ (Tracking Number)</span>
                                                        <span className="font-mono font-bold text-gray-800 text-lg tracking-wider">{o.tracking_number}</span> <span className="text-sm text-gray-500 ml-2">จัดส่งโดย: {o.tracking_company || 'Flash/Kerry'}</span>
                                                    </div>
                                                    <button className="bg-white px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50">คัดลอกเลข</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
