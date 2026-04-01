'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-craft-800 mb-4 tracking-wide">คอลเลกชันล่าสุด</h2>
          <div className="w-16 h-1 bg-craft-400 mx-auto rounded"></div>
        </div>
        
        {products.length === 0 ? (
            <div className="text-center py-10 text-craft-500">ยังไม่มีสินค้าในร้านค้าขณะนี้</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
            ))}
            </div>
        )}
      </div>
    </section>
  );
}
