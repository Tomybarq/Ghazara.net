import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Plus, 
  FileCheck, 
  MapPin, 
  Users, 
  X
} from 'lucide-react';
import { formatSAR, formatPercent } from '../../utils/formatters';

export const CharitiesView: React.FC = () => {
  const { 
    userCharities, 
    userMarketers, 
    currentUser, 
    addCharity 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Charity Form
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [code, setCode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [category, setCategory] = useState('رعاية الأيتام والأسر المتعففة');
  const [city, setCity] = useState('الرياض');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetAmount, setTargetAmount] = useState(300000);
  const [commissionRate, setCommissionRate] = useState(10);
  const [description, setDescription] = useState('');

  const handleCreateCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCharity({
      name: name.trim(),
      shortName: shortName.trim() || name.split(' ')[0] + ' ' + (name.split(' ')[1] || ''),
      code: code.trim() || `CHR-${Math.floor(10 + Math.random() * 90)}`,
      licenseNumber: licenseNumber.trim() || `${Math.floor(100 + Math.random() * 900)} / م.ع`,
      category,
      city,
      contactPerson: contactPerson.trim() || 'ممثل الجمعية',
      phone: phone.trim() || '05XXXXXXXX',
      email: email.trim() || 'info@charity.org.sa',
      targetAmount: Number(targetAmount),
      commissionRate: Number(commissionRate),
      status: 'active',
      description: description.trim() || 'جمعية خيرية معتمدة ومرخصة لجمع التبرعات.',
    });

    setIsAddModalOpen(false);
    setName('');
    setShortName('');
    setCode('');
    setLicenseNumber('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-ghazara-orange" />
            <span>دليل الجمعيات الخيرية المعتمدة</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            سجل الجمعيات الشريكة، أرقام التراخيص الرسمية، والحملات التسويقية النشطة
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جمعية خيرية جديدة</span>
          </button>
        )}
      </div>

      {/* Charities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userCharities.map((c) => {
          const pct = c.targetAmount > 0 ? (c.totalRaised / c.targetAmount) * 100 : 0;
          const assignedMarketersList = userMarketers.filter(m => m.assignedCharityIds.includes(c.id));

          return (
            <div 
              key={c.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-[#23234A] flex flex-col justify-between space-y-4"
            >
              {/* Header with License */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-ghazara-orange bg-[#FF6B2B]/10 px-2 py-0.5 rounded-md border border-[#FF6B2B]/20 mb-1.5">
                      {c.code}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">{c.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold badge-emerald shrink-0">
                    مرخصة وموثقة
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ترخيص: {c.licenseNumber}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{c.city}</span>
                  </span>
                </div>
              </div>

              {/* Raised & Target */}
              <div className="bg-[#0A0A1A]/80 p-3.5 rounded-xl border border-[#23234A] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">إجمالي التبرعات الموردة:</span>
                  <span className="font-bold text-emerald-400">{formatPercent(pct)}</span>
                </div>

                <div className="text-xl font-black text-white">{formatSAR(c.totalRaised)}</div>

                <div className="w-full bg-[#12122B] h-2 rounded-full overflow-hidden border border-[#23234A]">
                  <div
                    className="bg-gradient-to-r from-[#6B21C8] to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>المستهدف: {formatSAR(c.targetAmount)}</span>
                  <span>عمولة التسويق: {c.commissionRate}%</span>
                </div>
              </div>

              {/* Contact Person & Marketers */}
              <div className="pt-1 border-t border-[#23234A] space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 text-[11px]">المشرف المعتمد:</span>
                  <span className="font-semibold">{c.contactPerson}</span>
                </div>
                
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    <span>المسوقين المسندين:</span>
                  </span>
                  <span className="font-bold text-purple-300">{assignedMarketersList.length} مسوقين</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Charity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#12122B] border border-[#23234A] rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23234A] bg-gradient-to-r from-[#1A1A3A] to-[#150A2E]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-ghazara-orange" />
                <span>إضافة جمعية خيرية جديدة</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCharity} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الاسم الرسمي للجمعية *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: جمعية رعاية الأيتام بالمدينة المنورة"
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الاسم المختصر</label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="مثال: جمعية أيتام المدينة"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">كود الجمعية</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="AYTAM-07"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الترخيص الرسمي *</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="1205 / م.ع"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تصنيف النشاط</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  >
                    <option value="رعاية الأيتام والأسر المتعففة">رعاية الأيتام والأسر المتعففة</option>
                    <option value="مساعدات إغاثية وعلاجية">مساعدات إغاثية وعلاجية</option>
                    <option value="تعليم القرآن والعلوم الشرعية">تعليم القرآن والعلوم الشرعية</option>
                    <option value="حفظ النعمة وإطعام الجائعين">حفظ النعمة وإطعام الجائعين</option>
                    <option value="علاج المرضى وتوفير الأدوية">علاج المرضى وتوفير الأدوية</option>
                    <option value="بناء المساجد وسقيا الماء">بناء المساجد وسقيا الماء</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المدينة / المقر الرئيسي</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="الرياض، جدة، الدمام..."
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">اسم ممثل الجمعية</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="أ. عبدالله السليمان"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف / الجوال</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@charity.org.sa"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نبذة عن الجمعية</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="نبذة مختصرة عن نشاط الجمعية..."
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المستهدف المالي السنوي (ر.س)</label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نسبة عمولة التسويق للشركة (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#23234A]">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] text-white py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                  حفظ الجمعية في الدليل
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
