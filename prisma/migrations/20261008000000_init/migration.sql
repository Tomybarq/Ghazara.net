-- ==============================================================================
-- Initial Prisma Migration: 20261008000000_init
-- Ghazara Sales App - PostgreSQL Schema
-- ==============================================================================

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'marketer', 'charity_rep');
CREATE TYPE "donor_type" AS ENUM ('individual', 'corporate', 'anonymous');
CREATE TYPE "payment_method" AS ENUM ('mada', 'visa', 'mastercard', 'apple_pay', 'stc_pay', 'bank_transfer', 'cash');
CREATE TYPE "donation_status" AS ENUM ('completed', 'pending', 'refunded');
CREATE TYPE "payroll_status" AS ENUM ('draft', 'reviewed', 'approved', 'paid');
CREATE TYPE "target_status" AS ENUM ('in_progress', 'achieved', 'exceeded', 'missed');
CREATE TYPE "charity_status" AS ENUM ('active', 'inactive');
CREATE TYPE "marketer_status" AS ENUM ('active', 'on_leave', 'inactive');

-- CreateTable: charities
CREATE TABLE "charities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "license_number" VARCHAR(100) NOT NULL,
    "category" VARCHAR(150) NOT NULL,
    "city" VARCHAR(100) NOT NULL DEFAULT 'الرياض',
    "contact_person" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "logo_url" TEXT,
    "total_raised" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "target_amount" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "active_marketers_count" INTEGER NOT NULL DEFAULT 0,
    "status" "charity_status" NOT NULL DEFAULT 'active',
    "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charities_pkey" PRIMARY KEY ("id")
);

-- CreateTable: marketers
CREATE TABLE "marketers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "national_id" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "avatar_url" TEXT,
    "assigned_charity_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "base_salary" DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 6.00,
    "current_month_target" DECIMAL(12,2) NOT NULL DEFAULT 100000.00,
    "current_month_achieved" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total_donations_count" INTEGER NOT NULL DEFAULT 0,
    "status" "marketer_status" NOT NULL DEFAULT 'active',
    "join_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'marketer',
    "avatar" TEXT,
    "charity_id" TEXT,
    "marketer_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: donations
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "receipt_number" VARCHAR(50) NOT NULL,
    "charity_id" TEXT NOT NULL,
    "charity_name" VARCHAR(255) NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "marketer_name" VARCHAR(150) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "donor_name" VARCHAR(150) NOT NULL DEFAULT 'فاعل خير',
    "donor_phone" VARCHAR(50) NOT NULL DEFAULT '05XXXXXXXX',
    "donor_type" "donor_type" NOT NULL DEFAULT 'individual',
    "payment_method" "payment_method" NOT NULL DEFAULT 'mada',
    "status" "donation_status" NOT NULL DEFAULT 'completed',
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" VARCHAR(20) NOT NULL DEFAULT '12:00:00',
    "campaign_name" VARCHAR(255) DEFAULT 'كفالة ورعاية شاملة',
    "receipt_image_url" TEXT,
    "payment_reference" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: monthly_targets
CREATE TABLE "monthly_targets" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "marketer_name" VARCHAR(150) NOT NULL,
    "charity_id" TEXT,
    "charity_name" VARCHAR(255),
    "target_amount" DECIMAL(12,2) NOT NULL,
    "achieved_amount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "achievement_percentage" DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    "status" "target_status" NOT NULL DEFAULT 'in_progress',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable: payroll_records
CREATE TABLE "payroll_records" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "marketer_id" TEXT NOT NULL,
    "marketer_name" VARCHAR(150) NOT NULL,
    "base_salary" DECIMAL(10,2) NOT NULL,
    "target_amount" DECIMAL(12,2) NOT NULL,
    "achieved_amount" DECIMAL(12,2) NOT NULL,
    "achievement_percentage" DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "bonus_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "deductions_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "net_salary" DECIMAL(10,2) NOT NULL,
    "status" "payroll_status" NOT NULL DEFAULT 'draft',
    "approved_by" VARCHAR(150),
    "paid_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "charities_code_key" ON "charities"("code");
CREATE INDEX "charities_code_idx" ON "charities"("code");
CREATE INDEX "charities_city_idx" ON "charities"("city");

-- CreateIndex
CREATE INDEX "marketers_email_idx" ON "marketers"("email");
CREATE INDEX "marketers_national_id_idx" ON "marketers"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "donations_receipt_number_key" ON "donations"("receipt_number");
CREATE INDEX "donations_charity_id_idx" ON "donations"("charity_id");
CREATE INDEX "donations_marketer_id_idx" ON "donations"("marketer_id");
CREATE INDEX "donations_date_idx" ON "donations"("date" DESC);
CREATE INDEX "donations_receipt_number_idx" ON "donations"("receipt_number");

-- CreateIndex
CREATE INDEX "monthly_targets_year_month_idx" ON "monthly_targets"("year", "month");
CREATE INDEX "monthly_targets_marketer_id_idx" ON "monthly_targets"("marketer_id");
CREATE UNIQUE INDEX "monthly_targets_month_year_marketer_id_key" ON "monthly_targets"("month", "year", "marketer_id");

-- CreateIndex
CREATE INDEX "payroll_records_year_month_idx" ON "payroll_records"("year", "month");
CREATE INDEX "payroll_records_marketer_id_idx" ON "payroll_records"("marketer_id");
CREATE UNIQUE INDEX "payroll_records_month_year_marketer_id_key" ON "payroll_records"("month", "year", "marketer_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_charity_id_fkey" FOREIGN KEY ("charity_id") REFERENCES "charities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_marketer_id_fkey" FOREIGN KEY ("marketer_id") REFERENCES "marketers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_charity_id_fkey" FOREIGN KEY ("charity_id") REFERENCES "charities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_marketer_id_fkey" FOREIGN KEY ("marketer_id") REFERENCES "marketers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_targets" ADD CONSTRAINT "monthly_targets_marketer_id_fkey" FOREIGN KEY ("marketer_id") REFERENCES "marketers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_targets" ADD CONSTRAINT "monthly_targets_charity_id_fkey" FOREIGN KEY ("charity_id") REFERENCES "charities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_marketer_id_fkey" FOREIGN KEY ("marketer_id") REFERENCES "marketers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
