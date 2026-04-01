import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Leaf, Scissors, Heart } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-16 md:pt-32 md:pb-24 flex items-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1596521864156-f4422e50523e?q=80&w=2070&auto=format&fit=crop" alt="Hero background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-craft-50 via-craft-50/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="text-craft-500 font-medium tracking-wider text-sm uppercase mb-4 block animate-fade-in">Handcrafted with love</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-craft-800 leading-tight mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              ความเรียบง่าย<br/>ที่ถักทอด้วยความใส่ใจ
            </h1>
            <p className="text-lg text-craft-600 mb-8 max-w-lg leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น ออกแบบมาเพื่อความสวมใส่สบาย มินิมอล และเป็นมิตรกับสิ่งแวดล้อมโดย UNCLONED
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Link href="#shop" className="bg-craft-600 hover:bg-craft-700 text-white px-8 py-3 rounded-md text-center transition-colors font-medium shadow-md">
                เลือกชมสินค้า
              </Link>
              <Link href="#story" className="border border-craft-400 text-craft-700 hover:bg-craft-100 px-8 py-3 rounded-md text-center transition-colors font-medium">
                เรื่องราวของเรา
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-craft-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="p-4">
                      <Leaf className="h-8 w-8 mx-auto text-craft-600 mb-4" />
                      <h3 className="text-lg font-medium text-craft-800 mb-2">เส้นใยธรรมชาติ</h3>
                      <p className="text-craft-600 text-sm">เราเลือกใช้เฉพาะผ้าฝ้ายและผ้าลินินแท้ 100% ระบายอากาศได้ดี</p>
                  </div>
                  <div className="p-4">
                      <Scissors className="h-8 w-8 mx-auto text-craft-600 mb-4" />
                      <h3 className="text-lg font-medium text-craft-800 mb-2">ตัดเย็บด้วยมือ</h3>
                      <p className="text-craft-600 text-sm">ใส่ใจในทุกฝีเข็มโดยช่างฝีมือผู้ชำนาญ ผลิตจำนวนจำกัด</p>
                  </div>
                  <div className="p-4">
                      <Heart className="h-8 w-8 mx-auto text-craft-600 mb-4" />
                      <h3 className="text-lg font-medium text-craft-800 mb-2">มินิมอลดีไซน์</h3>
                      <p className="text-craft-600 text-sm">ออกแบบให้เรียบง่าย สวมใส่ได้ทุกโอกาส และไม่มีวันตกยุค</p>
                  </div>
              </div>
          </div>
      </section>
      
      {/* TODO: Shop component */}
      
    </>
  )
}
