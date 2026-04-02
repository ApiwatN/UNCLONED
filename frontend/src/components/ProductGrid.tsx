'use client'
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // สร้าง category list จากสินค้าจริง (dynamic)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => { if (p.category) cats.add(p.category); });
    return ['ทั้งหมด', ...Array.from(cats)];
  }, [products]);

  // Filter products based on search + category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery.trim() || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <section id="shop" className="py-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-48 h-8 bg-craft-200 mx-auto mb-4 rounded"></div>
            <div className="w-16 h-1 bg-craft-200 mx-auto rounded mb-16"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-craft-100 aspect-[3/4] rounded-lg"></div>
                ))}
            </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-craft-800 mb-4 tracking-wide">คอลเลกชันล่าสุด</h2>
          <div className="w-16 h-1 bg-craft-400 mx-auto rounded"></div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-craft-400 pointer-events-none" />
            <input
              type="text"
              id="product-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-craft-200 bg-white text-craft-800 placeholder-craft-400 focus:outline-none focus:ring-2 focus:ring-craft-400 transition-all text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-craft-400 hover:text-craft-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-craft-400 shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  id={`filter-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                    selectedCategory === cat
                      ? 'bg-craft-800 text-white border-craft-800 shadow-sm'
                      : 'bg-white text-craft-600 border-craft-200 hover:border-craft-400 hover:bg-craft-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-craft-500">
            <Search className="w-10 h-10 mx-auto mb-3 text-craft-300" />
            <p className="font-medium">ไม่พบสินค้าที่ค้นหา</p>
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ทั้งหมด'); }}
              className="mt-4 text-sm text-craft-600 underline hover:text-craft-900"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-craft-400 mb-4">แสดง {filteredProducts.length} จาก {products.length} รายการ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
