-- ================================================================
-- MALLSCREEN · Morocco Mall Screen Booking Platform
-- Database Schema for Supabase / PostgreSQL
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- ADMINS
-- ================================================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'reviewer' CHECK (role IN ('super_admin', 'admin', 'reviewer')),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- PACKAGES
-- ================================================================
CREATE TABLE packages (
  id TEXT PRIMARY KEY,  -- 'starter', 'impact', 'premium', 'exclusive'
  name TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  price_mad DECIMAL(10,2) NOT NULL,
  description TEXT,
  best_for TEXT,
  frequency TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default packages
INSERT INTO packages (id, name, duration_seconds, price_mad, description, best_for, frequency, features, is_featured, sort_order) VALUES
  ('starter', 'Starter', 15, 1500.00, 'Idéal pour un message court et percutant', 'Anniversaires & messages personnels', '4 diffusions par heure', '["Image ou courte vidéo", "15 secondes de visibilité", "Révision en 24h", "Confirmation par email"]', false, 1),
  ('impact', 'Impact', 30, 2800.00, 'Pour les campagnes mémorables et les promotions', 'Promotions & événements', '4 diffusions par heure', '["Image HD ou vidéo jusqu à 30s", "30 secondes de visibilité premium", "Révision prioritaire en 12h", "Confirmation + rappel SMS", "Rapport de diffusion"]', true, 2),
  ('premium', 'Premium', 60, 4900.00, 'L expérience de diffusion ultime sur l écran géant', 'Lancements produits & grandes marques', '4 diffusions par heure', '["Vidéo Full HD jusqu à 60s", "60 secondes d impact maximum", "Révision express en 6h", "Support dédié", "Rapport complet + analytics", "Certificat de diffusion"]', false, 3),
  ('exclusive', 'Exclusif', 120, 8900.00, 'Présence maximale pour les grandes campagnes', 'Grandes marques & campagnes nationales', '8 diffusions par heure', '["Vidéo cinématique 4K jusqu à 2min", "120 secondes de diffusion continue", "Traitement VIP en 3h", "Account manager dédié", "Analytics en temps réel", "Certificat officiel de campagne", "Option: diffusion multi-journée"]', false, 4);

-- ================================================================
-- UPLOADED ASSETS
-- ================================================================
CREATE TABLE uploaded_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration_seconds DECIMAL(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- TIME SLOTS
-- ================================================================
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,
  booking_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(date, start_time)
);

-- ================================================================
-- BOOKINGS (main table)
-- ================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,  -- e.g. BK-20250320-001
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'uploaded', 'pending_payment', 'paid',
    'pending_review', 'approved', 'revision_requested',
    'rejected', 'scheduled', 'displayed', 'cancelled', 'refunded'
  )),
  -- Relations
  package_id TEXT NOT NULL REFERENCES packages(id),
  asset_id UUID REFERENCES uploaded_assets(id),
  slot_id UUID REFERENCES time_slots(id),
  -- Customer info
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_company TEXT,
  campaign_title TEXT NOT NULL,
  customer_message TEXT,
  vat_number TEXT,
  invoice_requested BOOLEAN NOT NULL DEFAULT false,
  -- Payment
  payment_id TEXT,  -- Stripe PaymentIntent ID
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_amount DECIMAL(10,2),
  stripe_session_id TEXT,
  -- Review
  review_admin_id UUID REFERENCES admins(id),
  review_notes TEXT,
  -- Timestamps
  paid_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  displayed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add FK from uploaded_assets to bookings
ALTER TABLE uploaded_assets
  ADD CONSTRAINT fk_asset_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

ALTER TABLE time_slots
  ADD CONSTRAINT fk_slot_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- ================================================================
-- REVIEW NOTES
-- ================================================================
CREATE TABLE review_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admins(id),
  note TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('internal', 'customer_facing')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- NOTIFICATION LOGS
-- ================================================================
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'payment_confirmation', 'approval', 'rejection', etc.
  recipient TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- BLOCKED TIME PERIODS
-- ================================================================
CREATE TABLE blocked_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- SETTINGS
-- ================================================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admins(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value, description) VALUES
  ('screen_config', '{"centralScreen": {"topLeft": [38.5, 12.0], "topRight": [61.5, 12.0], "bottomRight": [61.5, 88.0], "bottomLeft": [38.5, 88.0]}, "brightness": 1.1, "contrast": 1.05, "saturation": 1.1, "ledOverlay": true, "glowIntensity": 0.35}', 'Screen perspective mapping configuration'),
  ('booking_rules', '{"maxAdvanceDays": 30, "minAdvanceDays": 1, "slotDurationMinutes": 30, "operatingHours": {"open": "09:00", "close": "22:00"}}', 'Booking rules configuration'),
  ('content_rules', '{"maxImageSizeMB": 20, "maxVideoSizeMB": 100, "acceptedImageTypes": ["image/jpeg", "image/png", "image/webp"], "acceptedVideoTypes": ["video/mp4", "video/quicktime", "video/webm"], "recommendedWidth": 1080, "recommendedHeight": 1920}', 'Content upload rules'),
  ('email_settings', '{"fromName": "MallScreen", "fromEmail": "noreply@mallscreen.ma", "replyTo": "contact@mallscreen.ma"}', 'Email notification settings');

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_notification_logs_booking ON notification_logs(booking_id);

-- ================================================================
-- ROW LEVEL SECURITY (Supabase)
-- ================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_notes ENABLE ROW LEVEL SECURITY;

-- Public can read available time slots
CREATE POLICY "Public can view available slots"
  ON time_slots FOR SELECT
  USING (is_available = true AND is_blocked = false);

-- Public can insert bookings (controlled by API)
CREATE POLICY "Service role can do anything on bookings"
  ON bookings FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on assets"
  ON uploaded_assets FOR ALL
  USING (auth.role() = 'service_role');

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
  date_str TEXT;
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq_num FROM bookings WHERE DATE(created_at) = CURRENT_DATE;
  NEW.reference := 'BK-' || date_str || '-' || LPAD(seq_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_generate_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();
