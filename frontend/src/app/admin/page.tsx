'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ExternalLink, X, Save } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);

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
    
    const handleDelete = async (id: string, name: string) => {
        if (confirm(`⚠️ คุณต้องการลบสินค้ารายการ "${name}" ออกจากระบบใช่หรือไม่?\n\n* การกระทำนี้ไม่สามารถย้อนกลับได้! สินค้าและตัวเลือกทั้งหมดจะหายไปจากคิวหน้าร้านทันที`)) {
            try {
                await axios.delete(`/api/admin/products?id=${id}`);
                loadProducts();
            } catch (error: any) {
                alert('เกิดข้อผิดพลาดในการลบสินค้า: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setEditLoading(true);
        try {
            await axios.patch('/api/admin/products', {
                id: editingProduct.id,
                name: editingProduct.name,
                description: editingProduct.description,
                category: editingProduct.category,
                base_price: editingProduct.base_price,
                image_url: editingProduct.image_url,
                video_url: editingProduct.video_url,
            });
            setEditingProduct(null);
            loadProducts();
            alert('บันทึกการแก้ไขเรียบร้อยแล้ว ✨');
        } catch (error: any) {
            alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.error || error.message));
        } finally {
            setEditLoading(false);
        }
    };

    
    return (
        <>
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
                                    <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                        <button
                                            id={`edit-${p.id}`}
                                            onClick={() => setEditingProduct({ ...p })}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="แก้ไขสินค้า"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-red-300 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 rounded-md" title="ลบสินค้าชิ้นนี้"><Trash2 className="w-4 h-4" /></button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
            <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">✉️ แก้ไขสินค้า</h2>
                        <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleEditSave} className="p-6 space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">ชื่อสินค้า *</label>
                            <input required type="text" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">รายละเอียดสินค้า</label>
                            <textarea rows={3} className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">หมวดหมู่</label>
                                <input type="text" placeholder="เช่น shirt, pants, accessory" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">ราคา (บาท) *</label>
                                <input required type="number" min="0" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.base_price || ''} onChange={e => setEditingProduct({...editingProduct, base_price: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">URL รูปภาพหลัก</label>
                            <input type="url" placeholder="https://res.cloudinary.com/..." className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.image_url || ''} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">URL วิดีโอ (ไม่บังคับ)</label>
                            <input type="url" className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-craft-400 outline-none" value={editingProduct.video_url || ''} onChange={e => setEditingProduct({...editingProduct, video_url: e.target.value})} />
                        </div>
                        {editingProduct.image_url && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">ตัวอย่างรูปภาพปัจจุบัน</p>
                                <img src={editingProduct.image_url} alt="preview" className="h-24 w-auto rounded border object-cover" />
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
                            <button type="submit" disabled={editLoading} className="px-5 py-2 rounded-lg bg-craft-800 text-white hover:bg-craft-900 transition-colors flex items-center gap-2 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {editLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
}
