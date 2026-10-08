import { 
  CurrentUser, 
  UserRole, 
  Charity, 
  Marketer, 
  Donation, 
  MonthlyTarget, 
  PayrollRecord,
  ActiveTab
} from '../types';

export interface NavItemConfig {
  id: ActiveTab;
  label: string;
}

/**
 * Pure selector for donations visible to a specific user based on role boundaries.
 */
export function getVisibleDonations(donations: Donation[], user: CurrentUser): Donation[] {
  if (user.role === 'admin') {
    return donations;
  }
  if (user.role === 'marketer') {
    return donations.filter(d => d.marketerId === user.marketerId);
  }
  if (user.role === 'charity_rep') {
    return donations.filter(d => d.charityId === user.charityId);
  }
  return [];
}

/**
 * Pure selector for charities visible to a specific user.
 */
export function getVisibleCharities(
  charities: Charity[], 
  user: CurrentUser, 
  marketers: Marketer[] = []
): Charity[] {
  if (user.role === 'admin') {
    return charities;
  }
  if (user.role === 'charity_rep') {
    return charities.filter(c => c.id === user.charityId);
  }
  if (user.role === 'marketer') {
    const marketer = marketers.find(m => m.id === user.marketerId);
    if (!marketer) return [];
    return charities.filter(c => marketer.assignedCharityIds.includes(c.id));
  }
  return [];
}

/**
 * Pure selector for marketers visible to a specific user.
 */
export function getVisibleMarketers(marketers: Marketer[], user: CurrentUser): Marketer[] {
  if (user.role === 'admin') {
    return marketers;
  }
  if (user.role === 'marketer') {
    return marketers.filter(m => m.id === user.marketerId);
  }
  // Charity reps do not have direct access to marketers roster
  return [];
}

/**
 * Pure selector for monthly targets visible to a specific user.
 */
export function getVisibleTargets(targets: MonthlyTarget[], user: CurrentUser): MonthlyTarget[] {
  if (user.role === 'admin') {
    return targets;
  }
  if (user.role === 'marketer') {
    return targets.filter(t => t.marketerId === user.marketerId);
  }
  // Charity reps do not access sales targets
  return [];
}

/**
 * Pure selector for payroll records visible to a specific user.
 */
export function getVisiblePayroll(payroll: PayrollRecord[], user: CurrentUser): PayrollRecord[] {
  if (user.role === 'admin') {
    return payroll;
  }
  if (user.role === 'marketer') {
    return payroll.filter(p => p.marketerId === user.marketerId);
  }
  // Charity reps do not access internal payroll
  return [];
}

/**
 * Role capability permissions
 */
export function canCreateDonation(role: UserRole): boolean {
  return role === 'admin' || role === 'marketer';
}

export function canManageCharities(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageMarketers(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageTargets(role: UserRole): boolean {
  return role === 'admin';
}

export function canManagePayroll(role: UserRole): boolean {
  return role === 'admin';
}

export function canExportData(role: UserRole): boolean {
  return role === 'admin' || role === 'charity_rep' || role === 'marketer';
}

/**
 * Returns accessible navigation tabs configuration for each role.
 */
export function getAccessibleTabs(role: UserRole): NavItemConfig[] {
  if (role === 'charity_rep') {
    return [
      { id: 'charity_portal', label: 'لوحة الجمعية' },
      { id: 'donations', label: 'سجل التبرعات الواردة' },
    ];
  }

  if (role === 'marketer') {
    return [
      { id: 'dashboard', label: 'لوحة إنجازي' },
      { id: 'donations', label: 'تبرعاتي الميدانية' },
      { id: 'targets', label: 'هدفي الشهري' },
      { id: 'payroll', label: 'عمولاتي وراتبي' },
      { id: 'charities', label: 'الجمعيات المسندة لي' },
    ];
  }

  // Admin default
  return [
    { id: 'dashboard', label: 'لوحة التحكم الرئيسية' },
    { id: 'donations', label: 'إدارة التبرعات والسجلات' },
    { id: 'marketers', label: 'فريق المسوقين الميدانيين' },
    { id: 'charities', label: 'دليل الجمعيات الخيرية' },
    { id: 'targets', label: 'المستهدفات الشهرية' },
    { id: 'payroll', label: 'مسير الرواتب والعمولات' },
  ];
}
