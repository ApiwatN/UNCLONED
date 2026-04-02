'use client'

import { useState, useEffect } from 'react'

const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070",
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2070",
    "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1974"
]

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 5000) // สลับภาพอัตโนมัติทุกๆ 5 วินาที
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl border-8 border-white z-10 bg-craft-100 group">
            {images.map((img, index) => (
                <img
                    key={img}
                    src={img}
                    alt={`Hero showcase ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                        index === currentIndex 
                            ? 'opacity-100 scale-105' 
                            : 'opacity-0 scale-100'
                    }`}
                />
            ))}
            
            {/* Dots indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-500 hover:bg-white ${
                            index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
            
            {/* Optional Manual Nav (Shows on hover) */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="pointer-events-auto bg-white/30 hover:bg-white/60 backdrop-blur-sm text-craft-900 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
                >
                    &#8592;
                </button>
                <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                    className="pointer-events-auto bg-white/30 hover:bg-white/60 backdrop-blur-sm text-craft-900 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
                >
                    &#8594;
                </button>
            </div>
        </div>
    )
}
