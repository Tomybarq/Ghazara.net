import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Charity, 
  Marketer, 
  Donation, 
  MonthlyTarget, 
  PayrollRecord, 
  CurrentUser, 
  ActiveTab, 
  UserRole, 
  PayrollStatus 
} from '../types';
import { 
  initialCharities, 
  initialMarketers, 
  initialDonations, 
  initialMonthlyTargets, 
  initialPayrollRecords, 
  demoUsers 
} from '../data/mockData';
import { getActivePeriod } from '../domain/period';
import { 
  calculateAchievement, 
  getTargetStatus, 
  calculatePayroll 
} from '../domain/finance';
import { 
  validateDonationInput, 
  prepareDonation, 
  DonationInput 
} from '../domain/donations';

export interface AppContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  switchRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  charities: Charity[];
  marketers: Marketer[];
  donations: Donation[];
  monthlyTargets: MonthlyTarget[];
  payrollRecords: PayrollRecord[];
  
  // Actions
  addDonation: (donationData: Omit<Donation, 'id' | 'receiptNumber' | 'date' | 'time'>) => Donation | null;
  addCharity: (charity: Omit<Charity, 'id' | 'totalRaised' | 'activeMarketersCount'>) => void;
  updateCharity: (id: string, charity: Partial<Charity>) => void;
  addMarketer: (marketer: Omit<Marketer, 'id' | 'currentMonthAchieved' | 'totalDonationsCount'>) => void;
  updateMarketer: (id: string, marketer: Partial<Marketer>) => void;
  updateTarget: (targetId: string, newTargetAmount: number) => void;
  updatePayrollStatus: (payrollId: string, status: PayrollStatus) => void;
  markAllPayrollPaid: (month: number, year: number) => void;
  approveAllPayroll: (month: number, year: number) => void;
  
  // Modals & UI States
  isNewDonationModalOpen: boolean;
  setIsNewDonationModalOpen: (open: boolean) => void;
  isAIAgentOpen: boolean;
  setIsAIAgentOpen: (open: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Filtered views based on roles
  userDonations: Donation[];
  userCharities: Charity[];
  userTargets: MonthlyTarget[];
  userPayroll: PayrollRecord[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('ghazara_user');
    return saved ? JSON.parse(saved) : demoUsers[0];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [charities, setCharities] = useState<Charity[]>(() => {
    const saved = localStorage.getItem('ghazara_charities');
    return saved ? JSON.parse(saved) : initialCharities;
  });

  const [marketers, setMarketers] = useState<Marketer[]>(() => {
    const saved = localStorage.getItem('ghazara_marketers');
    return saved ? JSON.parse(saved) : initialMarketers;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('ghazara_donations');
    return saved ? JSON.parse(saved) : initialDonations;
  });

  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>(() => {
    const saved = localStorage.getItem('ghazara_targets');
    return saved ? JSON.parse(saved) : initialMonthlyTargets;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('ghazara_payroll');
    return saved ? JSON.parse(saved) : initialPayrollRecords;
  });

  const [isNewDonationModalOpen, setIsNewDonationModalOpen] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ghazara_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ghazara_charities', JSON.stringify(charities));
  }, [charities]);

  useEffect(() => {
    localStorage.setItem('ghazara_marketers', JSON.stringify(marketers));
  }, [marketers]);

  useEffect(() => {
    localStorage.setItem('ghazara_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('ghazara_targets', JSON.stringify(monthlyTargets));
  }, [monthlyTargets]);

  useEffect(() => {
    localStorage.setItem('ghazara_payroll', JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = demoUsers.find(u => u.role === role) || demoUsers[0];
    setCurrentUser(targetUser);
    showNotification(`تم التبديل بنجاح إلى حساب: ${targetUser.name}`, 'info');
    
    // Auto-adjust active tab for charity rep
    if (role === 'charity_rep') {
      setActiveTab('charity_portal');
    } else if (activeTab === 'charity_portal') {
      setActiveTab('dashboard');
    }
  };

  // Add Donation with Pure Domain Validation and Auto-Calculations
  const addDonation = (data: Omit<Donation, 'id' | 'receiptNumber' | 'date' | 'time'>): Donation | null => {
    const validation = validateDonationInput(data, { charities, marketers });
    if (!validation.valid) {
      showNotification(validation.errors[0] || 'بيانات التبرع غير صالحة', 'error');
      return null;
    }

    const activePeriod = getActivePeriod();
    const newDonation = prepareDonation(
      data as DonationInput,
      new Date(),
      donations.length + 1
    );

    // 1. Add to donation list
    setDonations(prev => [newDonation, ...prev]);

    // 2. Update Charity Total Raised
    setCharities(prev => prev.map(c => {
      if (c.id === data.charityId) {
        return {
          ...c,
          totalRaised: c.totalRaised + data.amount,
        };
      }
      return c;
    }));

    // 3. Update Marketer Achieved & Count
    setMarketers(prev => prev.map(m => {
      if (m.id === data.marketerId) {
        return {
          ...m,
          currentMonthAchieved: m.currentMonthAchieved + data.amount,
          totalDonationsCount: m.totalDonationsCount + 1,
        };
      }
      return m;
    }));

    // 4. Update Monthly Target for this marketer for the active period
    setMonthlyTargets(prev => prev.map(t => {
      if (t.marketerId === data.marketerId && t.month === activePeriod.month && t.year === activePeriod.year) {
        const newAchieved = t.achievedAmount + data.amount;
        const newPct = calculateAchievement(newAchieved, t.targetAmount);
        const newStatus = getTargetStatus(newPct);

        return {
          ...t,
          achievedAmount: newAchieved,
          achievementPercentage: newPct,
          status: newStatus,
        };
      }
      return t;
    }));

    // 5. Update / Recalculate Payroll Record for this marketer for the active period
    setPayrollRecords(prev => prev.map(p => {
      if (p.marketerId === data.marketerId && p.month === activePeriod.month && p.year === activePeriod.year) {
        const newAchieved = p.achievedAmount + data.amount;
        const payrollCalc = calculatePayroll({
          baseSalary: p.baseSalary,
          achievedAmount: newAchieved,
          targetAmount: p.targetAmount,
          commissionRate: p.commissionRate,
          deductionsAmount: p.deductionsAmount,
        });

        return {
          ...p,
          achievedAmount: newAchieved,
          achievementPercentage: payrollCalc.achievementPercentage,
          commissionAmount: payrollCalc.commissionAmount,
          bonusAmount: payrollCalc.bonusAmount,
          netSalary: payrollCalc.netSalary,
        };
      }
      return p;
    }));

    showNotification(`تم تسجيل تبرع جديد بقيمة ${data.amount} ر.س وتحديث الإحصائيات والعمولات تلقائياً!`, 'success');
    return newDonation;
  };

  const addCharity = (charityData: Omit<Charity, 'id' | 'totalRaised' | 'activeMarketersCount'>) => {
    const newCharity: Charity = {
      ...charityData,
      id: `cht_${Date.now()}`,
      totalRaised: 0,
      activeMarketersCount: 0,
    };
    setCharities(prev => [...prev, newCharity]);
    showNotification(`تمت إضافة جمعية "${newCharity.name}" بنجاح`, 'success');
  };

  const updateCharity = (id: string, updatedFields: Partial<Charity>) => {
    setCharities(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    showNotification('تم تحديث بيانات الجمعية بنجاح', 'success');
  };

  const addMarketer = (marketerData: Omit<Marketer, 'id' | 'currentMonthAchieved' | 'totalDonationsCount'>) => {
    const newMarketer: Marketer = {
      ...marketerData,
      id: `mkt_${Date.now()}`,
      currentMonthAchieved: 0,
      totalDonationsCount: 0,
    };
    setMarketers(prev => [...prev, newMarketer]);

    const activePeriod = getActivePeriod();

    // Create target record for active period
    const newTarget: MonthlyTarget = {
      id: `tgt_${Date.now()}`,
      month: activePeriod.month,
      year: activePeriod.year,
      marketerId: newMarketer.id,
      marketerName: newMarketer.name,
      targetAmount: newMarketer.currentMonthTarget,
      achievedAmount: 0,
      achievementPercentage: 0,
      status: 'in_progress',
    };
    setMonthlyTargets(prev => [...prev, newTarget]);

    // Create draft payroll record for active period
    const initialPayroll = calculatePayroll({
      baseSalary: newMarketer.baseSalary,
      achievedAmount: 0,
      targetAmount: newMarketer.currentMonthTarget,
      commissionRate: newMarketer.commissionRate,
      deductionsAmount: 0,
    });

    const newPayroll: PayrollRecord = {
      id: `pay_${Date.now()}`,
      month: activePeriod.month,
      year: activePeriod.year,
      marketerId: newMarketer.id,
      marketerName: newMarketer.name,
      baseSalary: newMarketer.baseSalary,
      targetAmount: newMarketer.currentMonthTarget,
      achievedAmount: 0,
      achievementPercentage: initialPayroll.achievementPercentage,
      commissionRate: newMarketer.commissionRate,
      commissionAmount: initialPayroll.commissionAmount,
      bonusAmount: initialPayroll.bonusAmount,
      deductionsAmount: 0,
      netSalary: initialPayroll.netSalary,
      status: 'draft',
      notes: 'مسوق جديد تم إنشاؤه.',
    };
    setPayrollRecords(prev => [...prev, newPayroll]);

    showNotification(`تمت إضافة المسوق "${newMarketer.name}" بنجاح`, 'success');
  };

  const updateMarketer = (id: string, updatedFields: Partial<Marketer>) => {
    setMarketers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    showNotification('تم تحديث بيانات المسوق بنجاح', 'success');
  };

  const updateTarget = (targetId: string, newTargetAmount: number) => {
    setMonthlyTargets(prev => prev.map(t => {
      if (t.id === targetId) {
        const pct = calculateAchievement(t.achievedAmount, newTargetAmount);
        const status = getTargetStatus(pct);

        return {
          ...t,
          targetAmount: newTargetAmount,
          achievementPercentage: pct,
          status,
        };
      }
      return t;
    }));
    showNotification('تم تحديث المستهدف الشهري بنجاح', 'success');
  };

  const updatePayrollStatus = (payrollId: string, status: PayrollStatus) => {
    setPayrollRecords(prev => prev.map(p => {
      if (p.id === payrollId) {
        return {
          ...p,
          status,
          approvedBy: status === 'approved' || status === 'paid' ? currentUser.name : p.approvedBy,
          paidAt: status === 'paid' ? new Date().toISOString().split('T')[0] : p.paidAt,
        };
      }
      return p;
    }));
    showNotification(`تم تحديث مسير الرواتب إلى: ${status === 'paid' ? 'تم الصرف والتحويل' : status === 'approved' ? 'معتمد للصرف' : status}`, 'success');
  };

  const approveAllPayroll = (month: number, year: number) => {
    setPayrollRecords(prev => prev.map(p => {
      if (p.month === month && p.year === year && p.status !== 'paid') {
        return {
          ...p,
          status: 'approved',
          approvedBy: currentUser.name,
        };
      }
      return p;
    }));
    showNotification(`تم اعتماد مسيرات رواتب شهر ${month}/${year} بالكامل!`, 'success');
  };

  const markAllPayrollPaid = (month: number, year: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPayrollRecords(prev => prev.map(p => {
      if (p.month === month && p.year === year) {
        return {
          ...p,
          status: 'paid',
          paidAt: today,
          approvedBy: currentUser.name,
        };
      }
      return p;
    }));
    showNotification(`تم إغلاق مسير رواتب شهر ${month}/${year} وتحويل كافة المستحقات!`, 'success');
  };

  // Role Scoped Data Filtering
  const userDonations = donations.filter(d => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'marketer') return d.marketerId === currentUser.marketerId;
    if (currentUser.role === 'charity_rep') return d.charityId === currentUser.charityId;
    return true;
  });

  const userCharities = charities.filter(c => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'charity_rep') return c.id === currentUser.charityId;
    if (currentUser.role === 'marketer') {
      const marketer = marketers.find(m => m.id === currentUser.marketerId);
      return marketer ? marketer.assignedCharityIds.includes(c.id) : true;
    }
    return true;
  });

  const userTargets = monthlyTargets.filter(t => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'marketer') return t.marketerId === currentUser.marketerId;
    return true;
  });

  const userPayroll = payrollRecords.filter(p => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'marketer') return p.marketerId === currentUser.marketerId;
    return false; // Charity reps do not see sales payroll
  });

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      activeTab,
      setActiveTab,
      charities,
      marketers,
      donations,
      monthlyTargets,
      payrollRecords,
      addDonation,
      addCharity,
      updateCharity,
      addMarketer,
      updateMarketer,
      updateTarget,
      updatePayrollStatus,
      markAllPayrollPaid,
      approveAllPayroll,
      isNewDonationModalOpen,
      setIsNewDonationModalOpen,
      isAIAgentOpen,
      setIsAIAgentOpen,
      globalSearch,
      setGlobalSearch,
      notification,
      showNotification,
      userDonations,
      userCharities,
      userTargets,
      userPayroll,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
