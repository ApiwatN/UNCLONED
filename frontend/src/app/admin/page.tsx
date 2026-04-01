'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ExternalLink, Package } from 'lucide-react';
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
                    <h1 className="text-2xl font-bold text-gray-800">จัดการข้อมูลคลังสินค้า <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-normal ml-2">{products.length} รายการ</span></h1>
                    <p className="text-gray-500 text-sm mt-1">อัปโหลดรูปภาพผ่าน Cloudinary ข้อมูลสต็อกออนไลน์เชื่อมตรงกับหน้าร้าน</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="bg-craft-800 text-white px-5 py-2.5 rounded-md hover:bg-craft-900 flex items-center font-medium shadow-md transition-all active:scale-95">
                        <Plus className="w-4 h-4 mr-2" /> นำสินค้าเข้าโกดัง
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
                            <th className="p-4 font-medium">ข้อมูลสินค้า</th>
                            <th className="p-4 font-medium">คลังไซส์ / สต็อกคงเหลือ</th>
                            <th className="p-4 font-medium">วิดีโอโชว์</th>
                            <th className="p-4 font-medium text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">คลังสินค้าว่างเปล่า ลองนำข้อมูล Mock-up มาใส่ดูสิครับ</td></tr>
                        )}
                        {products.map((p: any) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4 align-top">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="w-16 h-20 object-cover rounded shadow-sm border border-gray-200" />
                                    ) : (
                                        <div className="w-16 h-20 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">No Img</div>
                                    )}
                                </td>
                                <td className="p-4 align-top">
                                    <div className="font-semibold text-gray-800">{p.name}</div>
                                    <div className="text-sm text-gray-500 capitalize">{p.category}</div>
                                    <div className="text-craft-800 font-medium mt-1">฿{Number(p.base_price).toLocaleString()}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="space-y-1">
                                    {p.product_variants?.map((v: any) => (
                                        <div key={v.id} className="text-sm flex items-center justify-between bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm w-48">
                                            <span className="font-medium text-gray-700 bg-gray-100 px-2 rounded-sm text-xs py-0.5">{v.size}</span>
                                            <span className={`font-medium ${v.stock_quantity <= 2 ? 'text-red-600' : 'text-craft-700'}`}>
                                                {v.stock_quantity > 0 ? `${v.stock_quantity} ชิ้น` : 'หมด! (0)'}
                                            </span>
                                        </div>
                                    ))}
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    {p.video_url ? (
                                        <a href={p.video_url} target="_blank" className="text-blue-500 hover:text-blue-600 flex items-center text-sm bg-blue-50 px-2 py-1 rounded inline-block"><ExternalLink className="w-3 h-3 mr-1 inline"/> Link</a>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-right align-top">
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
