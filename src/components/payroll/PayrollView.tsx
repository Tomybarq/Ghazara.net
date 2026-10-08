import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  CheckCircle, 
  Download, 
  FileText, 
  Printer, 
  DollarSign, 
  ShieldCheck, 
  Coins, 
  Gift
} from 'lucide-react';
import { formatSAR, formatPercent, getPayrollStatusLabel } from '../../utils/formatters';
import { exportPayrollToCSV } from '../../utils/exportUtils';
import { PayrollRecord } from '../../types';
import { getActivePeriod } from '../../domain/period';

export const PayrollView: React.FC = () => {
  const { 
    userPayroll, 
    currentUser, 
    approveAllPayroll, 
    markAllPayrollPaid 
  } = useApp();

  const currentPeriod = getActivePeriod();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentPeriod.month);
  const [selectedYear] = useState<number>(currentPeriod.year);

  const monthRecords = userPayroll.filter(p => p.month === selectedMonth && p.year === selectedYear);

  const totalBaseSalary = monthRecords.reduce((sum, p) => sum + p.baseSalary, 0);
  const totalCommission = monthRecords.reduce((sum, p) => sum + p.commissionAmount, 0);
  const totalBonuses = monthRecords.reduce((sum, p) => sum + p.bonusAmount, 0);
  const totalNetPayroll = monthRecords.reduce((sum, p) => sum + p.netSalary, 0);

  const isAllApproved = monthRecords.length > 0 && monthRecords.every(p => p.status === 'approved' || p.status === 'paid');
  const isAllPaid = monthRecords.length > 0 && monthRecords.every(p => p.status === 'paid');

  const printSinglePayslip = (record: PayrollRecord) => {
    const printWin = window.open('', '_blank', 'width=700,height=800');
    if (!printWin) return;

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>قسيمة راتب وعمولات - ${record.marketerName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; margin: 0; }
          .card { max-width: 600px; margin: auto; background: #fff; border-radius: 16px; border: 2px solid #e2e8f0; padding: 32px; }
          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 800; color: #6b21c8; }
          .subtitle { font-size: 13px; color: #64748b; }
          .badge { display: inline-block; background: #ff6b2b; color: #fff; padding: 3px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-top: 8px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { padding: 10px 12px; text-align: right; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .table th { background: #f1f5f9; color: #475569; }
          .total-box { background: #064e3b; color: #ecfdf5; padding: 16px; border-radius: 12px; text-align: center; margin-top: 20px; }
          .total-val { font-size: 26px; font-weight: 800; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print { body { background: transparent; padding: 0; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="title">شركة غزارة للتسويق والتجارة</div>
            <div class="subtitle">مسير الرواتب والعمولات الميدانية</div>
            <div class="badge">مسير شهر ${record.month} / ${record.year}</div>
          </div>

          <div style="font-size: 14px; margin-bottom: 16px;">
            <strong>الموظف / المسوق:</strong> ${record.marketerName}
          </div>

          <table class="table">
            <tr>
              <td>الراتب الأساسي</td>
              <td style="font-weight: 700;">${formatSAR(record.baseSalary)}</td>
            </tr>
            <tr>
              <td>مستهدف المبيعات المطلوب</td>
              <td>${formatSAR(record.targetAmount)}</td>
            </tr>
            <tr>
              <td>المبيعات والتبرعات المحققة</td>
              <td style="color: #047857; font-weight: 700;">${formatSAR(record.achievedAmount)} (${record.achievementPercentage.toFixed(1)}%)</td>
            </tr>
            <tr>
              <td>نسبة العمولة المعتمدة</td>
              <td>${record.commissionRate}%</td>
            </tr>
            <tr>
              <td>مبلغ العمولة المستحق</td>
              <td style="color: #c2410c; font-weight: 700;">+${formatSAR(record.commissionAmount)}</td>
            </tr>
            <tr>
              <td>المكافآت والحوافز التقديرية</td>
              <td style="color: #047857; font-weight: 700;">+${formatSAR(record.bonusAmount)}</td>
            </tr>
            <tr>
              <td>الخصومات والجزاءات</td>
              <td style="color: #be123c;">-${formatSAR(record.deductionsAmount)}</td>
            </tr>
          </table>

          <div class="total-box">
            <div style="font-size: 13px; opacity: 0.9;">صافي المبلغ المستحق للتحويل</div>
            <div class="total-val">${formatSAR(record.netSalary)}</div>
          </div>

          <div style="margin-top: 20px; font-size: 12px; color: #475569;">
            <div><strong>حالة المسير:</strong> ${record.status === 'paid' ? 'تم الصرف والتحويل البنكي' : 'معتمد'}</div>
            ${record.approvedBy ? `<div><strong>معتمد من:</strong> ${record.approvedBy}</div>` : ''}
          </div>

          <div class="footer">
            تم إصدار هذه القسيمة إلكترونياً من الإدارة المالية بشركة غزارة للتسويق الخيري
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-ghazara-orange" />
            <span>مسير الرواتب والعمولات الميدانية</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            نظام احتساب آلي متكامل: الراتب الأساسي + نسبة العمولة من التحصيل + حوافز تجاوز الهدف
          </p>
        </div>

        {/* Month Selector & CSV Export */}
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-[#12122B] border border-[#23234A] rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-ghazara-orange"
          >
            <option value={10}>أكتوبر 2026 (الشهر الحالي)</option>
            <option value={9}>سبتمبر 2026 (مصروف)</option>
          </select>

          <button
            onClick={() => exportPayrollToCSV(monthRecords)}
            className="flex items-center gap-2 bg-[#1A1A3A] hover:bg-[#252550] border border-[#23234A] text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير المسير</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs text-slate-400">إجمالي الرواتب الأساسية</div>
          <div className="text-xl font-black text-white mt-1">{formatSAR(totalBaseSalary)}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs text-slate-400">إجمالي العمولات المستحقة</div>
          <div className="text-xl font-black text-ghazara-orange mt-1">{formatSAR(totalCommission)}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs text-slate-400">إجمالي المكافآت والحوافز</div>
          <div className="text-xl font-black text-purple-300 mt-1">{formatSAR(totalBonuses)}</div>
        </div>

        <div className="glass-card p-4 rounded-xl bg-gradient-to-br from-[#1A0F35] to-[#120D2C] border-purple-500/40">
          <div className="text-xs text-purple-300 font-bold">إجمالي صافي المسير المستحق</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatSAR(totalNetPayroll)}</div>
        </div>

      </div>

      {/* Admin Approval Control Bar */}
      {currentUser.role === 'admin' && (
        <div className="glass-card p-4 rounded-2xl bg-gradient-to-r from-[#1E113E] to-[#150A2E] border border-[#6B21C8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">إجراءات الاعتماد والصرف الإداري</div>
              <div className="text-xs text-purple-200/80">
                {isAllPaid 
                  ? 'تم إغلاق مسير هذا الشهر وصرف كافة الرواتب والعمولات للحسابات البنكية.' 
                  : isAllApproved 
                    ? 'تم اعتماد المسير وجاهز للتحويل والصرف النهائي.' 
                    : 'قم بمراجعة المسير ثم اضغط اعتماد أو صرف للمسوقين.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAllApproved && !isAllPaid && (
              <button
                onClick={() => approveAllPayroll(selectedMonth, selectedYear)}
                className="flex items-center gap-2 bg-[#6B21C8] hover:bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>اعتماد مسير الشهر بالكامل</span>
              </button>
            )}

            {!isAllPaid && (
              <button
                onClick={() => markAllPayrollPaid(selectedMonth, selectedYear)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>إغلاق الشهر والصرف والتحويل</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Payroll Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#1A1A3A]/80 border-b border-[#23234A] text-slate-400 font-bold">
                <th className="py-3.5 px-4">اسم المسوق</th>
                <th className="py-3.5 px-4">الأساسي</th>
                <th className="py-3.5 px-4">المستهدف</th>
                <th className="py-3.5 px-4">المحصل الفعلي</th>
                <th className="py-3.5 px-4">الإنجاز</th>
                <th className="py-3.5 px-4">العمولة %</th>
                <th className="py-3.5 px-4">مبلغ العمولة</th>
                <th className="py-3.5 px-4">حوافز وبونص</th>
                <th className="py-3.5 px-4">صافي الراتب</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">قسيمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23234A]/50">
              {monthRecords.map((record) => {
                const statusInfo = getPayrollStatusLabel(record.status);
                const isExceeded = record.achievementPercentage >= 100;

                return (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {record.marketerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatSAR(record.baseSalary)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatSAR(record.targetAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {formatSAR(record.achievedAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black ${isExceeded ? 'text-emerald-400' : 'text-ghazara-orange'}`}>
                        {formatPercent(record.achievementPercentage)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {record.commissionRate}%
                    </td>
                    <td className="py-3.5 px-4 font-bold text-ghazara-orange">
                      +{formatSAR(record.commissionAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-purple-300">
                      {record.bonusAmount > 0 ? `+${formatSAR(record.bonusAmount)}` : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                      {formatSAR(record.netSalary)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => printSinglePayslip(record)}
                        className="flex items-center gap-1 mx-auto bg-[#1A1A3A] hover:bg-[#6B21C8] text-slate-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all border border-[#23234A]"
                        title="طباعة قسيمة الراتب"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>قسيمة</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
