/**
 * Ghazara Sales App - Goals & Target Analysis Engine
 * Evaluates target progress, pacing, forecast, and status synchronization.
 */

import { MonthlyTarget, Donation } from '../types';

export interface TargetAnalysisResult {
  targetAmount: number;
  achievedAmount: number;
  achievementPercentage: number;
  remainingAmount: number;
  status: MonthlyTarget['status'];
  isCompleted: boolean;
  isOverAchieved: boolean;
  paceStatus: 'ahead' | 'on_track' | 'behind' | 'critical';
  projectedAchievement: number;
  projectedPercentage: number;
}

/**
 * Calculates target progress and status given target amount and donations or achieved sum.
 */
export function calculateTargetProgress(
  targetAmount: number,
  achievedAmount: number,
  dayOfMonth: number = new Date().getDate(),
  daysInMonth: number = 30
): TargetAnalysisResult {
  const safeTarget = Math.max(0, targetAmount);
  const safeAchieved = Math.max(0, achievedAmount);

  const achievementPercentage =
    safeTarget > 0 ? Number(((safeAchieved / safeTarget) * 100).toFixed(2)) : 100;

  const remainingAmount = Math.max(0, safeTarget - safeAchieved);
  const isCompleted = safeAchieved >= safeTarget && safeTarget > 0;
  const isOverAchieved = achievementPercentage > 100;

  let status: MonthlyTarget['status'] = 'in_progress';
  if (isOverAchieved) {
    status = 'exceeded';
  } else if (isCompleted) {
    status = 'achieved';
  } else if (dayOfMonth >= daysInMonth && safeAchieved < safeTarget) {
    status = 'missed';
  }

  // Pacing & Projection
  const safeDays = Math.max(1, Math.min(dayOfMonth, daysInMonth));
  const dailyPace = safeAchieved / safeDays;
  const projectedAchievement = Number((dailyPace * daysInMonth).toFixed(2));
  const projectedPercentage =
    safeTarget > 0 ? Number(((projectedAchievement / safeTarget) * 100).toFixed(2)) : 100;

  const expectedPercentageAtDay = (safeDays / daysInMonth) * 100;
  let paceStatus: 'ahead' | 'on_track' | 'behind' | 'critical' = 'on_track';

  if (achievementPercentage >= expectedPercentageAtDay * 1.1) {
    paceStatus = 'ahead';
  } else if (achievementPercentage >= expectedPercentageAtDay * 0.9) {
    paceStatus = 'on_track';
  } else if (achievementPercentage >= expectedPercentageAtDay * 0.6) {
    paceStatus = 'behind';
  } else {
    paceStatus = 'critical';
  }

  return {
    targetAmount: safeTarget,
    achievedAmount: safeAchieved,
    achievementPercentage,
    remainingAmount,
    status,
    isCompleted,
    isOverAchieved,
    paceStatus,
    projectedAchievement,
    projectedPercentage,
  };
}

/**
 * Aggregates completed donations for a specific marketer in a month/year and synchronizes target status.
 */
export function syncMarketerMonthlyTarget(
  target: MonthlyTarget,
  donations: Donation[],
  currentDay: number = new Date().getDate(),
  daysInMonth: number = 30
): MonthlyTarget {
  const matchingDonations = donations.filter((d) => {
    if (d.marketerId !== target.marketerId) return false;
    if (d.status !== 'completed') return false;

    const donationDate = new Date(d.date);
    const donationMonth = donationDate.getMonth() + 1;
    const donationYear = donationDate.getFullYear();

    return donationMonth === target.month && donationYear === target.year;
  });

  const totalAchieved = matchingDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const analysis = calculateTargetProgress(target.targetAmount, totalAchieved, currentDay, daysInMonth);

  return {
    ...target,
    achievedAmount: analysis.achievedAmount,
    achievementPercentage: analysis.achievementPercentage,
    status: analysis.status,
  };
}
