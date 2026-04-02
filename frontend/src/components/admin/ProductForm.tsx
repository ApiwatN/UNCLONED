'use client'
import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Save, X, Plus, Trash2 } from 'lucide-react';

export default function ProductForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', name_en: '',
    description: '', description_en: '',
    category: 'tops',
    base_price: '',
    video_url: '',
    material_th: '', material_en: '',
    care_th: '', care_en: '',
    shipping_th: '', shipping_en: '',
    model_info_th: '', model_info_en: '',
    variants: [{ id: Date.now(), size: 'Free Size', stock_quantity: 10, additional_price: 0 }]
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
    if (!cloudName) throw new Error("Missing CloudName");
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset || 'uncloned_unsigned');
    try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, form);
        return res.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error", error);
        throw new Error("ล้มเหลวในการอัปโหลดรูปภาพไปยัง Cloudinary. กรุณาเช็ค Upload Preset (เป็น Unsigned)");
    }
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
      const newVariants = [...formData.variants];
      newVariants[index] = { ...newVariants[index], [field]: value } as any;
      setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
      setFormData({
          ...formData,
          variants: [...formData.variants, { id: Date.now(), size: 'S', stock_quantity: 0, additional_price: 0 }]
      });
  };

  const removeVariant = (index: number) => {
      if (formData.variants.length > 1) {
          const newVariants = [...formData.variants];
          newVariants.splice(index, 1);
          setFormData({ ...formData, variants: newVariants });
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
        // ตัดบรรทัด id จำลองทิ้งก่อนยิงเข้า Database
        variants: formData.variants.map(v => ({ size: v.size, stock_quantity: Number(v.stock_quantity), additional_price: Number(v.additional_price) }))
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
          <h2 className="text-xl font-semibold text-gray-800">เพิ่มสินค้าและนำเข้าโกดัง</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-700 mb-1">ชื่อสินค้า (ไทย) <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-gray-700 mb-1">ชื่อสินค้า (EN)</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none placeholder-gray-300" placeholder="Product Name (English)" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} />
            </div>
            
            <div className="md:col-span-2">
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

        {/* จัดการโกดังสินค้า */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <label className="block font-semibold text-gray-700">คลังสินค้า (ระบุไซส์ / สต็อก / ราคาที่บวกเพิ่มถ้ามี)</label>
                <button type="button" onClick={addVariant} className="text-craft-700 hover:text-craft-900 border border-craft-200 bg-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center shadow-sm">
                    <Plus className="w-3 h-3 mr-1"/> เพิ่มขนาด (Size)
                </button>
            </div>
            
            {formData.variants.map((v, index) => (
                <div key={v.id} className="grid grid-cols-12 gap-3 items-end mb-3 bg-white p-3 rounded-md shadow-sm border border-gray-100">
                    <div className="col-span-5">
                        <label className="block text-xs text-gray-500 mb-1">ชื่อไซส์หรือแบบ</label>
                        <input required type="text" placeholder="เช่น S, M, Free Size, สีแดง" className="w-full border border-gray-300 rounded p-2" value={v.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} />
                    </div>
                    <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">จำนวบใบสต็อก (ชิ้น)</label>
                        <input required type="number" min="0" className="w-full border border-gray-300 rounded p-2" value={v.stock_quantity} onChange={e => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value))} />
                    </div>
                    <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">บวกราคาเพิ่ม (+฿)</label>
                        <input required type="number" min="0" className="w-full border border-gray-300 rounded p-2" value={v.additional_price} onChange={e => handleVariantChange(index, 'additional_price', parseInt(e.target.value))} />
                    </div>
                    <div className="col-span-1 text-right pb-2">
                        <button type="button" onClick={() => removeVariant(index)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-5 h-5 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Bilingual Detail Sections */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-lg text-craft-900 border-l-4 border-craft-500 pl-2">ข้อมูลสินค้าแบบ 2 ภาษา</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">เรื่องราวสินค้า (Story - TH)</label>
                    <textarea rows={3} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">เรื่องราวสินค้า (Story - EN)</label>
                    <textarea rows={3} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})}></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">วัสดุ/เนื้อผ้า (Material - TH)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.material_th} onChange={e => setFormData({...formData, material_th: e.target.value})} placeholder="เช่น ผ้าฝ้าย 100%, นุ่มใส่สบาย"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">วัสดุ/เนื้อผ้า (Material - EN)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.material_en} onChange={e => setFormData({...formData, material_en: e.target.value})} placeholder="e.g. 100% Cotton, Breathable"></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">การดูแลรักษา (Care - TH)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.care_th} onChange={e => setFormData({...formData, care_th: e.target.value})} placeholder="เช่น ซักมือ หรือใส่ถุงซัก"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">การดูแลรักษา (Care - EN)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.care_en} onChange={e => setFormData({...formData, care_en: e.target.value})} placeholder="e.g. Hand wash recommended"></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">สัดส่วนนางแบบ (Model Info - TH)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.model_info_th} onChange={e => setFormData({...formData, model_info_th: e.target.value})} placeholder="เช่น นางแบบสูง 165 ซม. ใส่ไซส์ S"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">สัดส่วนนางแบบ (Model Info - EN)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.model_info_en} onChange={e => setFormData({...formData, model_info_en: e.target.value})} placeholder="e.g. Model is 165cm tall, wearing size S"></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">การจัดส่ง/การคืน (Shipping - TH)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.shipping_th} onChange={e => setFormData({...formData, shipping_th: e.target.value})} placeholder="เช่น จัดส่ง 5-7 วัน, รับเปลี่ยนคืนใน 7 วัน"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-semibold">การจัดส่ง/การคืน (Shipping - EN)</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.shipping_en} onChange={e => setFormData({...formData, shipping_en: e.target.value})} placeholder="e.g. Takes 5-7 days, 7-day returns"></textarea>
                </div>
            </div>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">ลิงก์ YouTube (Optional)</label>
            <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-craft-500 outline-none" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
        </div>

        <div>
            <label className="block text-gray-700 mb-2">รูปภาพหรือวิดีโอ (.mp4) เข้า Store</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-center relative overflow-hidden transition-colors hover:bg-gray-100">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-40 object-contain mb-4" />
                ) : (
                    <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                )}
                <span className="text-gray-500 text-sm font-medium">{previewUrl ? 'คลิกเพื่อเปลี่ยนไฟล์การอัปโหลด' : 'คลิกเลือกไฟล์ หรือลากมาวาง (รองรับ mp4)'}</span>
                <input type="file" accept="image/*,video/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">ยกเลิก</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-craft-800 text-white rounded hover:bg-craft-900 flex items-center shadow-md">
                {loading ? 'กำลังส่งข้อมูลเข้าโกดัง...' : <><Save className="w-4 h-4 mr-2" /> นำสินค้าขึ้นชั้นวาง</>}
            </button>
        </div>
      </form>
    </div>
  );
}
