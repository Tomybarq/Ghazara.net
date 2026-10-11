import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { demoUsers } from '../../data/mockData';
import { CurrentUser, UserRole } from '../../types';

const CURRENT_YEAR = 2026;

export const LoginView: React.FC = () => {
  const { setViewMode, loginAs, showNotification } = useApp();
  
  // Tabs: 'quick' (1-click role login) vs 'credentials' (form login)
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  
  // Credentials Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@ghazara.sa');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle role selection in credentials mode
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const demo = demoUsers.find(u => u.role === role);
    if (demo) {
      setEmail(demo.email);
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = demoUsers.find(u => u.role === selectedRole) || demoUsers[0];
      loginAs(user);
    }, 600);
  };

  const handleQuickLogin = (user: CurrentUser) => {
    loginAs(user);
  };

  return (
    <div className="min-h-screen bg-[#070714] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans antialiased">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header / Back Navigation */}
      <header className="relative z-10 p-4 sm:p-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        
        {/* Brand identity */}
        <button 
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 text-right group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B21C8] to-[#FF6B2B] p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0E0E26] rounded-[14px] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-[#FF6B2B]" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-lg text-white">منصة غزارة للتسويق</div>
            <div className="text-[10px] text-purple-300/80">بوابة الدخول والتحقق الآمن</div>
          </div>
        </button>

        {/* Back to Landing Page */}
        <button
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-[#24244D] hover:border-purple-500/50 bg-[#10102B]/80 transition-all hover:bg-[#18183E]"
        >
          <span>الصفحة الرئيسية</span>
          <ArrowLeft className="w-4 h-4 text-purple-400" />
        </button>

      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-xl">
          
          {/* Card Container */}
          <div className="rounded-3xl bg-[#0D0D26]/90 border border-[#232352] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            
            {/* Header info */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>دخول آمن ومشفر 256-bit SSL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                تسجيل الدخول إلى منصة غزارة
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                اختر الحساب التجريبي المخصص لدورك الوظيفي للبدء فوراً، أو أدخل بياناتك
              </p>
            </div>

            {/* Toggle Modes Tab */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#141438] border border-[#262656] mb-8">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'quick'
                    ? 'bg-gradient-to-r from-[#6B21C8] to-[#8B5CF6] text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الدخول السريع بالأدوار (موصى به)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'credentials'
                    ? 'bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                البريد الإلكتروني وكلمة المرور
              </button>
            </div>

            {/* TAB 1: 1-Click Role Login */}
            {activeTab === 'quick' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(demoUsers[0])}
                  className="w-full text-right p-4 rounded-2xl bg-[#141438] hover:bg-[#1C1C4C] border border-[#2B2B5C] hover:border-purple-500/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={demoUsers[0].avatar}
                      alt={demoUsers[0].name}
                      className="w-12 h-12 rounded-xl object-cover border border-purple-500/50 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{demoUsers[0].name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600/30 text-purple-300 border border-purple-500/40">
                          مدير تنفيذي
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        صلاحيات كاملة · الجمعيات · التارغت · مسيرات الرواتب
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </button>

                {/* Marketer Card */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(demoUsers[1])}
                  className="w-full text-right p-4 rounded-2xl bg-[#141438] hover:bg-[#1C1C4C] border border-[#2B2B5C] hover:border-orange-500/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={demoUsers[1].avatar}
                      alt={demoUsers[1].name}
                      className="w-12 h-12 rounded-xl object-cover border border-orange-500/50 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{demoUsers[1].name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600/30 text-orange-300 border border-orange-500/40">
                          مسوق ميداني
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        تسجيل التبرعات · تتبع الهدف · احتساب العمولات
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-300 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </button>

                {/* Charity Rep Card */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(demoUsers[2])}
                  className="w-full text-right p-4 rounded-2xl bg-[#141438] hover:bg-[#1C1C4C] border border-[#2B2B5C] hover:border-emerald-500/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={demoUsers[2].avatar}
                      alt={demoUsers[2].name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{demoUsers[2].name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                          ممثل جمعية
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        جمعية إحسان · شفافية الحصيلة · سندات التبرع المباشرة
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </button>

              </div>
            )}

            {/* TAB 2: Standard Form */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-fade-in">
                
                {/* Role Selector Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">الدور الوظيفي للدخول:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('admin')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedRole === 'admin'
                          ? 'bg-purple-600/30 border-purple-500 text-white'
                          : 'bg-[#141438] border-[#2A2A5A] text-slate-400 hover:text-white'
                      }`}
                    >
                      مدير نظام
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('marketer')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedRole === 'marketer'
                          ? 'bg-orange-600/30 border-orange-500 text-white'
                          : 'bg-[#141438] border-[#2A2A5A] text-slate-400 hover:text-white'
                      }`}
                    >
                      مسوق ميداني
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('charity_rep')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedRole === 'charity_rep'
                          ? 'bg-emerald-600/30 border-emerald-500 text-white'
                          : 'bg-[#141438] border-[#2A2A5A] text-slate-400 hover:text-white'
                      }`}
                    >
                      ممثل جمعية
                    </button>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني المهني:</label>
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="w-full bg-[#141438] border border-[#2B2B5C] rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-right transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">كلمة المرور:</label>
                    <button 
                      type="button" 
                      onClick={() => showNotification('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك المسجل.', 'info')}
                      className="text-[11px] text-[#FF6B2B] hover:underline"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                      className="w-full bg-[#141438] border border-[#2B2B5C] rounded-xl pr-10 pl-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-right transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#141438] border-[#2B2B5C] text-purple-600 focus:ring-purple-500"
                    />
                    <span>تذكر تسجيل دخولي على هذا الجهاز</span>
                  </label>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    جلسة آمنة
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 active:scale-98 transition-all disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>تسجيل الدخول ومتابعة العمل</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

            {/* Direct Platform Jump Alternative */}
            <div className="mt-8 pt-6 border-t border-[#1F1F48] text-center">
              <button
                type="button"
                onClick={() => setViewMode('platform')}
                className="text-xs text-purple-300 hover:text-white font-bold flex items-center justify-center gap-1.5 mx-auto group"
              >
                <span>أو يمكنك استعراض المنصة بدون تسجيل الدخول (عرض تجريبي)</span>
                <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Privacy & Compliance Footer Notice */}
          <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
            <div>
              شركة غزارة للتجارة والتسويق · متوافقة مع لوائح حماية البيانات والقطاع غير الربحي 🇸🇦
            </div>
          </div>

        </div>
      </main>

      {/* Page bottom spacer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-600">
        جميع الحقوق محفوظة © {CURRENT_YEAR} غزارة
      </footer>

    </div>
  );
};
