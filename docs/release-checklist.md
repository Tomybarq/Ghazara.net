# Ghazara Sales App - MVP Release Checklist & Operational Runbook

## 1. Release Overview
- **Product Name:** Ghazara Sales & Charity Marketing MVP (غزارة للتسويق والتجارة)
- **Target Platform:** Desktop & Mobile Modern Browsers (Arabic RTL)
- **Architecture:** Client-side React 19 + TypeScript + Vite + Tailwind CSS with LocalStorage Persistence (`ghazara_sales_app_state_v1`)
- **Git Remote:** `https://github.com/Tomybarq/Ghazara.net.git` (`main` branch)

---

## 2. Multi-Role Verification Flows

### A. Role 1: Administrator (`admin`)
- [ ] **Access & Navigation:** Full visibility of all tabs (لوحة التحكم، التبرعات، المسوقون، الجمعيات، الأهداف، مسير الرواتب، وكيل الذكاء الاصطناعي).
- [ ] **Data Scope:** Sees global donations, all registered charities, all active marketers, global targets, and full company payroll.
- [ ] **Donation Entry:** Can register a new donation selecting any charity and any marketer.
- [ ] **Payroll Lifecycle Management:**
  - Can advance payroll status: `draft` (مسودة) -> `reviewed` (تم التدقيق) -> `approved` (معتمد) -> `paid` (تم الصرف).
  - Verifies that `paid` records become locked and immutable.
- [ ] **Export Capabilities:**
  - Can export donations to UTF-8 BOM CSV (Arabic text renders correctly in Excel).
  - Can export payroll slips to CSV with full allowances and deductions.
  - Can print official PDF/Print receipts for any donation.
- [ ] **State Administration:** Can trigger "إعادة تعيين البيانات التجريبية" (Reset Demo Data) to restore default state.

---

### B. Role 2: Marketer (`marketer`)
- [ ] **Access & Navigation:** Restricted to (لوحة التحكم، التبرعات، الأهداف، مسير الرواتب، وكيل الذكاء الاصطناعي). الجمعيات (Charities) tab is hidden.
- [ ] **Data Scope:**
  - Donations view shows ONLY donations credited to this marketer.
  - Targets view shows ONLY this marketer's monthly targets and achievement progress.
  - Payroll view shows ONLY this marketer's personal payslip.
  - Dashboard stats reflect this marketer's personal volume and expected commissions.
- [ ] **Donation Entry:** Marketer field is auto-locked to current marketer's identity; cannot credit sales to others.
- [ ] **Payroll Permissions:** Marketer CANNOT approve or change status of their own payroll (action buttons hidden/disabled).

---

### C. Role 3: Charity Representative (`charity_rep`)
- [ ] **Access & Navigation:** Restricted to (لوحة التحكم، التبرعات، الجمعيات / ملف الجمعية، وكيل الذكاء الاصطناعي). المسوقون (Marketers) and مسير الرواتب (Payroll) tabs are hidden.
- [ ] **Data Scope:**
  - Donations view shows ONLY donations designated for this charity.
  - Charities view shows ONLY this charity's profile, campaigns, and collected funds.
  - Internal marketer commission rates and operational payroll records are completely isolated and inaccessible.
- [ ] **Export Capabilities:** Can export only this charity's donations list to CSV or print individual donor receipts.

---

## 3. Financial Invariant Verification
- [ ] **Donation Validation:** Negative or zero amount donations are rejected.
- [ ] **Commission Calculations:** Marketer commission = `Donation Amount × (Marketer Commission Rate / 100)`.
- [ ] **Target Progress:** Target achievement % = `(Total Collected in Period / Target Amount) × 100`.
- [ ] **Payroll Totals:** `Net Salary = Base Salary + Earned Commission + Allowances - Deductions`.
- [ ] **Dynamic Active Period:** Current period calculates dynamically via `getActivePeriod()` matching calendar `M/YYYY` or `MM/YYYY`.

---

## 4. UI/UX & RTL Quality Standards
- [ ] Page direction is strictly RTL (`dir="rtl"`) with Arabic typography (`Cairo`, `Tajawal`, sans-serif).
- [ ] Palette adheres to Ghazara Dark Theme (`#0A0A1A` base, `#12122B` card, `#6B21C8` purple, `#FF6B2B` orange).
- [ ] Modals support touch dismissal and `Escape` key capture.
- [ ] Responsive navigation functions seamlessly on mobile viewports (< 768px) and desktop (> 1024px).

---

## 5. Known MVP Scope & Production Boundaries
> [!NOTE]
> This application is currently an MVP demonstration client. The following boundaries are known by design:
> 1. **Authentication:** Role switcher is a client-side selector for demo purposes; production deployment will integrate backend JWT / OAuth SSO (e.g. Supabase Auth / Clerk / enterprise IAM).
> 2. **Persistence:** State is persisted in browser `localStorage`. Real multi-user concurrent persistence requires a PostgreSQL / Supabase backend.
> 3. **Payments:** Payment methods (Mada, Apple Pay, Visa/MasterCard, Bank Wire, Cash) simulate field collection workflows and do not process live card transactions.
