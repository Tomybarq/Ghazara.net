import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DonationsView } from './components/donations/DonationsView';
import { MarketersView } from './components/marketers/MarketersView';
import { CharitiesView } from './components/charities/CharitiesView';
import { TargetsView } from './components/targets/TargetsView';
import { PayrollView } from './components/payroll/PayrollView';
import { CharityRepPortalView } from './components/charity-rep/CharityRepPortalView';
import { NewDonationModal } from './components/donations/NewDonationModal';
import { AIAssistantDrawer } from './components/ai-agent/AIAssistantDrawer';
import { NotificationToast } from './components/common/NotificationToast';

const MainAppContent: React.FC = () => {
  const { activeTab, currentUser } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'donations':
        return <DonationsView />;
      case 'marketers':
        return <MarketersView />;
      case 'charities':
        return <CharitiesView />;
      case 'targets':
        return <TargetsView />;
      case 'payroll':
        return <PayrollView />;
      case 'charity_portal':
        return <CharityRepPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-[#F8FAFC] flex flex-col antialiased">
      
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:mr-20' : 'md:mr-64'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* View Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavbar />

      {/* Modals & Drawers */}
      <NewDonationModal />
      <AIAssistantDrawer />
      <NotificationToast />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
