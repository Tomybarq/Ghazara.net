import { describe, it, expect } from 'vitest';
import { generateDonationsCSV, generatePayrollCSV } from './exportUtils';
import { Donation, PayrollRecord } from '../types';

const testDonations: Donation[] = [
  {
    id: 'don_1',
    receiptNumber: 'REC-202610-0001',
    charityId: 'cht_1',
    charityName: 'جمعية إحسان لرعاية الأيتام',
    marketerId: 'mkt_1',
    marketerName: 'أحمد الغامدي',
    amount: 5000,
    donorName: 'سارة خالد',
    donorPhone: '0501234567',
    donorType: 'individual',
    paymentMethod: 'apple_pay',
    status: 'completed',
    date: '2026-10-08',
    time: '14:30',
    campaignName: 'كفالة أيتام',
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
    achievedAmount: 110000,
    achievementPercentage: 110.0,
    commissionRate: 6.0,
    commissionAmount: 6600,
    bonusAmount: 1000,
    deductionsAmount: 0,
    netSalary: 12600,
    status: 'approved',
  },
];

describe('Export Utilities Module', () => {
  it('should generate donations CSV with UTF-8 BOM and correct columns', () => {
    const csv = generateDonationsCSV(testDonations);

    // Verify UTF-8 BOM
    expect(csv.startsWith('\uFEFF')).toBe(true);
    // Verify Header
    expect(csv).toContain('رقم الإيصال');
    expect(csv).toContain('الجمعية الخيرية');
    // Verify Data
    expect(csv).toContain('"REC-202610-0001"');
    expect(csv).toContain('"جمعية إحسان لرعاية الأيتام"');
    expect(csv).toContain('5000');
  });

  it('should generate payroll CSV with UTF-8 BOM and formatted status', () => {
    const csv = generatePayrollCSV(testPayroll);

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('الشهر/السنة');
    expect(csv).toContain('صافي الراتب (ر.س)');
    expect(csv).toContain('"10/2026"');
    expect(csv).toContain('"معتمد"');
    expect(csv).toContain('12600');
  });

  it('should generate valid empty CSV when given empty arrays', () => {
    const emptyDonationsCSV = generateDonationsCSV([]);
    expect(emptyDonationsCSV.startsWith('\uFEFF')).toBe(true);
    expect(emptyDonationsCSV.split('\n')).toHaveLength(1);

    const emptyPayrollCSV = generatePayrollCSV([]);
    expect(emptyPayrollCSV.startsWith('\uFEFF')).toBe(true);
    expect(emptyPayrollCSV.split('\n')).toHaveLength(1);
  });
});
