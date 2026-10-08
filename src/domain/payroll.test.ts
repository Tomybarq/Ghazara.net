import { describe, it, expect } from 'vitest';
import { 
  canTransitionPayroll, 
  validatePayrollTransition, 
  validateBulkApproval, 
  validateBulkPayment 
} from './payroll';
import { PayrollRecord, CurrentUser } from '../types';

const adminActor: CurrentUser = {
  id: 'u1',
  name: 'المدير',
  role: 'admin',
  email: 'admin@ghazara.sa',
  avatar: 'a.png',
};

const marketerActor: CurrentUser = {
  id: 'u2',
  name: 'المسوق',
  role: 'marketer',
  email: 'mkt@ghazara.sa',
  avatar: 'm.png',
  marketerId: 'm1',
};

const sampleRecord: PayrollRecord = {
  id: 'pay_1',
  month: 10,
  year: 2026,
  marketerId: 'm1',
  marketerName: 'أحمد الغامدي',
  baseSalary: 5000,
  targetAmount: 100000,
  achievedAmount: 85000,
  achievementPercentage: 85,
  commissionRate: 6.0,
  commissionAmount: 5100,
  bonusAmount: 0,
  deductionsAmount: 0,
  netSalary: 10100,
  status: 'draft',
};

describe('Payroll Lifecycle State Machine Domain', () => {
  describe('canTransitionPayroll', () => {
    it('should permit valid transitions', () => {
      expect(canTransitionPayroll('draft', 'reviewed')).toBe(true);
      expect(canTransitionPayroll('draft', 'approved')).toBe(true);
      expect(canTransitionPayroll('reviewed', 'approved')).toBe(true);
      expect(canTransitionPayroll('approved', 'paid')).toBe(true);
      expect(canTransitionPayroll('reviewed', 'draft')).toBe(true);
    });

    it('should reject invalid or skip transitions', () => {
      expect(canTransitionPayroll('draft', 'paid')).toBe(false);
      expect(canTransitionPayroll('paid', 'draft')).toBe(false);
      expect(canTransitionPayroll('paid', 'approved')).toBe(false);
    });
  });

  describe('validatePayrollTransition', () => {
    it('should allow admin to transition draft to approved', () => {
      const result = validatePayrollTransition(sampleRecord, 'approved', adminActor);
      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject marketer actor from updating payroll', () => {
      const result = validatePayrollTransition(sampleRecord, 'approved', marketerActor);
      expect(result.allowed).toBe(false);
      expect(result.error).toContain('غير مصرح');
    });

    it('should prevent jumping from draft to paid directly', () => {
      const result = validatePayrollTransition(sampleRecord, 'paid', adminActor);
      expect(result.allowed).toBe(false);
      expect(result.error).toContain('لا يمكن صرف المسير مباشرة من مسودة');
    });

    it('should reject any modification once marked as paid', () => {
      const paidRecord: PayrollRecord = { ...sampleRecord, status: 'paid' };
      const result = validatePayrollTransition(paidRecord, 'draft', adminActor);
      expect(result.allowed).toBe(false);
      expect(result.error).toContain('حالة نهائية');
    });
  });

  describe('validateBulkApproval and validateBulkPayment', () => {
    it('should allow bulk approval for non-paid records', () => {
      const records: PayrollRecord[] = [
        { ...sampleRecord, id: '1', status: 'draft' },
        { ...sampleRecord, id: '2', status: 'reviewed' },
      ];
      const result = validateBulkApproval(records, adminActor);
      expect(result.allowed).toBe(true);
    });

    it('should require all records to be approved before bulk payment', () => {
      const recordsWithDraft: PayrollRecord[] = [
        { ...sampleRecord, id: '1', status: 'draft' },
        { ...sampleRecord, id: '2', status: 'approved' },
      ];
      const result = validateBulkPayment(recordsWithDraft, adminActor);
      expect(result.allowed).toBe(false);
      expect(result.error).toContain('يجب اعتماد كافة مسودات الرواتب');
    });

    it('should allow bulk payment when all non-paid records are approved', () => {
      const approvedRecords: PayrollRecord[] = [
        { ...sampleRecord, id: '1', status: 'approved' },
        { ...sampleRecord, id: '2', status: 'approved' },
      ];
      const result = validateBulkPayment(approvedRecords, adminActor);
      expect(result.allowed).toBe(true);
    });
  });
});
