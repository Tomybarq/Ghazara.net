import { describe, it, expect } from 'vitest';
import { 
  getVisibleDonations, 
  getVisibleCharities, 
  getVisibleMarketers, 
  getVisibleTargets, 
  getVisiblePayroll,
  canCreateDonation,
  canManageCharities,
  canManagePayroll,
  getAccessibleTabs
} from './access';
import { CurrentUser, Charity, Marketer, Donation, MonthlyTarget, PayrollRecord } from '../types';

const adminUser: CurrentUser = {
  id: 'usr_admin',
  name: 'المدير العام',
  role: 'admin',
  email: 'admin@ghazara.sa',
  avatar: 'admin.png',
};

const marketerUser: CurrentUser = {
  id: 'usr_marketer',
  name: 'أحمد الغامدي',
  role: 'marketer',
  email: 'ahmed@ghazara.sa',
  avatar: 'ahmed.png',
  marketerId: 'mkt_1',
};

const charityRepUser: CurrentUser = {
  id: 'usr_charity',
  name: 'ممثل جمعية إحسان',
  role: 'charity_rep',
  email: 'rep@ehsan.sa',
  avatar: 'rep.png',
  charityId: 'cht_1',
};

const testCharities: Charity[] = [
  {
    id: 'cht_1',
    name: 'جمعية إحسان',
    shortName: 'إحسان',
    code: 'EHS-01',
    licenseNumber: 'LIC-1',
    category: 'orphans',
    city: 'الرياض',
    contactPerson: 'خالد',
    phone: '050',
    email: 'info@ehsan.sa',
    totalRaised: 100000,
    targetAmount: 200000,
    activeMarketersCount: 1,
    status: 'active',
    commissionRate: 6.0,
    description: 'رعاية أيتام',
  },
  {
    id: 'cht_2',
    name: 'جمعية البر',
    shortName: 'البر',
    code: 'BIR-02',
    licenseNumber: 'LIC-2',
    category: 'poverty',
    city: 'مكة',
    contactPerson: 'سالم',
    phone: '055',
    email: 'info@bir.sa',
    totalRaised: 50000,
    targetAmount: 100000,
    activeMarketersCount: 1,
    status: 'active',
    commissionRate: 5.0,
    description: 'مساعدات أسر',
  },
];

const testMarketers: Marketer[] = [
  {
    id: 'mkt_1',
    name: 'أحمد الغامدي',
    nationalId: '101',
    phone: '050',
    email: 'ahmed@ghazara.sa',
    avatarUrl: 'ahmed.png',
    assignedCharityIds: ['cht_1'], // only assigned to cht_1
    baseSalary: 5000,
    commissionRate: 6.0,
    currentMonthTarget: 100000,
    currentMonthAchieved: 80000,
    totalDonationsCount: 20,
    status: 'active',
    joinDate: '2025-01-01',
  },
  {
    id: 'mkt_2',
    name: 'سارة العتيبي',
    nationalId: '102',
    phone: '055',
    email: 'sara@ghazara.sa',
    avatarUrl: 'sara.png',
    assignedCharityIds: ['cht_2'],
    baseSalary: 5000,
    commissionRate: 7.0,
    currentMonthTarget: 100000,
    currentMonthAchieved: 50000,
    totalDonationsCount: 10,
    status: 'active',
    joinDate: '2025-02-01',
  },
];

const testDonations: Donation[] = [
  {
    id: 'don_1',
    receiptNumber: 'REC-1',
    charityId: 'cht_1',
    charityName: 'جمعية إحسان',
    marketerId: 'mkt_1',
    marketerName: 'أحمد الغامدي',
    amount: 1000,
    donorName: 'متبرع 1',
    donorPhone: '050',
    donorType: 'individual',
    paymentMethod: 'apple_pay',
    status: 'completed',
    date: '2026-10-01',
    time: '12:00',
  },
  {
    id: 'don_2',
    receiptNumber: 'REC-2',
    charityId: 'cht_2',
    charityName: 'جمعية البر',
    marketerId: 'mkt_2',
    marketerName: 'سارة العتيبي',
    amount: 2000,
    donorName: 'متبرع 2',
    donorPhone: '055',
    donorType: 'corporate',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    date: '2026-10-02',
    time: '14:00',
  },
];

const testTargets: MonthlyTarget[] = [
  {
    id: 'tgt_1',
    month: 10,
    year: 2026,
    marketerId: 'mkt_1',
    marketerName: 'أحمد الغامدي',
    targetAmount: 100000,
    achievedAmount: 80000,
    achievementPercentage: 80,
    status: 'in_progress',
  },
  {
    id: 'tgt_2',
    month: 10,
    year: 2026,
    marketerId: 'mkt_2',
    marketerName: 'سارة العتيبي',
    targetAmount: 100000,
    achievedAmount: 50000,
    achievementPercentage: 50,
    status: 'in_progress',
  },
];

const testPayroll: PayrollRecord[] = [
  {
    id: 'pay_1',
    month: 10,
    year: 2026,
    marketerId: 'mkt_1',
    marketerName: 'أحمد الغامدي',
    baseSalary: 5000,
    targetAmount: 100000,
    achievedAmount: 80000,
    achievementPercentage: 80,
    commissionRate: 6.0,
    commissionAmount: 4800,
    bonusAmount: 0,
    deductionsAmount: 0,
    netSalary: 9800,
    status: 'draft',
  },
  {
    id: 'pay_2',
    month: 10,
    year: 2026,
    marketerId: 'mkt_2',
    marketerName: 'سارة العتيبي',
    baseSalary: 5000,
    targetAmount: 100000,
    achievedAmount: 50000,
    achievementPercentage: 50,
    commissionRate: 7.0,
    commissionAmount: 3500,
    bonusAmount: 0,
    deductionsAmount: 0,
    netSalary: 8500,
    status: 'draft',
  },
];

describe('Access Control & Role Isolation Domain', () => {
  describe('Admin Role', () => {
    it('should see all donations, charities, marketers, targets, and payroll', () => {
      expect(getVisibleDonations(testDonations, adminUser)).toHaveLength(2);
      expect(getVisibleCharities(testCharities, adminUser, testMarketers)).toHaveLength(2);
      expect(getVisibleMarketers(testMarketers, adminUser)).toHaveLength(2);
      expect(getVisibleTargets(testTargets, adminUser)).toHaveLength(2);
      expect(getVisiblePayroll(testPayroll, adminUser)).toHaveLength(2);
      expect(canManageCharities('admin')).toBe(true);
      expect(canManagePayroll('admin')).toBe(true);
    });
  });

  describe('Marketer Role Isolation', () => {
    it('should only see own donations and assigned charities', () => {
      const visibleDonations = getVisibleDonations(testDonations, marketerUser);
      expect(visibleDonations).toHaveLength(1);
      expect(visibleDonations[0].marketerId).toBe('mkt_1');

      const visibleCharities = getVisibleCharities(testCharities, marketerUser, testMarketers);
      expect(visibleCharities).toHaveLength(1);
      expect(visibleCharities[0].id).toBe('cht_1');
    });

    it('should only see own targets and payroll', () => {
      const visibleTargets = getVisibleTargets(testTargets, marketerUser);
      expect(visibleTargets).toHaveLength(1);
      expect(visibleTargets[0].marketerId).toBe('mkt_1');

      const visiblePayroll = getVisiblePayroll(testPayroll, marketerUser);
      expect(visiblePayroll).toHaveLength(1);
      expect(visiblePayroll[0].marketerId).toBe('mkt_1');
    });

    it('should have permission to create field donations but not manage master payroll', () => {
      expect(canCreateDonation('marketer')).toBe(true);
      expect(canManagePayroll('marketer')).toBe(false);
      expect(canManageCharities('marketer')).toBe(false);
    });
  });

  describe('Charity Representative Isolation', () => {
    it('should only see records matching own charityId', () => {
      const visibleDonations = getVisibleDonations(testDonations, charityRepUser);
      expect(visibleDonations).toHaveLength(1);
      expect(visibleDonations[0].charityId).toBe('cht_1');

      const visibleCharities = getVisibleCharities(testCharities, charityRepUser, testMarketers);
      expect(visibleCharities).toHaveLength(1);
      expect(visibleCharities[0].id).toBe('cht_1');
    });

    it('must have zero access to marketer lists, targets, and sales payroll', () => {
      expect(getVisibleMarketers(testMarketers, charityRepUser)).toHaveLength(0);
      expect(getVisibleTargets(testTargets, charityRepUser)).toHaveLength(0);
      expect(getVisiblePayroll(testPayroll, charityRepUser)).toHaveLength(0);
      expect(canManagePayroll('charity_rep')).toBe(false);
      expect(canManageCharities('charity_rep')).toBe(false);
    });
  });

  describe('Navigation Tab Filtering', () => {
    it('should return role-appropriate navigation tabs', () => {
      const adminTabs = getAccessibleTabs('admin').map(t => t.id);
      expect(adminTabs).toContain('marketers');
      expect(adminTabs).toContain('charities');
      expect(adminTabs).toContain('payroll');

      const repTabs = getAccessibleTabs('charity_rep').map(t => t.id);
      expect(repTabs).toEqual(['charity_portal', 'donations']);
      expect(repTabs).not.toContain('payroll');
      expect(repTabs).not.toContain('marketers');
    });
  });
});
