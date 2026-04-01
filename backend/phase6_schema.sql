-- Phase 6: Customer Auth & Tracking System

-- 1. สร้างตารางโปรไฟล์ลูกค้า (เชื่อมต่อกับระบบ Supabase Auth ให้อัตโนมัติ)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. อัปเกรดตาราง Orders ปัจจุบันให้รองรับระบบสมาชิกและเลขพัสดุ
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid references public.profiles(id) null;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number text null;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_company text null;

-- 3. เขียน Trigger ให้สร้างโปรไฟล์อัตโนมัติเมื่อลูกค้าสมัครสมาชิกใหม่
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- ลบ Trigger ทิ้งถ้ามีอยู่ก่อนแล้วเพื่อสร้างใหม่
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
