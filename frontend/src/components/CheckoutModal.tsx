'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, UploadCloud, ShieldCheck, QrCode } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { createClient } from '@supabase/supabase-js';
import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, clearCart } = useCartStore();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_address: ''
    });
    
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        async function fetchUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                setFormData(f => ({ ...f, customer_name: session.user.user_metadata?.full_name || '' }));
                
                const { data: prof } = await supabase.from('profiles').select('phone, address').eq('id', session.user.id).single();
                if (prof) {
                    setFormData(f => ({ ...f, customer_phone: prof.phone || '', customer_address: prof.address || '' }));
                }
            }
        }
        fetchUser();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSlipFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const uploadSlip = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName) throw new Error("Missing CloudName");
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', preset || 'uncloned_unsigned');
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, form);
            return res.data.secure_url;
        } catch (error) {
            throw new Error("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!slipFile) throw new Error("กรุณาแนบสลิปการโอนเงิน");

            const payment_slip_url = await uploadSlip(slipFile);
            
            const payload = {
                ...formData,
                user_id: user ? user.id : null,
                total_amount: total,
                payment_slip_url,
                items: cart.map(item => ({
                    variant_id: item.variantId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const res = await axios.post('/api/orders', payload);
            
            alert(`สั่งซื้อสำเร็จ! เลขที่ออเดอร์ของคุณคือ #${res.data.orderId.split('-')[0]}\nสามารถดูสถานะพัสดุได้ในเมนู 'บัญชีของฉัน'`);
            clearCart();
            onClose();
            window.location.href = '/account'; // พาไปดูสถานะ
            
        } catch (err: any) {
            alert(err.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"><X className="w-5 h-5"/></button>
                
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">สรุปการสั่งซื้อ <span className="text-craft-600 font-normal ml-2">({cart.reduce((s,i)=>s+i.quantity,0)} ชิ้น)</span></h2>
                    
                    {/* ยอดเงิน */}
                    <div className="bg-craft-50 border border-craft-200 p-4 rounded-xl mt-4 mb-6 flex justify-between items-center text-craft-800 font-bold">
                        <span>ยอดโอนชำระเงิน</span>
                        <span className="text-2xl">฿{total.toLocaleString()}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                                <input required type="text" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-craft-500 outline-none" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                                <input required type="tel" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-craft-500 outline-none" value={formData.customer_phone} onChange={e => setFormData({...formData, customer_phone: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">ที่อยู่สำหรับจัดส่งพัสดุ <span className="text-red-500">*</span></label>
                            <textarea required rows={3} className="w-full border p-2.5 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-craft-500 outline-none" value={formData.customer_address} onChange={e => setFormData({...formData, customer_address: e.target.value})} />
                        </div>

                        {/* PromptPay QR Code */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-white">
                            <label className="block text-gray-800 font-bold mb-3 flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-craft-700"/>
                                สแกน PromptPay เพื่อชำระเงิน
                            </label>
                            <div className="flex flex-col items-center bg-gradient-to-b from-craft-50 to-white border border-craft-100 rounded-xl p-5 mb-4">
                                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100 mb-3">
                                    <QRCodeSVG
                                        value={generatePayload(
                                            process.env.NEXT_PUBLIC_PROMPTPAY_ID || '0812345678',
                                            { amount: total }
                                        )}
                                        size={180}
                                        level="M"
                                        includeMargin={false}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">ชำระยอดเงิน</p>
                                    <p className="text-3xl font-bold text-craft-800">฿{total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                                    <p className="text-xs text-gray-400 mt-1">พร้อมเพย์: {process.env.NEXT_PUBLIC_PROMPTPAY_ID || '081-234-5678'}</p>
                                </div>
                            </div>
                            
                            <label className="block text-gray-600 mb-2">แนบสลิปการโอนเงิน <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 text-center relative overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Slip Preview" className="h-32 object-contain mb-2 shadow-sm rounded border" />
                                ) : (
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                )}
                                <span className="text-gray-500 text-xs font-medium">{previewUrl ? 'คลิกที่นี่เพื่อเปลี่ยนสลิปใหม่' : 'แตะเพื่อเลือกไฟล์สลิป หรือลากมาวาง'}</span>
                                <input required={!slipFile} type="file" accept="image/*" onChange={handleSlipChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading || !slipFile} className="w-full bg-craft-800 text-white font-medium py-3 rounded-lg hover:bg-craft-900 transition-colors shadow-md disabled:opacity-50 mt-4 flex justify-center items-center">
                            {loading ? 'กำลังยืนยันออเดอร์...' : `ยืนยันคำสั่งซื้อ: ฿${total.toLocaleString()}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
