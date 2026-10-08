import { describe, it, expect } from 'vitest';
import { validateDonationInput, prepareDonation, generateReceiptNumber } from './donations';
import { Charity, Marketer } from '../types';

const mockCharities: Charity[] = [
  {
    id: 'cht_1',
    name: 'جمعية إحسان لرعاية الأيتام',
    shortName: 'إحسان للأيتام',
    code: 'EHSAN-01',
    licenseNumber: 'LIC-1001',
    category: 'orphans',
    city: 'الرياض',
    contactPerson: 'د. خالد التميمي',
    phone: '0112345678',
    email: 'info@ehsan-orphans.sa',
    totalRaised: 340000,
    targetAmount: 500000,
    activeMarketersCount: 3,
    status: 'active',
    commissionRate: 8.0,
    description: 'رعاية الأيتام وتعليمهم',
  },
  {
    id: 'cht_2',
    name: 'جمعية سقيا الماء',
    shortName: 'سقيا',
    code: 'SUQIA-02',
    licenseNumber: 'LIC-1002',
    category: 'water',
    city: 'جدة',
    contactPerson: 'م. فهد الزهراني',
    phone: '0123456789',
    email: 'info@suqia.sa',
    totalRaised: 180000,
    targetAmount: 300000,
    activeMarketersCount: 2,
    status: 'active',
    commissionRate: 10.0,
    description: 'حفر الآبار وتوفير مياه الشرب',
  },
];

const mockMarketers: Marketer[] = [
  {
    id: 'mkt_1',
    name: 'أحمد الغامدي',
    nationalId: '1023456789',
    email: 'ahmed@ghazara.sa',
    phone: '0501234567',
    avatarUrl: 'https://example.com/avatar1.jpg',
    baseSalary: 5000,
    currentMonthTarget: 100000,
    currentMonthAchieved: 85000,
    commissionRate: 6.0,
    assignedCharityIds: ['cht_1'], // only assigned to cht_1
    totalDonationsCount: 142,
    status: 'active',
    joinDate: '2025-01-15',
  },
];

describe('Donations Domain Module', () => {
  describe('validateDonationInput', () => {
    it('should validate successfully when all fields and assignments are correct', () => {
      const result = validateDonationInput(
        {
          amount: 500,
          donorName: 'سارة خالد',
          donorType: 'individual',
          charityId: 'cht_1',
          charityName: 'جمعية إحسان لرعاية الأيتام',
          marketerId: 'mkt_1',
          marketerName: 'أحمد الغامدي',
          paymentMethod: 'mada',
        },
        { charities: mockCharities, marketers: mockMarketers }
      );

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-positive amounts', () => {
      const result = validateDonationInput(
        {
          amount: 0,
          donorName: 'سارة خالد',
          donorType: 'individual',
          charityId: 'cht_1',
          charityName: 'جمعية إحسان لرعاية الأيتام',
          marketerId: 'mkt_1',
          marketerName: 'أحمد الغامدي',
          paymentMethod: 'mada',
        },
        { charities: mockCharities, marketers: mockMarketers }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('مبلغ التبرع يجب أن يكون رقماً أكبر من الصفر');
    });

    it('should reject missing donor name', () => {
      const result = validateDonationInput(
        {
          amount: 1000,
          donorName: '  ',
          donorType: 'individual',
          charityId: 'cht_1',
          marketerId: 'mkt_1',
          paymentMethod: 'mada',
        },
        { charities: mockCharities, marketers: mockMarketers }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('اسم المتبرع مطلوب');
    });

    it('should reject unassigned marketer-charity combinations', () => {
      const result = validateDonationInput(
        {
          amount: 500,
          donorName: 'سارة خالد',
          donorType: 'individual',
          charityId: 'cht_2', // mkt_1 is not assigned to cht_2
          charityName: 'جمعية سقيا الماء',
          marketerId: 'mkt_1',
          marketerName: 'أحمد الغامدي',
          paymentMethod: 'mada',
        },
        { charities: mockCharities, marketers: mockMarketers }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('المسوق غير معين للعمل مع هذه الجمعية الخيرية');
    });

    it('should reject unknown charity or marketer ID', () => {
      const result = validateDonationInput(
        {
          amount: 500,
          donorName: 'سارة خالد',
          donorType: 'individual',
          charityId: 'unknown_charity',
          marketerId: 'unknown_marketer',
          paymentMethod: 'mada',
        },
        { charities: mockCharities, marketers: mockMarketers }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('الجمعية الخيرية المحددة غير موجودة في النظام');
      expect(result.errors).toContain('المسوق المحدد غير مسجل في النظام');
    });
  });

  describe('generateReceiptNumber & prepareDonation', () => {
    it('should generate formatted deterministic receipt numbers', () => {
      const fixedDate = new Date('2026-10-08T12:00:00Z');
      const receipt = generateReceiptNumber(fixedDate, 42);
      expect(receipt).toBe('REC-202610-0042');
    });

    it('should prepare a complete donation entity', () => {
      const fixedDate = new Date('2026-10-08T14:25:00');
      const donation = prepareDonation(
        {
          amount: 2500,
          donorName: 'عبدالله السعد',
          donorType: 'corporate',
          charityId: 'cht_1',
          charityName: 'جمعية إحسان لرعاية الأيتام',
          marketerId: 'mkt_1',
          marketerName: 'أحمد الغامدي',
          paymentMethod: 'bank_transfer',
        },
        fixedDate,
        5
      );

      expect(donation.status).toBe('completed');
      expect(donation.receiptNumber).toBe('REC-202610-0005');
      expect(donation.date).toBe(fixedDate.toISOString().split('T')[0]);
      expect(donation.amount).toBe(2500);
      expect(donation.id).toBeDefined();
    });
  });
});
