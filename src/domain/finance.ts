import { MonthlyTarget, PayrollRecord } from '../types';

export interface PayrollCalculationInput {
  baseSalary: number;
  achievedAmount: number;
  targetAmount: number;
  commissionRate: number;
  deductionsAmount?: number;
}

export type PayrollCalculationResult = Pick<
  PayrollRecord,
  'achievementPercentage' | 'commissionAmount' | 'bonusAmount' | 'netSalary'
>;

/**
 * Calculates achievement percentage rounded to one decimal place.
 * Safely handles zero and negative targets.
 */
export function calculateAchievement(achieved: number, target: number): number {
  if (target <= 0) {
    return achieved > 0 ? 100 : 0;
  }
  const pct = (achieved / target) * 100;
  return Number(pct.toFixed(1));
}

/**
 * Determines target status based on achievement percentage:
 * - >= 110%: 'exceeded'
 * - >= 100%: 'achieved'
 * - < 100%: 'in_progress'
 */
export function getTargetStatus(percentage: number): MonthlyTarget['status'] {
  if (percentage >= 110) return 'exceeded';
  if (percentage >= 100) return 'achieved';
  return 'in_progress';
}

/**
 * Calculates achievement performance bonus:
 * - >= 115%: 2,000 SAR
 * - >= 100%: 1,000 SAR
 * - < 100%: 0 SAR
 */
export function calculateBonus(percentage: number): number {
  if (percentage >= 115) return 2000;
  if (percentage >= 100) return 1000;
  return 0;
}

/**
 * Calculates commission amount based on achieved fundraising and commission rate.
 */
export function calculateCommission(achieved: number, commissionRate: number): number {
  if (achieved <= 0 || commissionRate <= 0) return 0;
  const comm = (achieved * commissionRate) / 100;
  return Number(comm.toFixed(2));
}

/**
 * Calculates complete payroll figures (commission, bonus, and net salary).
 */
export function calculatePayroll(input: PayrollCalculationInput): PayrollCalculationResult {
  const {
    baseSalary,
    achievedAmount,
    targetAmount,
    commissionRate,
    deductionsAmount = 0,
  } = input;

  const achievementPercentage = calculateAchievement(achievedAmount, targetAmount);
  const commissionAmount = calculateCommission(achievedAmount, commissionRate);
  const bonusAmount = calculateBonus(achievementPercentage);
  const net = baseSalary + commissionAmount + bonusAmount - deductionsAmount;

  return {
    achievementPercentage,
    commissionAmount,
    bonusAmount,
    netSalary: Number(net.toFixed(2)),
  };
}
