import { PaymentMethod, DonorType, DonationStatus, PayrollStatus } from '../types';

export const formatSAR = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ر.س';
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-SA').format(num);
};

export const formatPercent = (percent: number): string => {
  return percent.toFixed(1) + '%';
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const map: Record<PaymentMethod, string> = {
    mada: 'مدى (Mada)',
    visa: 'فيزا (Visa)',
    mastercard: 'ماستركارد',
    apple_pay: 'Apple Pay',
    stc_pay: 'STC Pay',
    bank_transfer: 'تحويل بنكي',
    cash: 'نقدي (كاش)',
  };
  return map[method] || method;
};

export const getDonorTypeLabel = (type: DonorType): string => {
  const map: Record<DonorType, string> = {
    individual: 'أفراد',
    corporate: 'شركات ومؤسسات',
    anonymous: 'فاعل خير (مجهول)',
  };
  return map[type] || type;
};

export const getDonationStatusLabel = (status: DonationStatus): { label: string; className: string } => {
  switch (status) {
    case 'completed':
      return { label: 'مكتمل ومعتمد', className: 'badge-emerald' };
    case 'pending':
      return { label: 'قيد المراجعة', className: 'badge-orange' };
    case 'refunded':
      return { label: 'مسترجع', className: 'badge-rose' };
    default:
      return { label: status, className: 'badge-purple' };
  }
};

export const getPayrollStatusLabel = (status: PayrollStatus): { label: string; className: string } => {
  switch (status) {
    case 'paid':
      return { label: 'تم الصرف والتحويل', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
    case 'approved':
      return { label: 'معتمد للصرف', className: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' };
    case 'reviewed':
      return { label: 'تمت المراجعة', className: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' };
    case 'draft':
    default:
      return { label: 'مسودة حسابية', className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
  }
};
