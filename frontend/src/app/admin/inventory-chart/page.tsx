'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, Package, AlertTriangle } from 'lucide-react';

export default function InventoryChartPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadProducts();
    }, []);

    // --- Inventory Chart Computations ---
    const categoryColors: Record<string, string> = {
        tops: 'bg-blue-400', bottoms: 'bg-purple-400', dresses: 'bg-pink-400',
        accessories: 'bg-amber-400', handwoven: 'bg-green-400',
    };
    const stockByCategory = (products as any[]).reduce((acc: Record<string, number>, p: any) => {
        const cat = p.category || 'other';
        const totalStock = p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0;
        acc[cat] = (acc[cat] || 0) + totalStock;
        return acc;
    }, {});
    const maxCatStock = Math.max(...Object.values(stockByCategory).map(Number), 1);

    const statusCounts = (products as any[]).reduce(
        (acc, p: any) => {
            const total = p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0;
            if (total === 0) acc.out++;
            else if (total <= 5) acc.low++;
            else acc.ok++;
            return acc;
        },
        { ok: 0, low: 0, out: 0 }
    );

    const totalInventoryValue = (products as any[]).reduce((sum, p: any) => {
        const stock = p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0;
        return sum + stock * Number(p.base_price);
    }, 0);

    const totalStock = (products as any[]).reduce((sum, p: any) =>
        sum + (p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0), 0);

    // 1. Stock by Size
    const sizeColors: Record<string, string> = { 
        S: 'bg-emerald-500', M: 'bg-teal-500', L: 'bg-cyan-500', XL: 'bg-sky-500', 'Free Size': 'bg-indigo-500', 'XS': 'bg-green-500' 
    };
    const stockBySize = (products as any[]).reduce((acc: Record<string, number>, p: any) => {
        p.product_variants?.forEach((v: any) => {
            const sz = v.size || 'Other';
            acc[sz] = (acc[sz] || 0) + v.stock_quantity;
        });
        return acc;
    }, {});
    const maxSizeStock = Math.max(...Object.values(stockBySize).map(Number), 1);

    // 2. Low-Stock Alert List (By Size)
    const lowStockVariants = (products as any[]).flatMap(p => {
        if (!p.product_variants || p.product_variants.length === 0) return [];
        return p.product_variants.map((v: any) => ({
            name: p.name,
            size: v.size || 'N/A',
            stock: v.stock_quantity || 0
        }));
    }).filter(v => v.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6);

    // 3. Top 5 Capital Tied-Up Products
    const topCapitalProducts = (products as any[]).map(p => {
        const stock = p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0;
        const val = stock * Number(p.base_price);
        return { name: p.name, stock, value: val };
    }).filter(p => p.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">กราฟแสดงสินค้าคงเหลือ</h1>
                <p className="text-gray-500 text-sm mt-1">สรุปภาพรวมทั้งหมดของคลังสินค้าในรูปแบบกราฟ</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-craft-50 p-4 rounded-lg flex items-center">
                            <div className="bg-craft-100 p-3 rounded-full mr-4">
                                <Package className="w-6 h-6 text-craft-700" />
                            </div>
                            <div>
                                <p className="text-sm text-craft-600 font-medium">สต็อกรวมทั้งร้าน</p>
                                <p className="text-2xl font-bold text-craft-900">{totalStock.toLocaleString()} <span className="text-base font-normal text-gray-500">ชิ้น</span></p>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <BarChart2 className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">มูลค่าคลังประเมิน</p>
                                <p className="text-2xl font-bold text-blue-900">฿{totalInventoryValue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg flex items-center">
                            <div className="bg-orange-100 p-3 rounded-full mr-4">
                                <AlertTriangle className="w-6 h-6 text-orange-700" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-600 font-medium">สถานะสต็อก</p>
                                <div className="text-sm font-semibold mt-1">
                                    <span className="text-green-600 mr-3">พร้อมขาย: {statusCounts.ok}</span>
                                    <span className="text-orange-600 mr-3">ใกล้หมด: {statusCounts.low}</span>
                                    <span className="text-red-500">หมด: {statusCounts.out}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Categories */}
                        <div className="border border-gray-100 rounded-lg p-5 flex flex-col justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-5">สัดส่วนสต็อกตามหมวดหมู่</h3>
                            <div className="space-y-4">
                                {['tops', 'bottoms', 'dresses', 'accessories', 'handwoven'].map(cat => {
                                    const count = stockByCategory[cat] || 0;
                                    const pct = maxCatStock > 0 ? (count / maxCatStock) * 100 : 0;
                                    return (
                                        <div key={cat} className="relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-600 uppercase">{cat}</span>
                                                <span className="text-gray-500">{count} ชิ้น</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3">
                                                <div 
                                                    className={`h-3 rounded-full ${categoryColors[cat] || 'bg-gray-400'}`} 
                                                    style={{ width: `${pct}%`, transition: 'width 1s ease-in-out' }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="border border-gray-100 rounded-lg p-5 flex flex-col justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-5">สัดส่วนสต็อกตามไซส์ (Size Distribution)</h3>
                            <div className="space-y-4">
                                {Object.keys(stockBySize).sort((a, b) => stockBySize[b] - stockBySize[a]).slice(0, 6).map(sz => {
                                    const count = stockBySize[sz];
                                    const pct = maxSizeStock > 0 ? (count / maxSizeStock) * 100 : 0;
                                    return (
                                        <div key={sz} className="relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-600">{sz}</span>
                                                <span className="text-gray-500">{count} ชิ้น</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3">
                                                <div 
                                                    className={`h-3 rounded-full ${sizeColors[sz] || 'bg-gray-400'}`} 
                                                    style={{ width: `${pct}%`, transition: 'width 1s ease-in-out' }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Low Stock Alert */}
                        <div className="border border-orange-100 bg-orange-50/30 rounded-lg p-5">
                            <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-100 pb-3 mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                สินค้าที่ต้อง "สั่งผลิตด่วน" (Low-Stock Alert)
                            </h3>
                            <ul className="space-y-3">
                                {lowStockVariants.length === 0 ? (
                                    <li className="text-gray-500 text-sm">ไม่มีสินค้าเหลือน้อย</li>
                                ) : (
                                    lowStockVariants.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-orange-100">
                                            <div className="flex flex-col mr-2 overflow-hidden">
                                                <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                                                <span className="text-xs text-gray-500 mt-1">ไซส์: <span className="font-semibold px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">{item.size}</span></span>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {item.stock === 0 ? 'หมดเกลี้ยง!' : `เหลือ ${item.stock} ชิ้น`}
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Top Capital Tied-up */}
                        <div className="border border-blue-100 bg-blue-50/30 rounded-lg p-5">
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-3 mb-4 flex items-center">
                                <BarChart2 className="w-5 h-5 mr-2" />
                                5 อันดับสินค้า "เงินจม" ในโกดัง (Capital Tied-up)
                            </h3>
                            <ul className="space-y-3">
                                {topCapitalProducts.length === 0 ? (
                                    <li className="text-gray-500 text-sm">ไม่มีข้อมูลสินค้า</li>
                                ) : (
                                    topCapitalProducts.map((p, i) => (
                                        <li key={i} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-blue-100">
                                            <div className="flex items-center overflow-hidden">
                                                <span className="text-gray-400 font-bold mr-3 w-4 text-right">{i+1}.</span>
                                                <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                                            </div>
                                            <div className="text-right whitespace-nowrap ml-4">
                                                <p className="text-sm font-bold text-blue-700">฿{p.value.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">สต็อก {p.stock} ชิ้น</p>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
