'use client'
import { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, AlertCircle } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function AddToCartModal({ product, isOpen, onClose }: { product: any, isOpen: boolean, onClose: () => void }) {
    const { addToCart, toggleCart } = useCartStore();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    // Auto-select first available variant
    useEffect(() => {
        if (isOpen && product?.product_variants) {
            const firstAvailable = product.product_variants.find((v: any) => v.stock_quantity > 0);
            setSelectedVariant(firstAvailable || null);
            setQuantity(1);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const basePrice = Number(product.base_price);
    const displayPrice = selectedVariant ? basePrice + Number(selectedVariant.additional_price) : basePrice;

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart({
            cartKey: `${product.id}-${selectedVariant.id}`,
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            image: product.image_url,
            size: selectedVariant.size,
            price: displayPrice,
            quantity: quantity
        });
        
        onClose();
        // Removed toggleCart() here so the sidebar doesn't pop up!
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up sm:animate-zoom-in relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 z-10"><X className="w-5 h-5"/></button>
                
                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <img src={product.image_url} alt={product.name} className="w-24 h-32 object-cover rounded-lg border border-gray-100 shadow-sm" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 leading-tight mb-1 pr-6">{product.name}</h2>
                            <p className="text-2xl font-bold text-craft-700">฿{displayPrice.toLocaleString()}</p>
                            {selectedVariant && (
                                <p className="text-xs text-gray-500 mt-2">สต็อก: {selectedVariant.stock_quantity} ชิ้น</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Size Selection */}
                    <div className="mb-6 border-t border-gray-100 pt-4">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">เลือกแบบ/ไซส์</label>
                        <div className="flex flex-wrap gap-2">
                            {product.product_variants?.map((v: any) => {
                                const outOfStock = v.stock_quantity <= 0;
                                const isSelected = selectedVariant?.id === v.id;
                                return (
                                    <button 
                                        key={v.id}
                                        disabled={outOfStock}
                                        onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${outOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : isSelected ? 'border-craft-800 bg-craft-800 text-white shadow-md' : 'border-gray-300 text-gray-700 hover:border-craft-400'}`}
                                    >
                                        {v.size} {v.additional_price > 0 ? `(+฿${v.additional_price})` : ''}
                                        {outOfStock && <span className="block text-[10px] mt-0.5">สินค้าหมด</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity */}
                    {selectedVariant && (
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">จำนวน</label>
                            <div className="flex items-center w-max border border-gray-300 rounded-lg overflow-hidden h-12">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 h-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                ><Minus className="w-4 h-4" /></button>
                                <span className="w-16 text-center font-semibold text-gray-800">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(selectedVariant.stock_quantity, quantity + 1))}
                                    className="px-4 h-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                ><Plus className="w-4 h-4" /></button>
                            </div>
                            {quantity === selectedVariant.stock_quantity && <p className="text-xs text-orange-500 mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> จำกัดการซื้อตามจำนวนสต็อกสูงสุด</p>}
                        </div>
                    )}

                    <button 
                        disabled={!selectedVariant}
                        onClick={handleAddToCart}
                        className="w-full bg-craft-800 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center shadow-lg disabled:opacity-50"
                    >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        เพิ่มลงตะกร้า • ฿{(displayPrice * quantity).toLocaleString()}
                    </button>
                </div>
            </div>
        </div>
    );
}
