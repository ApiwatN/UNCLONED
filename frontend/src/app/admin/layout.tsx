import Link from 'next/link';
import { Package, ShoppingCart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <span className="font-bold text-xl text-craft-800 tracking-wide">
                UN<span className="font-light">CLONED</span> <span className="text-xs font-normal text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded ml-2">Admin</span>
            </span>
        </div>
        <nav className="p-4 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 bg-craft-50 text-craft-800 rounded-md font-medium">
                <Package className="w-5 h-5 text-craft-600" />
                <span>คลังสินค้า (Products)</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-not-allowed opacity-50">
                <ShoppingCart className="w-5 h-5" />
                <span>คำสั่งซื้อ (Coming Soon)</span>
            </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  );
}
