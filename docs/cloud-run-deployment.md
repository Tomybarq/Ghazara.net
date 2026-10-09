# Ghazara Sales App - Google Cloud Run & Supabase Deployment Architecture

دليل النشر والتشغيل السحابي الموجه لتطبيق غزارة للتسويق الخيري على **Google Cloud Run** بالربط مع **Supabase PostgreSQL & Prisma ORM**.

---

## 1. مبادئ الأمان والتصميم الأساسية (Architecture Principles)

1. **حاوية إنتاجية متعددة المراحل (Multi-Stage Dockerfile):**
   - مرحلة البناء (`builder`) تنفذ `npx prisma generate` و `npm run build`.
   - مرحلة التشغيل (`runner`) مبنية على صورة مصغرة `node:22-alpine` وتعمل بمستخدم غير جذري (`USER node`).
   - خلو الحاوية تماماً من أي ملفات بيئة (`.env`) أو بيانات اعتماد صلبة.

2. **إدارة الأسرار عبر Google Cloud Secret Manager:**
   - جميع المتغيرات السرية (`DATABASE_URL`, `DIRECT_URL`, `SHADOW_DATABASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) تُخزن في **Secret Manager** وتُحقن عند الإقلاع.

3. **صلاحيات الحد الأدنى (Least Privilege Service Account):**
   - حساب الخدمة الخاص بـ Cloud Run يُمنح فقط دور `roles/secretmanager.secretAccessor` على الأسرار المحددة للتطبيق، دون منحه صلاحية إدارة شاملة على المشروع (`Secret Manager Admin`).

4. **بوابة الترحيلات والهجرة الصارمة (Pre-Deployment Migration Gate):**
   - ترحيل قاعدة البيانات (`npx prisma migrate deploy`) ينفذ فقط عبر مسار **CI/CD (GitHub Actions)** ضد مجمع الجلسات (`DIRECT_URL` - المنفذ 5432) **قبل** نشر الحاوية الجديدة لتفادي التعارض في بيئات التشغيل المتعددة.
   - التحقق من عدم وجود انحراف في المخطط عبر `prisma migrate diff --exit-code`.

5. **إعدادات الاتصال بمجمع Supabase:**
   - `DATABASE_URL` المخصص للتشغيل يستهدف **Transaction Pooler** (المنفذ 6543) مع `?pgbouncer=true`.
   - عدم إضافة `connection_limit=1` عند استخدام Supavisor لتجنب التعارض مع مجمعات الاتصال الخارجية.

---

## 2. أوامر إعداد البنية التحتية عبر `gcloud` (Infrastructure Setup)

### أ. إنشاء مستودع Artifact Registry:
```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="me-central1"
export REPO_NAME="ghazara-apps"

gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="Production containers repository for Ghazara"
```

### ب. إنشاء الأسرار في Secret Manager:
```bash
# 1. Transaction Pooler (Port 6543 with ?pgbouncer=true)
gcloud secrets create DATABASE_URL --replication-policy="automatic"
echo -n "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true" | \
  gcloud secrets versions add DATABASE_URL --data-file=-

# 2. Session Pooler (Port 5432 for migrations)
gcloud secrets create DIRECT_URL --replication-policy="automatic"
echo -n "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres" | \
  gcloud secrets versions add DIRECT_URL --data-file=-

# 3. Supabase Frontend Keys
gcloud secrets create VITE_SUPABASE_URL --replication-policy="automatic"
echo -n "https://[PROJECT_REF].supabase.co" | \
  gcloud secrets versions add VITE_SUPABASE_URL --data-file=-

gcloud secrets create VITE_SUPABASE_ANON_KEY --replication-policy="automatic"
echo -n "[ANON_KEY]" | \
  gcloud secrets versions add VITE_SUPABASE_ANON_KEY --data-file=-
```

### ج. إنشاء حساب خدمة Cloud Run وتطبيق مبدأ الصلاحيات الأدنى:
```bash
export RUN_SA_NAME="ghazara-run-sa"
export RUN_SA_EMAIL="${RUN_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# إنشاء حساب الخدمة
gcloud iam service-accounts create $RUN_SA_NAME \
  --display-name="Ghazara Cloud Run Service Account"

# منح صلاحية الوصول لقراءة الأسرار فقط (على كل سر محدد)
for SECRET in DATABASE_URL DIRECT_URL VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:${RUN_SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"
done
```

---

## 3. أسرار GitHub Actions المطلوبة (Repository Secrets)

في إعدادات المستودع على GitHub (`Settings -> Secrets and variables -> Actions`):

| السر (Secret Name) | الوصف |
| :--- | :--- |
| `GCP_PROJECT_ID` | معرّف مشروع Google Cloud |
| `GCP_REGION` | المنطقة الجغرافية (مثل `me-central1` أو `europe-west1`) |
| `GCP_GAR_REPOSITORY` | اسم مستودع الحاويات (مثل `ghazara-apps`) |
| `GCP_CLOUDRUN_SERVICE` | اسم خدمة Cloud Run (مثل `ghazara-sales-app`) |
| `GCP_SA_KEY` | مفتاح حساب خدمة النشر بتنسيق JSON |
| `DIRECT_URL` | رابط Supabase Session Pooler (المنفذ 5432) لتنفيذ الترحيلات في الـ CI |
| `SHADOW_DATABASE_URL` | رابط قاعدة بيانات الظل المعزولة لفحص الانحراف (اختياري) |

---

## 4. مسار دورة حياة النشر (CI/CD Pipeline Workflow)

```mermaid
flowchart TD
    A["Push to main"] --> B["Quality Gate: typecheck + test + lint"]
    B --> C["Migration Gate: prisma migrate diff (Drift Gate)"]
    C --> D["Prisma Migration Deploy against DIRECT_URL (:5432)"]
    D --> E["Build Multi-Stage Docker Image (Node 22 LTS)"]
    E --> F["Push Container to Artifact Registry"]
    F --> G["Deploy Revision to Cloud Run with Secret Manager Mounts"]
    G --> H["Traffic Shift to New Revision"]
```
