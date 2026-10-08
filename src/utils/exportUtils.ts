import { Donation, PayrollRecord } from '../types';
import { formatSAR, getPaymentMethodLabel, getDonorTypeLabel } from './formatters';

export const exportDonationsToCSV = (donations: Donation[], filename = 'donations_ghazara.csv') => {
  const headers = [
    'رقم الإيصال',
    'الجمعية الخيرية',
    'المسوق',
    'المبلغ (ر.س)',
    'اسم المتبرع',
    'رقم الجوال',
    'نوع المتبرع',
    'طريقة الدفع',
    'الحالة',
    'التاريخ',
    'الوقت',
    'اسم الحملة',
    'ملاحظات'
  ];

  const rows = donations.map(d => [
    `"${d.receiptNumber}"`,
    `"${d.charityName}"`,
    `"${d.marketerName}"`,
    d.amount,
    `"${d.donorName}"`,
    `"${d.donorPhone}"`,
    `"${getDonorTypeLabel(d.donorType)}"`,
    `"${getPaymentMethodLabel(d.paymentMethod)}"`,
    `"${d.status === 'completed' ? 'مكتمل' : d.status}"`,
    `"${d.date}"`,
    `"${d.time}"`,
    `"${d.campaignName || ''}"`,
    `"${d.notes || ''}"`
  ]);

  // UTF-8 BOM for Arabic support in Excel
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPayrollToCSV = (payroll: PayrollRecord[], filename = 'payroll_ghazara.csv') => {
  const headers = [
    'الشهر/السنة',
    'اسم المسوق',
    'الراتب الأساسي (ر.س)',
    'المستهدف (ر.س)',
    'المحقق (ر.س)',
    'نسبة الإنجاز %',
    'نسبة العمولة %',
    'مبلغ العمولة (ر.س)',
    'المكافأة والحوافز (ر.س)',
    'الخصومات (ر.س)',
    'صافي الراتب (ر.س)',
    'حالة الصرف',
    'ملاحظات'
  ];

  const rows = payroll.map(p => [
    `"${p.month}/${p.year}"`,
    `"${p.marketerName}"`,
    p.baseSalary,
    p.targetAmount,
    p.achievedAmount,
    p.achievementPercentage.toFixed(1),
    p.commissionRate,
    p.commissionAmount,
    p.bonusAmount,
    p.deductionsAmount,
    p.netSalary,
    `"${p.status}"`,
    `"${p.notes || ''}"`
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printDonationReceipt = (donation: Donation) => {
  const receiptWindow = window.open('', '_blank', 'width=700,height=800');
  if (!receiptWindow) return;

  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال تبرع - ${donation.receiptNumber}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Cairo', sans-serif;
          background-color: #f8fafc;
          color: #0f172a;
          margin: 0;
          padding: 24px;
        }
        .receipt-card {
          max-width: 580px;
          margin: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 2px solid #e2e8f0;
          padding: 32px;
          position: relative;
        }
        .header {
          text-align: center;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .company-title {
          font-size: 20px;
          font-weight: 800;
          color: #6b21c8;
        }
        .sub-title {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        .receipt-badge {
          display: inline-block;
          background: #ff6b2b;
          color: white;
          padding: 4px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          margin-top: 10px;
        }
        .amount-box {
          background: #f1f5f9;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }
        .amount-value {
          font-size: 28px;
          font-weight: 800;
          color: #047857;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .info-item {
          font-size: 13px;
        }
        .info-label {
          color: #64748b;
          margin-bottom: 2px;
        }
        .info-val {
          font-weight: 600;
          color: #0f172a;
        }
        .footer {
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          font-size: 11px;
          color: #94a3b8;
        }
        @media print {
          body { background: transparent; padding: 0; }
          .receipt-card { box-shadow: none; border: 1px solid #000; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <div class="company-title">شركة غزارة للتسويق والتجارة</div>
          <div class="sub-title">إدارة مبيعات وتبرعات الجمعيات الخيرية</div>
          <div class="receipt-badge">سند استلام تبرع رقم: ${donation.receiptNumber}</div>
        </div>

        <div class="amount-box">
          <div style="font-size: 13px; color: #475569; margin-bottom: 4px;">المبلغ المستلم</div>
          <div class="amount-value">${formatSAR(donation.amount)}</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">الجهة المستفيدة:</div>
            <div class="info-val">${donation.charityName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">اسم المتبرع:</div>
            <div class="info-val">${donation.donorName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">المسوق المعتمد:</div>
            <div class="info-val">${donation.marketerName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">طريقة السداد:</div>
            <div class="info-val">${getPaymentMethodLabel(donation.paymentMethod)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">تاريخ ووقت المعاملة:</div>
            <div class="info-val">${donation.date} - ${donation.time}</div>
          </div>
          <div class="info-item">
            <div class="info-label">الحملة الخيرية:</div>
            <div class="info-val">${donation.campaignName || 'تبرع عام'}</div>
          </div>
        </div>

        <div style="font-size: 12px; color: #475569; background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; margin-bottom: 20px;">
          <strong>ملاحظة:</strong> تم تسجيل وإيداع هذا التبرع مباشرة في الحساب الرسمي للجمعية، ونثمن مساهمتكم الكريمة في صناعة الأثر.
        </div>

        <div class="footer">
          <div>صدر هذا الإيصال إلكترونياً من منصة غزارة للتسويق الخيري</div>
          <div>الرقم الموحد: 920000000 | info@ghazara.sa</div>
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  receiptWindow.document.write(content);
  receiptWindow.document.close();
};
