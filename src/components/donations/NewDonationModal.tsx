import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  HandHeart, 
  User, 
  Check, 
  Printer,
  Coins
} from 'lucide-react';
import { PaymentMethod, DonorType, Donation } from '../../types';
import { formatSAR } from '../../utils/formatters';
import { printDonationReceipt } from '../../utils/exportUtils';

export const NewDonationModal: React.FC = () => {
  const { 
    isNewDonationModalOpen, 
    setIsNewDonationModalOpen, 
    userCharities, 
    userMarketers, 
    currentUser, 
    addDonation 
  } = useApp();

  const [charityId, setCharityId] = useState(userCharities[0]?.id || '');
  const [marketerId, setMarketerId] = useState(
    currentUser.role === 'marketer' && currentUser.marketerId 
      ? currentUser.marketerId 
      : userMarketers[0]?.id || ''
  );
  const [amount, setAmount] = useState<number | ''>(5000);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorType, setDonorType] = useState<DonorType>('individual');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [campaignName, setCampaignName] = useState('كفالة ورعاية شاملة');
  const [notes, setNotes] = useState('');
  const [lastCreatedDonation, setLastCreatedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewDonationModalOpen) {
        setIsNewDonationModalOpen(false);
        setLastCreatedDonation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewDonationModalOpen, setIsNewDonationModalOpen]);

  if (!isNewDonationModalOpen) return null;

  const selectedCharity = userCharities.find(c => c.id === charityId);
  const selectedMarketer = userMarketers.find(m => m.id === marketerId);
  
  // Calculate live expected commission
  const currentAmountNum = typeof amount === 'number' ? amount : 0;
  const expectedCommission = selectedMarketer ? (currentAmountNum * (selectedMarketer.commissionRate / 100)) : 0;

  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    if (!selectedCharity || !selectedMarketer) return;

    const donation = addDonation({
      charityId,
      charityName: selectedCharity.name,
      marketerId,
      marketerName: selectedMarketer.name,
      amount: Number(amount),
      donorName: donorName.trim() || (donorType === 'anonymous' ? 'فاعل خير' : 'متبرع كريم'),
      donorPhone: donorPhone.trim() || '05XXXXXXXX',
      donorType,
      paymentMethod,
      campaignName,
      status: 'completed',
      notes,
    });

    if (donation) {
      setLastCreatedDonation(donation);
    }
  };

  const handleClose = () => {
    setIsNewDonationModalOpen(false);
    setLastCreatedDonation(null);
    setAmount(5000);
    setDonorName('');
    setDonorPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#12122B] border border-[#23234A] rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23234A] bg-gradient-to-r from-[#1A1A3A] to-[#150A2E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-ghazara-orange/20 text-ghazara-orange border border-ghazara-orange/30">
              <HandHeart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">تسجيل تبرع ميداني جديد</h3>
              <p className="text-xs text-slate-400">يتم احتساب العمولات وتحديث أهداف المبيعات تلقائياً فور الحفظ</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen with Receipt Print */}
        {lastCreatedDonation ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">تم حفظ التبرع بنجاح!</h4>
              <p className="text-sm text-slate-400 mt-1">
                رقم الإيصال: <span className="text-ghazara-orange font-bold font-mono">{lastCreatedDonation.receiptNumber}</span>
              </p>
              <div className="text-3xl font-black text-emerald-400 mt-3">
                {formatSAR(lastCreatedDonation.amount)}
              </div>
            </div>

            <div className="bg-[#1A1A3A] p-4 rounded-xl border border-[#23234A] text-right space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">الجمعية المستفيدة:</span>
                <span className="font-semibold">{lastCreatedDonation.charityName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">المسوق المعتمد:</span>
                <span className="font-semibold">{lastCreatedDonation.marketerName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">اسم المتبرع:</span>
                <span className="font-semibold">{lastCreatedDonation.donorName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">العمولة المكتسبة للمسوق:</span>
                <span className="font-bold text-ghazara-orange">+{formatSAR(expectedCommission)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => printDonationReceipt(lastCreatedDonation)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6] hover:from-[#5B1AA8] hover:to-[#7C3AED] text-white py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                <Printer className="w-5 h-5" />
                <span>طباعة سند الاستلام (PDF)</span>
              </button>
              <button
                onClick={() => {
                  setLastCreatedDonation(null);
                  setDonorName('');
                  setDonorPhone('');
                }}
                className="flex-1 bg-[#1A1A3A] hover:bg-[#252550] text-slate-200 py-3 rounded-xl font-bold transition-all border border-[#23234A]"
              >
                + تسجيل تبرع آخر
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Amount Input & Quick Chips */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                مبلغ التبرع (ر.س) <span className="text-ghazara-orange">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="أدخل المبلغ..."
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-4 py-3 text-2xl font-black text-emerald-400 focus:outline-none focus:border-ghazara-orange focus:ring-1 focus:ring-ghazara-orange"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ريال سعودي
                </span>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      amount === q
                        ? 'bg-ghazara-orange text-white'
                        : 'bg-[#1A1A3A] text-slate-300 hover:bg-[#252550] border border-[#23234A]'
                    }`}
                  >
                    +{q.toLocaleString('ar-SA')} ر.س
                  </button>
                ))}
              </div>
            </div>

            {/* Live Commission Pill */}
            {selectedMarketer && currentAmountNum > 0 && (
              <div className="bg-gradient-to-r from-[#6B21C8]/20 via-[#FF6B2B]/20 to-transparent border border-purple-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-200">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>العمولة المحتسبة للمسوق ({selectedMarketer.commissionRate}%):</span>
                </div>
                <span className="font-extrabold text-sm text-ghazara-orange">
                  +{formatSAR(expectedCommission)}
                </span>
              </div>
            )}

            {/* Charity & Marketer Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الجمعية الخيرية المستفيدة <span className="text-ghazara-orange">*</span>
                </label>
                <select
                  value={charityId}
                  onChange={(e) => setCharityId(e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-ghazara-orange"
                >
                  {userCharities.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  المسوق الميداني <span className="text-ghazara-orange">*</span>
                </label>
                <select
                  value={marketerId}
                  disabled={currentUser.role === 'marketer'}
                  onChange={(e) => setMarketerId(e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-ghazara-orange disabled:opacity-60"
                >
                  {userMarketers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} - عمولة {m.commissionRate}%
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Donor Information */}
            <div className="bg-[#1A1A3A]/60 p-4 rounded-xl border border-[#23234A] space-y-3">
              <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>بيانات المتبرع</span>
              </div>

              {/* Donor Type Radio */}
              <div className="flex gap-4">
                {[
                  { id: 'individual', label: 'فرد (مواطن/مقيم)' },
                  { id: 'corporate', label: 'شركة / مؤسسة' },
                  { id: 'anonymous', label: 'فاعل خير' },
                ].map(t => (
                  <label key={t.id} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="donorType"
                      checked={donorType === t.id}
                      onChange={() => setDonorType(t.id as DonorType)}
                      className="accent-ghazara-orange"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={donorType === 'corporate' ? 'اسم الشركة أو المؤسسة المانحة' : 'اسم المتبرع الكريم'}
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="رقم الجوال (05xxxxxxxx)"
                    className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                طريقة السداد <span className="text-ghazara-orange">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'mada', label: 'مدى Mada' },
                  { id: 'visa', label: 'فيزا / ماستر' },
                  { id: 'bank_transfer', label: 'تحويل بنكي' },
                  { id: 'stc_pay', label: 'STC Pay' },
                  { id: 'cash', label: 'نقدي (كاش)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      paymentMethod === m.id
                        ? 'bg-[#FF6B2B]/20 border-ghazara-orange text-ghazara-orange font-bold'
                        : 'bg-[#0A0A1A] border-[#23234A] text-slate-300 hover:bg-[#1A1A3A]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم الحملة / المشروع</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="مثال: كفالة أيتام، إطعام صائم..."
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات إضافية</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="كشك المبيعات، رقم المرجع، إلخ..."
                  className="w-full bg-[#0A0A1A] border border-[#23234A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-ghazara-orange"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#23234A]">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white py-3 rounded-xl font-extrabold shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm"
              >
                تأكيد وتسجيل التبرع في النظام
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 bg-[#1A1A3A] hover:bg-[#252550] text-slate-300 rounded-xl font-bold text-sm border border-[#23234A] transition-all"
              >
                إلغاء
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
