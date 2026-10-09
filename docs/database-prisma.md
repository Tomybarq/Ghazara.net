# Prisma ORM & PostgreSQL Architecture Guide

وثيقة إعداد وتكامل قاعدة البيانات وإدارة الـ Schema باستخدام **Prisma ORM** ومحرك **PostgreSQL (Supabase Pooler Architecture)** لتطبيق غزارة للتسويق الخيري.

---

## 1. النظرة العامة (Overview)

تم بناء نموذج البيانات لتغطية كافة متطلبات النظام، بما يشمل:
- **دليل الجمعيات الخيرية الشريكة (`charities`)**
- **فريق المسوقين الميدانيين (`marketers`)**
- **إدارة المستخدمين والأدوار (`users`)**
- **سجل التبرعات الميدانية الموثقة (`donations`)**
- **الأهداف الشهرية ومعدلات الإنجاز (`monthly_targets`)**
- **مسير الرواتب ودورة الاعتماد المالي (`payroll_records`)**

---

## 2. هيكل ملفات قاعدة البيانات (Files Structure)

```text
├── prisma/
│   ├── schema.prisma                       # تعريف الـ Prisma Schema والنماذج والمصادر
│   └── migrations/
│       └── 20261008000000_init/
│           └── migration.sql               # ترحيل SQL الأولي لإنشاء الجداول والفهارس
├── database/
│   ├── schema.sql                          # السكربت الشامل لإنشاء الجداول وسياسات RLS
│   ├── seed.sql                            # بيانات البذور الأولية (Mock Data) للتطوير والتجربة
│   └── sync.mjs                            # أداة فحص التزامن وعزل قاعدة بيانات الظل
└── docs/
    └── database-prisma.md                  # دليل Prisma و SQL وقواعد البيانات
```

---

## 3. إعداد متغيرات البيئة لبنية Supabase (Environment Configuration)

للاتصال بقاعدة البيانات عبر **Supabase Pooler (PgBouncer/Supavisor)**:

```env
# 1. اتصال مجمع المعاملات (Transaction Pooler - Port 6543)
# مخصص للاستعلامات والعمليات الاعتيادية في التطبيق مع إدارة الـ Pooler
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. اتصال مجمع الجلسات (Session Pooler - Port 5432)
# مخصص لأوامر Prisma CLI والترحيلات وعمليات DDL
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# 3. اتصال قاعدة بيانات الظل المعزولة (Shadow Database - Port 5432)
# مطلوب لأمر `prisma migrate dev` ويجب أن يشير إلى قاعدة بيانات/مشروع فارغ ومستقل تماماً عن الإنتاج
SHADOW_DATABASE_URL="postgresql://postgres.[SHADOW_REF]:[SHADOW_PASSWORD]@aws-0-[SHADOW_REGION].pooler.supabase.com:5432/postgres"

# 4. واجهة Supabase للعميل (Frontend Auth & Storage)
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY]
```

> ⚠️ **تنبيه أمان صارم:** لا تجعل `SHADOW_DATABASE_URL` تشير إلى قاعدة الإنتاج الأساسية أبداً؛ لأن محرك Prisma يقوم بإعادة إنشاء قاعدة بيانات الظل وحذف محتوياتها أثناء حساب الفروقات.

---

## 4. دورة حياة الأوامر (Prisma CLI Commands)

### فحص التزامن وتشخيص الاتصال:
```bash
npm run db:sync
```

### التحقق من صحة المخطط:
```bash
npx prisma validate
```

### تطبيق الترحيلات في بيئة التطوير (مع Shadow DB):
```bash
npx prisma migrate dev --name init
```

### تطبيق الترحيلات في بيئة الإنتاج:
```bash
npx prisma migrate deploy
```

---

## 5. نماذج الاستعلام الموصى بها (Query Best Practices)

### استعلام تبرعات المسوق مع الجمعية بدون N+1:
```typescript
import prisma from '@/lib/prisma';

export async function getMarketerDonations(marketerId: string) {
  return await prisma.donation.findMany({
    where: { marketerId },
    select: {
      id: true,
      receiptNumber: true,
      amount: true,
      donorName: true,
      paymentMethod: true,
      status: true,
      date: true,
      charity: {
        select: {
          id: true,
          name: true,
          shortName: true,
          code: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
}
```

### المعاملات المالية الموثوقة (Transactions):
```typescript
export async function recordNewDonation(data: NewDonationInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. تسجيل التبرع
    const donation = await tx.donation.create({
      data: { ...data },
    });

    // 2. تحديث إجمالي محصلة الجمعية
    await tx.charity.update({
      where: { id: data.charityId },
      data: {
        totalRaised: { increment: data.amount },
      },
    });

    // 3. تحديث إنجاز المسوق الشهري
    await tx.marketer.update({
      where: { id: data.marketerId },
      data: {
        currentMonthAchieved: { increment: data.amount },
        totalDonationsCount: { increment: 1 },
      },
    });

    return donation;
  });
}
```

---

## 6. سياسات أمان مستوى الصفوف (PostgreSQL RLS)

تم تفعيل سياسات Row-Level Security على كافة الجداول لضمان عزل البيانات بدقة:
- **`admin`**: صلاحية كاملة على جميع السجلات والإحصائيات وتعيينات الجمعيات ومسيرات الرواتب.
- **`marketer`**: قراءة وإضافة التبرعات المسندة للمسوق فقط، واستعراض سجله المالي وأهدافه.
- **`charity_rep`**: استعراض تبرعات الجمعية الخاصة به وتحديث بيانات التواصل الرسمية.
