'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    const loadProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        loadProducts();
    }, []);
    
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">จัดการข้อมูลคลังสินค้า</h1>
                    <p className="text-gray-500 text-sm mt-1">อัปโหลดรูปภาพผ่าน Cloudinary ข้อมูลจัดเก็บลง Supabase</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="bg-craft-800 text-white px-5 py-2.5 rounded-md hover:bg-craft-900 flex items-center font-medium shadow-md transition-all active:scale-95">
                        <Plus className="w-4 h-4 mr-2" /> เพิ่มสินค้าใหม่
                    </button>
                )}
            </div>
            
            {showForm && (
                <div className="mb-8 animate-fade-in">
                    <ProductForm 
                        onSuccess={() => { setShowForm(false); loadProducts(); }} 
                        onCancel={() => setShowForm(false)} 
                    />
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                            <th className="p-4 font-medium w-24">รูปภาพ</th>
                            <th className="p-4 font-medium">ชื่อสินค้า</th>
                            <th className="p-4 font-medium">หมวดหมู่</th>
                            <th className="p-4 font-medium">ราคา (฿)</th>
                            <th className="p-4 font-medium">วิดีโอ</th>
                            <th className="p-4 font-medium text-right">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr><td colSpan={6} className="p-12 text-center text-gray-400">ยังไม่มีสินค้าในระบบ ลองกด <span className="text-craft-600 font-medium">"เพิ่มสินค้าใหม่"</span> เพื่อสร้างทดสอบดูสิครับ</td></tr>
                        )}
                        {products.map((p: any) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="w-14 h-20 object-cover rounded bg-gray-100 shadow-sm" />
                                    ) : (
                                        <div className="w-14 h-20 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">No Img</div>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-gray-800">{p.name}</td>
                                <td className="p-4 text-gray-600 capitalize">{p.category}</td>
                                <td className="p-4 text-gray-800 font-medium">{Number(p.base_price).toLocaleString()}</td>
                                <td className="p-4">
                                    {p.video_url ? (
                                        <a href={p.video_url} target="_blank" className="text-blue-500 hover:text-blue-600 flex items-center text-sm"><ExternalLink className="w-3 h-3 mr-1"/> YouTube</a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">พร้อมขาย</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
