# منصة غزارة للتسويق الخيري (Ghazara Sales & Charity Marketing Platform)

منصة رقمية متكاملة لإدارة وتنظيم عمليات التسويق الخيري والتبرعات الميدانية، موجهة لشركة **غزارة للتجارة والتسويق**. تتيح المنصة الربط الفوري بين الجمعيات الخيرية الشريكة، والمسوقين الميدانيين، والإدارة التنفيذية، مع تتبع آلي للأهداف البيعية (Sales Targets)، ومسيرات الرواتب والعمولات (Payroll & Commissions)، وعرض مؤشرات الأداء الحية عبر واجهة عربية أصيلة بتصميم متجاوب بالكامل (RTL).

---

## 🌟 أبرز المميزات (Key Features)

- **بوابة متعددة الأدوار بحدود أمان صارمة (Role-Based Multi-Portal):**
  - **مدير تنفيذي (`admin`):** رؤية تشغيلية وإحصائية كاملة، إدارة بيانات الجمعيات والمسوقين، اعتماد مسيرات الرواتب وصرفها، وتصدير التقارير المالية (Excel / CSV).
  - **مسوق ميداني (`marketer`):** بوابة خاصة لتسجيل التبرعات الميدانية الفورية، متابعة نسبة تحقيق الهدف الشهري، واستعراض قسائم الرواتب والعمولات المكتسبة.
  - **ممثل جمعية خيرية (`charity_rep`):** بوابة معزولة للجمعية الشريكة لمتابعة حصيلة التبرعات المسجلة وسندات الاستلام مع حجب بيانات رواتب وعمولات المسوقين تماماً.
- **حسابات مالية واشتقاق آلي للبيانات (Automated Financial Engine):**
  - تتبع التبرعات الميدانية فورياً واحتساب نسب الإنجاز التلقائي للأهداف الشهرية.
  - احتساب الرواتب والعمولات بناءً على معادلات مالية موثوقة ونسب تحقيق متدرجة.
  - دورة حياة صارمة لمسير الرواتب (`مسودة Draft` ⬅️ `مراجعة Reviewed` ⬅️ `معتمد Approved` ⬅️ `مصروف Paid`).
- **صفحة هبوط تسويقية وبوابة دخول ذكية (Landing Page & Modern Auth):**
  - صفحة رئيسية عصرية بمؤشرات حية، وتدرجات إضاءة وتجربة مستخدم تفاعلية.
  - تسجيل دخول سريع بنقرة واحدة بحسابات تجريبية للأدوار الثلاثة، بالإضافة لنموذج تسجيل دخول كامل متوافق مع Supabase Auth.
- **مساعد ذكي مدمج للعمليات (AI Assistant Co-pilot):**
  - مساعد استفسارات ذكي مبني داخل التطبيق يلتزم بنطاق وصلاحيات المستخدم الحالي فقط.
- **بنية نشر سحابية آمنة (Production-Ready Cloud Architecture):**
  - نشر آمن على **Google Cloud Run** بالربط مع **Supabase PostgreSQL** و **Prisma ORM**.
  - بوابة ترحيلات مشددة في CI/CD تمنع أي انحراف في المخطط (Zero-Drift Pre-Deployment Migration Gate).

---

## 🛠️ البنية التقنية (Tech Stack)

| الطبقة | التقنية المستخدمة | الوصف والدور |
|---|---|---|
| **الواجهة الأمامية** | React 19 + TypeScript + Vite 8 | بنية SPA حديثة فائقة السرعة مع كتابة صارمة للأنواع |
| **التصميم والأنماط** | Tailwind CSS + Lucide React | تصميم عربي بالكامل اتجاه اليمين (RTL) مع لوحة ألوان غزارة الداكنة |
| **إدارة الحالة والتخزين** | React Context + AppRepository Boundary | إدارة الحالة المعزولة ودعم التخزين المحلي واستعادة البيانات التجريبية |
| **قاعدة البيانات والـ ORM** | PostgreSQL (Supabase) + Prisma 7 (v7.10.0) | بنية تجميع الاتصالات (Supabase Pooler) وإدارة المخططات والـ Migrations |
| **العميل السحابي** | `@supabase/supabase-js` | دعم المصادقة وإدارة الهوية عبر سحابة Supabase |
| **الفحص والتحقق** | Vitest + Oxlint | 61 اختبار وحدة وDomain مع فحص جودة عالي الأداء |
| **الحاويات والنشر السحابي** | Docker Multi-Stage + Google Cloud Run + Vercel | حاوية إنتاجية خفيفة بدون أسرار ومبنية بمستخدم غير جذري |

---

## 📋 المتطلبات المسبقة (Prerequisites)

للتشغيل والتطوير على بيئة العمل المحلية، يجب توفر ما يلي:
- **Node.js**: الإصدار `20.x` أو `22.x LTS` (يوصى بـ Node.js 22).
- **مدير الحزم**: `npm` (أو `npm.cmd` على أنظمة Windows).
- **Git**: لاستنساخ المستودع ومتابعة الفروع.
- **حساب Supabase** (اختياري للتطوير المحلي، وإلزامي للنشر السحابي).

---

## 🚀 البدء والتشغيل المحلي (Getting Started)

### 1. استنساخ المستودع
```bash
git clone https://github.com/Tomybarq/Ghazara.net.git
cd Ghazara.net
```

### 2. تثبيت الحزم والاعتماديات
```bash
# لأنظمة Windows
npm.cmd install

# لأنظمة macOS / Linux
npm install
```

### 3. إعداد متغيرات البيئة
قم بنسخ ملف البيئة النموذجي `.env.example` إلى `.env`:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Bash / Linux / macOS
cp .env.example .env
```

محتوى متغيرات البيئة الرئيسية:
```env
# 1. مجمع المعاملات لتشغيل الاستعلامات (Transaction Pooler - Port 6543)
DATABASE_URL="postgresql://postgres.gyhuapqxydbywdupwzmq:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. مجمع الجلسات لتشغيل الترحيلات وأوامر Prisma (Session Pooler - Port 5432)
DIRECT_URL="postgresql://postgres.gyhuapqxydbywdupwzmq:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

# 3. إعدادات عميل Supabase للواجهة الأمامية
VITE_SUPABASE_URL="https://gyhuapqxydbywdupwzmq.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_nVOrmPKpqidFo6Fv_lWkNQ_9Yd9qeQC"
```

### 4. تشغيل خادم التطوير المحلي
```bash
# Windows
npm.cmd run dev

# macOS / Linux
npm run dev
```
افتح المتصفح على الرابط: [http://localhost:5173](http://localhost:5173).

---

## 🏗️ المعمارية وهيكل المشروع (Architecture Overview)

```text
sales-app/
├── .agents/skills/            # أدوات ومهارات Supabase وأفضل ممارسات قواعد البيانات
├── .github/workflows/         # مسار CI/CD وبوابة التحقق من ترحيلات Prisma
├── database/                  # نصوص تهيئة SQL الأولية وسكربت مزامنة المجمع (sync.mjs)
├── docs/                      # التوثيق المعماري ومواصفات المنتج وخطة الإطلاق
│   ├── architecture.md        # المبادئ المعمارية وحساب المشتقات المالية
│   ├── cloud-run-deployment.md# دليل النشر على Google Cloud Run والـ Secret Manager
│   ├── database-prisma.md     # دليل Prisma ومجمعات Supabase Pooler
│   └── product-spec.md        # مواصفات المنتج ومتطلبات قبول النسخة التجريبية
├── prisma/                    # مخطط Prisma Schema وملفات الـ Migrations
│   ├── schema.prisma          # تعريف جداول وقواعد PostgreSQL
│   └── migrations/            # سجل ترحيلات SQL المنفذة
├── server/                    # خادم Express/Node فائق الصغر لتشغيل الحاوية السحابية
├── src/
│   ├── assets/                # الصور والشعارات والرموز
│   ├── components/
│   │   ├── ai-agent/          # واجهة المساعد الذكي المدمج (Copilot Drawer)
│   │   ├── auth/              # واجهة تسجيل الدخول الحديثة بالأدوار
│   │   ├── charities/         # بطاقات وإدارة الجمعيات الخيرية الشريكة
│   │   ├── charity-rep/       # البوابة الخاصة بممثلي الجمعيات الخيرية
│   │   ├── common/            # العناصر المشتركة (إشعارات، أزرار)
│   │   ├── dashboard/         # لوحة المؤشرات الرئيسية والرسوم البيانية
│   │   ├── donations/         # سجل التبرعات ونافذة تسجيل تبرع ميداني جديد
│   │   ├── landing/           # صفحة الهبوط التسويقية الرئيسية
│   │   ├── layout/            # الهيدر، القائمة الجانبية، وشريط التنقل للشاشات الصغيرة
│   │   ├── marketers/         # فريق المسوقين الميدانيين وملفات الأداء
│   │   ├── payroll/           # مسير الرواتب ودورة الاعتماد المالي
│   │   └── targets/           # متابعة الأهداف البيعية ونسب الإنجاز
│   ├── context/               # سياق التطبيق ومحددات الوصول للأدوار (AppContext)
│   ├── data/                  # بيانات البذور الأولية المتكاملة (Mock Data)
│   ├── domain/                # منطق الأعمال النقي والاختبارات (حسابات، صلاحيات، رواتب)
│   ├── lib/                   # عميل Supabase ومكتبات المساعدة الخارجية
│   ├── storage/               # طبقة المستودع (AppRepository) لإدارة التخزين
│   ├── types/                 # تعريف أنواع TypeScript الشاملة
│   └── utils/                 # أدوات التنسيق وتصدير الجداول (Excel / CSV)
├── Dockerfile                 # حاوية الإنتاج المتعددة المراحل (Node 22 Alpine)
├── package.json               # التبعيات والأوامر المقفلة
├── prisma.config.ts           # إعدادات Prisma 7 للربط مع متغيرات البيئة
└── vercel.json                # إعدادات التوجيه والنشر كـ SPA على Vercel
```

---

## ⚡ الأوامر المتاحة (Available Scripts)

| الأمر | الوصف والدور |
|---|---|
| `npm run dev` | تشغيل خادم التطوير السريع عبر Vite |
| `npm run build` | تجميع وفحص المشروع للإنتاج (`tsc -b && vite build`) |
| `npm run test` | تشغيل اختبارات الوحدة ومنطق الأعمال عبر Vitest |
| `npm run lint` | فحص جودة الكود والالتزام بالمعايير عبر Oxlint |
| `npm run typecheck` | التحقق الصارم من أنواع TypeScript دون توليد ملفات |
| `npm run preview` | معاينة حزمة الإنتاج المبنية محلياً |
| `npm run db:validate` | التحقق من صحة ملف `prisma/schema.prisma` |
| `npm run db:migrate:dev` | تطبيق ترحيلات Prisma في بيئة التطوير المحلية |
| `npm run db:migrate:deploy` | تطبيق الترحيلات المعتمدة ضد مجمع الجلسات (:5432) في بيئة الإنتاج |
| `npm run db:drift-check` | فحص ومطابقة الـ Migrations مع الـ Schema لضمان عدم وجود انحراف |

---

## 🧪 الاختبارات والجودة (Testing & Quality Gates)

يحتوي المشروع على جناح اختبارات يغطي جميع قواعد الأعمال الحسابية والصلاحيات وتخزين البيانات عبر **Vitest**:
```bash
npm.cmd test
```
تشمل الاختبارات:
- **`src/domain/payroll.test.ts`**: اختبار قواعد دورة حياة الرواتب وحساب العمولات.
- **`src/domain/donations.test.ts`**: التحقق من صحة مدخلات التبرعات ومنع الحالات الشاذة.
- **`src/domain/finance.test.ts`**: اختبار معادلات نسب الإنجاز والمكافآت.
- **`src/domain/access.test.ts`**: التحقق من عزل الصلاحيات ومنع تسريب بيانات الجمعيات والمسوقين.
- **`src/storage/appRepository.test.ts`**: اختبار استعادة البيانات والتعافي عند تلف التخزين المحلي.

---

## ☁️ النشر والتشغيل السحابي (Deployment)

### 1. النشر على Google Cloud Run
التطبيق مجهز بحاوية Docker متعددة المراحل (`Dockerfile`) خالية تماماً من البيانات الحساسة وتعمل بمستخدم غير جذري (`USER node`) على المنفذ `8080`.
الرابط المباشر للإنتاج:
🔗 **[https://ghazara-sales-app-457625667026.me-central1.run.app](https://ghazara-sales-app-457625667026.me-central1.run.app)**

بناء الحاوية وتشغيلها محلياً عبر Docker:
```bash
docker build -t ghazara-sales-app .
docker run -p 8080:8080 -e PORT=8080 ghazara-sales-app
```

### 2. النشر على Vercel
تم ضبط ملف `vercel.json` لإعادة توجيه كافة المسارات إلى `index.html` لدعم نمط تطبيق الصفحة الواحدة (SPA Rewrite):
```bash
vercel --prod
```

### 3. بوابة ترحيلات CI/CD في GitHub Actions
تتضمن خطة النشر في `.github/workflows/deploy.yml` فحصاً إلزامياً:
1. فحص الكود والجودة (`quality-gate`: build + test + lint).
2. فحص انحراف المخطط وتطبيق ترحيل Prisma عبر مجمع الجلسات (:5432) باستخدام الحزمة المثبتة محلياً ودون اتصال خارجي (`npx --no-install prisma migrate deploy`).
3. بناء صورة الـ Container ورفعها إلى Google Artifact Registry ثم تحديث Cloud Run تلقائياً.

---

## 🔐 الأمان وحماية البيانات (Security & Privacy)

- **انعدام الأسرار في المستودع:** لا يتم تخزين أي كلمات مرور أو مفاتيح سرية في ملفات Git أو في صور Docker.
- **عزل أسرار السحابة:** تُحقن المتغيرات الحساسة وقت التشغيل عبر **Google Cloud Secret Manager**.
- **الحد الأدنى من الصلاحيات (Least Privilege):** استخدام حسابات خدمة بصلاحيات القراءة المحددة فقط للأسرار دون صلاحيات إدارة على مستوى المشروع.

---

## 📄 الترخيص والمحتوى (License & Ownership)

جميع الحقوق محفوظة لـ **شركة غزارة للتجارة والتسويق (Ghazara Trading & Marketing)** © 2026.
