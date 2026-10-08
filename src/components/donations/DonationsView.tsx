import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HandHeart, 
  Filter, 
  Download, 
  Printer, 
  Plus, 
  Coins, 
  CreditCard,
  X
} from 'lucide-react';
import { formatSAR, getPaymentMethodLabel } from '../../utils/formatters';
import { exportDonationsToCSV, printDonationReceipt } from '../../utils/exportUtils';

export const DonationsView: React.FC = () => {
  const { 
    userDonations, 
    userCharities, 
    userMarketers, 
    currentUser, 
    setIsNewDonationModalOpen,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [selectedCharity, setSelectedCharity] = useState<string>('all');
  const [selectedMarketer, setSelectedMarketer] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filtering Logic
  const filteredDonations = userDonations.filter(d => {
    // Global search or local search
    const query = globalSearch.toLowerCase().trim();
    if (query) {
      const matchQuery = 
        d.receiptNumber.toLowerCase().includes(query) ||
        d.donorName.toLowerCase().includes(query) ||
        d.donorPhone.includes(query) ||
        d.charityName.toLowerCase().includes(query) ||
        d.marketerName.toLowerCase().includes(query) ||
        (d.campaignName && d.campaignName.toLowerCase().includes(query));
      if (!matchQuery) return false;
    }

    if (selectedCharity !== 'all' && d.charityId !== selectedCharity) return false;
    if (selectedMarketer !== 'all' && d.marketerId !== selectedMarketer) return false;
    if (selectedMethod !== 'all' && d.paymentMethod !== selectedMethod) return false;
    if (dateFilter && !d.date.startsWith(dateFilter)) return false;

    return true;
  });

  const totalFilteredAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const avgDonation = filteredDonations.length > 0 ? totalFilteredAmount / filteredDonations.length : 0;

  const resetFilters = () => {
    setSelectedCharity('all');
    setSelectedMarketer('all');
    setSelectedMethod('all');
    setDateFilter('');
    setGlobalSearch('');
  };

  const hasActiveFilters = selectedCharity !== 'all' || selectedMarketer !== 'all' || selectedMethod !== 'all' || dateFilter !== '' || globalSearch !== '';

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <HandHeart className="w-7 h-7 text-ghazara-orange" />
            <span>سجل التبرعات والعمليات الميدانية</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة دقيقة لكافة التبرعات الواردة مع إمكانية الفرز والتصدير وطباعة الإيصالات الرسمية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDonationsToCSV(filteredDonations)}
            className="flex items-center gap-2 bg-[#1A1A3A] hover:bg-[#252550] border border-[#23234A] text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير Excel/CSV</span>
          </button>
          
          <button
            onClick={() => setIsNewDonationModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل تبرع جديد</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">إجمالي المبالغ المعروضة</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{formatSAR(totalFilteredAmount)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">عدد العمليات</div>
            <div className="text-xl font-black text-purple-300 mt-1">{filteredDonations.length} عملية</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <HandHeart className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">متوسط قيمة التبرع</div>
            <div className="text-xl font-black text-ghazara-orange mt-1">{formatSAR(avgDonation)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-ghazara-orange">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>فلترة وبحث متقدم</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Charity Filter */}
          {currentUser.role !== 'charity_rep' && (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">الجمعية الخيرية</label>
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
              >
                <option value="all">كافة الجمعيات</option>
                {userCharities.map(c => (
                  <option key={c.id} value={c.id}>{c.shortName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Marketer Filter */}
          {currentUser.role === 'admin' && (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">المسوق الميداني</label>
              <select
                value={selectedMarketer}
                onChange={(e) => setSelectedMarketer(e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
              >
                <option value="all">كافة المسوقين</option>
                {userMarketers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">طريقة الدفع</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
            >
              <option value="all">كافة طرق الدفع</option>
              <option value="mada">مدى (Mada)</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="visa">فيزا / ماستركارد</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="stc_pay">STC Pay</option>
              <option value="cash">نقدي (كاش)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">تاريخ المعاملة</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Main Donations Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#1A1A3A]/70 border-b border-[#23234A] text-slate-400 font-bold">
                <th className="py-3.5 px-4">رقم الإيصال</th>
                <th className="py-3.5 px-4">الجمعية المستفيدة</th>
                <th className="py-3.5 px-4">المسوق</th>
                <th className="py-3.5 px-4">المبلغ</th>
                <th className="py-3.5 px-4">المتبرع</th>
                <th className="py-3.5 px-4">طريقة الدفع</th>
                <th className="py-3.5 px-4">التاريخ والوقت</th>
                <th className="py-3.5 px-4">الحملة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23234A]/50">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <HandHeart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold">لا توجد تبرعات مطابقة للبحث أو الفلاتر المختارة</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs text-ghazara-orange hover:underline font-bold"
                    >
                      إلغاء الفلاتر وعرض الكل
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => {
                  return (
                    <tr key={donation.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-ghazara-orange">
                        {donation.receiptNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {donation.charityName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {donation.marketerName}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                        {formatSAR(donation.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{donation.donorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{donation.donorPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-[#0A0A1A] border border-[#23234A] text-[11px] text-slate-300 font-medium">
                          {getPaymentMethodLabel(donation.paymentMethod)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <div>{donation.date}</div>
                        <div className="text-[10px] text-slate-500">{donation.time}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-[140px] truncate">
                        {donation.campaignName || 'تبرع عام'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => printDonationReceipt(donation)}
                          className="flex items-center gap-1 mx-auto bg-[#1A1A3A] hover:bg-[#6B21C8] text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#23234A]"
                          title="طباعة سند الاستلام"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>سند</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
