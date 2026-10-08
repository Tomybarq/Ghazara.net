import { describe, it, expect } from 'vitest';
import {
  calculateAchievement,
  getTargetStatus,
  calculateBonus,
  calculateCommission,
  calculatePayroll,
} from './finance';

describe('Finance & Payroll Domain Module', () => {
  describe('calculateAchievement', () => {
    it('should calculate accurate percentage rounded to 1 decimal', () => {
      expect(calculateAchievement(50000, 100000)).toBe(50.0);
      expect(calculateAchievement(115450, 100000)).toBe(115.5);
      expect(calculateAchievement(33333, 100000)).toBe(33.3);
    });

    it('should handle zero or negative targets safely', () => {
      expect(calculateAchievement(5000, 0)).toBe(100);
      expect(calculateAchievement(0, 0)).toBe(0);
      expect(calculateAchievement(100, -500)).toBe(100);
    });
  });

  describe('getTargetStatus', () => {
    it('should return in_progress when percentage < 100', () => {
      expect(getTargetStatus(0)).toBe('in_progress');
      expect(getTargetStatus(99.9)).toBe('in_progress');
    });

    it('should return achieved when percentage between 100 and 109.9', () => {
      expect(getTargetStatus(100)).toBe('achieved');
      expect(getTargetStatus(109.9)).toBe('achieved');
    });

    it('should return exceeded when percentage >= 110', () => {
      expect(getTargetStatus(110)).toBe('exceeded');
      expect(getTargetStatus(150)).toBe('exceeded');
    });
  });

  describe('calculateBonus', () => {
    it('should return 0 bonus for < 100%', () => {
      expect(calculateBonus(99.9)).toBe(0);
      expect(calculateBonus(50)).toBe(0);
    });

    it('should return 1000 SAR bonus for 100% to 114.9%', () => {
      expect(calculateBonus(100)).toBe(1000);
      expect(calculateBonus(114.9)).toBe(1000);
    });

    it('should return 2000 SAR bonus for >= 115%', () => {
      expect(calculateBonus(115)).toBe(2000);
      expect(calculateBonus(130)).toBe(2000);
    });
  });

  describe('calculateCommission', () => {
    it('should compute commission rounded to 2 decimal places', () => {
      expect(calculateCommission(100000, 6.0)).toBe(6000.0);
      expect(calculateCommission(55555, 5.5)).toBe(3055.53);
      expect(calculateCommission(0, 6.0)).toBe(0);
    });
  });

  describe('calculatePayroll', () => {
    it('should calculate complete net salary accurately', () => {
      const result = calculatePayroll({
        baseSalary: 5000,
        achievedAmount: 115000,
        targetAmount: 100000,
        commissionRate: 6.0,
        deductionsAmount: 200,
      });

      // 115000 / 100000 = 115%
      expect(result.achievementPercentage).toBe(115.0);
      // 115000 * 6% = 6900
      expect(result.commissionAmount).toBe(6900);
      // 115% bonus = 2000
      expect(result.bonusAmount).toBe(2000);
      // 5000 + 6900 + 2000 - 200 = 13700
      expect(result.netSalary).toBe(13700);
    });

    it('should calculate payroll when target is not reached with no bonus', () => {
      const result = calculatePayroll({
        baseSalary: 4500,
        achievedAmount: 50000,
        targetAmount: 100000,
        commissionRate: 5.0,
        deductionsAmount: 0,
      });

      expect(result.achievementPercentage).toBe(50.0);
      expect(result.commissionAmount).toBe(2500);
      expect(result.bonusAmount).toBe(0);
      expect(result.netSalary).toBe(7000);
    });
  });
});
