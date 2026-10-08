import { describe, it, expect } from 'vitest';
import { generateCopilotAnswer, CopilotContext } from './copilot';
import { getSeedState } from '../storage/appRepository';

describe('Smart AI Copilot Engine', () => {
  const seed = getSeedState();

  const baseContext: CopilotContext = {
    currentUser: seed.currentUser,
    donations: seed.donations,
    charities: seed.charities,
    marketers: seed.marketers,
    targets: seed.monthlyTargets,
    payroll: seed.payrollRecords,
  };

  it('should answer total donations query with correct formatted amount', () => {
    const res = generateCopilotAnswer('كم إجمالي التبرعات المحصلة؟', baseContext);
    expect(res.text).toContain('إجمالي التبرعات');
    expect(res.text).toContain('ر.س');
    expect(res.suggestedActions?.[0].tab).toBe('donations');
  });

  it('should identify top marketer for admin role', () => {
    const res = generateCopilotAnswer('من هو أفضل مسوق هذا الشهر؟', baseContext);
    expect(res.text).toContain('المسوق الأكثر تحصيلاً');
    expect(res.text).toContain('فاطمة الشهري');
  });

  it('should restrict marketer rankings when charity_rep asks', () => {
    const charityRepContext: CopilotContext = {
      ...baseContext,
      currentUser: { id: 'u3', name: 'أ. فهد', role: 'charity_rep', charityId: 'cht_1', email: 'rep@charity.sa', avatar: 'https://images.unsplash.com/photo-1' },
    };

    const res = generateCopilotAnswer('من هو أعلى مسوق؟', charityRepContext);
    expect(res.text).toContain('مخصصة لإدارة الشركة والمسوقين');
  });

  it('should summarize monthly targets and achievement percentage', () => {
    const res = generateCopilotAnswer('ما هي نسبة تحقيق المستهدف العام؟', baseContext);
    expect(res.text).toContain('المستهدف المالي الإجمالي');
    expect(res.text).toContain('%');
    expect(res.suggestedActions?.[0].tab).toBe('targets');
  });

  it('should summarize payroll for admin and restrict for charity_rep', () => {
    const adminRes = generateCopilotAnswer('ما هو ملخص مسير الرواتب؟', baseContext);
    expect(adminRes.text).toContain('إجمالي صافي مسير الرواتب');

    const charityRepContext: CopilotContext = {
      ...baseContext,
      currentUser: { id: 'u3', name: 'أ. فهد', role: 'charity_rep', charityId: 'cht_1', email: 'rep@charity.sa', avatar: 'https://images.unsplash.com/photo-1' },
    };
    const repRes = generateCopilotAnswer('كم إجمالي الرواتب والعمولات؟', charityRepContext);
    expect(repRes.text).toContain('خاصة بالعمليات الإدارية');
  });

  it('should return helpful guidance for unrecognized queries', () => {
    const res = generateCopilotAnswer('مرحبا كيف يمكنك مساعدتي؟', baseContext);
    expect(res.text).toContain('مساعد غزارة الذكي');
    expect(res.suggestedActions?.length).toBeGreaterThan(0);
  });
});
