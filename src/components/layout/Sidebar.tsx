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
  HeartHandshake,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { formatSAR } from '../../utils/formatters';
import { getAccessibleTabs } from '../../domain/access';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

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

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setIsAIAgentOpen,
    userDonations
  } = useApp();

  const totalRaisedCurrent = userDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const navItems = getAccessibleTabs(currentUser.role).map(tab => ({
    ...tab,
    icon: TAB_ICONS[tab.id] || LayoutDashboard,
  }));

  return (
    <aside 
      className={`hidden md:flex flex-col fixed top-0 right-0 h-screen z-40 transition-all duration-300 bg-gradient-to-b from-[#150A2E] via-[#0D0B24] to-[#0A0A1A] border-l border-[#6B21C8]/30 shadow-2xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#23234A] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B21C8] to-[#8B5CF6] flex items-center justify-center p-2 shadow-lg shadow-purple-600/30 shrink-0">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in truncate">
              <div className="font-extrabold text-base tracking-wide bg-clip-text text-transparent bg-gradient-to-l from-white via-slate-100 to-purple-200">
                غزارة للتسويق
              </div>
              <div className="text-[10px] text-purple-300/80 font-medium">
                إدارة مبيعات الجمعيات الخيرية
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm transition-all text-right group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#6B21C8] to-[#7C3AED] text-white shadow-lg shadow-purple-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-purple-300/70 group-hover:text-purple-300'
              }`} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && (
                <span className="absolute left-1.5 w-1.5 h-6 bg-ghazara-orange rounded-full" />
              )}
            </button>
          );
        })}

        {/* AI Agent Quick Tab */}
        <button
          onClick={() => setIsAIAgentOpen(true)}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm transition-all text-right text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 mt-4 group"
          title={collapsed ? 'المساعد الذكي' : undefined}
        >
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 group-hover:rotate-12 transition-transform" />
          {!collapsed && (
            <span className="truncate">مساعد الذكاء الاصطناعي</span>
          )}
        </button>
      </nav>

      {/* Mini Performance Summary */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-[#1E123F] to-[#120B27] border border-[#6B21C8]/40 shadow-inner">
          <div className="flex items-center justify-between text-xs text-purple-200 mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-ghazara-orange" />
              {currentUser.role === 'admin' ? 'إجمالي المحصل في النظام' : 'إنجازك المالي'}
            </span>
          </div>
          <div className="text-lg font-black text-white">
            {formatSAR(totalRaisedCurrent)}
          </div>
          <div className="text-[11px] text-purple-300/70 mt-1">
            {currentUser.role === 'admin' ? 'محدث لحظياً من الميدان' : 'تم احتساب العمولات بنجاح'}
          </div>
        </div>
      )}

      {/* Footer Toggle */}
      <div className="p-3 border-t border-[#23234A] flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full py-2 px-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>{collapsed ? '▶' : '◀ تصغير القائمة'}</span>
        </button>
      </div>
    </aside>
  );
};
