'use client'
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                window.location.reload();
            } else {
                const { error } = await supabase.auth.signUp({
                    email, password, options: { data: { full_name: fullName } }
                });
                if (error) throw new Error(error.message);
                alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
                setIsLogin(true);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"><X className="w-5 h-5"/></button>
                
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center text-craft-800 mb-2">{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
                    <p className="text-center text-gray-500 text-sm mb-6">{isLogin ? 'เพื่อตรวจสอบสถานะพัสดุของคุณ' : 'รับสิทธิพิเศษและเชื่อมข้อมูลที่อยู่'}</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input required type="text" placeholder="ชื่อ-นามสกุล" className="w-full border border-gray-300 rounded-lg py-3 flex pl-10 focus:ring-2 focus:ring-craft-500 outline-none" value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input required type="email" placeholder="อีเมล" className="w-full border border-gray-300 rounded-lg py-3 flex pl-10 focus:ring-2 focus:ring-craft-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input required type="password" placeholder="รหัสผ่าน (6 ตัวอักษรขึ้นไป)" minLength={6} className="w-full border border-gray-300 rounded-lg py-3 flex pl-10 focus:ring-2 focus:ring-craft-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-craft-800 text-white font-medium py-3 rounded-lg hover:bg-craft-900 transition-colors shadow-md disabled:opacity-50 mt-2">
                            {loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชีใหม่')}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'มีบัญชีอยู่แล้ว? '}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-craft-600 font-semibold hover:underline">
                            {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
