'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Scissors, ShoppingBag, Menu, X, User } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { createClient } from '@supabase/supabase-js'
import LoginModal from './LoginModal'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [isBumping, setIsBumping] = useState(false)
  
  const { cart, toggleCart } = useCartStore()
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)
  
  const prevCountRef = useRef(cartItemCount)

  // ดักจับว่า "กดของลงตะกร้าแล้วรึยัง" ถ้าใช่ให้เด้งไอคอน! (Bump Animation)
  useEffect(() => {
    if (cartItemCount > prevCountRef.current) {
        setIsBumping(true)
        const timer = setTimeout(() => setIsBumping(false), 300)
        return () => clearTimeout(timer)
    }
    prevCountRef.current = cartItemCount
  }, [cartItemCount])

  useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
       setUser(session?.user || null)
     })
     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       setUser(session?.user || null)
     })
     return () => subscription.unsubscribe()
  }, [])

  return (
    <>
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
            <Link href="/#shop" className="text-craft-700 hover:text-craft-500 transition-colors">คอลเลกชัน</Link>
            <Link href="/#story" className="text-craft-700 hover:text-craft-500 transition-colors">เรื่องราวของเรา</Link>
            
            {/* Account Icon */}
            {user ? (
                <Link href="/account" className="flex items-center text-craft-700 hover:text-craft-900 transition-colors font-medium bg-craft-100 px-3 py-1.5 rounded-full">
                    <User className="h-4 w-4 mr-2" /> บัญชีของฉัน
                </Link>
            ) : (
                <button onClick={() => setShowLogin(true)} className="flex items-center text-craft-700 hover:text-craft-900 transition-colors font-medium border border-craft-200 px-3 py-1.5 rounded-full hover:bg-craft-100">
                    <User className="h-4 w-4 mr-2" /> เข้าสู่ระบบ
                </button>
            )}

            {/* Cart Icon */}
            <button onClick={toggleCart} className={`relative p-2 transition-all ${isBumping ? 'scale-125 text-craft-900 duration-150' : 'text-craft-700 hover:text-craft-500 hover:scale-105 duration-300'}`}>
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className={`absolute top-0 right-0 bg-craft-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1 transition-all ${isBumping ? 'scale-125 bg-black' : ''}`}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button onClick={toggleCart} className={`relative p-2 transition-all ${isBumping ? 'scale-125 text-craft-900 duration-150' : 'text-craft-700 hover:text-craft-500 hover:scale-105 duration-300'}`}>
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className={`absolute top-0 right-0 bg-craft-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1 transition-all ${isBumping ? 'scale-125 bg-black' : ''}`}>
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
          <div className="px-4 pt-2 pb-4 space-y-2 sm:px-3">
            <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">หน้าแรก</Link>
            <Link href="/#shop" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">สินค้าทั้งหมด</Link>
            <Link href="/#story" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-craft-700 hover:bg-craft-100 rounded-md">เรื่องราวของเรา</Link>
            <hr className="border-craft-200 my-2"/>
            {user ? (
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 bg-craft-800 text-white rounded-md text-center">บัญชีของฉัน</Link>
            ) : (
                <button onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }} className="block w-full px-3 py-2 border border-craft-300 text-craft-800 rounded-md text-center">เข้าสู่ระบบ / ลงทะเบียน</button>
            )}
          </div>
        </div>
      )}
    </nav>
    <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
