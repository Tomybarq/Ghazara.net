import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Target, 
  Trophy, 
  Edit3, 
  CheckCircle2, 
  Flame, 
  Coins, 
  Calendar,
  X
} from 'lucide-react';
import { formatSAR, formatPercent } from '../../utils/formatters';
import { MonthlyTarget } from '../../types';

export const TargetsView: React.FC = () => {
  const { 
    userTargets, 
    marketers, 
    currentUser, 
    updateTarget 
  } = useApp();

  const [editingTarget, setEditingTarget] = useState<MonthlyTarget | null>(null);
  const [newTargetAmount, setNewTargetAmount] = useState<number>(100000);

  const totalAssignedTarget = userTargets.reduce((sum, t) => sum + t.targetAmount, 0);
  const totalAchievedTarget = userTargets.reduce((sum, t) => sum + t.achievedAmount, 0);
  const overallRate = totalAssignedTarget > 0 ? (totalAchievedTarget / totalAssignedTarget) * 100 : 0;

  const handleEditClick = (t: MonthlyTarget) => {
    setEditingTarget(t);
    setNewTargetAmount(t.targetAmount);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;
    updateTarget(editingTarget.id, newTargetAmount);
    setEditingTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Target className="w-7 h-7 text-ghazara-orange" />
            <span>المستهدفات الشهرية ونسب الإنجاز (أكتوبر 2026)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة خطط التارغت الميداني واحتساب الحوافز التنافسية آلياً فور تسجيل كل تبرع
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1A3A] px-4 py-2 rounded-xl border border-[#23234A] text-xs font-bold text-slate-200">
          <Calendar className="w-4 h-4 text-ghazara-orange" />
          <span>دورة شهر أكتوبر 2026</span>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">إجمالي المستهدف المطلوب</div>
            <div className="text-xl font-black text-white mt-1">{formatSAR(totalAssignedTarget)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">إجمالي المحقق الفعلي</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{formatSAR(totalAchievedTarget)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">المعدل العام للإنجاز</div>
            <div className="text-xl font-black text-ghazara-orange mt-1">{formatPercent(overallRate)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-ghazara-orange">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Marketer Targets Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300">تفاصيل أهداف ومكافآت المسوقين الميدانيين</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userTargets.map((target) => {
            const marketer = marketers.find(m => m.id === target.marketerId);
            const isExceeded = target.achievementPercentage >= 100;
            const isSuper = target.achievementPercentage >= 115;

            return (
              <div 
                key={target.id}
                className="glass-card rounded-2xl p-5 border border-[#23234A] space-y-4 relative overflow-hidden"
              >
                {/* Badge if exceeded */}
                {isSuper && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-br-xl shadow-md flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>متميز + مكافأة بونص 2,000 ر.س</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    {marketer && (
                      <img 
                        src={marketer.avatarUrl} 
                        alt={marketer.name} 
                        className="w-11 h-11 rounded-xl object-cover border-2 border-purple-500/40"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{target.marketerName}</h4>
                      <p className="text-[11px] text-slate-400">مسوق معتمد - عمولة {marketer?.commissionRate || 6}%</p>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleEditClick(target)}
                      className="p-1.5 rounded-lg bg-[#1A1A3A] hover:bg-[#6B21C8] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                      title="تعديل المستهدف"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                  )}
                </div>

                {/* Progress Bar & Percent */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">نسبة تحقيق الهدف:</span>
                    <span className={`text-base font-black ${isExceeded ? 'text-emerald-400' : 'text-ghazara-orange'}`}>
                      {formatPercent(target.achievementPercentage)}
                    </span>
                  </div>

                  <div className="w-full bg-[#0A0A1A] h-3.5 rounded-full overflow-hidden border border-[#23234A] p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isSuper 
                          ? 'bg-gradient-to-r from-purple-600 via-amber-400 to-emerald-400' 
                          : isExceeded 
                            ? 'bg-gradient-to-r from-purple-600 to-emerald-400' 
                            : 'bg-gradient-to-r from-purple-600 to-ghazara-orange'
                      }`}
                      style={{ width: `${Math.min(target.achievementPercentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-400 text-[11px]">المحصل الفعلي: </span>
                      <strong className="text-emerald-400 font-mono">{formatSAR(target.achievedAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">المستهدف: </span>
                      <strong className="text-slate-200 font-mono">{formatSAR(target.targetAmount)}</strong>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="p-2.5 rounded-xl bg-[#0A0A1A]/70 border border-[#23234A] flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>حالة الإنجاز:</span>
                  </span>
                  <span className={`font-bold ${isExceeded ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isSuper 
                      ? 'تجاوز المستهدف بتفوق (+115%)' 
                      : isExceeded 
                        ? 'تم تحقيق المستهدف بنجاح' 
                        : 'جاري العمل في الميدان'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Target Modal */}
      {editingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#12122B] border border-[#23234A] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23234A] bg-[#1A1A3A]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-ghazara-orange" />
                <span>تعديل المستهدف الشهري - {editingTarget.marketerName}</span>
              </h3>
              <button onClick={() => setEditingTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTarget} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  المستهدف الجديد لشهر أكتوبر (ر.س)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  required
                  value={newTargetAmount}
                  onChange={(e) => setNewTargetAmount(Number(e.target.value))}
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-ghazara-orange"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6] text-white py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                  حفظ المستهدف
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-4 bg-[#1A1A3A] text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
