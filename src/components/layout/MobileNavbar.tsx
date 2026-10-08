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
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { getAccessibleTabs, canCreateDonation } from '../../domain/access';

const TAB_ICONS: Record<ActiveTab, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  donations: HandHeart,
  marketers: Users,
  charities: Building2,
  targets: Target,
  payroll: Wallet,
  charity_portal: Building2,
  reports: FileSpreadsheet,
};

export const MobileNavbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setIsNewDonationModalOpen, 
    setIsAIAgentOpen 
  } = useApp();

  const accessibleTabs = getAccessibleTabs(currentUser.role).map(tab => ({
    ...tab,
    icon: TAB_ICONS[tab.id] || LayoutDashboard,
  }));

  const hasCreateDonationPerm = canCreateDonation(currentUser.role);
  const visibleTabs = accessibleTabs.slice(0, 4);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E26]/95 backdrop-blur-lg border-t border-[#23234A] px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around relative">
        {visibleTabs.slice(0, 2).map((tab) => {
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

        {/* Center Floating Plus Button for Field Donation if permitted */}
        {hasCreateDonationPerm && (
          <button
            onClick={() => setIsNewDonationModalOpen(true)}
            className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B2B] to-[#EA580C] text-white shadow-xl shadow-orange-500/30 active:scale-95 transition-transform"
            title="تسجيل تبرع جديد"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {visibleTabs.slice(2).map((tab) => {
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
