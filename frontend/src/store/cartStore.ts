import { create } from 'zustand';

export interface CartItem {
    cartKey: string;
    productId: string;
    variantId: string;
    name: string;
    image: string;
    size: string;
    price: number;
    quantity: number;
}

interface CartStore {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (cartKey: string) => void;
    changeQuantity: (cartKey: string, delta: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
    cart: [],
    isCartOpen: false,
    
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    
    addToCart: (newItem) => set((state) => {
        const existingItem = state.cart.find(item => item.cartKey === newItem.cartKey);
        if (existingItem) {
            return {
                cart: state.cart.map(item => 
                    item.cartKey === newItem.cartKey 
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                )
            };
        }
        return { 
            cart: [...state.cart, newItem]
        };
    }),
    
    removeFromCart: (cartKey) => set((state) => ({
        cart: state.cart.filter(item => item.cartKey !== cartKey)
    })),
    
    changeQuantity: (cartKey, delta) => set((state) => ({
        cart: state.cart.map(item => {
            if (item.cartKey === cartKey) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
            }
            return item;
        })
    })),
    
    clearCart: () => set({ cart: [] })
}));

export default useCartStore;
