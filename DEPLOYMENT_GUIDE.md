# JS Photography — Complete Deployment & Handover Guide
## M. Dharma Rao | jsphotography8488@gmail.com

---

## STEP 1 — SUPABASE SETUP (Database + Auth + Storage)

### 1.1 Run the Database Schema

1. Go to: https://supabase.com/dashboard/project/lgzbptakfowfbqesunnw/editor
2. Click **SQL Editor** → **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Click **Run** (green button)
5. You should see: "Success. 0 rows affected" (tables created + seed data inserted)

### 1.2 Set Up Storage Buckets

1. Go to: https://supabase.com/dashboard/project/lgzbptakfowfbqesunnw/storage/buckets
2. Click **New bucket** → Name: `images` → **Public bucket: ON** → Create
3. Go to **Policies** tab for the `images` bucket → Add these policies:

**Policy 1 — Anyone can view images:**
```sql
CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

**Policy 2 — Admin can upload images:**
```sql
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
```

**Policy 3 — Admin can delete images:**
```sql
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
```

### 1.3 Create Admin Account

1. Go to: https://supabase.com/dashboard/project/lgzbptakfowfbqesunnw/auth/users
2. Click **Add user** → **Create new user**
3. Email: `jsphotography8488@gmail.com`
4. Password: `JSPhoto@2026` (change after first login!)
5. Click **Create user**
6. The trigger will automatically set role = 'admin' for this email

### 1.4 Enable Email Auth

1. Go to: https://supabase.com/dashboard/project/lgzbptakfowfbqesunnw/auth/providers
2. Ensure **Email** is enabled
3. Under **Email** settings → Disable "Confirm email" (for easier testing) OR keep enabled for production

---

## STEP 2 — RESEND EMAIL SETUP

1. Go to: https://resend.com/domains
2. Add your domain OR use the sandbox for testing
3. For production, add DNS records to your GoDaddy domain:
   - Go to GoDaddy DNS settings
   - Add the TXT/MX records Resend shows you
4. Your API key is already set: `re_NddCirDv_N3W7M1b8iLDQeNYGP2pW6Lhf`
5. **Important**: Change the `from` email in `app/api/booking/route.ts` from:
   `from: "JS Photography <onboarding@resend.dev>"` 
   To: 
   `from: "JS Photography <noreply@yourdomain.com>"`
   (after domain verification)

---

## STEP 3 — GITHUB SETUP

```bash
# On your computer, open Terminal / Command Prompt

# Install Git if not installed: https://git-scm.com/downloads

# Navigate to project folder
cd js-photography

# Initialize git
git init
git add .
git commit -m "Initial commit — JS Photography website"

# Create repo on GitHub: https://github.com/new
# Name: js-photography (private)

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/js-photography.git
git branch -M main
git push -u origin main
```

---

## STEP 4 — VERCEL DEPLOYMENT

1. Go to: https://vercel.com → Sign up with GitHub
2. Click **Add New Project** → Import your `js-photography` repo
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add ALL of these:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lgzbptakfowfbqesunnw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |
| `RESEND_API_KEY` | `re_NddCirDv_N3W7M1b8iLDQeNYGP2pW6Lhf` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` (add after domain setup) |
| `OWNER_EMAIL` | `jsphotography8488@gmail.com` |

5. Click **Deploy** → Wait 2-3 minutes
6. Your site is LIVE at: `https://js-photography-xxx.vercel.app`

---

## STEP 5 — CUSTOM DOMAIN (GoDaddy)

1. In Vercel: Go to your project → **Settings** → **Domains**
2. Click **Add Domain** → Enter your domain (e.g., `jsphotography.in`)
3. Vercel shows you DNS records to add
4. Go to GoDaddy: https://dcc.godaddy.com → Your domain → **DNS**
5. Add the records Vercel shows:
   - **Type A**: `@` → `76.76.21.21`
   - **Type CNAME**: `www` → `cname.vercel-dns.com`
6. Wait 10-60 minutes for DNS to propagate
7. Come back to Vercel → Domain shows ✓ green

---

## STEP 6 — UPDATE SUPABASE AUTH URL

After your domain is live:
1. Go to Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://jsphotography.in`
3. Add to **Redirect URLs**: `https://jsphotography.in/auth/reset`

---

## STEP 7 — FIRST ADMIN LOGIN

1. Go to: `https://your-domain.com/login`
2. Email: `jsphotography8488@gmail.com`
3. Password: `JSPhoto@2026` (the one you set in Step 1.3)
4. You'll be redirected to the home page
5. Navigate to: `https://your-domain.com/admin`
6. **First thing**: Go to Settings → Change Admin Password to something strong!

---

## ADMIN DASHBOARD GUIDE

### How to manage everything:

#### 📋 Bookings Tab
- See ALL customer booking requests in real-time
- Green ✓ button = Confirm booking (customer gets email)
- Red ✗ button = Delete booking
- Phone numbers are clickable (tap to call on mobile)

#### 🖼 Gallery Tab
- **Upload images**: Click "Choose File" → select from your phone/computer
- **Add by URL**: Paste any image URL from Google Photos, WhatsApp Web, etc.
- Choose category: wedding / prewedding / candid / drone / baby
- Toggle ON/OFF to show/hide without deleting
- Delete permanently with 🗑 button

#### ⚡ Services Tab
- Click "Edit Service" on any card
- Change title (English + Telugu), description, price, icon, image
- Upload new service image from your device
- Save changes → website updates instantly

#### 🔧 Settings Tab
- **Logo**: Upload your studio logo (PNG/JPG)
- **Hero Images**: Upload 4 background photos for the homepage slideshow
- **Business Info**: Update phone, email, address
- **Banner**: Add a promotional message (e.g. "Diwali Special 20% Off!")
- **Change Password**: Update admin password anytime

---

## FUTURE UPDATES

Any time you change code:
```bash
git add .
git commit -m "Update: description of what you changed"
git push
```
→ Vercel automatically rebuilds and deploys in 2-3 minutes.

---

## SUPPORT CONTACTS

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## BUSINESS DETAILS ON FILE

- **Business**: JS Photography
- **Owner**: M. Dharma Rao
- **Location**: Mangalavaari Peta, Rajahmundry
- **Phone**: 9492070597 / 9491365499
- **Email**: jsphotography8488@gmail.com
- **Timings**: 9:30 AM – 9:00 PM
- **Admin URL**: https://your-domain.com/admin
- **Supabase Project**: https://lgzbptakfowfbqesunnw.supabase.co
