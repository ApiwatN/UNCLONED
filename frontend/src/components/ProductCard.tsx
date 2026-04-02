'use client'
import { useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import AddToCartModal from './AddToCartModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductCard({ product }: { product: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { lang } = useLanguage();

  // คำนวณสต็อครวมว่าของหมดหรือยัง
  const totalStock = product.product_variants?.reduce((sum: number, v: any) => sum + v.stock_quantity, 0) || 0;
  const isOutOfStock = totalStock <= 0;

  const categoryMap: any = {
      tops: lang === 'en' ? 'Tops' : 'เสื้อ',
      bottoms: lang === 'en' ? 'Bottoms' : 'กางเกง/กระโปรง',
      dresses: lang === 'en' ? 'Dresses' : 'เดรส'
  };

  return (
    <>
    <div className="group bg-white rounded-lg overflow-hidden border border-craft-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
      {/* Badge สำหรับของหมด หรือ ตัวขายดี */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-sm z-10 shadow-sm">{lang === 'en' ? 'Out of Stock' : 'สินค้าหมด'}</div>
      )}
      {!isOutOfStock && totalStock < 5 && (
        <div className="absolute top-3 right-3 bg-craft-800 text-white text-xs font-bold px-3 py-1 rounded-sm z-10 shadow-sm flex items-center animate-pulse"><Star className="w-3 h-3 mr-1 fill-white"/> {lang === 'en' ? 'Low Stock!' : 'ใกล้หมด!'}</div>
      )}

      {/* รูปภาพ กดแล้วไปหน้ารายละเอียด */}
      <div className="relative aspect-[3/4] overflow-hidden bg-craft-50">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
            <img 
              src={product.image_url || "https://images.unsplash.com/photo-1596521864156-f4422e50523e?q=80&w=2070"} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
            />
        </Link>
        
        {/* Overlay Hover Button - สำหรับ Desktop */}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-2 z-10 pointer-events-none">
          <Link href={`/product/${product.id}`} className="pointer-events-auto w-full bg-craft-900 text-white shadow-lg py-2.5 rounded text-sm font-semibold hover:bg-black active:scale-95 transition-all duration-200 flex justify-center items-center mb-2">
            {lang === 'en' ? 'View Details' : 'ดูรายละเอียดสินค้า'}
          </Link>
          <button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
            className="pointer-events-auto w-full bg-white/95 backdrop-blur-sm text-craft-900 border border-craft-200 shadow-lg py-2.5 rounded text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all duration-200 flex justify-center items-center disabled:opacity-0"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {lang === 'en' ? 'Add to Cart' : 'ใส่ตะกร้า'}
          </button>
        </div>
      </div>
      
      {/* ข้อมูลสินค้าใต้รูป */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{categoryMap[product.category] || product.category}</h3>
            <h2 className="text-lg font-bold text-craft-900 mb-2 leading-snug line-clamp-2 hover:underline">{lang === 'en' ? (product.name_en || product.name) : product.name}</h2>
            <div className="flex items-center space-x-2">
                <p className="text-craft-700 font-semibold text-lg">฿{Number(product.base_price).toLocaleString()}</p>
            </div>
        </Link>
        
        {/* Mobile Button - ซ่อนแบบ Overlay กดติดยากในมือถือ เลยเอามาไว้บรรทัดล่างให้กดง่ายๆ */}
        <div className="sm:hidden mt-4 grid grid-cols-2 gap-2">
          <Link href={`/product/${product.id}`} className="flex justify-center items-center bg-craft-800 text-white rounded py-2 text-xs font-semibold hover:bg-black active:scale-95 transition-all duration-200">
            {lang === 'en' ? 'Details' : 'รายละเอียด'}
          </Link>
          <button 
              disabled={isOutOfStock}
              onClick={() => setModalOpen(true)}
              className="flex justify-center items-center bg-craft-50 text-craft-800 border border-craft-200 py-2 rounded text-xs font-semibold hover:bg-craft-100 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
              <ShoppingBag className="w-3 h-3 mr-1" />
              {isOutOfStock ? (lang === 'en' ? 'Sold Out' : 'หมด') : (lang === 'en' ? 'Add' : 'ใส่ตะกร้า')}
          </button>
        </div>
      </div>
    </div>

    <AddToCartModal isOpen={modalOpen} onClose={() => setModalOpen(false)} product={product} />
    </>
  );
}
