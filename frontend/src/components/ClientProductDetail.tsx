'use client'
import { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Undo2, Truck, Plus, Minus, Check, PlayCircle } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function ClientProductDetail({ product }: { product: any }) {
    const { addToCart, toggleCart } = useCartStore();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    useEffect(() => {
        if (product?.product_variants) {
            const firstAvailable = product.product_variants.find((v: any) => v.stock_quantity > 0);
            setSelectedVariant(firstAvailable || null);
            setQuantity(1);
            
            // Auto open video if it's an mp4 (Cloudinary Video)
            if (product.image_url?.includes('.mp4')) {
                setIsVideoPlaying(true);
            }
        }
    }, [product]);

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
        // ไม่สั่งเปิด SideBar ตามที่ลูกค้า Request เอาไว้
    };

    const isYoutube = product.video_url?.includes('youtube.com') || product.video_url?.includes('youtu.be');
    const isMp4Image = product.image_url?.includes('.mp4');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-20 fade-in animate-in">
            {/* ฝั่งซ้าย: รูปภาพและวิดีโอ */}
            <div className="space-y-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-craft-50 relative group border border-craft-100 shadow-sm">
                    {isVideoPlaying && isMp4Image ? (
                        <video src={product.image_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                        <img src={isMp4Image ? product.image_url.replace('.mp4', '.jpg') : product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    )}
                    
                    {isMp4Image && !isVideoPlaying && (
                        <button onClick={() => setIsVideoPlaying(true)} className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <PlayCircle className="w-16 h-16 text-white opacity-80" />
                        </button>
                    )}
                </div>
                
                {/* ถ้ามี YouTube Link เสริม */}
                {isYoutube && (
                    <div className="aspect-video rounded-xl overflow-hidden shadow-sm border border-craft-100">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={product.video_url.replace('watch?v=', 'embed/')} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>

            {/* ฝั่งขวา: ข้อมูลสินค้าและการสั่งซื้อ */}
            <div className="flex flex-col justify-start">
                
                {/* Header Info */}
                <h3 className="text-sm font-bold text-craft-500 tracking-widest uppercase mb-2">HANDCRAFTED {product.category}</h3>
                <h1 className="text-3xl lg:text-4xl font-bold text-craft-900 mb-4 leading-tight">{product.name}</h1>
                <p className="text-3xl font-medium text-craft-800 mb-6 border-b border-craft-100 pb-6">฿{displayPrice.toLocaleString()}</p>

                {/* ส่วนการเลือกไซส์และจำนวน */}
                <div className="bg-white rounded-2xl shadow-[0_2px_40px_-15px_rgba(0,0,0,0.1)] p-6 mb-8 border border-craft-50 border-t border-l border-white bg-gradient-to-br from-white to-craft-50/30">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-semibold text-gray-800">เลือกแบบ/ไซส์</label>
                            <a href="#size-guide" className="text-xs text-craft-600 underline font-medium">ดูคู่มือขนาด</a>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {product.product_variants?.map((v: any) => {
                                const outOfStock = v.stock_quantity <= 0;
                                const isSelected = selectedVariant?.id === v.id;
                                return (
                                    <button 
                                        key={v.id}
                                        disabled={outOfStock}
                                        onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                                        className={`px-5 py-3 rounded-lg border text-sm font-bold transition-all ${outOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : isSelected ? 'border-craft-900 bg-craft-900 text-white shadow-md transform scale-[1.02]' : 'border-gray-300 text-gray-700 hover:border-craft-400 bg-white'}`}
                                    >
                                        {v.size} {v.additional_price > 0 ? `(+฿${v.additional_price})` : ''}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedVariant && (
                        <div className="mb-8">
                            <label className="text-sm font-semibold text-gray-800 mb-3 block">จำนวนสินค้า <span className="text-xs font-normal text-gray-500 ml-2">(คงเหลือ {selectedVariant.stock_quantity} ชิ้น)</span></label>
                            <div className="flex items-center w-max border border-gray-300 rounded-lg overflow-hidden h-12 bg-white">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                                <span className="w-16 text-center font-bold text-lg text-gray-800">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(selectedVariant.stock_quantity, quantity + 1))} className="w-12 h-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}

                    <button 
                        disabled={!selectedVariant}
                        onClick={handleAddToCart}
                        className="w-full bg-craft-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center shadow-xl shadow-craft-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.98]"
                    >
                        <ShoppingBag className="w-5 h-5 mr-3 mb-0.5" />
                        หยิบใส่ตะกร้าเลย
                    </button>

                    <div className="grid grid-cols-3 gap-2 mt-6 border-t border-craft-100 pt-6">
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <Truck className="w-5 h-5 text-gray-400 mb-1.5" />
                            <span className="text-[10px] text-gray-500 font-medium">จัดส่งรวดเร็ว<br/>ทั่วประเทศ</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-2 border-l border-r border-craft-100">
                            <Undo2 className="w-5 h-5 text-gray-400 mb-1.5" />
                            <span className="text-[10px] text-gray-500 font-medium">เปลี่ยนไซส์ได้<br/>ภายใน 7 วัน</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <ShieldCheck className="w-5 h-5 text-gray-400 mb-1.5" />
                            <span className="text-[10px] text-gray-500 font-medium">รับประกันคุณภาพ<br/>สินค้าแฮนด์เมด</span>
                        </div>
                    </div>
                </div>

                {/* รายละเอียดสินค้าเต็มรูปแบบ - Handmade Template */}
                <div className="space-y-10 text-gray-700 leading-relaxed font-prompt mt-4 max-w-2xl">
                    
                    <div>
                        <h4 className="flex items-center text-lg font-bold text-craft-900 mb-4 border-b border-craft-100 pb-2">
                            <span className="bg-craft-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✦</span> เรื่องราวของชุดนี้ (Story)
                        </h4>
                        <p className="pl-11 text-sm md:text-base text-gray-600">{product.description || 'ออกแบบมาเพื่อวันสบายๆ ที่ยังต้องการความดูดี ตัดเย็บด้วยความใส่ใจจากช่างฝีมือในสตูดิโอเล็กๆ ของเรา เรียบง่ายแต่แฝงไปด้วยรายละเอียด พรางหุ่นและระบายอากาศได้ดีเยี่ยม'}</p>
                    </div>

                    <div>
                        <h4 className="flex items-center text-lg font-bold text-craft-900 mb-4 border-b border-craft-100 pb-2">
                            <span className="bg-craft-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✦</span> วัสดุและเนื้อผ้า (Material)
                        </h4>
                        <ul className="pl-11 space-y-2 text-sm md:text-base text-gray-600 list-disc ml-5">
                            <li>ผ้าฝ้ายลินินผสม (Premium Natural Linen 100%)</li>
                            <li>เนื้อผ้ามีเท็กซ์เจอร์ยับเป็นธรรมชาติ ยิ่งซักยิ่งนุ่ม โปร่งสบายไม่ร้อน</li>
                            <li>มีซับในกระโปรงทำจากผ้าคอตตอนเนื้อบาง (ไม่ต้องกลัวโป๊แน่นอนค่ะ)</li>
                        </ul>
                    </div>

                    <div id="size-guide">
                        <h4 className="flex items-center text-lg font-bold text-craft-900 mb-4 border-b border-craft-100 pb-2">
                            <span className="bg-craft-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✦</span> ขนาดและสัดส่วน (Size Guide)
                        </h4>
                        <div className="pl-11 space-y-3 text-sm md:text-base text-gray-600">
                            {product.product_variants && product.product_variants.length > 0 ? (
                                product.product_variants.map((v: any) => (
                                    <div key={v.id} className="bg-craft-50 p-2.5 rounded-lg border border-craft-100">
                                        <span className="font-bold text-craft-800">Size {v.size} :</span> {product.category === 'bottoms' ? 'เอว 26-34" | สะโพก 40" | ความยาว 38"' : 'อก 34-38" | เอว 28-32" | ความยาว 42"'}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-craft-50 p-2.5 rounded-lg border border-craft-100"><span className="font-bold text-craft-800">Free Size :</span> อก 32-40" | เอว 26-34" | ความยาว 42"</div>
                            )}
                            <p className="mt-4 italic text-sm">(มีเชือกผูกเอวเย็บติดด้านข้าง สามารถผูกปรับให้เข้ารูปได้ตามต้องการ)</p>
                            <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 inline-block">
                                👤 <strong>นางแบบในรูป:</strong> สูง 165 ซม. อก 32" เอว 25" สะโพก 35" ใส่ไซส์ S/Free Size ค่ะ
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center text-lg font-bold text-craft-900 mb-4 border-b border-craft-100 pb-2">
                            <span className="bg-craft-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✦</span> การดูแลรักษา (Care)
                        </h4>
                        <ul className="pl-11 space-y-2 text-sm md:text-base text-gray-600 list-disc ml-5">
                            <li>แนะนำให้ซักมือเพื่อถนอมใยผ้า หรือใส่ถุงตาข่ายซักเครื่องโหมดถนอมผ้า (น้ำเย็น)</li>
                            <li>สะบัดให้หมาดแล้วตากในที่ร่ม (หลีกเลี่ยงแดดจัดเพื่อรักษาสีผ้าให้สวยคงทน)</li>
                            <li>รีดด้วยไฟกลาง-สูง หรือปล่อยให้ยับนิดๆ เพื่อความเป็นธรรมชาติของผ้าลินิน</li>
                            <li className="text-red-500/80">สีอาจตกในการซัก 1-2 ครั้งแรก ควรแยกซัก</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="flex items-center text-lg font-bold text-craft-900 mb-4 border-b border-craft-100 pb-2">
                            <span className="bg-craft-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✦</span> การจัดส่ง & เปลี่ยนคืน
                        </h4>
                        <p className="pl-11 text-sm md:text-base text-gray-600 mb-2"><strong>สถานะสินค้า:</strong> งานสั่งตัดประณีต (Made to Order) ใช้เวลาตัดเย็บ 5-7 วันทำการตามคิว</p>
                        <p className="pl-11 text-sm md:text-base text-gray-600"><strong>Return Policy:</strong> รับเปลี่ยนไซส์ภายใน 7 วันหลังได้รับสินค้า (มีค่าส่งกลับ 50 บาท) <br/>*งานสั่งตัดแก้ไขไซส์พิเศษ ขอสงวนสิทธิ์ไม่รับเปลี่ยนคืน</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
