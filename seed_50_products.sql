-- นำโค้ด SQL ด้านล่างนี้ไปรันใน Supabase -> SQL Editor -> กด New Query -> วางโค้ด -> กด RUN

DO $$
DECLARE
    new_product_id UUID;
    i INT;
    cat TEXT;
    
    -- ข้อมูลเฉพาะหมวดหมู่
    p_name TEXT;
    p_name_en TEXT;
    p_desc_th TEXT;
    p_desc_en TEXT;
    p_mat_th TEXT;
    p_mat_en TEXT;
    
    img_list TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070',
        'https://images.unsplash.com/photo-1596521864156-f4422e50523e?q=80&w=2070',
        'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2070',
        'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1974',
        'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070'
    ];
    img_url TEXT;
BEGIN
    -- ลบข้อมูลเก่าทิ้ง (ปลดคอมเมนต์หากต้องการล้างของเดิม)
    -- DELETE FROM product_variants;
    -- DELETE FROM products;

    FOR i IN 1..50 LOOP
        -- วนลูปหมวดหมู่ 3 แบบหลัก
        IF (i % 3) = 0 THEN
            cat := 'tops';
            p_name := 'เสื้อเชิ้ตคอจีนผ้าลินิน ' || LPAD(i::text, 2, '0');
            p_name_en := 'Linen Mandarin Collar Shirt ' || LPAD(i::text, 2, '0');
            p_desc_th := 'เสื้อเชิ้ตดีไซน์มินิมอลทรงคอจีน ออกแบบให้เนื้อผ้าโปร่ง ระบายอากาศได้ดีเยี่ยม เหมาะกับสภาพอากาศร้อน ช่วยให้วันธรรมดาของคุณดูมีสไตล์และคล่องตัว แมทช์ง่ายกับทั้งกางเกงขาสั้นและขายาว';
            p_desc_en := 'Minimalist mandarin collar shirt designed for excellent breathability. Perfect for hot weather, keeping you stylish and agile. Easy to match with both shorts and trousers.';
            p_mat_th := 'ผ้าลินินธรรมชาติผสมฝ้าย 100% (โปร่งสบาย ไม่ระคายเคืองผิว)';
            p_mat_en := '100% Natural Linen & Cotton blend (Breathable and skin-friendly)';
        ELSIF (i % 3) = 1 THEN
            cat := 'bottoms';
            p_name := 'กางเกงทรงกระบอกเอวสูงพรางหุ่น ' || LPAD(i::text, 2, '0');
            p_name_en := 'High-Waisted Straight Leg Trousers ' || LPAD(i::text, 2, '0');
            p_desc_th := 'กางเกงสำหรับวันทำงานหรือไปคาเฟ่ แพทเทิร์นเน้นจับจีบช่วงเอวสูงพิเศษ ช่วยพรางให้สะโพกดูเล็กลงและขาดูเรียวยาวขึ้น ทิ้งตัวเป็นทรงสวย ไม่ยับง่ายแม้นั่งทำงานทั้งวัน';
            p_desc_en := 'Trousers tailored for work or casual cafe trips. High-waisted pattern accentuates your figure, making hips look slimmer and legs longer. Wrinkle-resistant drape.';
            p_mat_th := 'ผ้ายืด Spendex นำเข้าเนื้อหนานุ่ม ทิ้งตัวมีน้ำหนัก ซิปซ่อนซับในอย่างดี';
            p_mat_en := 'Premium Spendex blend, thick but soft. Heavy drape with concealed zipper.';
        ELSE
            cat := 'dresses';
            p_name := 'เดรสสายเดี่ยวยาวผูกหลังพริ้วไหว ' || LPAD(i::text, 2, '0');
            p_name_en := 'Flowy Open-Back Slip Maxi Dress ' || LPAD(i::text, 2, '0');
            p_desc_th := 'เดรสที่เกิดมาเพื่อทริปพักผ่อน พริ้วไหวไปตามจังหวะการเดิน ดีเทลสายไขว้ด้านหลังสามารถปรับผูกให้กระชับเข้ากับสรีระได้ตามต้องการ ซ่อนตะเข็บปราณีตตลอดทั้งชุด';
            p_desc_en := 'A maxi dress born for vacations. Flows beautifully with every step. Adjustable crossed back ties adapt to your unique body shape. Seamlessly stitched.';
            p_mat_th := 'ผ้าซาตินผสมซิลค์พิมพ์ลาย สัมผัสเย็นลื่นผิว ใส่แล้วไม่ร้อน';
            p_mat_en := 'Satin & Silk blend. Cool touch on the skin, highly breathable.';
        END IF;

        img_url := img_list[1 + (i % 5)];
        
        INSERT INTO products (
            name, name_en, description, description_en, category, base_price, image_url,
            material_th, material_en, care_th, care_en, shipping_th, shipping_en, model_info_th, model_info_en
        ) VALUES (
            p_name, 
            p_name_en,
            p_desc_th, 
            p_desc_en,
            cat, 
            -- สุ่มราคาไม่เกิน 10 บาท (เช่น 5, 6, 7, 8, 9 บาท)
            floor(random() * 5 + 5)::int,
            img_url,
            p_mat_th, 
            p_mat_en,
            'ซักมือด้วยน้ำยาซักผ้าสูตรอ่อนโยน ไม่ควรบิดแรงๆ ห้ามอบด้วยความร้อน', 'Gentle hand wash. Do not wring forcefully. Do not tumble dry.',
            'งานพร้อมส่ง ตัดรอบ 12:00 น. จัดส่งฟรีแบบ EMS', 'Ready to ship. Cut-off time 12:00 PM. Free express delivery.',
            'นางแบบสูง 165 ซม. น้ำหนัก 45 กก. ใส่ไซส์ S แบบพอดีตัว', 'Model is 165cm, 45kg, wearing size S for a fitted look.'
        ) RETURNING id INTO new_product_id;

        -- สร้างตัวเลือก Size หลากหลายแบบตามหมวดหมู่
        IF cat = 'bottoms' THEN
            INSERT INTO product_variants (product_id, size, stock_quantity, additional_price)
            VALUES 
                (new_product_id, 'Waist 24"', floor(random() * 5 + 1)::int, 0),
                (new_product_id, 'Waist 26"', floor(random() * 10 + 2)::int, 0),
                (new_product_id, 'Waist 28"', floor(random() * 15 + 2)::int, 0),
                (new_product_id, 'Waist 30"', floor(random() * 10 + 2)::int, 0),
                (new_product_id, 'Waist 32"', floor(random() * 5 + 1)::int, 1), -- ไซส์ใหญ่บวกเพิ่ม 1 บาท
                (new_product_id, 'Waist 34"', floor(random() * 2)::int, 2);      -- ไซส์ใหญ่พิเศษบวกเพิ่ม 2 บาท
        ELSE
            INSERT INTO product_variants (product_id, size, stock_quantity, additional_price)
            VALUES 
                (new_product_id, 'XS', floor(random() * 5 + 1)::int, 0),
                (new_product_id, 'S', floor(random() * 15 + 5)::int, 0),
                (new_product_id, 'M', floor(random() * 20 + 5)::int, 0),
                (new_product_id, 'L', floor(random() * 15)::int, 0),
                (new_product_id, 'XL', floor(random() * 5)::int, 1),   -- บวกราคาเพิ่ม 1 บาท
                (new_product_id, 'XXL', floor(random() * 2)::int, 2);  -- บวกราคาเพิ่ม 2 บาท
        END IF;
            
    END LOOP;
END $$;
