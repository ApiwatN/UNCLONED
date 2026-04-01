import { ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCartStore();

  const handleQuickAdd = () => {
    // Select the first variant as a quick-add default, fallback if empty
    const defaultVariant = product.product_variants?.[0] || { id: 'no-variant', size: 'Free Size', additional_price: 0 };
    addToCart({
      cartKey: `${product.id}-${defaultVariant.id}`,
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.image_url,
      size: defaultVariant.size,
      price: product.base_price + Number(defaultVariant.additional_price),
      quantity: 1
    });
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-craft-100 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-craft-50 cursor-pointer">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1596521864156-f4422e50523e?q=80&w=2070&auto=format&fit=crop"} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); handleQuickAdd(); }}
            className="w-full bg-craft-800/90 backdrop-blur-sm text-white py-3 rounded text-sm font-medium hover:bg-craft-900 transition-colors flex justify-center items-center"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            ใส่ตะกร้าเลย
          </button>
        </div>
      </div>
      <div className="p-5 text-center cursor-pointer">
        <h3 className="text-lg font-medium text-craft-800 mb-1">{product.name}</h3>
        <p className="text-craft-600">฿{Number(product.base_price).toLocaleString()}</p>
      </div>
    </div>
  );
}
