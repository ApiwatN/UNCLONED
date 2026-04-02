# UNCLONED — Project Progress Log
> อัปเดตล่าสุด: 2 เมษายน 2569 | สถานะ: ✅ Production Live + Phase 2 In Progress

---

## 🌐 ลิงก์สำคัญ
| ชื่อ | URL |
|---|---|
| 🏪 หน้าร้านจริง (Production) | https://uncloned-frontend.vercel.app |
| 🛠️ หลังบ้าน Admin | https://uncloned-frontend.vercel.app/admin |
| 🔍 Vercel Dashboard | https://vercel.com/apiwatns-projects/uncloned-frontend |
| 🗄️ Supabase Dashboard | https://supabase.com/dashboard |
| 📦 GitHub Repository | https://github.com/ApiwatN/UNCLONED |

---

## 🏗️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom craft theme) |
| Database | Supabase (PostgreSQL) |
| Image Storage | Cloudinary |
| State Management | Zustand (cartStore) |
| Auth | Supabase Auth (email + password) |
| Deployment | Vercel (Production) |
| Admin Auth | Next.js Middleware + Basic Auth |

---

## ✅ Features ที่ทำสำเร็จแล้ว

### 🔐 ระบบ Auth & บัญชีลูกค้า
- [x] ลงทะเบียน / เข้าสู่ระบบด้วย Email + Password (Supabase Auth)
- [x] หน้า Login Modal (pop-up ไม่เปลี่ยนหน้า)
- [x] หน้า `/account` แสดงข้อมูลส่วนตัวและประวัติออเดอร์
- [x] ระบบ Session (คงสถานะล็อกอินข้ามหน้าได้)
- [x] Navbar แสดงสถานะ "บัญชีของฉัน" หรือ "เข้าสู่ระบบ" ตามสถานะ user

### 🛍️ หน้าร้านค้า (Storefront)
- [x] หน้าแรก (Landing Page) ดีไซน์สวยงาม 2-column layout
- [x] Hero Carousel → สไลด์โชว์ภาพอัตโนมัติ 3 รูป + ปุ่มเลื่อนมือ + Dots indicator
- [x] ส่วน "เรื่องราวของเรา" (Story Section) พร้อมประวัติแบรนด์
- [x] Footer ระดับ Premium พร้อมช่องทางติดต่อ
- [x] Navbar มีลิงก์: หน้าแรก / คอลเลกชัน / เรื่องราวของเรา + รองรับ Mobile menu
- [x] คอลเลกชันสินค้า (ProductGrid) ดึงข้อมูลจริงจาก Supabase

### 🛒 ระบบตะกร้าสินค้า
- [x] AddToCartModal — pop-up เลือก Size และจำนวนก่อนใส่ตะกร้า
- [x] ไอคอน Shopping Bag บน Navbar มี Bounce Animation เมื่อกดเพิ่มสินค้า (ไม่บังคับเปิด Sidebar)
- [x] Cart Sidebar — แสดงรายการสินค้าในตะกร้า ลบสินค้าได้
- [x] ระบบ Checkout Modal — กรอกที่อยู่จัดส่ง เบอร์โทร พร้อมสรุปออเดอร์

### 📄 หน้ารายละเอียดสินค้า (`/product/[id]`)
- [x] แสดงข้อมูลสินค้าครบตามเทมเพลต 6 ส่วน (ชื่อ / วัสดุ / ขนาด / วิธีดูแล / ระยะส่ง / แรงบันดาลใจ)
- [x] รองรับ Dynamic Route ตามมาตรฐาน Next.js 15+ (`await params`)
- [x] ปุ่ม "เพิ่มลงตะกร้า" บนหน้าสินค้า

### 💳 ระบบชำระเงิน PromptPay
- [x] PromptPay QR Code จริงใน CheckoutModal (generate จากเบอร์/ID + ยอดเงิน)
- [x] แสดงยอดเงินจริงบน QR — ลูกค้าสแกนได้เลย
- [x] env: `NEXT_PUBLIC_PROMPTPAY_ID` — ใส่เบอร์โทรหรือเลข ID ของร้าน

### 🔑 ระบบ Admin
- [x] ป้องกันด้วย HTTP Basic Auth (user: `admin`, password: `uncloned2026`)
- [x] หน้า `/admin` — จัดการสินค้า: เพิ่มสินค้าใหม่ / ดูสต็อก / ลบสินค้า
- [x] **แก้ไขสินค้า (Edit Product Modal)** — prefill ข้อมูล, บันทึก PATCH ไป API
- [x] อัปโหลดรูปภาพผ่าน Cloudinary (Unsigned Preset)
- [x] หน้า `/admin/orders` — จัดการออเดอร์ อัปเดตสถานะ ใส่ Tracking Number
- [x] API ลบสินค้า (`DELETE /api/admin/products?id=...`)
- [x] API แก้ไขสินค้า (`PATCH /api/admin/products`)

### 🗄️ ฐานข้อมูล (Supabase)
- [x] ตาราง `products` + `product_variants` (สต็อกตามไซส์)
- [x] ตาราง `orders` + `order_items`
- [x] ตาราง `profiles` (ข้อมูลลูกค้า: ชื่อ / ที่อยู่ / เบอร์ / วันเกิด)
- [x] Schema ไฟล์: `schema.sql` + `phase6_schema.sql` + `mock_data.sql`

### 🔍 SEO
- [x] Full OpenGraph + Twitter Card metadata ใน `layout.tsx`
- [x] JSON-LD Organization Schema
- [x] Dynamic `sitemap.xml` (ดึง product pages จาก Supabase)
- [x] `robots.txt` (block /admin/, /api/ จาก Google)
- [x] title template: `%s | UNCLONED` สำหรับทุกหน้า

### 📊 Analytics
- [x] Vercel Analytics (`<Analytics />` ใน layout)

### 📧 Email แจ้งเตือน
- [x] Resend integration ใน `POST /api/orders`
- [x] ส่ง email แจ้ง admin อัตโนมัติเมื่อมีออเดอร์ใหม่ (non-blocking)
- [x] env: `RESEND_API_KEY` + `ADMIN_EMAIL`

### 🔎 ระบบค้นหาสินค้า
- [x] Search Bar ค้นหาตามชื่อ/รายละเอียดสินค้า
- [x] Category Filter Chips (dynamic จาก field `category` ในฐานข้อมูล)
- [x] แสดงจำนวนผลลัพธ์ / ปุ่ม "ล้างตัวกรอง"

---

## 🚀 การ Deploy

### วิธีสั่ง Deploy ขึ้นเว็บจริง (Production)
```bash
# ต้องอยู่ในโฟลเดอร์ frontend เท่านั้น!
cd frontend
npx vercel --prod
```

> ⚠️ **Root Directory:** Vercel Project ชื่อ `uncloned-frontend` ตั้งค่าให้ชี้ที่ `/frontend` เท่านั้น
> หากรันจาก `/UNCLONED` จะขึ้น 404 เพราะไม่เจอโค้ด Next.js

### Environment Variables (ต้องตั้งค่าบน Vercel ด้วย)
| Key | ที่เอามาจาก |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary > Settings > Upload Presets (Unsigned) |
| `ADMIN_PASSWORD` | กำหนดเองได้ (default: `uncloned2026`) |

### ไฟล์ที่ git ขึ้นปกติ vs ไม่ขึ้น
| ขึ้น Git ✅ | ไม่ขึ้น Git 🚫 |
|---|---|
| โค้ดทั้งหมดใน `src/` | `.env`, `.env.local` (กุญแจลับ) |
| API Routes (`src/app/api/`) | `node_modules/` |
| Schema SQL | `.next/` (build output) |
| | `.vercel/` |

---

## 📋 Roadmap — สิ่งที่ยังไม่ได้ทำ (Next Steps)

### ด่วน (ก่อนเปิดรับออเดอร์จริง)
- [ ] แก้ `NEXT_PUBLIC_PROMPTPAY_ID` ใน `.env` และ Vercel → ใส่เบอร์โทร/เลข ID PromptPay จริงของร้าน
- [ ] แก้ `RESEND_API_KEY` + `ADMIN_EMAIL` ใน `.env` และ Vercel → ลงทะเบียนฟรีที่ resend.com
- [ ] ทดสอบ Flow จริงตั้งแต่ต้นจนจบ (ลงทะเบียน → เลือกสินค้า → ชำระเงิน → Admin ยืนยัน)
- [ ] ใส่รูปสินค้าจริงแทน Mock-up
- [ ] ตั้งค่า Vercel env vars ใหม่ทุกตัว แล้วรัน `npx vercel --prod`

### Phase ถัดไป
- [ ] หน้า `/product/[id]` — เพิ่ม Product JSON-LD Schema
- [ ] ระบบแจ้งเตือน Email ถึงลูกค้า (Order Confirmation)
- [ ] ระบบ Review / Rating สินค้า
- [ ] หน้า Wishlist (บันทึกสินค้าที่ชอบ)
- [ ] Auto-Deploy ผ่าน GitHub CI/CD

---

## 🐛 Bug ที่แก้ไปแล้ว
| Bug | วิธีแก้ |
|---|---|
| Hydration Error: `<a>` ซ้อน `<a>` | ปรับโครงสร้าง `ProductCard.tsx` แยก Link ออก |
| `params is a Promise` (Next.js 15+) | ใช้ `await params` ใน `/product/[id]/page.tsx` |
| Cart Sidebar เปิดทันทีทุกครั้งที่กดใส่ตระกร้า | แก้ `cartStore.ts` ลบ `isCartOpen = true` ออก |
| `AddToCartModal.tsx` ขาด closing bracket | เพิ่ม `}` กลับ |
| ProductGrid แสดง 2 ซ้อนกันบนหน้าแรก | ลบบรรทัดซ้ำใน `page.tsx` |

---

*อัปเดตไฟล์นี้ทุกครั้งที่มีฟีเจอร์ใหม่หรือ Deploy ขึ้นเว็บจริงครับ*
