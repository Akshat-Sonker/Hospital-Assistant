-- ============================================================================
-- JanVaani Database Schema for Supabase
-- Hierarchical Queues, Provider Directories, Freshness Tracking & Realtime
-- ============================================================================

-- 1. Create Hospitals Table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT DEFAULT 'Delhi',
  emergency_capability TEXT[] DEFAULT ARRAY['ICU', 'Trauma'],
  total_beds INT DEFAULT 100,
  available_beds INT DEFAULT 24,
  icu_beds_available INT DEFAULT 4,
  latitude NUMERIC(9,6) DEFAULT 28.6139,
  longitude NUMERIC(9,6) DEFAULT 77.2090,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  head_doctor TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Extend / Create Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL, -- kept for direct lookup compatibility
  is_available BOOLEAN DEFAULT true, -- Controls "Accepting new tokens"
  room_number TEXT DEFAULT 'OPD-102',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Hierarchical Queue Table
CREATE TABLE IF NOT EXISTS public.queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  token_number INT NOT NULL,
  status TEXT CHECK (status IN ('waiting', 'done', 'cancelled', 'in_consultation')) DEFAULT 'waiting',
  is_operator_mapped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Physical Token Operator Mappings
CREATE TABLE IF NOT EXISTS public.operator_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL,
  physical_token_code TEXT NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  mapped_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Provider Directories (Clinics, Medical Shops, Pathology, Blood Banks)
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  specialties TEXT[],
  is_open BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  inventory_summary JSONB DEFAULT '{"paracetamol": "in_stock", "insulin": "limited"}'::jsonb,
  is_24_7 BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pathology_labs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  available_tests TEXT[] DEFAULT ARRAY['CBC', 'Blood Sugar', 'Thyroid', 'RT-PCR'],
  next_available_slot TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blood_banks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  stock_by_group JSONB DEFAULT '{"A+": 12, "O+": 25, "O-": 3, "AB+": 5}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime on Queue and Doctors tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospitals;
