import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Plus, 
  Search, 
  UserCheck, 
  ChevronDown, 
  ShieldCheck, 
  Users, 
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    setIsNewDonationModalOpen, 
    setIsAIAgentOpen,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'مدير النظام (كامل الصلاحيات)', color: 'bg-ghazara-purple text-white' };
      case 'marketer':
        return { label: 'مسوق ميداني (حساب شخصي)', color: 'bg-ghazara-orange text-white' };
      case 'charity_rep':
        return { label: 'ممثل جمعية (عرض التبرعات)', color: 'bg-emerald-600 text-white' };
    }
  };

  const currentRoleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 bg-[#0E0E26]/90 backdrop-blur-md border-b border-[#23234A] px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side (in RTL): Brand Mobile / Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="بحث عن متبرع، إيصال، جمعية، مسوق..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#12122B] border border-[#23234A] rounded-xl pr-9 pl-8 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-ghazara-orange focus:ring-1 focus:ring-ghazara-orange transition-all"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action + AI Agent + Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Add Donation Button (Orange Action Highlight) */}
          <button
            onClick={() => setIsNewDonationModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-3.5 sm:px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل تبرع ميداني</span>
            <span className="sm:hidden">تبرع</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAIAgentOpen(true)}
            className="relative flex items-center gap-2 bg-[#1A1A3A] hover:bg-[#252550] border border-[#6B21C8]/40 hover:border-[#6B21C8] text-purple-200 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all group"
            title="المساعد الذكي لعمليات غزارة"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">مساعد غزارة AI</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghazara-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ghazara-orange"></span>
            </span>
          </button>

          {/* Role Switcher Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 bg-[#12122B] hover:bg-[#1A1A3A] border border-[#23234A] px-2.5 sm:px-3 py-1.5 rounded-xl text-right transition-all"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-lg object-cover border border-purple-500/40"
              />
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  {currentUser.name}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">{currentRoleInfo.label.split(' ')[0]}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRoleDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-72 bg-[#12122B] border border-[#23234A] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-[#23234A] mb-1">
                    <div className="text-xs font-semibold text-slate-400">تبديل دور المستخدم (تجربة الأدوار):</div>
                  </div>

                  {/* Admin Option */}
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all ${
                      currentUser.role === 'admin' ? 'bg-[#6B21C8]/20 border border-[#6B21C8]/40' : 'hover:bg-[#1A1A3A]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-purple-600/30 text-purple-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">مدير النظام (Admin)</div>
                      <div className="text-[11px] text-slate-400">إدارة الجمعيات، المسوقين، التارغت، والرواتب</div>
                    </div>
                  </button>

                  {/* Marketer Option */}
                  <button
                    onClick={() => {
                      switchRole('marketer');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all ${
                      currentUser.role === 'marketer' ? 'bg-[#FF6B2B]/20 border border-[#FF6B2B]/40' : 'hover:bg-[#1A1A3A]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-orange-600/30 text-orange-300">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">مسوق ميداني (أحمد الزهراني)</div>
                      <div className="text-[11px] text-slate-400">تسجيل التبرعات، متابعة الهدف، والعمولات</div>
                    </div>
                  </button>

                  {/* Charity Rep Option */}
                  <button
                    onClick={() => {
                      switchRole('charity_rep');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all ${
                      currentUser.role === 'charity_rep' ? 'bg-emerald-600/20 border border-emerald-500/40' : 'hover:bg-[#1A1A3A]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-emerald-600/30 text-emerald-300">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">ممثل جمعية (جمعية إحسان)</div>
                      <div className="text-[11px] text-slate-400">اطلاع حصري على سجلات وإيرادات الجمعية</div>
                    </div>
                  </button>

                  <div className="mt-2 pt-2 border-t border-[#23234A] px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ghazara-orange" />
                      أكتوبر 2026
                    </span>
                    <span className="text-emerald-400 font-medium">الرياض، المملكة</span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
