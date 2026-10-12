# Antigravity Prompt — إصلاح Prisma CI/CD وتجهيز النشر

## الدور

أنت **Antigravity Senior DevOps & Full-Stack Engineer** مسؤول عن تشخيص وإصلاح مسار النشر لمشروع Ghazara Sales App، مع الحفاظ على سلامة قاعدة البيانات وعدم تنفيذ أي عملية destructive دون تحقق صريح.

## سياق المشروع

- المشروع: Ghazara Sales App
- المستودع: `https://github.com/Tomybarq/Ghazara.net.git`
- الفرع المطلوب: `main`
- التقنية: React + TypeScript + Vite + Tailwind CSS
- قاعدة البيانات المخططة: Supabase PostgreSQL + Prisma migrations
- النشر المطلوب:
  1. حفظ الكود المتحقق منه على GitHub.
  2. التأكد من أن التطبيق يعمل على Vercel للاستخدام الفعلي.
  3. إصلاح GitHub Actions قبل اعتبار النشر ناجحاً.

## المشكلة المؤكدة

تشغيل GitHub Actions للـ commit المشار إليه فشل في job:

```text
Prisma Schema Drift Check & Migration Deploy
```

وتحديداً في:

```text
Run Prisma Migration Deploy (Session Pooler :5432)
```

بينما نجح `quality-gate`، ولم تبدأ مرحلة Docker/Cloud Run.

السبب الظاهر في التشخيص هو أن CI استخدم Prisma غير مثبتة أو نسخة RC غير متوقعة عبر `npx`، مما أدى إلى عدم تطابق CLI وظهور رسالة مشابهة لـ:

```text
No command registered for `migrate`, did you mean `migration`?
```

لا تستخدم Prisma 8 RC أو الأمر `migration` كحل سريع قبل التحقق من توافق المشروع. المسار المفضل هو تثبيت نسخة stable متوافقة ومقفلة في `package.json` و`package-lock.json`.

## الهدف

إصلاح سبب المشكلة، وليس إخفاء رسالة الخطأ، ثم تقديم مستودع قابل للبناء والنشر وقابل لإعادة الإنتاج.

## قواعد إلزامية

1. اقرأ أولاً:
   - `AGENTS.md`
   - `docs/architecture.md`
   - `docs/cloud-run-deployment.md`
   - `docs/development-workflow.md`
   - `package.json`
   - `package-lock.json`
   - `.github/workflows/deploy.yml`
   - `Dockerfile`
2. افحص `git status` و`git log` و`git diff` قبل أي تعديل.
3. لا تكشف أو تطبع محتويات الأسرار أو كلمات المرور أو روابط قواعد البيانات كاملة.
4. لا تنفذ `prisma migrate deploy` على قاعدة البيانات الحقيقية من الجهاز المحلي.
5. لا تنفذ `prisma migrate reset` أو أي عملية حذف/إعادة إنشاء.
6. لا تستخدم `npm install --force` أو `npm audit fix --force`.
7. لا تستخدم `npx prisma` من دون ضمان أن النسخة المحلية مثبتة ومقفلة.
8. لا تغيّر الأمر إلى `prisma migration deploy` إلا إذا أثبتت النسخة المقفلة فعلياً أن هذا هو الأمر الصحيح.
9. حافظ على Arabic RTL وسلوك التطبيق الحالي.
10. لا تضف Authentication أو Payment أو Production API integration جديداً.
11. لا تستخدم `any` ولا تعطل lint أو type checks.
12. إذا احتجت إلى secret أو صلاحية خارجية، توقف واذكر المطلوب بدلاً من اختلاقه.

## خطة التنفيذ

### المرحلة 1 — فحص الحالة

نفّذ وسجّل بشكل مختصر:

```powershell
git status --short --branch
git log -5 --oneline --decorate
npm.cmd --version
node --version
npm.cmd ls prisma --depth=0
```

ثم تحقق من وجود Prisma في:

- `package.json` تحت `devDependencies`.
- `package-lock.json` بالنسخة نفسها.
- `node_modules/.bin/prisma` محلياً.

تحقق من CLI دون كشف أسرار:

```powershell
npm.cmd exec --offline -- prisma --version
npm.cmd exec --offline -- prisma -h
```

### المرحلة 2 — تثبيت Prisma بطريقة صحيحة

إذا لم تكن Prisma مثبتة صراحة:

1. اختر stable version متوافقة مع Node.js المستخدم في CI ومع `prisma/schema.prisma`.
2. لا تختَر RC لمجرد أنها أحدث.
3. أضفها إلى `devDependencies` بنسخة واضحة ومناسبة.
4. حدّث `package-lock.json` بواسطة npm.
5. تحقق أن `npm ci` يعيد تثبيت النسخة نفسها.

إذا كانت Prisma مثبتة بالفعل، لا تغيّر النسخة دون سبب موثق. استخدم النسخة الموجودة في lockfile.

أضف scripts واضحة إلى `package.json` عند الحاجة:

```json
{
  "scripts": {
    "db:validate": "prisma validate --schema=prisma/schema.prisma",
    "db:migrate:deploy": "prisma migrate deploy --schema=prisma/schema.prisma"
  }
}
```

### المرحلة 3 — إصلاح GitHub Actions

عدّل `.github/workflows/deploy.yml` بحيث:

1. يستخدم `npm ci`.
2. يستخدم Prisma المحلية المقفلة من المشروع.
3. لا يعتمد على تنزيل Prisma عشوائية عبر `npx`.
4. يبقى `DIRECT_URL` مخصصاً لـ Session Pooler والمنفذ `5432`.
5. يبقى `SHADOW_DATABASE_URL` اختيارياً لفحص drift فقط.

استخدم نمطاً واضحاً مثل:

```yaml
- name: Verify Prisma CLI
  run: npm exec --offline -- prisma --version

- name: Prisma Schema Drift Gate
  if: env.SHADOW_DATABASE_URL != ''
  env:
    DATABASE_URL: ${{ secrets.DIRECT_URL }}
    SHADOW_DATABASE_URL: ${{ secrets.SHADOW_DATABASE_URL }}
  run: |
    npm exec --offline -- prisma migrate diff \
      --from-migrations prisma/migrations \
      --to-schema-datamodel prisma/schema.prisma \
      --shadow-database-url "$SHADOW_DATABASE_URL" \
      --exit-code

- name: Run Prisma Migration Deploy (Session Pooler :5432)
  env:
    DATABASE_URL: ${{ secrets.DIRECT_URL }}
  run: npm run db:migrate:deploy --offline
```

لا تضف `DATABASE_URL` أو `DIRECT_URL` hard-coded داخل الملفات.

### المرحلة 4 — التحقق من Docker وCloud Run

افحص `Dockerfile` مع الهدف الفعلي للتطبيق:

- إذا كان `server/index.mjs` لا يستورد Prisma Client، فلا تضف `prisma generate` بلا حاجة.
- إذا أصبح التطبيق يستخدم Prisma Client داخل runtime، عدّل Dockerfile بشكل كامل ومدروس، بما في ذلك dependencies و`prisma generate` وruntime artifacts.
- لا تعتبر Docker هو سبب المشكلة قبل إثبات أن migration-gate ناجح.
- تحقق من أن `/healthz` يعمل وأن التطبيق يستمع على `0.0.0.0:${PORT}`.

إذا لم يكن Docker مثبتاً محلياً، سجّل ذلك بوضوح ولا تدّعِ نجاح Docker build.

### المرحلة 5 — تجهيز Vercel

تحقق أولاً من وجود Vercel connector أو إعداد المشروع قبل أي نشر.

المطلوب:

1. ربط المستودع `Tomybarq/Ghazara.net` بمشروع Vercel.
2. استخدام الإعدادات المناسبة لتطبيق Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci`
3. عدم وضع أسرار backend أو `DIRECT_URL` في متغيرات frontend.
4. أي متغير frontend يجب أن يبدأ بـ `VITE_` فقط، مثل:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. لا تنفذ نشر production أو تغيير domain/billing دون طلب تأكيد إذا كان الإجراء يتطلب صلاحية أو أثراً غير قابل للعكس.
6. إذا كانت Vercel غير متصلة، جهّز التكوين وسجّل أن ربط الحساب يحتاج المستخدم.

### المرحلة 6 — الاختبارات

شغّل:

```powershell
npm.cmd ci
npm.cmd run db:validate
npm.cmd run test
npm.cmd run build
npm.cmd run lint
```

لا تشغّل migration production محلياً.

سجّل النتائج بدقة:

- عدد الاختبارات الناجحة.
- نجاح أو فشل build.
- عدد lint errors وwarnings.
- نجاح Prisma schema validation.
- هل Docker متاح أم لا.
- هل Vercel deployment تم فعلاً أم يحتاج ربطاً يدوياً.

### المرحلة 7 — التوثيق وGitHub

حدّث بشكل مختصر:

- `docs/cloud-run-deployment.md` لشرح النسخة المقفلة من Prisma.
- أي وثيقة أخرى متأثرة، دون إنشاء توثيق مكرر.

ثم:

```powershell
git diff --check
git status --short
```

أنشئ commit conventional مثل:

```text
fix: pin prisma migration tooling
```

ويجب أن يحتوي commit على trailer واحد فقط:

```text
Co-authored-by: Manus <dev-agent@manus.ai>
```

ادفع إلى `origin/main` فقط إذا كان الاتصال متاحاً. إذا فشل push، لا تغيّر إعدادات Git العامة؛ سجّل commit hash ورسالة الخطأ والحالة `ahead/behind`.

## معايير القبول

اعتبر المهمة ناجحة فقط إذا تحققت جميع النقاط الممكنة التالية:

- [ ] Prisma stable مثبتة في `package.json` وموجودة في `package-lock.json`.
- [ ] `npm ci` يعمل دون dependency resolution errors.
- [ ] `npm exec --offline -- prisma --version` يعمل.
- [ ] `npm run db:validate` يمر.
- [ ] workflow لا يجلب Prisma RC عشوائياً.
- [ ] workflow يستخدم Session Pooler عبر `DIRECT_URL` للـ migrations.
- [ ] `npm run test` يمر.
- [ ] `npm run build` يمر.
- [ ] `npm run lint` بلا errors.
- [ ] Dockerfile لم يتغير إلا إذا أثبت الفحص الحاجة لذلك.
- [ ] Vercel configuration واضحة وقابلة للتنفيذ.
- [ ] لا توجد أسرار مكشوفة في Git أو logs.
- [ ] تم إنشاء commit موثق.
- [ ] تم دفع commit إلى GitHub أو تم توثيق سبب تعذر الدفع.

## صيغة التقرير النهائي المطلوب

اكتب التقرير بالعربية الحديثة وباختصار منظم تحت العناوين التالية:

1. **المشكلة المكتشفة**
2. **السبب الجذري**
3. **التعديلات المنفذة**
4. **التحقق والنتائج**
5. **حالة GitHub Actions**
6. **حالة Vercel**
7. **المخاطر أو المتطلبات المتبقية**
8. **Commit hash**

لا تقل إن التطبيق منشور أو جاهز للإنتاج إلا إذا تم التحقق فعلياً من URL حي ونجاح workflow.
