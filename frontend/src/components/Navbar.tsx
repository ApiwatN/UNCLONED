'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, ShoppingBag, Menu, X } from 'lucide-react'
import useCartStore from '@/store/cartStore'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cart, toggleCart } = useCartStore()
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="fixed w-full z-50 bg-craft-50/90 backdrop-blur-md border-b border-craft-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer group">
            <Scissors className="h-6 w-6 text-craft-600 mr-2 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-2xl tracking-wide text-craft-800">
              UN<span className="font-light">CLONED</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            <Link href="/#home" className="text-craft-700 hover:text-craft-500 transition-colors">หน้าแรก</Link>
            <Link href="/#shop" className="text-craft-700 hover:text-craft-500 transition-colors">สินค้าทั้งหมด</Link>
            <Link href="/#reviews" className="text-craft-700 hover:text-craft-500 transition-colors">รีวิว</Link>
            <Link href="/#story" className="text-craft-700 hover:text-craft-500 transition-colors">เรื่องราวของเรา</Link>
            
            {/* Cart Icon */}
            <button onClick={toggleCart} className="relative p-2 text-craft-700 hover:text-craft-500 transition-all duration-300 transform hover:scale-105">
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-craft-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button onClick={toggleCart} className="relative p-2 text-craft-700 transition-all duration-300 transform">
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-craft-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-craft-700 p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-craft-50 border-t border-craft-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">หน้าแรก</Link>
            <Link href="/#shop" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">สินค้าทั้งหมด</Link>
            <Link href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">รีวิว</Link>
            <Link href="/#story" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">เรื่องราวของเรา</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
