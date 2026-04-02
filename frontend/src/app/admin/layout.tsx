import Link from 'next/link';
import { Package, ShoppingCart, BarChart, PieChart } from 'lucide-react';

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
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                <Package className="w-5 h-5 text-gray-600" />
                <span>รายการคลังสินค้า</span>
            </Link>
            <Link href="/admin/inventory-chart" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                <PieChart className="w-5 h-5 text-gray-600" />
                <span>กราฟแสดงสินค้าคงเหลือ</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>คำสั่งซื้อ (Orders)</span>
            </Link>
            <Link href="/admin/analytics" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                <BarChart className="w-5 h-5" />
                <span>วิเคราะห์ข้อมูล (Analytics)</span>
            </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  );
}
