import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HandHeart, 
  Target, 
  Users, 
  Building2, 
  TrendingUp, 
  Wallet, 
  Award, 
  ArrowUpRight, 
  Sparkles,
  Plus,
  FileSpreadsheet,
  Clock,
  Coins
} from 'lucide-react';
import { formatSAR, formatPercent, getPaymentMethodLabel, getDonationStatusLabel } from '../../utils/formatters';
import { exportDonationsToCSV, printDonationReceipt } from '../../utils/exportUtils';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    userCharities, 
    userMarketers, 
    userDonations, 
    userTargets, 
    setActiveTab, 
    setIsNewDonationModalOpen,
    setIsAIAgentOpen
  } = useApp();

  // Admin Calculations
  const totalDonationsAmount = userDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalTargetAmount = userTargets.reduce((sum, t) => sum + t.targetAmount, 0);
  const overallAchievement = totalTargetAmount > 0 ? (totalDonationsAmount / totalTargetAmount) * 100 : 0;
  const activeMarketersCount = userMarketers.filter(m => m.status === 'active').length;
  const activeCharitiesCount = userCharities.filter(c => c.status === 'active').length;

  // Marketer Scoped Calculations
  const currentMarketer = userMarketers.find(m => m.id === currentUser.marketerId) || userMarketers[0];
  const marketerDonations = userDonations.filter(d => d.marketerId === currentMarketer?.id);
  const marketerRaised = marketerDonations.reduce((sum, d) => sum + d.amount, 0);
  const marketerTarget = currentMarketer?.currentMonthTarget || 100000;
  const marketerAchievement = marketerTarget > 0 ? (marketerRaised / marketerTarget) * 100 : 0;
  const marketerCommission = marketerRaised * ((currentMarketer?.commissionRate || 6) / 100);
  const marketerNetForecast = (currentMarketer?.baseSalary || 5000) + marketerCommission + (marketerAchievement >= 110 ? 2000 : marketerAchievement >= 100 ? 1000 : 0);

  // Top Performing Marketers
  const sortedMarketers = [...userMarketers].sort((a, b) => b.currentMonthAchieved - a.currentMonthAchieved);

  // Top Charities
  const sortedCharities = [...userCharities].sort((a, b) => b.totalRaised - a.totalRaised);

  // Recent 6 donations
  const recentDonations = userDonations.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Welcome Banner with Role Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#1B0B3B] via-[#120D2C] to-[#0D0A22] border border-[#6B21C8]/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B2B]/20 border border-[#FF6B2B]/30 text-ghazara-orange text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منظومة غزارة للتسويق الخيري المتطور</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              مرحباً بك، {currentUser.name} 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {currentUser.role === 'admin' 
                ? 'لوحة القيادة الميدانية الشاملة لمتابعة مسار التبرعات، إنجازات المسوقين، وتحصيل العمولات لشهر أكتوبر 2026.'
                : `لوحة متابعة أهدافك الميدانية وعمولاتك المكتسبة. لقد حققت ${formatPercent(marketerAchievement)} من مستهدفك الشهري.`
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewDonationModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-5 py-3 rounded-2xl font-extrabold text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>تسجيل تبرع فوري</span>
            </button>
            <button
              onClick={() => setIsAIAgentOpen(true)}
              className="flex items-center gap-2 bg-[#1A1A3A] hover:bg-[#252550] border border-[#6B21C8]/50 text-purple-200 px-4 py-3 rounded-2xl font-bold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تحليل الذكاء الاصطناعي</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {currentUser.role === 'admin' ? (
        /* ADMIN KPIS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Donations */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#FF6B2B] to-[#EA580C]" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي التبرعات المحصلة</span>
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-ghazara-orange border border-orange-500/20">
                <HandHeart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{formatSAR(totalDonationsAmount)}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% نمو مقارنة بالشهر السابق</span>
              </div>
            </div>
          </div>

          {/* Achievement Rate */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6]" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">نسبة تحقيق التارغت العام</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-purple-200">{formatPercent(overallAchievement)}</div>
              <div className="w-full bg-[#0A0A1A] h-2 rounded-full mt-2.5 overflow-hidden border border-[#23234A]">
                <div 
                  className="bg-gradient-to-r from-[#6B21C8] to-[#FF6B2B] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(overallAchievement, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Marketers */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">فريق التسويق الميداني</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{activeMarketersCount} <span className="text-xs font-normal text-slate-400">مسوقين نشطين</span></div>
              <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                <span>متوسط التحصيل للمسوق:</span>
                <span className="font-bold text-slate-200">{formatSAR(totalDonationsAmount / (activeMarketersCount || 1))}</span>
              </div>
            </div>
          </div>

          {/* Active Charities */}
          <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">الجمعيات المعتمدة</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{activeCharitiesCount} <span className="text-xs font-normal text-slate-400">جمعيات شريكة</span></div>
              <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                <span>إجمالي التراخيص:</span>
                <span className="font-bold text-cyan-300">100% موثقة</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* MARKETER PERSONAL KPIS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-card glass-card-hover p-5 rounded-2xl border-purple-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">مبيعاتي المحققة هذا الشهر</span>
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-ghazara-orange">
                <HandHeart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{formatSAR(marketerRaised)}</div>
              <div className="text-xs text-slate-400 mt-2">من أصل مستهدف {formatSAR(marketerTarget)}</div>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">نسبة إنجاز المستهدف</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-ghazara-orange">{formatPercent(marketerAchievement)}</div>
              <div className="w-full bg-[#0A0A1A] h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-full rounded-full"
                  style={{ width: `${Math.min(marketerAchievement, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">العمولة المكتسبة ({currentMarketer.commissionRate}%)</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-400">{formatSAR(marketerCommission)}</div>
              <div className="text-xs text-slate-400 mt-2">+ حوافز إضافية عند تجاوز 100%</div>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">صافي الراتب المتوقع</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">{formatSAR(marketerNetForecast)}</div>
              <div className="text-xs text-slate-400 mt-2">أساسي {formatSAR(currentMarketer.baseSalary)} + عمولة + بونص</div>
            </div>
          </div>

        </div>
      )}

      {/* Visual Analytics & Target Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Target Performance Chart / Progress */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">متابعة المستهدفات الشهرية للمسوقين</h3>
                <p className="text-xs text-slate-400">المبيعات الفعلية مقارنة بالمستهدف المحدد لكل مسوق</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('targets')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Marketer Target Bars */}
          <div className="space-y-4 pt-2">
            {sortedMarketers.slice(0, 4).map((m) => {
              const pct = m.currentMonthTarget > 0 ? (m.currentMonthAchieved / m.currentMonthTarget) * 100 : 0;
              const isExceeded = pct >= 100;
              return (
                <div key={m.id} className="bg-[#0A0A1A]/80 p-3.5 rounded-xl border border-[#23234A] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span className="font-bold text-slate-100">{m.name}</span>
                      {isExceeded && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          تجاوز الهدف 🏆
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        {formatSAR(m.currentMonthAchieved)} / <span className="text-slate-200">{formatSAR(m.currentMonthTarget)}</span>
                      </span>
                      <span className={`font-black ${isExceeded ? 'text-emerald-400' : 'text-ghazara-orange'}`}>
                        {formatPercent(pct)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#12122B] h-2.5 rounded-full overflow-hidden border border-[#23234A]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isExceeded 
                          ? 'bg-gradient-to-r from-purple-600 via-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-r from-purple-600 to-ghazara-orange'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Top Performing Charities */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 text-ghazara-orange border border-orange-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">أعلى الجمعيات تحصيلاً</h3>
                <p className="text-xs text-slate-400">إجمالي التبرعات الموردة</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('charities')}
              className="text-xs font-bold text-ghazara-orange hover:underline"
            >
              الدليل
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {sortedCharities.slice(0, 4).map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A1A]/70 border border-[#23234A]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-900/50 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="truncate max-w-[150px]">
                    <div className="text-xs font-bold text-slate-100 truncate">{c.shortName}</div>
                    <div className="text-[10px] text-slate-400">{c.category}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-emerald-400">{formatSAR(c.totalRaised)}</div>
                  <div className="text-[10px] text-slate-400">{c.activeMarketersCount} مسوقين</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Donations Stream Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-ghazara-orange" />
              <span>آخر عمليات التبرع المسجلة في الميدان</span>
            </h3>
            <p className="text-xs text-slate-400">سجل لحظي بالتبرعات وقنوات الدفع المعتمدة</p>
          </div>

          <div className="flex items-center gap-2">
            <button
                onClick={() => exportDonationsToCSV(userDonations)}
              className="flex items-center gap-1.5 bg-[#1A1A3A] hover:bg-[#252550] text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#23234A] transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>تصدير Excel/CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              عرض كافة السجلات ({userDonations.length})
            </button>
          </div>
        </div>

        {/* Table / Responsive Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#23234A] text-slate-400">
                <th className="py-3 px-3">رقم الإيصال</th>
                <th className="py-3 px-3">الجمعية المستفيدة</th>
                <th className="py-3 px-3">المسوق</th>
                <th className="py-3 px-3">المبلغ</th>
                <th className="py-3 px-3">طريقة الدفع</th>
                <th className="py-3 px-3">التاريخ</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-center">إيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23234A]/50">
              {recentDonations.map((d) => {
                const statusInfo = getDonationStatusLabel(d.status);
                return (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-ghazara-orange">{d.receiptNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{d.charityName}</td>
                    <td className="py-3 px-3 text-slate-300">{d.marketerName}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{formatSAR(d.amount)}</td>
                    <td className="py-3 px-3 text-slate-300">{getPaymentMethodLabel(d.paymentMethod)}</td>
                    <td className="py-3 px-3 text-slate-400">{d.date}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => printDonationReceipt(d)}
                        className="p-1.5 rounded-lg bg-[#1A1A3A] hover:bg-[#6B21C8] text-slate-300 hover:text-white transition-all"
                        title="طباعة الإيصال"
                      >
                        سند
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
