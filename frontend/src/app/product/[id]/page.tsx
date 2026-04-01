import { createClient } from '@supabase/supabase-js';
import ClientProductDetail from '@/components/ClientProductDetail';
import Navbar from '@/components/Navbar';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export const revalidate = 60; // SEO: Cache aggressively, revalidate every 60s

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
            <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientProductDetail product={product} />
            </div>
        </main>
    )
}
