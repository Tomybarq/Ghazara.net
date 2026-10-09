import { describe, it, expect } from 'vitest';
import { calculateTargetProgress, syncMarketerMonthlyTarget } from './goals';
import { MonthlyTarget, Donation } from '../types';

describe('Goals and Target Analysis Engine', () => {
  it('correctly calculates progress and status for in_progress target', () => {
    const result = calculateTargetProgress(100000, 50000, 15, 30);
    expect(result.achievementPercentage).toBe(50);
    expect(result.remainingAmount).toBe(50000);
    expect(result.status).toBe('in_progress');
    expect(result.paceStatus).toBe('on_track');
  });

  it('correctly flags achieved and exceeded targets', () => {
    const achieved = calculateTargetProgress(100000, 100000, 20, 30);
    expect(achieved.status).toBe('achieved');
    expect(achieved.isCompleted).toBe(true);

    const exceeded = calculateTargetProgress(100000, 120000, 25, 30);
    expect(exceeded.status).toBe('exceeded');
    expect(exceeded.isOverAchieved).toBe(true);
  });

  it('flags missed target at the end of the month', () => {
    const missed = calculateTargetProgress(100000, 75000, 30, 30);
    expect(missed.status).toBe('missed');
  });

  it('synchronizes marketer monthly target from completed donations', () => {
    const baseTarget: MonthlyTarget = {
      id: 'tgt_1',
      month: 10,
      year: 2026,
      marketerId: 'mkt_1',
      marketerName: 'أحمد الغامدي',
      targetAmount: 80000,
      achievedAmount: 0,
      achievementPercentage: 0,
      status: 'in_progress',
    };

    const donations: Donation[] = [
      {
        id: 'don_1',
        receiptNumber: 'REC-001',
        charityId: 'cht_1',
        charityName: 'جمعية إنسان',
        marketerId: 'mkt_1',
        marketerName: 'أحمد الغامدي',
        amount: 30000,
        donorName: 'متبرع 1',
        donorPhone: '0501111111',
        donorType: 'individual',
        paymentMethod: 'mada',
        status: 'completed',
        date: '2026-10-05',
        time: '14:00',
      },
      {
        id: 'don_2',
        receiptNumber: 'REC-002',
        charityId: 'cht_1',
        charityName: 'جمعية إنسان',
        marketerId: 'mkt_1',
        marketerName: 'أحمد الغامدي',
        amount: 55000,
        donorName: 'متبرع 2',
        donorPhone: '0502222222',
        donorType: 'corporate',
        paymentMethod: 'bank_transfer',
        status: 'completed',
        date: '2026-10-08',
        time: '16:00',
      },
      {
        id: 'don_3',
        receiptNumber: 'REC-003',
        charityId: 'cht_1',
        charityName: 'جمعية إنسان',
        marketerId: 'mkt_2', // other marketer
        marketerName: 'سارة الشهري',
        amount: 10000,
        donorName: 'متبرع 3',
        donorPhone: '0503333333',
        donorType: 'individual',
        paymentMethod: 'apple_pay',
        status: 'completed',
        date: '2026-10-09',
        time: '10:00',
      },
      {
        id: 'don_4',
        receiptNumber: 'REC-004',
        charityId: 'cht_1',
        charityName: 'جمعية إنسان',
        marketerId: 'mkt_1',
        marketerName: 'أحمد الغامدي',
        amount: 5000,
        donorName: 'متبرع 4',
        donorPhone: '0504444444',
        donorType: 'individual',
        paymentMethod: 'mada',
        status: 'pending', // pending donation should not count
        date: '2026-10-09',
        time: '11:00',
      },
    ];

    const synced = syncMarketerMonthlyTarget(baseTarget, donations, 10, 30);
    expect(synced.achievedAmount).toBe(85000);
    expect(synced.achievementPercentage).toBe(106.25);
    expect(synced.status).toBe('exceeded');
  });
});
