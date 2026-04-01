'use client'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function CartSidebar() {
  const { cart, isCartOpen, toggleCart, removeFromCart, changeQuantity } = useCartStore();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-craft-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-craft-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-craft-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            ตะกร้าสินค้า ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button onClick={toggleCart} className="p-2 text-craft-500 hover:text-craft-800 hover:bg-craft-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 font-prompt no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-craft-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p>ยังไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.cartKey} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md bg-craft-50" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-craft-800 leading-tight pr-4">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.cartKey)} className="text-craft-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-craft-500 mb-3 mt-1">Size: {item.size}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-craft-200 rounded">
                        <button onClick={() => changeQuantity(item.cartKey, -1)} className="px-2 py-1 text-craft-500 hover:bg-craft-50 rounded-l transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm text-craft-800 font-medium">{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.cartKey, 1)} className="px-2 py-1 text-craft-500 hover:bg-craft-50 rounded-r transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-medium text-craft-800">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-craft-100 bg-craft-50">
            <div className="flex justify-between mb-4 text-craft-800 font-medium">
              <span>ยอดรวมทั้งสิ้น</span>
              <span className="text-xl">฿{total.toLocaleString()}</span>
            </div>
            <button className="w-full bg-craft-800 text-white py-4 rounded-md font-medium hover:bg-craft-900 shadow-md transform active:scale-[0.98] transition-all">
              ดำเนินการชำระเงิน
            </button>
          </div>
        )}
      </div>
    </>
  );
}
