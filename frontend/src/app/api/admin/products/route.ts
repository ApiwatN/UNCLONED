import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, category, base_price, image_url, video_url, variants } = body;
        
        // 1. Insert product
        const { data: product, error: pError } = await supabase
            .from('products')
            .insert([{ name, description, category, base_price, image_url, video_url }])
            .select()
            .single();
            
        if (pError) throw pError;
        
        // 2. Insert variants
        if (variants && variants.length > 0) {
            const varsToInsert = variants.map((v: any) => ({
                product_id: product.id,
                size: v.size,
                stock_quantity: v.stock_quantity,
                additional_price: v.additional_price || 0
            }));
            const { error: vError } = await supabase.from('product_variants').insert(varsToInsert);
            if (vError) throw vError;
        }
        
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, name, description, category, base_price, image_url, video_url } = body;
        if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

        const { data, error } = await supabase
            .from('products')
            .update({ name, description, category, base_price, image_url, video_url })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, product: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
        
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
