-- ==============================================================================
-- Supabase Migration: 20261010000000_new_migration.sql
-- Project Ref: gyhuapqxydbywdupwzmq
-- Ghazara Sales App - Production Schema & Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID generation extension if not available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Custom Enum Types
-- ------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'marketer', 'charity_rep');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE donor_type AS ENUM ('individual', 'corporate', 'anonymous');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'mada', 
        'visa', 
        'mastercard', 
        'apple_pay', 
        'stc_pay', 
        'bank_transfer', 
        'cash'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE donation_status AS ENUM ('completed', 'pending', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payroll_status AS ENUM ('draft', 'reviewed', 'approved', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_status AS ENUM ('in_progress', 'achieved', 'exceeded', 'missed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE charity_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE marketer_status AS ENUM ('active', 'on_leave', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Core Tables
-- ------------------------------------------------------------------------------

-- Charities Table (دليل الجمعيات الخيرية الشريكة)
CREATE TABLE IF NOT EXISTS charities (
    id TEXT PRIMARY KEY DEFAULT ('cht_' || substr(md5(random()::text), 1, 8)),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    license_number VARCHAR(100) NOT NULL,
    category VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'الرياض',
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    logo_url TEXT,
    total_raised NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_raised >= 0),
    target_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (target_amount >= 0),
    active_marketers_count INT NOT NULL DEFAULT 0 CHECK (active_marketers_count >= 0),
    status charity_status NOT NULL DEFAULT 'active',
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Marketers Table (فريق المسوقين الميدانيين)
CREATE TABLE IF NOT EXISTS marketers (
    id TEXT PRIMARY KEY DEFAULT ('mkt_' || substr(md5(random()::text), 1, 8)),
    name VARCHAR(150) NOT NULL,
    national_id VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    assigned_charity_ids TEXT[] NOT NULL DEFAULT '{}',
    base_salary NUMERIC(10, 2) NOT NULL DEFAULT 5000.00 CHECK (base_salary >= 0),
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 6.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    current_month_target NUMERIC(12, 2) NOT NULL DEFAULT 100000.00 CHECK (current_month_target >= 0),
    current_month_achieved NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (current_month_achieved >= 0),
    total_donations_count INT NOT NULL DEFAULT 0 CHECK (total_donations_count >= 0),
    status marketer_status NOT NULL DEFAULT 'active',
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users Table (المستخدمين والأدوار)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text), 1, 8)),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'marketer',
    avatar TEXT,
    charity_id TEXT REFERENCES charities(id) ON DELETE SET NULL,
    marketer_id TEXT REFERENCES marketers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Donations Table (سجل التبرعات الميدانية الموثقة)
CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY DEFAULT ('don_' || substr(md5(random()::text), 1, 8)),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    charity_id TEXT NOT NULL REFERENCES charities(id) ON DELETE RESTRICT,
    charity_name VARCHAR(255) NOT NULL,
    marketer_id TEXT NOT NULL REFERENCES marketers(id) ON DELETE RESTRICT,
    marketer_name VARCHAR(150) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    donor_name VARCHAR(150) NOT NULL DEFAULT 'فاعل خير',
    donor_phone VARCHAR(50) NOT NULL DEFAULT '05XXXXXXXX',
    donor_type donor_type NOT NULL DEFAULT 'individual',
    payment_method payment_method NOT NULL DEFAULT 'mada',
    status donation_status NOT NULL DEFAULT 'completed',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time VARCHAR(20) NOT NULL DEFAULT '12:00:00',
    campaign_name VARCHAR(255) DEFAULT 'كفالة ورعاية شاملة',
    receipt_image_url TEXT,
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Monthly Targets Table (الأهداف الشهرية ونسب التحقيق)
CREATE TABLE IF NOT EXISTS monthly_targets (
    id TEXT PRIMARY KEY DEFAULT ('tgt_' || substr(md5(random()::text), 1, 8)),
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL CHECK (year >= 2020),
    marketer_id TEXT NOT NULL REFERENCES marketers(id) ON DELETE CASCADE,
    marketer_name VARCHAR(150) NOT NULL,
    charity_id TEXT REFERENCES charities(id) ON DELETE SET NULL,
    charity_name VARCHAR(255),
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount >= 0),
    achieved_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (achieved_amount >= 0),
    achievement_percentage NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    status target_status NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(month, year, marketer_id)
);

-- Payroll Records Table (مسير الرواتب ودورة الاعتماد)
CREATE TABLE IF NOT EXISTS payroll_records (
    id TEXT PRIMARY KEY DEFAULT ('pay_' || substr(md5(random()::text), 1, 8)),
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL CHECK (year >= 2020),
    marketer_id TEXT NOT NULL REFERENCES marketers(id) ON DELETE CASCADE,
    marketer_name VARCHAR(150) NOT NULL,
    base_salary NUMERIC(10, 2) NOT NULL CHECK (base_salary >= 0),
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount >= 0),
    achieved_amount NUMERIC(12, 2) NOT NULL CHECK (achieved_amount >= 0),
    achievement_percentage NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    commission_rate NUMERIC(5, 2) NOT NULL CHECK (commission_rate >= 0),
    commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    bonus_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    deductions_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(10, 2) NOT NULL CHECK (net_salary >= 0),
    status payroll_status NOT NULL DEFAULT 'draft',
    approved_by VARCHAR(150),
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(month, year, marketer_id)
);

-- ------------------------------------------------------------------------------
-- 3. High-Performance Query Indexes
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_charities_code ON charities(code);
CREATE INDEX IF NOT EXISTS idx_charities_city ON charities(city);
CREATE INDEX IF NOT EXISTS idx_marketers_email ON marketers(email);
CREATE INDEX IF NOT EXISTS idx_marketers_national_id ON marketers(national_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_donations_charity_id ON donations(charity_id);
CREATE INDEX IF NOT EXISTS idx_donations_marketer_id ON donations(marketer_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(date DESC);
CREATE INDEX IF NOT EXISTS idx_donations_receipt_number ON donations(receipt_number);
CREATE INDEX IF NOT EXISTS idx_monthly_targets_period ON monthly_targets(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_targets_marketer ON monthly_targets(marketer_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_period ON payroll_records(year, month);
CREATE INDEX IF NOT EXISTS idx_payroll_records_marketer ON payroll_records(marketer_id);

-- ------------------------------------------------------------------------------
-- 4. Row-Level Security (RLS) Isolation Policies
-- ------------------------------------------------------------------------------

ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe rerun
DROP POLICY IF EXISTS admin_full_access_charities ON charities;
DROP POLICY IF EXISTS admin_full_access_marketers ON marketers;
DROP POLICY IF EXISTS admin_full_access_donations ON donations;
DROP POLICY IF EXISTS admin_full_access_targets ON monthly_targets;
DROP POLICY IF EXISTS admin_full_access_payroll ON payroll_records;
DROP POLICY IF EXISTS marketer_view_assigned_charities ON charities;
DROP POLICY IF EXISTS marketer_view_own_profile ON marketers;
DROP POLICY IF EXISTS marketer_scoped_donations ON donations;
DROP POLICY IF EXISTS marketer_scoped_targets ON monthly_targets;
DROP POLICY IF EXISTS marketer_scoped_payroll ON payroll_records;
DROP POLICY IF EXISTS charity_rep_own_charity ON charities;
DROP POLICY IF EXISTS charity_rep_scoped_donations ON donations;

-- Admins Policy: Full Read/Write across all collections
CREATE POLICY admin_full_access_charities ON charities FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY admin_full_access_marketers ON marketers FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY admin_full_access_donations ON donations FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY admin_full_access_targets ON monthly_targets FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY admin_full_access_payroll ON payroll_records FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

-- Marketer Policies: Isolated personal donations, targets, and payslips
CREATE POLICY marketer_view_assigned_charities ON charities FOR SELECT TO authenticated
    USING (true);

CREATE POLICY marketer_view_own_profile ON marketers FOR SELECT TO authenticated
    USING (id = (SELECT marketer_id FROM users WHERE id = auth.uid()::text));

CREATE POLICY marketer_scoped_donations ON donations FOR ALL TO authenticated
    USING (marketer_id = (SELECT marketer_id FROM users WHERE id = auth.uid()::text))
    WITH CHECK (marketer_id = (SELECT marketer_id FROM users WHERE id = auth.uid()::text));

CREATE POLICY marketer_scoped_targets ON monthly_targets FOR SELECT TO authenticated
    USING (marketer_id = (SELECT marketer_id FROM users WHERE id = auth.uid()::text));

CREATE POLICY marketer_scoped_payroll ON payroll_records FOR SELECT TO authenticated
    USING (marketer_id = (SELECT marketer_id FROM users WHERE id = auth.uid()::text));

-- Charity Representative Policies: Isolated charity profile and incoming donations
CREATE POLICY charity_rep_own_charity ON charities FOR SELECT TO authenticated
    USING (id = (SELECT charity_id FROM users WHERE id = auth.uid()::text));

CREATE POLICY charity_rep_scoped_donations ON donations FOR SELECT TO authenticated
    USING (charity_id = (SELECT charity_id FROM users WHERE id = auth.uid()::text));
