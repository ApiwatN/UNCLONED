-- นำโค้ด SQL ด้านล่างนี้ไปรันใน Supabase -> SQL Editor -> กด New Query -> วางโค้ด -> กด RUN

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS material_th TEXT,
ADD COLUMN IF NOT EXISTS material_en TEXT,
ADD COLUMN IF NOT EXISTS care_th TEXT,
ADD COLUMN IF NOT EXISTS care_en TEXT,
ADD COLUMN IF NOT EXISTS shipping_th TEXT,
ADD COLUMN IF NOT EXISTS shipping_en TEXT,
ADD COLUMN IF NOT EXISTS model_info_th TEXT,
ADD COLUMN IF NOT EXISTS model_info_en TEXT;

-- หมายเหตุ: ข้อมูลเดิมในระบบจะมีค่าเป็น NULL สำหรับคอลัมน์ใหม่เหล่านี้
-- ระบบหน้าบ้านจะทำการ Fallback กลับไปแสดงข้อความมาตรฐาน (Default text) หากฟิลด์เหล่านี้เป็น NULL
