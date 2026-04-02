import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ClientProductDetail from '@/components/ClientProductDetail';
import Navbar from '@/components/Navbar';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export const revalidate = 60; // SEO: Cache aggressively, revalidate every 60s

// SEO: Generate Dynamic Metadata for each product
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase
      .from('products')
      .select('name, description, image_url, category')
      .eq('id', id)
      .single();

  if (!product) return {};

  return {
    title: `${product.name} | UNCLONED`,
    description: product.description || `เสื้อผ้าแฮนด์เมด ฝ้ายลินิน หมวดหมู่ ${product.category} จาก UNCLONED`,
    openGraph: {
      title: product.name,
      description: product.description || `เสื้อผ้าแฮนด์เมดธรรมชาติ ถักทอด้วยมือ`,
      images: product.image_url ? [
        {
          url: product.image_url.replace('.mp4', '.jpg'), // Fallback to jpg if it's a video
          width: 800,
          height: 1066,
          alt: product.name,
        }
      ] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    // Unwrapped promise payload required by Next.js 15+
    const { id } = await params;

    // Fetch product along with its scalable variants safely
    const { data: product, error } = await supabase
        .from('products')
        .select(`*, product_variants(*)`)
        .eq('id', id)
        .single();
        
    if (error || !product) {
        return <div className="min-h-screen flex items-center justify-center bg-craft-50 text-gray-500">ไม่พบสินค้าที่คุณค้นหา โปรดตรวจสอบลิงก์อีกครั้ง</div>;
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />
            
            {/* SEO and Breadcrumbs can be injected here. For CRO, we directly mount the client chunk */}
            {/* Product Schema Markup for SEO Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org/',
                        '@type': 'Product',
                        name: product.name,
                        image: [product.image_url?.replace('.mp4', '.jpg') || ''],
                        description: product.description || 'เสื้อผ้าแฮนด์เมด UNCLONED',
                        sku: product.id.toString(),
                        brand: {
                            '@type': 'Brand',
                            name: 'UNCLONED'
                        },
                        offers: {
                            '@type': 'Offer',
                            url: `https://uncloned-frontend.vercel.app/product/${product.id}`,
                            priceCurrency: 'THB',
                            price: Number(product.base_price),
                            itemCondition: 'https://schema.org/NewCondition',
                            availability: product.product_variants?.some((v: any) => v.stock_quantity > 0) 
                                ? 'https://schema.org/InStock' 
                                : 'https://schema.org/OutOfStock',
                        }
                    })
                }}
            />
            <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientProductDetail product={product} />
            </div>
        </main>
    )
}
