export type UserRole = 'admin' | 'marketer' | 'charity_rep';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  charityId?: string; // If charity_rep
  marketerId?: string; // If marketer
}

export type PaymentMethod = 
  | 'mada' 
  | 'visa' 
  | 'mastercard' 
  | 'apple_pay' 
  | 'stc_pay' 
  | 'bank_transfer' 
  | 'cash';

export type DonorType = 'individual' | 'corporate' | 'anonymous';

export type DonationStatus = 'completed' | 'pending' | 'refunded';

export interface Charity {
  id: string;
  name: string;
  shortName: string;
  code: string;
  licenseNumber: string;
  category: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  logoUrl?: string;
  totalRaised: number;
  targetAmount: number;
  activeMarketersCount: number;
  status: 'active' | 'inactive';
  commissionRate: number; // e.g. 10%
  description: string;
}

export interface Marketer {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  avatarUrl: string;
  assignedCharityIds: string[];
  baseSalary: number; // in SAR
  commissionRate: number; // in percentage e.g. 5%
  currentMonthTarget: number;
  currentMonthAchieved: number;
  totalDonationsCount: number;
  status: 'active' | 'on_leave' | 'inactive';
  joinDate: string;
  notes?: string;
}

export interface Donation {
  id: string;
  receiptNumber: string;
  charityId: string;
  charityName: string;
  marketerId: string;
  marketerName: string;
  amount: number; // SAR
  donorName: string;
  donorPhone: string;
  donorType: DonorType;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  date: string; // ISO or YYYY-MM-DD
  time: string;
  campaignName?: string;
  notes?: string;
}

export interface MonthlyTarget {
  id: string;
  month: number; // 1-12
  year: number;
  marketerId: string;
  marketerName: string;
  charityId?: string;
  charityName?: string;
  targetAmount: number;
  achievedAmount: number;
  achievementPercentage: number;
  status: 'in_progress' | 'achieved' | 'exceeded' | 'missed';
}

export type PayrollStatus = 'draft' | 'reviewed' | 'approved' | 'paid';

export interface PayrollRecord {
  id: string;
  month: number;
  year: number;
  marketerId: string;
  marketerName: string;
  baseSalary: number;
  targetAmount: number;
  achievedAmount: number;
  achievementPercentage: number;
  commissionRate: number;
  commissionAmount: number;
  bonusAmount: number;
  deductionsAmount: number;
  netSalary: number;
  status: PayrollStatus;
  approvedBy?: string;
  paidAt?: string;
  notes?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

export type ActiveTab = 
  | 'dashboard' 
  | 'donations' 
  | 'marketers' 
  | 'charities' 
  | 'targets' 
  | 'payroll' 
  | 'charity_portal'
  | 'reports';
