-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dresses table
CREATE TABLE dresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL, -- { he, fr, en, ... }
  description JSONB NOT NULL, -- { he, fr, en, ... }
  category TEXT NOT NULL CHECK (category IN ('evening', 'wedding', 'cocktail')),
  availability TEXT NOT NULL CHECK (availability IN ('sale', 'rental', 'both')),
  price_sale NUMERIC(10, 2),
  price_rental NUMERIC(10, 2),
  images TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  dress_id UUID REFERENCES dresses(id) ON DELETE SET NULL,
  enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('dress', 'class', 'alteration', 'general')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create class_info table (single-row configuration)
CREATE TABLE class_info (
  id INTEGER PRIMARY KEY DEFAULT 1,
  children_schedule JSONB, -- { he, fr, en }
  adults_schedule JSONB, -- { he, fr, en }
  price_per_course NUMERIC(10, 2),
  num_sessions INTEGER DEFAULT 6,
  notes JSONB, -- { he, fr, en }
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row in class_info
INSERT INTO class_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX idx_dresses_slug ON dresses(slug);
CREATE INDEX idx_dresses_is_active ON dresses(is_active);
CREATE INDEX idx_dresses_is_featured ON dresses(is_featured);
CREATE INDEX idx_dresses_category ON dresses(category);
CREATE INDEX idx_dresses_availability ON dresses(availability);
CREATE INDEX idx_enquiries_dress_id ON enquiries(dress_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_enquiry_type ON enquiries(enquiry_type);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);

-- Row-Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_info ENABLE ROW LEVEL SECURITY;

-- DRESSES TABLE POLICIES
-- Public can view active dresses
CREATE POLICY "Public can view active dresses" ON dresses
  FOR SELECT
  USING (is_active = true);

-- Admin can do everything (authenticated users with admin role)
CREATE POLICY "Admin can manage dresses" ON dresses
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ENQUIRIES TABLE POLICIES
-- Public can insert enquiries (contact form)
CREATE POLICY "Public can submit enquiries" ON enquiries
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all enquiries
CREATE POLICY "Admin can view enquiries" ON enquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can update enquiry status
CREATE POLICY "Admin can update enquiry status" ON enquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CLASS_INFO TABLE POLICIES
-- Public can view class info
CREATE POLICY "Public can view class_info" ON class_info
  FOR SELECT
  USING (true);

-- Admin can update class info
CREATE POLICY "Admin can update class_info" ON class_info
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
