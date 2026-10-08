import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  HandHeart, 
  Target, 
  Users, 
  Download, 
  FileCheck, 
  TrendingUp, 
  Coins, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatSAR, formatPercent, getPaymentMethodLabel, getDonationStatusLabel } from '../../utils/formatters';
import { exportDonationsToCSV, printDonationReceipt } from '../../utils/exportUtils';

export const CharityRepPortalView: React.FC = () => {
  const { 
    currentUser, 
    charities, 
    marketers, 
    userDonations 
  } = useApp();

  const currentRepCharity = charities.find(c => c.id === currentUser.charityId) || charities[0];
  const assignedMarketers = marketers.filter(m => m.assignedCharityIds.includes(currentRepCharity.id));
  const totalRaised = userDonations.reduce((sum, d) => sum + d.amount, 0);
  const targetPct = currentRepCharity.targetAmount > 0 ? (totalRaised / currentRepCharity.targetAmount) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Welcome Banner for Charity Rep */}
      <div className="rounded-3xl bg-gradient-to-l from-[#064E3B] via-[#0E2F2B] to-[#0A1A1A] border border-emerald-500/40 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <FileCheck className="w-3.5 h-3.5" />
              <span>بوابة ممثل الجمعية الخيرية المعتمد</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentRepCharity.name}
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-2xl leading-relaxed">
              ترخيص رقم: <span className="font-bold text-white font-mono">{currentRepCharity.licenseNumber}</span> | المقر: {currentRepCharity.city}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportDonationsToCSV(userDonations, `charity_${currentRepCharity.code}_donations.csv`)}
              className="flex items-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تصدير كشف حساب الجمعية</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400">إجمالي التبرعات الموردة للجمعية</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{formatSAR(totalRaised)}</div>
          <div className="text-xs text-slate-400 mt-1">مستهدف سنوي: {formatSAR(currentRepCharity.targetAmount)}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400">نسبة تحقيق الهدف</div>
          <div className="text-2xl font-black text-white mt-2">{formatPercent(targetPct)}</div>
          <div className="w-full bg-[#0A0A1A] h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${Math.min(targetPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400">فريق المسوقين المخصص للجمعية</div>
          <div className="text-2xl font-black text-purple-300 mt-2">{assignedMarketers.length} مسوقين</div>
          <div className="text-xs text-slate-400 mt-1">مكلفين من شركة غزارة</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400">إجمالي عدد العمليات</div>
          <div className="text-2xl font-black text-ghazara-orange mt-2">{userDonations.length} عملية</div>
          <div className="text-xs text-slate-400 mt-1">متوسط العملية: {formatSAR(userDonations.length > 0 ? totalRaised / userDonations.length : 0)}</div>
        </div>

      </div>

      {/* Assigned Marketers */}
      <div className="glass-card p-5 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <span>المسوقين المعتمدين لحملات جمعيتكم الميدانية</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {assignedMarketers.map(m => (
            <div key={m.id} className="p-3 bg-[#0A0A1A]/80 rounded-xl border border-[#23234A] flex items-center gap-3">
              <img src={m.avatarUrl} alt={m.name} className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <div className="text-xs font-bold text-slate-200">{m.name}</div>
                <div className="text-[10px] text-slate-400" dir="ltr">{m.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Ledger Table */}
      <div className="glass-card rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HandHeart className="w-4 h-4 text-ghazara-orange" />
            <span>كشف سجل التبرعات الواردة للجمعية</span>
          </h3>
          <span className="text-xs text-slate-400">{userDonations.length} تبرع موثق</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#23234A] text-slate-400">
                <th className="py-3 px-3">رقم الإيصال</th>
                <th className="py-3 px-3">المبلغ</th>
                <th className="py-3 px-3">اسم المتبرع</th>
                <th className="py-3 px-3">طريقة السداد</th>
                <th className="py-3 px-3">المسوق</th>
                <th className="py-3 px-3">التاريخ</th>
                <th className="py-3 px-3 text-center">إيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23234A]/50">
              {userDonations.map(d => (
                <tr key={d.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-mono font-bold text-ghazara-orange">{d.receiptNumber}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{formatSAR(d.amount)}</td>
                  <td className="py-3 px-3 text-slate-200">{d.donorName}</td>
                  <td className="py-3 px-3 text-slate-300">{getPaymentMethodLabel(d.paymentMethod)}</td>
                  <td className="py-3 px-3 text-slate-300">{d.marketerName}</td>
                  <td className="py-3 px-3 text-slate-400">{d.date}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => printDonationReceipt(d)}
                      className="px-2 py-1 bg-[#1A1A3A] hover:bg-[#6B21C8] text-slate-200 rounded text-xs"
                    >
                      سند
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
