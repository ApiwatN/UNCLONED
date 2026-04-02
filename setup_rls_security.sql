-- 1. ล็อคตาราง (Enable RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. อนุญาตให้ทุกคน (anon) "อ่าน" สินค้าได้ (เอาไว้โชว์หน้าร้าน)
CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_variants" 
ON product_variants FOR SELECT USING (true);

-- 3. อนุญาตให้ทุกคน (anon) "สร้าง" ออเดอร์ได้ (ตอนลูกค้ากดสั่งซื้อ)
CREATE POLICY "Allow public to insert orders" 
ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to insert order_items" 
ON order_items FOR INSERT WITH CHECK (true);

-- 4. กดลบกฏเก่าทิ้งก่อน (ถ้าเคยตั้งไว้เล่นๆ)
-- DROP POLICY IF EXISTS "Allow public full access" ON products;
-- DROP POLICY IF EXISTS "Allow public full access" ON orders;

-- สรุป: ตอนนี้คนนอก (API ปกติ) จะไม่สามารถ ลบ, แก้ไข, หรือดูออเดอร์คนอื่นได้เลย (ป้องกันแฮกเกอร์)
-- ส่วนแอดมินจะต้องจัดการผ่าน Service Role Key แทน (ซึ่งทะลุกฏ RLS ได้ทั้งหมด)
