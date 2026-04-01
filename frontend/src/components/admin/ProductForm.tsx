'use client'
import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Save, X } from 'lucide-react';

export default function ProductForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'handwoven',
    base_price: '',
    video_url: '', // specifically asked for YouTube integration
    variants: [{ size: 'Free Size', stock_quantity: 10, additional_price: 0 }]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    // Fallback preset if empty
    if (!cloudName) throw new Error("Missing CloudName");

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset || 'uncloned_unsigned');

    try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, form);
        return res.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error", error);
        throw new Error("ล้มเหลวในการอัปโหลดรูปภาพไปยัง Cloudinary. กรุณาเช็ค Upload Preset ใน Cloudinary Console (ตั้งค่าให้เป็น Unsigned)");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = '';
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      await axios.post('/api/admin/products', {
        ...formData,
        base_price: Number(formData.base_price),
        image_url: finalImageUrl,
      });
      
      alert('บันทึกสินค้าใหม่เรียบร้อยแล้ว');
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">เพิ่มสินค้าใหม่</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-700 mb-1">ชื่อสินค้า <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
                <label className="block text-gray-700 mb-1">ราคาเริ่มต้น (บาท) <span className="text-red-500">*</span></label>
                <input required type="number" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} />
            </div>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
            <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="tops">เสื้อ (Tops)</option>
                <option value="bottoms">กางเกง/กระโปรง (Bottoms)</option>
                <option value="dresses">เดรส (Dresses)</option>
                <option value="accessories">เครื่องประดับ (Accessories)</option>
                <option value="handwoven">งานทอมือพิเศษ (Handwoven)</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">คำอธิบายสินค้า</label>
            <textarea rows={3} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">YouTube Video Link (Unlisted) - (Optional)</label>
            <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
        </div>

        <div>
            <label className="block text-gray-700 mb-2">รูปภาพสินค้า</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-center relative overflow-hidden">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-40 object-contain mb-4" />
                ) : (
                    <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                )}
                <span className="text-gray-500 text-sm">{previewUrl ? 'เปลี่ยนรูปภาพใหม่' : 'คลิกหรือลากไฟล์รูปภาพมาวางที่นี่ (อัปโหลดอัตโนมัติผ่าน Cloudinary)'}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">ยกเลิก</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-craft-800 text-white rounded hover:bg-craft-900 disabled:opacity-50 flex items-center">
                {loading ? 'กำลังบันทึกและอัปโหลดรูป...' : <><Save className="w-4 h-4 mr-2" /> บันทึกสินค้า</>}
            </button>
        </div>
      </form>
    </div>
  );
}
