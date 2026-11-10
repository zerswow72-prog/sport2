# กระดานคะแนนกีฬาสี (เรียลไทม์)

React + Vite · Supabase (Postgres + Realtime + Auth) · Framer Motion · Lucide · Cloudflare Pages

## 1) ตั้งค่า Supabase
1. สร้างโปรเจกต์ที่ supabase.com
2. SQL Editor → วางและรันไฟล์ `supabase/schema.sql` (สร้างตาราง, สิทธิ์, Realtime และทีมตัวอย่าง 4 สี)
3. Authentication → Users → Add user (สร้างบัญชีกรรมการ) แล้วปิด "Allow new users to sign up" ใน Authentication → Sign In / Providers
4. Project Settings → API → คัดลอก Project URL และ anon key

## 2) รันในเครื่อง
    cp .env.example .env   # ใส่ URL และ anon key
    npm install
    npm run dev

- หน้าแสดงผล: `/`
- หน้ากรรมการ: `/#admin`

## 3) Deploy บน Cloudflare Pages
1. Push โค้ดขึ้น GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build command: `npm run build` · Output directory: `dist`
4. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. Deploy

## หมายเหตุ
- ทุกคนอ่านคะแนนได้ แต่มีเฉพาะผู้ที่ล็อกอินเท่านั้นที่เพิ่ม/ลบคะแนนได้ (Row Level Security)
- anon key เปิดเผยฝั่งเบราว์เซอร์ได้ตามปกติ เพราะสิทธิ์ถูกคุมที่ RLS
- เปลี่ยนชื่อทีม/สี หรือเพิ่มทีมได้ที่ตาราง `teams` ใน Supabase
