-- 1. ลบข้อมูลเก่าทิ้ง (ถ้ามี) เพื่อไม่ให้ซ้ำซ้อน
DELETE FROM product_variants;
DELETE FROM products;

-- 2. สร้าง Mock สินค้าสมมติ
INSERT INTO products (id, name, description, category, base_price, image_url) VALUES 
('00000000-0000-0000-0000-000000000001', 'เสื้อฝ้ายทอมือย้อมคราม', 'เสื้อครามธรรมชาติ 100% สวมใส่สบาย ไม่ร้อน ระบายอากาศได้ดี', 'tops', 890, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('00000000-0000-0000-0000-000000000002', 'กระโปรงผ้าหม้อห้อม ทรงเอ', 'กระโปรงยาวผ้าหม้อห้อม ทรงสวย ตัดเย็บประณีต', 'bottoms', 1290, 'https://images.unsplash.com/photo-1583496661160-c588e25281bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('00000000-0000-0000-0000-000000000003', 'เดรสผ้าขิดประยุกต์', 'เดรสสำหรับออกงาน ดีไซน์ทันสมัยประยุกต์', 'dresses', 2590, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('00000000-0000-0000-0000-000000000004', 'กระเป๋าสานพลาสติก', 'กระเป๋าสานแข็งแรงทนทาน ถือเก๋ไก๋', 'accessories', 590, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

-- 3. สร้างไซส์และสต็อก
INSERT INTO product_variants (product_id, size, stock_quantity) VALUES 
('00000000-0000-0000-0000-000000000001', 'M', 10),
('00000000-0000-0000-0000-000000000001', 'L', 5),
('00000000-0000-0000-0000-000000000002', 'Free Size', 15),
('00000000-0000-0000-0000-000000000003', 'S', 2),
('00000000-0000-0000-0000-000000000004', 'One Size', 30);
