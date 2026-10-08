# Prisma ORM & PostgreSQL Architecture Guide

وثيقة إعداد وتكامل قاعدة البيانات وإدارة الـ Schema باستخدام **Prisma ORM** ومحرك **PostgreSQL** الموزع لتطبيق غزارة للتسويق الخيري.

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
│   ├── schema.prisma                       # تعريف الـ Prisma Schema والنماذج والعلاقات
│   └── migrations/
│       └── 20261008000000_init/
│           └── migration.sql               # ترحيل SQL الأولي لإنشاء الجداول والفهارس
├── database/
│   ├── schema.sql                          # السكربت الشامل لإنشاء الجداول وسياسات RLS
│   └── seed.sql                            # بيانات البذور الأولية (Mock Data) للتطوير والتجربة
├── src/
│   └── lib/
│       └── prisma.ts                       # كائن عميل Prisma المُوحّد (Singleton Instance)
└── docs/
    └── database-prisma.md                  # دليل Prisma و SQL وقواعد البيانات
```

---

## 3. إعداد متغيرات البيئة (Environment Configuration)

للاتصال بقاعدة البيانات عبر **Prisma Data Platform (Accelerate / Pulse)** أو مزود PostgreSQL المباشر (مثل Neon أو Supabase):

```env
# رابط Prisma Accelerate المسرع للاستعلامات وإدارة التجمع (Connection Pooling)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_prisma_accelerate_key"

# رابط الاتصال المباشر بقاعدة بيانات PostgreSQL (مطلوب لأوامر Migrations)
DIRECT_URL="postgresql://postgres:password@db.your-host.com:5432/postgres?sslmode=require"
```

---

## 4. دورة حياة الأوامر (Prisma CLI Commands)

### التحقق وتنسيق المخطط:
```bash
npx prisma validate
npx prisma format
```

### توليد عميل Prisma Client:
```bash
npx prisma generate
```

### تطبيق الترحيلات في بيئة التطوير:
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
