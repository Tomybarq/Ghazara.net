import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Award, 
  X,
  Phone,
  Building2
} from 'lucide-react';
import { formatSAR, formatPercent } from '../../utils/formatters';

export const MarketersView: React.FC = () => {
  const { 
    userMarketers, 
    userCharities, 
    currentUser, 
    addMarketer 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Marketer Form State
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [baseSalary, setBaseSalary] = useState(5000);
  const [commissionRate, setCommissionRate] = useState(6.0);
  const [currentMonthTarget, setCurrentMonthTarget] = useState(100000);
  const [assignedCharities, setAssignedCharities] = useState<string[]>([userCharities[0]?.id || '']);
  const [notes, setNotes] = useState('');

  const handleCreateMarketer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMarketer({
      name: name.trim(),
      nationalId: nationalId.trim() || '10XXXXXXXX',
      phone: phone.trim() || '05XXXXXXXX',
      email: email.trim() || `${name.replace(/\s+/g, '').toLowerCase()}@ghazara.sa`,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      assignedCharityIds: assignedCharities,
      baseSalary: Number(baseSalary),
      commissionRate: Number(commissionRate),
      currentMonthTarget: Number(currentMonthTarget),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      notes,
    });

    setIsAddModalOpen(false);
    setName('');
    setNationalId('');
    setPhone('');
    setEmail('');
  };

  const toggleCharitySelection = (charityId: string) => {
    if (assignedCharities.includes(charityId)) {
      setAssignedCharities(assignedCharities.filter(id => id !== charityId));
    } else {
      setAssignedCharities([...assignedCharities, charityId]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-ghazara-orange" />
            <span>فريق المسوقين الميدانيين</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة كفاءات التسويق، تحديد المستهدفات، والتحقق التلقائي من نسب الإنجاز والعمولات
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6] hover:from-[#5B1AA8] hover:to-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة مسوق ميداني جديد</span>
          </button>
        )}
      </div>

      {/* Marketers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userMarketers.map((m) => {
          const pct = m.currentMonthTarget > 0 ? (m.currentMonthAchieved / m.currentMonthTarget) * 100 : 0;
          const isExceeded = pct >= 100;
          const commissionEarned = m.currentMonthAchieved * (m.commissionRate / 100);

          return (
            <div 
              key={m.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-[#23234A] flex flex-col justify-between space-y-4"
            >
              {/* Profile Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={m.avatarUrl} 
                    alt={m.name} 
                    className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/40 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {m.name}
                      {isExceeded && <Award className="w-4 h-4 text-amber-400" />}
                    </h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5" dir="ltr">
                      <Phone className="w-3 h-3 text-ghazara-orange" />
                      <span>{m.phone}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  m.status === 'active' ? 'badge-emerald' : 'badge-orange'
                }`}>
                  {m.status === 'active' ? 'نشط ميدانياً' : 'إجازة'}
                </span>
              </div>

              {/* Progress Toward Target */}
              <div className="bg-[#0A0A1A]/80 p-3.5 rounded-xl border border-[#23234A] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">إنجاز مستهدف أكتوبر:</span>
                  <span className={`font-black ${isExceeded ? 'text-emerald-400' : 'text-ghazara-orange'}`}>
                    {formatPercent(pct)}
                  </span>
                </div>

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

                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>المحقق: <strong className="text-white font-mono">{formatSAR(m.currentMonthAchieved)}</strong></span>
                  <span>الهدف: <strong className="text-slate-300 font-mono">{formatSAR(m.currentMonthTarget)}</strong></span>
                </div>
              </div>

              {/* Financial & Commission Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#1A1A3A]/70 border border-[#23234A]">
                  <div className="text-[10px] text-slate-400">الراتب الأساسي</div>
                  <div className="font-bold text-slate-200 mt-0.5">{formatSAR(m.baseSalary)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1A1A3A]/70 border border-[#23234A]">
                  <div className="text-[10px] text-slate-400">العمولة ({m.commissionRate}%)</div>
                  <div className="font-bold text-ghazara-orange mt-0.5">{formatSAR(commissionEarned)}</div>
                </div>
              </div>

              {/* Assigned Charities Tags */}
              <div>
                <div className="text-[10px] text-slate-400 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-purple-400" />
                  <span>الجمعيات المعتمدة للمسوق:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.assignedCharityIds.map(cid => {
                    const charity = userCharities.find(c => c.id === cid);
                    return charity ? (
                      <span key={cid} className="px-2 py-0.5 rounded-md bg-[#6B21C8]/20 text-purple-200 text-[10px] border border-purple-500/30">
                        {charity.shortName}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Marketer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#12122B] border border-[#23234A] rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23234A] bg-gradient-to-r from-[#1A1A3A] to-[#150A2E]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-ghazara-orange" />
                <span>إضافة مسوق ميداني جديد</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMarketer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: فيصل فهد الشمري"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الهوية الوطنية</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="10XXXXXXXX"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الجوال *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marketer@ghazara.sa"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الراتب الأساسي (ر.س)</label>
                  <input
                    type="number"
                    min="1000"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">مستهدف الشهر (ر.س)</label>
                  <input
                    type="number"
                    min="10000"
                    value={currentMonthTarget}
                    onChange={(e) => setCurrentMonthTarget(Number(e.target.value))}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">تعيين الجمعيات المسندة</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-[#0A0A1A] rounded-xl border border-[#23234A]">
                  {userCharities.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={assignedCharities.includes(c.id)}
                        onChange={() => toggleCharitySelection(c.id)}
                        className="accent-ghazara-orange"
                      />
                      <span className="truncate">{c.shortName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات إضافية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات حول الخبرة أو المنطقة الجغرافية..."
                  rows={2}
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange text-xs"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#23234A]">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6] text-white py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                  حفظ المسوق الجديد
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
