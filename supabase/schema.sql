-- ============================================================
-- JS PHOTOGRAPHY — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- ── PROFILES TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email      TEXT NOT NULL,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin','customer')),
  avatar_url TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email = 'jsphotography8488@gmail.com' THEN 'admin' ELSE 'customer' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── BOOKINGS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  service    TEXT NOT NULL,
  event_date DATE NOT NULL,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','cancelled')),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a booking (public form)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete bookings
CREATE POLICY "Admin can manage bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can see their own bookings
CREATE POLICY "Users can see own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;


-- ── SERVICES TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  title           TEXT NOT NULL,
  title_te        TEXT,
  description     TEXT NOT NULL,
  description_te  TEXT,
  price           TEXT NOT NULL DEFAULT 'Contact for price',
  icon            TEXT NOT NULL DEFAULT '📸',
  image_url       TEXT NOT NULL,
  display_order   INT NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services
CREATE POLICY "Anyone can read services"
  ON public.services FOR SELECT
  USING (active = true);

-- Admin can manage services
CREATE POLICY "Admin can manage services"
  ON public.services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ── GALLERY TABLE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  image_url     TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'wedding',
  caption       TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery"
  ON public.gallery FOR SELECT
  USING (active = true);

CREATE POLICY "Admin can manage gallery"
  ON public.gallery FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ── SITE SETTINGS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ── SEED: DEFAULT SERVICES ───────────────────────────────────
INSERT INTO public.services (title, title_te, description, description_te, price, icon, image_url, display_order, active) VALUES
('Events',             'ఈవెంట్స్',             'Corporate events, birthday parties, cultural programs — captured with precision and energy.',        'కార్పొరేట్ ఈవెంట్లు, పుట్టినరోజులు — అన్నీ అద్భుతంగా చిత్రీకరించబడతాయి.',    'Starting ₹8,000',  '🎉', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=75', 1, true),
('Marriages',          'వివాహాలు',             'Full wedding day coverage — from mehendi to reception, every ritual immortalized.',                   'మెహందీ నుండి రిసెప్షన్ వరకు — ప్రతి అడుగు చిరస్మరణీయంగా.',                  'Starting ₹25,000', '💒', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75', 2, true),
('Pre Wedding Songs',  'ప్రీ-వెడ్డింగ్ సాంగ్స్', 'Cinematic pre-wedding song shoots at stunning locations with professional direction.',                'అందమైన లొకేషన్లలో సినిమాటిక్ ప్రీ-వెడ్డింగ్ షూట్.',                        'Starting ₹15,000', '💑', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=75', 3, true),
('Wedding Video & Photos','వెడ్డింగ్ వీడియో & ఫోటోలు','Complete wedding video + photo package with cinematic editing and same-day highlights.',        'సినిమాటిక్ ఎడిటింగ్‌తో సంపూర్ణ వెడ్డింగ్ వీడియో & ఫోటో ప్యాకేజీ.',        'Starting ₹35,000', '🎬', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=75', 4, true),
('Cinematography Video','సినిమాటోగ్రఫీ వీడియో',  'Hollywood-style cinematic videos for your wedding — drone shots, slow-mo, color graded.',          'హాలీవుడ్ స్టైల్ సినిమాటిక్ వీడియోలు — డ్రోన్, స్లో-మో, కలర్ గ్రేడ్.',     'Starting ₹20,000', '🎥', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=75', 5, true),
('Candid Photography', 'కాండిడ్ ఫొటోగ్రఫీ',   'Natural, unposed, emotional — capturing genuine smiles and tears with artistic frames.',             'సహజమైన, భావోద్వేగ క్షణాలను కళాత్మకంగా చిత్రీకరించడం.',                    'Starting ₹10,000', '📸', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=75', 6, true),
('Baby Shoots',        'బేబీ షూట్స్',          'Precious newborn and toddler shoots in studio or outdoor with themed setups.',                      'స్టూడియో లేదా అవుట్‌డోర్‌లో పసివాళ్ళ అద్భుతమైన ఫోటోషూట్.',               'Starting ₹5,000',  '👶', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=75', 7, true),
('Gift Articles',      'గిఫ్ట్ ఆర్టికల్స్',    'Custom photo gifts — albums, framed prints, mugs, canvases and more for all occasions.',             'కస్టమ్ ఫోటో గిఫ్ట్‌లు — ఆల్బమ్‌లు, ఫ్రేమ్‌లు, మగ్‌లు, కాన్వాస్.',         'Starting ₹500',    '🎁', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=75', 8, true),
('Drone',              'డ్రోన్',                'Breathtaking aerial coverage of your event venue, procession, and outdoor ceremonies.',               'మీ వేడుక వేదిక యొక్క అద్భుతమైన ఏరియల్ కవరేజ్.',                          'Starting ₹12,000', '🚁', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=75', 9, true)
ON CONFLICT DO NOTHING;


-- ── SEED: DEFAULT GALLERY ────────────────────────────────────
INSERT INTO public.gallery (image_url, category, caption, display_order, active) VALUES
('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75', 'wedding',    'Wedding Ceremony',    1,  true),
('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=75', 'prewedding', 'Pre-Wedding Shoot',   2,  true),
('https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=75', 'wedding',    'Bridal Portrait',     3,  true),
('https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=75', 'drone',      'Aerial View',         4,  true),
('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=75', 'candid',     'Candid Laugh',        5,  true),
('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=75', 'baby',       'Baby Shoot',          6,  true),
('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=75', 'wedding',    'Wedding Reception',   7,  true),
('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=75', 'prewedding', 'Pre-Wedding Film',    8,  true),
('https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=800&q=75', 'candid',     'Candid Moment',       9,  true),
('https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&q=75', 'wedding',    'Wedding Portrait',    10, true),
('https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=75', 'baby',       'Cute Baby',           11, true),
('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=75', 'wedding',    'Grand Event',         12, true)
ON CONFLICT DO NOTHING;


-- ── SEED: DEFAULT SITE SETTINGS ─────────────────────────────
INSERT INTO public.site_settings (key, value) VALUES
('business_name', 'JS Photography'),
('phone1',        '9492070597'),
('phone2',        '9491365499'),
('email',         'jsphotography8488@gmail.com'),
('address',       'Mangalavaari Peta, Rajahmundry'),
('banner_text',   ''),
('banner_show',   'no'),
('hero_img_1', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'),
('hero_img_2', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80'),
('hero_img_3', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=80'),
('hero_img_4', 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&q=80')
ON CONFLICT (key) DO NOTHING;
