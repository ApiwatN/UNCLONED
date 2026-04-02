'use client'
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const { lang } = useLanguage();
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Category translation map
  const getCategoryLabel = (cat: string) => {
    if (cat === 'ทั้งหมด') return lang === 'en' ? 'All Items' : 'ทั้งหมด';
    if (lang === 'th') {
      const thLabels: Record<string, string> = {
        tops: 'เสื้อ',
        bottoms: 'กางเกง/กระโปรง',
        dresses: 'เดรส',
        accessories: 'เครื่องประดับ'
      };
      return thLabels[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1);
    }
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-10 pt-4">
          <h2 className="text-3xl font-semibold text-craft-800 mb-4 tracking-wide">
            {lang === 'en' ? 'Latest Collection' : 'คอลเลกชันล่าสุด'}
          </h2>
          <div className="w-16 h-1 bg-craft-400 mx-auto rounded"></div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 mb-10 border-b border-craft-100 pb-6">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start w-full md:w-auto">
            {categories.length > 1 && categories.map(cat => (
              <button
                key={cat}
                id={`filter-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-craft-800 text-white font-medium shadow-md scale-105'
                    : 'bg-transparent text-craft-600 hover:bg-craft-100'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-craft-400 pointer-events-none" />
            <input
              type="text"
              id="product-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? "Search products..." : "ค้นหาสินค้า..."}
              className="w-full pl-11 pr-10 py-2.5 rounded-full border border-craft-200 bg-craft-50/50 text-craft-800 placeholder-craft-400 focus:outline-none focus:border-craft-400 focus:bg-white focus:shadow-sm transition-all text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-craft-400 hover:text-craft-700 bg-craft-100 p-1 rounded-full">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-craft-500">
            <Search className="w-10 h-10 mx-auto mb-3 text-craft-300" />
            <p className="font-medium">{lang === 'en' ? 'No products found' : 'ไม่พบสินค้าที่ค้นหา'}</p>
            <p className="text-sm mt-1">{lang === 'en' ? 'Try changing your search term or category' : 'ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น'}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ทั้งหมด'); }}
              className="mt-4 text-sm text-craft-600 underline hover:text-craft-900"
            >
              {lang === 'en' ? 'Clear all filters' : 'ล้างตัวกรองทั้งหมด'}
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-craft-400 mb-6 font-medium tracking-wide">
              {lang === 'en' ? 'Showing' : 'แสดง'} {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} {lang === 'en' ? 'of' : 'จาก'} {filteredProducts.length} {lang === 'en' ? 'Items' : 'รายการ'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {currentProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 border border-craft-200 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-craft-50 transition-colors text-craft-700"
                >
                  {lang === 'en' ? 'Previous' : 'ย้อนกลับ'}
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({length: totalPages}).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                        currentPage === i + 1 
                        ? 'bg-craft-800 text-white shadow-md' 
                        : 'text-craft-600 hover:bg-craft-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 border border-craft-200 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-craft-50 transition-colors text-craft-700"
                >
                  {lang === 'en' ? 'Next' : 'ถัดไป'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
