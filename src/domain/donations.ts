import { Charity, Marketer, Donation, PaymentMethod, DonorType } from '../types';

export interface DonationInput {
  amount: number;
  donorName: string;
  donorPhone?: string;
  donorType: DonorType;
  charityId: string;
  charityName: string;
  marketerId: string;
  marketerName: string;
  paymentMethod: PaymentMethod;
  campaignName?: string;
  notes?: string;
}

export interface ValidationState {
  charities: Charity[];
  marketers: Marketer[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates donation inputs atomically against system data rules and entity relationships.
 */
export function validateDonationInput(
  input: Partial<DonationInput>,
  state: ValidationState
): ValidationResult {
  const errors: string[] = [];

  // 1. Validate Amount
  if (input.amount === undefined || input.amount === null || isNaN(input.amount) || input.amount <= 0) {
    errors.push('مبلغ التبرع يجب أن يكون رقماً أكبر من الصفر');
  }

  // 2. Validate Donor Name
  if (!input.donorName || input.donorName.trim() === '') {
    errors.push('اسم المتبرع مطلوب');
  }

  // 3. Validate Charity Reference
  if (!input.charityId) {
    errors.push('يجب اختيار الجمعية الخيرية');
  } else {
    const charityExists = state.charities.some(c => c.id === input.charityId);
    if (!charityExists) {
      errors.push('الجمعية الخيرية المحددة غير موجودة في النظام');
    }
  }

  // 4. Validate Marketer Reference & Assignment
  if (!input.marketerId) {
    errors.push('يجب اختيار المسوق المسؤول');
  } else {
    const marketer = state.marketers.find(m => m.id === input.marketerId);
    if (!marketer) {
      errors.push('المسوق المحدد غير مسجل في النظام');
    } else if (input.charityId && !marketer.assignedCharityIds.includes(input.charityId)) {
      errors.push('المسوق غير معين للعمل مع هذه الجمعية الخيرية');
    }
  }

  // 5. Validate Payment Method
  if (!input.paymentMethod) {
    errors.push('طريقة الدفع مطلوبة');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a collision-resistant deterministic receipt identifier.
 */
export function generateReceiptNumber(now: Date, sequence: number): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seqStr = String(sequence).padStart(4, '0');
  return `REC-${year}${month}-${seqStr}`;
}

/**
 * Prepares a full Donation record ready for persistence.
 */
export function prepareDonation(
  input: DonationInput,
  now: Date = new Date(),
  sequenceSeed: number = 1
): Donation {
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
  const receiptNumber = generateReceiptNumber(now, sequenceSeed);

  return {
    ...input,
    id: `don_${now.getTime()}_${Math.floor(Math.random() * 1000)}`,
    receiptNumber,
    date: dateStr,
    time: timeStr,
    donorPhone: input.donorPhone || '05XXXXXXXX',
    status: 'completed',
  };
}
