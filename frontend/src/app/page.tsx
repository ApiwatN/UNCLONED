'use client'
import Navbar from '@/components/Navbar'
import ProductGrid from '@/components/ProductGrid'
import HeroCarousel from '@/components/HeroCarousel'
import Link from 'next/link'
import { Leaf, Scissors, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { lang } = useLanguage()
  
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-craft-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text */}
            <div className="max-w-2xl">
              <span className="text-craft-500 font-medium tracking-wider text-sm uppercase mb-4 block animate-fade-in">{lang === 'en' ? 'Handcrafted with love' : 'ทำด้วยใจ'}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-craft-900 leading-tight mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                {lang === 'en' ? (
                  <>Simplicity<br/>woven with care</>
                ) : (
                  <>ความเรียบง่าย<br/>ที่ถักทอด้วยความใส่ใจ</>
                )}
              </h1>
              <p className="text-lg text-craft-600 mb-8 max-w-lg leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
                {lang === 'en' ? 'Natural cotton and linen clothing. Every piece is handcrafted, designed for comfort, minimal, and eco-friendly by UNCLONED.' : 'เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น ออกแบบมาเพื่อความสวมใส่สบาย มินิมอล และเป็นมิตรกับสิ่งแวดล้อมโดย UNCLONED'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <Link href="#shop" className="bg-craft-800 hover:bg-black text-white px-8 py-3 rounded-md text-center transition-all duration-200 font-medium shadow-lg hover:shadow-xl active:scale-95 focus:ring-4 focus:ring-craft-200">
                  {lang === 'en' ? 'Shop Now' : 'เลือกชมสินค้า'}
                </Link>
                <Link href="#story" className="border border-craft-400 text-craft-800 hover:bg-craft-200 px-8 py-3 rounded-md text-center transition-all duration-200 font-medium active:scale-95 focus:ring-4 focus:ring-craft-100">
                  {lang === 'en' ? 'Our Story' : 'เรื่องราวของเรา'}
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image (Weaver/Crafting) */}
            <div className="relative animate-fade-in hidden lg:block" style={{animationDelay: '0.4s'}}>
              {/* Decorative background shape */}
              <div className="absolute -inset-4 bg-craft-200/60 rounded-tl-[100px] rounded-br-[100px] transform rotate-3 z-0"></div>
              
              {/* Main Sliding Carousel Image */}
              <HeroCarousel />
              
              {/* Floating Badge */}
              <div className="absolute bottom-16 -left-8 bg-white p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center space-x-4 z-20 animate-bounce" style={{animationDuration: '4s'}}>
                <div className="bg-craft-100 p-2.5 rounded-full text-craft-700">
                  <Scissors className="w-6 h-6" />
                </div>
                <div className="pr-2">
                  <p className="text-xs text-craft-500 font-semibold tracking-wide">{lang === 'en' ? 'Made with heart' : 'ทำด้วยใจ'}</p>
                  <p className="text-sm text-craft-900 font-bold tracking-wider">{lang === 'en' ? '100% Handmade' : '100% งานแฮนด์เมด'}</p>
                </div>
              </div>
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
                      <h3 className="text-lg font-medium text-craft-800 mb-2">{lang === 'en' ? 'Natural Fibers' : 'เส้นใยธรรมชาติ'}</h3>
                      <p className="text-craft-600 text-sm">{lang === 'en' ? 'We use 100% authentic cotton and linen for breathability.' : 'เราเลือกใช้เฉพาะผ้าฝ้ายและผ้าลินินแท้ 100% ระบายอากาศได้ดี'}</p>
                  </div>
                  <div className="p-4">
                      <Scissors className="h-8 w-8 mx-auto text-craft-600 mb-4" />
                      <h3 className="text-lg font-medium text-craft-800 mb-2">{lang === 'en' ? 'Handcrafted' : 'ตัดเย็บด้วยมือ'}</h3>
                      <p className="text-craft-600 text-sm">{lang === 'en' ? 'Sewn by local craftsmen with limited production.' : 'ใส่ใจในทุกฝีเข็มโดยช่างฝีมือผู้ชำนาญ ผลิตจำนวนจำกัด'}</p>
                  </div>
                  <div className="p-4">
                      <Heart className="h-8 w-8 mx-auto text-craft-600 mb-4" />
                      <h3 className="text-lg font-medium text-craft-800 mb-2">{lang === 'en' ? 'Minimal Design' : 'มินิมอลดีไซน์'}</h3>
                      <p className="text-craft-600 text-sm">{lang === 'en' ? 'Timeless pieces, easy to wear for any occasion.' : 'ออกแบบให้เรียบง่าย สวมใส่ได้ทุกโอกาส และไม่มีวันตกยุค'}</p>
                  </div>
              </div>
          </div>
      </section>
      
      <ProductGrid />
      
      {/* Story Section */}
      <section id="story" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-5/12 relative">
                    <div className="aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl border-4 border-white relative z-10">
                        <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070" alt="Handmade process" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-craft-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 z-0"></div>
                </div>
                <div className="w-full lg:w-7/12 space-y-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-craft-900 leading-tight">
                        {lang === 'en' ? (
                            <>Clothing is a language<br/><span className="text-craft-500 font-light italic text-3xl">that reflects your soul</span></>
                        ) : (
                            <>เสื้อผ้าคือภาษา<br/><span className="text-craft-500 font-light italic text-3xl">ที่สะท้อนตัวตนของคุณ</span></>
                        )}
                    </h2>
                    
                    <div className="space-y-6 text-lg text-craft-700 leading-relaxed font-light">
                        <p>{lang === 'en' ? 'The beginning of ' : 'จุดเริ่มต้นของ '}<strong className="font-bold">UNCLONED</strong> 
                        {lang === 'en' ? 
                          ' is not just a business, but born from the passion for natural textures. We believe that natural fabrics have "breath". The more you wear them, the more they reflect you. The more you wash them, the softer they get.' 
                          : ' ไม่ใช่เพียงแค่ธุรกิจ แต่เกิดจากความหลงใหลในพื้นผิวธรรมชาติของเส้นใยฝ้ายและลินิน เราเชื่อว่าผ้าที่มาจากธรรมชาตินั้นมี "ลมหายใจ" ยิ่งสวมใส่ยิ่งสะท้อนตัวตน ยิ่งซักยิ่งนุ่มนวล'}</p>
                        
                        <p>{lang === 'en' ? 'We reject the Fast Fashion system and embrace the roots of craftsmanship. Every piece of our clothing is not cloned by machines by the thousands, but drawn, cut, and sewn individually by local artisans who care about every stitch.' : 'เราขอปฏิเสธระบบ Fast Fashion และหันกลับมาโอบกอดรากเหง้าของงานฝีมือ เสื้อผ้าทุกชิ้นของเราไม่ได้ถูกโคลนนิ่งออกมาจากเครื่องจักรหน้าตาเหมือนกันทีละหมื่นตัว แต่ถูกวาด ตัด และเย็บทีละตัวด้วยสองมือของช่างฝีมือในท้องถิ่นที่ใส่ใจในทุกฝีเข็ม'}</p>
                        
                        <p>{lang === 'en' ? 'When you wear UNCLONED, you are not just wearing clothes. You are wearing sustainable art and supporting the livelihood of local makers directly.' : 'เมื่อคุณสวมใส่ UNCLONED คุณไม่ได้แค่กำลังใส่เสื้อผ้า แต่คุณกำลังสวมใส่งานศิลปะที่เป็นมิตรกับสิ่งแวดล้อม และสนับสนุนรายได้ให้ช่างฝีมือตัวเล็กๆ ไปพร้อมกัน'}</p>
                    </div>
                    
                    <div className="pt-6 flex items-center space-x-5 border-t border-craft-100">
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522" alt="Founder" className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-craft-50" />
                        <div>
                            <p className="font-bold text-lg text-craft-900">ปรางทิพย์ สุวรรณเทวา</p>
                            <p className="text-sm font-medium text-craft-500 uppercase tracking-wider">Founder & Maker at UNCLONED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-craft-900 py-20 text-craft-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <h3 className="text-3xl font-bold tracking-widest text-white mb-6 w-max">
                UN<span className="font-light">CLONED</span>
                <span className="block h-0.5 w-1/2 bg-craft-600 mt-2"></span>
              </h3>
              <p className="text-craft-300 max-w-sm mb-6 pb-2 leading-relaxed">
                  {lang === 'en' ? 'Crafts designed for you to be yourself, unique, and friendly to our planet.' : 'งานคราฟต์ที่ออกแบบมาเพื่อให้คุณได้เป็นตัวเอง ไม่ต้องเหมือนใคร และเป็นมิตรกับโลกของเรา'}
              </p>
              <div className="flex space-x-4">
                  {/* Social Circles */}
                  <div className="w-10 h-10 rounded-full bg-craft-800 flex items-center justify-center hover:bg-craft-600 active:scale-95 transition-all duration-200 cursor-pointer text-white">IG</div>
                  <div className="w-10 h-10 rounded-full bg-craft-800 flex items-center justify-center hover:bg-craft-600 active:scale-95 transition-all duration-200 cursor-pointer text-white">FB</div>
                  <div className="w-10 h-10 rounded-full bg-craft-800 flex items-center justify-center hover:bg-craft-600 active:scale-95 transition-all duration-200 cursor-pointer text-white">LINE</div>
              </div>
            </div>
            
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">ช่องทางการติดต่อ</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-craft-400 hover:text-white transition-colors font-light">Instagram @uncloned.craft</a></li>
                <li><a href="#" className="text-craft-400 hover:text-white transition-colors font-light">Facebook Page</a></li>
                <li><a href="#" className="text-craft-400 hover:text-white transition-colors font-light">Line Official @uncloned</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{lang === 'en' ? 'Help' : 'ช่วยเหลือ'}</h4>
              <ul className="space-y-4">
                <li><a href="#shop" className="text-craft-400 hover:text-white transition-colors font-light">{lang === 'en' ? 'All Products' : 'สินค้าทั้งหมด / เลือกซื้อ'}</a></li>
                <li><a href="#story" className="text-craft-400 hover:text-white transition-colors font-light">{lang === 'en' ? 'Our Story' : 'เรื่องราวของเรา'}</a></li>
                <li><a href="#" className="text-craft-400 hover:text-white transition-colors font-light">{lang === 'en' ? 'Contact & Claims' : 'ติดต่อเคลมสินค้า'}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-craft-800 mt-16 pt-8 text-sm text-craft-500 flex flex-col sm:flex-row justify-between font-light">
            <p>© 2026 UNCLONED HANDCRAFT. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Made with ❤️ for independent spirits.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
