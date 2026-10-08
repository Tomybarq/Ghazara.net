import { Donation, Charity, Marketer, MonthlyTarget, PayrollRecord, CurrentUser, ActiveTab } from '../types';
import { formatSAR, formatPercent } from '../utils/formatters';

export interface CopilotContext {
  currentUser: CurrentUser;
  donations: Donation[];
  charities: Charity[];
  marketers: Marketer[];
  targets: MonthlyTarget[];
  payroll: PayrollRecord[];
}

export interface CopilotResponse {
  text: string;
  suggestedActions?: { label: string; tab?: ActiveTab }[];
}

/**
 * Generates structured Arabic responses for user queries based on current role-scoped data.
 */
export function generateCopilotAnswer(query: string, context: CopilotContext): CopilotResponse {
  const normalized = query.trim().toLowerCase();
  const { currentUser, donations, charities, marketers, targets, payroll } = context;

  // Total collected funds query
  if (
    normalized.includes('إجمالي التبرعات') ||
    normalized.includes('كم جمعنا') ||
    normalized.includes('كم المبالغ') ||
    normalized.includes('الحصيلة') ||
    normalized.includes('مجموع التبرعات')
  ) {
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    const count = donations.length;
    return {
      text: `إجمالي التبرعات المسجلة في نطاق صلاحياتك الحالية هو **${formatSAR(total)}** عبر **${count}** عملية تبرع موثقة.`,
      suggestedActions: [{ label: 'عرض سجل التبرعات', tab: 'donations' }],
    };
  }

  // Top performing marketer query
  if (
    normalized.includes('أفضل مسوق') ||
    normalized.includes('أعلى مسوق') ||
    normalized.includes('المتميز') ||
    normalized.includes('ترتيب المسوقين') ||
    normalized.includes('المتصدر')
  ) {
    if (currentUser.role === 'charity_rep') {
      return {
        text: 'بيانات أداء المسوقين الداخلية مخصصة لإدارة الشركة والمسوقين ولا يمكن عرضها لحساب ممثل الجمعية.',
      };
    }

    if (marketers.length === 0) {
      return { text: 'لا يوجد مسوقون مسجلون حالياً في النظام.' };
    }

    // Rank marketers by total donations
    const marketerTotals = marketers.map(m => {
      const raised = donations.filter(d => d.marketerId === m.id).reduce((s, d) => s + d.amount, 0);
      const target = targets.find(t => t.marketerId === m.id);
      const targetAmount = target?.targetAmount || m.currentMonthTarget || 1;
      const pct = (raised / targetAmount) * 100;
      return { marketer: m, raised, pct };
    }).sort((a, b) => b.raised - a.raised);

    const top = marketerTotals[0];
    return {
      text: `المسوق الأكثر تحصيلاً حالياً هو **${top.marketer.name}** بإجمالي تحصيل **${formatSAR(top.raised)}** (نسبة إنجاز **${formatPercent(top.pct)}** من المستهدف).`,
      suggestedActions: [{ label: 'عرض دليل المسوقين', tab: 'marketers' }],
    };
  }

  // Targets and achievement summary
  if (
    normalized.includes('المستهدف') ||
    normalized.includes('نسبة الإنجاز') ||
    normalized.includes('الهدف') ||
    normalized.includes('تحقيق الهدف')
  ) {
    const totalTarget = targets.reduce((sum, t) => sum + t.targetAmount, 0);
    const totalAchieved = targets.reduce((sum, t) => sum + t.achievedAmount, 0);
    const overallPct = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

    return {
      text: `المستهدف المالي الإجمالي هو **${formatSAR(totalTarget)}**، تم تحقيق **${formatSAR(totalAchieved)}** بنسبة إنجاز بلغت **${formatPercent(overallPct)}**.`,
      suggestedActions: [{ label: 'متابعة الأهداف الشهرية', tab: 'targets' }],
    };
  }

  // Payroll summary
  if (
    normalized.includes('الرواتب') ||
    normalized.includes('مسير') ||
    normalized.includes('المسير') ||
    normalized.includes('العمولات') ||
    normalized.includes('مستحقات')
  ) {
    if (currentUser.role === 'charity_rep') {
      return {
        text: 'بيانات مسير الرواتب والعمولات خاصة بالعمليات الإدارية لشركة غزارة ولا تتاح لممثلي الجمعيات.',
      };
    }

    const totalNet = payroll.reduce((sum, p) => sum + p.netSalary, 0);
    const pendingCount = payroll.filter(p => p.status !== 'paid').length;
    const paidCount = payroll.filter(p => p.status === 'paid').length;

    return {
      text: `إجمالي صافي مسير الرواتب والعمولات هو **${formatSAR(totalNet)}**. عدد السجلات المصروفة: **${paidCount}**، والسجلات قيد المعالجة/الاعتماد: **${pendingCount}**.`,
      suggestedActions: [{ label: 'فتح مسير الرواتب', tab: 'payroll' }],
    };
  }

  // Charities summary
  if (
    normalized.includes('الجمعيات') ||
    normalized.includes('جمعية') ||
    normalized.includes('الشركاء')
  ) {
    if (currentUser.role === 'marketer') {
      return {
        text: `لديك صلاحية لتسجيل التبرعات لصالح الجمعيات الشريكة المعتمدة. يمكنك الاطلاع على الحملات من خلال نموذج إضافة تبرع جديد.`,
        suggestedActions: [{ label: 'تسجيل تبرع جديد', tab: 'donations' }],
      };
    }

    const count = charities.length;
    return {
      text: `يوجد حالياً **${count}** جمعيات خيرية شريكة معتمدة ومرخصة في النظام.`,
      suggestedActions: [{ label: 'دليل الجمعيات', tab: 'charities' }],
    };
  }

  // Default intelligent assistant welcome / help response
  return {
    text: `أهلاً بك **${currentUser.name}**. أنا مساعد غزارة الذكي لمتابعة عمليات التسويق والتبرعات. يمكنك سؤالي عن:
• **إجمالي التبرعات والتحصيل**
• **أفضل المسوقين ونسب الإنجاز**
• **ملخص الأهداف الشهرية**
• **حالة مسير الرواتب والعمولات المستحقة**`,
    suggestedActions: [
      { label: 'إجمالي التبرعات', tab: 'donations' },
      { label: 'الأهداف الشهرية', tab: 'targets' },
    ],
  };
}
