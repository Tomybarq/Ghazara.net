import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  HandHeart, 
  Users, 
  Building2, 
  Target, 
  Wallet, 
  Sparkles,
  Plus
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const MobileNavbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setIsNewDonationModalOpen, 
    setIsAIAgentOpen 
  } = useApp();

  const getTabs = () => {
    if (currentUser.role === 'charity_rep') {
      return [
        { id: 'charity_portal' as ActiveTab, label: 'الرئيسية', icon: LayoutDashboard },
        { id: 'donations' as ActiveTab, label: 'السجلات', icon: HandHeart },
      ];
    }
    if (currentUser.role === 'marketer') {
      return [
        { id: 'dashboard' as ActiveTab, label: 'إنجازي', icon: LayoutDashboard },
        { id: 'donations' as ActiveTab, label: 'تبرعاتي', icon: HandHeart },
        { id: 'targets' as ActiveTab, label: 'المستهدف', icon: Target },
        { id: 'payroll' as ActiveTab, label: 'الراتب', icon: Wallet },
      ];
    }
    return [
      { id: 'dashboard' as ActiveTab, label: 'الرئيسية', icon: LayoutDashboard },
      { id: 'donations' as ActiveTab, label: 'التبرعات', icon: HandHeart },
      { id: 'marketers' as ActiveTab, label: 'المسوقين', icon: Users },
      { id: 'payroll' as ActiveTab, label: 'الرواتب', icon: Wallet },
    ];
  };

  const tabs = getTabs();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E26]/95 backdrop-blur-lg border-t border-[#23234A] px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around relative">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-ghazara-orange font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Floating Plus Button for Field Donation */}
        <button
          onClick={() => setIsNewDonationModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#EA580C] text-white shadow-xl shadow-orange-500/30 active:scale-95 transition-transform"
          title="تسجيل تبرع جديد"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {tabs.slice(2, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-ghazara-orange font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        {/* AI Agent Icon on Mobile */}
        <button
          onClick={() => setIsAIAgentOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-purple-300 hover:text-purple-100"
          title="المساعد الذكي"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">AI</span>
        </button>
      </div>
    </div>
  );
};
