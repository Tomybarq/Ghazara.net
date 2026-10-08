import { PayrollRecord, PayrollStatus, CurrentUser } from '../types';

export interface TransitionValidationResult {
  allowed: boolean;
  error?: string;
}

/**
 * Valid state transitions table for payroll lifecycle:
 * draft -> reviewed, approved
 * reviewed -> draft, approved
 * approved -> reviewed, paid
 * paid -> (terminal, no transitions)
 */
const ALLOWED_TRANSITIONS: Record<PayrollStatus, PayrollStatus[]> = {
  draft: ['reviewed', 'approved'],
  reviewed: ['draft', 'approved'],
  approved: ['reviewed', 'paid'],
  paid: [],
};

/**
 * Checks whether a lifecycle transition from one status to another is mathematically and logically valid.
 */
export function canTransitionPayroll(from: PayrollStatus, to: PayrollStatus): boolean {
  if (from === to) return true;
  const allowedNext = ALLOWED_TRANSITIONS[from];
  return allowedNext ? allowedNext.includes(to) : false;
}

/**
 * Validates a requested payroll state transition against state machine rules and actor permissions.
 */
export function validatePayrollTransition(
  record: PayrollRecord,
  targetStatus: PayrollStatus,
  actor: CurrentUser
): TransitionValidationResult {
  // 1. Check actor permissions (only admins manage payroll lifecycle)
  if (actor.role !== 'admin') {
    return {
      allowed: false,
      error: 'غير مصرح: إدارة واعتماد مسير الرواتب مقتصرة على الإدارة فقط',
    };
  }

  // 2. Check if already in requested state
  if (record.status === targetStatus) {
    return { allowed: true };
  }

  // 3. Paid records cannot be reverted or changed
  if (record.status === 'paid') {
    return {
      allowed: false,
      error: 'لا يمكن تعديل مسير تم صرفه وتحويله مسبقاً (حالة نهائية)',
    };
  }

  // 4. Cannot skip directly from draft to paid without review/approval
  if (record.status === 'draft' && targetStatus === 'paid') {
    return {
      allowed: false,
      error: 'لا يمكن صرف المسير مباشرة من مسودة دون اعتماده أولاً',
    };
  }

  // 5. General state transition check
  if (!canTransitionPayroll(record.status, targetStatus)) {
    return {
      allowed: false,
      error: `انتقال غير صالح في دورة الرواتب من (${record.status}) إلى (${targetStatus})`,
    };
  }

  return { allowed: true };
}

/**
 * Validates bulk approval of monthly payroll.
 */
export function validateBulkApproval(
  records: PayrollRecord[],
  actor: CurrentUser
): TransitionValidationResult {
  if (actor.role !== 'admin') {
    return {
      allowed: false,
      error: 'غير مصرح: اعتماد الرواتب مقتصر على الإدارة فقط',
    };
  }

  const actionableRecords = records.filter(r => r.status !== 'paid');
  if (actionableRecords.length === 0) {
    return {
      allowed: false,
      error: 'لا توجد مسيرات قابلة للاعتماد في هذه الفترة',
    };
  }

  return { allowed: true };
}

/**
 * Validates bulk payment execution for a month.
 */
export function validateBulkPayment(
  records: PayrollRecord[],
  actor: CurrentUser
): TransitionValidationResult {
  if (actor.role !== 'admin') {
    return {
      allowed: false,
      error: 'غير مصرح: صرف الرواتب مقتصر على الإدارة فقط',
    };
  }

  const unapproved = records.filter(r => r.status === 'draft');
  if (unapproved.length > 0) {
    return {
      allowed: false,
      error: 'يجب اعتماد كافة مسودات الرواتب قبل تنفيذ أمر الصرف النهائي',
    };
  }

  const unpaid = records.filter(r => r.status !== 'paid');
  if (unpaid.length === 0) {
    return {
      allowed: false,
      error: 'تم صرف جميع مسيرات هذه الفترة مسبقاً',
    };
  }

  return { allowed: true };
}
