import { 
  Charity, 
  Marketer, 
  Donation, 
  MonthlyTarget, 
  PayrollRecord, 
  CurrentUser,
  PayrollStatus
} from '../types';
import { 
  initialCharities, 
  initialMarketers, 
  initialDonations, 
  initialMonthlyTargets, 
  initialPayrollRecords, 
  demoUsers 
} from '../data/mockData';
import { IAppRepository } from './types';
import { calculatePayroll, calculateAchievement, getTargetStatus } from '../domain/finance';
import { canTransitionPayroll } from '../domain/payroll';

export const APP_STORAGE_KEY = 'ghazara_app_state_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export interface AppState {
  version: number;
  currentUser: CurrentUser;
  charities: Charity[];
  marketers: Marketer[];
  donations: Donation[];
  monthlyTargets: MonthlyTarget[];
  payrollRecords: PayrollRecord[];
}

/**
 * Returns default seeded initial state for the application.
 */
export function getSeedState(): AppState {
  return {
    version: CURRENT_SCHEMA_VERSION,
    currentUser: demoUsers[0],
    charities: initialCharities,
    marketers: initialMarketers,
    donations: initialDonations,
    monthlyTargets: initialMonthlyTargets,
    payrollRecords: initialPayrollRecords,
  };
}

/**
 * Safely loads persisted app state with schema validation and error fallback.
 */
export function loadAppState(): AppState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getSeedState();
  }

  try {
    const raw = window.localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) {
      // Fallback: check legacy individual keys if present
      const legacyUser = window.localStorage.getItem('ghazara_user');
      const legacyCharities = window.localStorage.getItem('ghazara_charities');
      const legacyMarketers = window.localStorage.getItem('ghazara_marketers');
      const legacyDonations = window.localStorage.getItem('ghazara_donations');
      const legacyTargets = window.localStorage.getItem('ghazara_targets');
      const legacyPayroll = window.localStorage.getItem('ghazara_payroll');

      if (legacyUser || legacyCharities || legacyDonations) {
        const migrated: AppState = {
          version: CURRENT_SCHEMA_VERSION,
          currentUser: legacyUser ? JSON.parse(legacyUser) : demoUsers[0],
          charities: legacyCharities ? JSON.parse(legacyCharities) : initialCharities,
          marketers: legacyMarketers ? JSON.parse(legacyMarketers) : initialMarketers,
          donations: legacyDonations ? JSON.parse(legacyDonations) : initialDonations,
          monthlyTargets: legacyTargets ? JSON.parse(legacyTargets) : initialMonthlyTargets,
          payrollRecords: legacyPayroll ? JSON.parse(legacyPayroll) : initialPayrollRecords,
        };
        saveAppState(migrated);
        return migrated;
      }

      return getSeedState();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== CURRENT_SCHEMA_VERSION) {
      console.warn('Ghazara Storage: Invalid schema version or payload. Resetting to seed state.');
      return getSeedState();
    }

    return {
      version: CURRENT_SCHEMA_VERSION,
      currentUser: parsed.currentUser || demoUsers[0],
      charities: Array.isArray(parsed.charities) ? parsed.charities : initialCharities,
      marketers: Array.isArray(parsed.marketers) ? parsed.marketers : initialMarketers,
      donations: Array.isArray(parsed.donations) ? parsed.donations : initialDonations,
      monthlyTargets: Array.isArray(parsed.monthlyTargets) ? parsed.monthlyTargets : initialMonthlyTargets,
      payrollRecords: Array.isArray(parsed.payrollRecords) ? parsed.payrollRecords : initialPayrollRecords,
    };
  } catch (error) {
    console.error('Ghazara Storage: Error reading state from localStorage. Recovering with seed state.', error);
    return getSeedState();
  }
}

/**
 * Safely saves app state snapshot to localStorage.
 */
export function saveAppState(state: AppState): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const payload = JSON.stringify({
      ...state,
      version: CURRENT_SCHEMA_VERSION,
    });
    window.localStorage.setItem(APP_STORAGE_KEY, payload);
    return true;
  } catch (error) {
    console.error('Ghazara Storage: Failed to persist state to localStorage', error);
    return false;
  }
}

/**
 * Resets local storage and returns fresh seed demo data.
 */
export function resetDemoData(): AppState {
  const seed = getSeedState();
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(APP_STORAGE_KEY);
      window.localStorage.removeItem('ghazara_user');
      window.localStorage.removeItem('ghazara_charities');
      window.localStorage.removeItem('ghazara_marketers');
      window.localStorage.removeItem('ghazara_donations');
      window.localStorage.removeItem('ghazara_targets');
      window.localStorage.removeItem('ghazara_payroll');
      saveAppState(seed);
    } catch (e) {
      console.error('Ghazara Storage: Error clearing localStorage', e);
    }
  }
  return seed;
}

// ------------------------------------------------------------------------------
// Repository Implementations
// ------------------------------------------------------------------------------

/**
 * Client-Side LocalStorage Repository Implementation of IAppRepository
 */
export class LocalStorageRepository implements IAppRepository {
  async getAppState(): Promise<AppState> {
    return loadAppState();
  }

  async saveAppState(state: AppState): Promise<boolean> {
    return saveAppState(state);
  }

  async addDonation(donation: Donation, currentState: AppState): Promise<AppState> {
    const nextDonations = [donation, ...currentState.donations];
    
    // Update charity raised amount
    const nextCharities = currentState.charities.map(c => 
      c.id === donation.charityId 
        ? { ...c, totalRaised: c.totalRaised + donation.amount }
        : c
    );

    // Update marketer achieved amount
    const nextMarketers = currentState.marketers.map(m => {
      if (m.id === donation.marketerId) {
        return {
          ...m,
          currentMonthAchieved: m.currentMonthAchieved + donation.amount,
          totalDonationsCount: m.totalDonationsCount + 1,
        };
      }
      return m;
    });

    // Update targets
    const dDate = new Date(donation.date);
    const dMonth = isNaN(dDate.getTime()) ? 10 : dDate.getMonth() + 1;
    const dYear = isNaN(dDate.getTime()) ? 2026 : dDate.getFullYear();

    const nextTargets = currentState.monthlyTargets.map(t => {
      if (t.marketerId === donation.marketerId && t.month === dMonth && t.year === dYear) {
        const achieved = t.achievedAmount + donation.amount;
        const pct = calculateAchievement(achieved, t.targetAmount);
        return {
          ...t,
          achievedAmount: achieved,
          achievementPercentage: pct,
          status: getTargetStatus(pct),
        };
      }
      return t;
    });

    // Update payroll calculations
    const nextPayroll = currentState.payrollRecords.map(p => {
      if (p.marketerId === donation.marketerId && p.month === dMonth && p.year === dYear) {
        const achieved = p.achievedAmount + donation.amount;
        const pct = calculateAchievement(achieved, p.targetAmount);
        const calc = calculatePayroll({
          baseSalary: p.baseSalary,
          achievedAmount: achieved,
          targetAmount: p.targetAmount,
          commissionRate: p.commissionRate,
          deductionsAmount: p.deductionsAmount,
        });

        return {
          ...p,
          achievedAmount: achieved,
          achievementPercentage: pct,
          commissionAmount: calc.commissionAmount,
          bonusAmount: calc.bonusAmount,
          netSalary: calc.netSalary,
        };
      }
      return p;
    });

    const newState: AppState = {
      ...currentState,
      donations: nextDonations,
      charities: nextCharities,
      marketers: nextMarketers,
      monthlyTargets: nextTargets,
      payrollRecords: nextPayroll,
    };

    this.saveAppState(newState);
    return newState;
  }

  async addCharity(charity: Charity, currentState: AppState): Promise<AppState> {
    const newState: AppState = {
      ...currentState,
      charities: [charity, ...currentState.charities],
    };
    this.saveAppState(newState);
    return newState;
  }

  async addMarketer(marketer: Marketer, currentState: AppState): Promise<AppState> {
    const newState: AppState = {
      ...currentState,
      marketers: [marketer, ...currentState.marketers],
    };
    this.saveAppState(newState);
    return newState;
  }

  async updatePayrollStatus(
    id: string, 
    newStatus: PayrollStatus, 
    approvedBy: string | undefined, 
    currentState: AppState
  ): Promise<AppState> {
    const nextPayroll = currentState.payrollRecords.map(rec => {
      if (rec.id !== id) return rec;
      if (!canTransitionPayroll(rec.status, newStatus)) return rec;

      return {
        ...rec,
        status: newStatus,
        approvedBy: newStatus === 'approved' || newStatus === 'paid' ? approvedBy || 'مدير النظام' : rec.approvedBy,
        paidAt: newStatus === 'paid' ? new Date().toISOString() : rec.paidAt,
      };
    });

    const newState: AppState = {
      ...currentState,
      payrollRecords: nextPayroll,
    };
    this.saveAppState(newState);
    return newState;
  }

  async resetDemoData(): Promise<AppState> {
    return resetDemoData();
  }
}

/**
 * Cloud / Remote Database Repository Adapter (PostgreSQL / Supabase)
 * Automatically falls back to LocalStorage if offline or unconfigured.
 */
export class SupabaseRepository implements IAppRepository {
  private fallbackRepo: LocalStorageRepository;
  private supabaseUrl: string | undefined;
  private supabaseKey: string | undefined;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.fallbackRepo = new LocalStorageRepository();
  }

  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  async getAppState(): Promise<AppState> {
    if (!this.isConfigured()) {
      return this.fallbackRepo.getAppState();
    }
    // Remote fetch implementation with local fallback
    try {
      // Future: fetch from Supabase REST endpoint / client
      return this.fallbackRepo.getAppState();
    } catch {
      return this.fallbackRepo.getAppState();
    }
  }

  async saveAppState(state: AppState): Promise<boolean> {
    return this.fallbackRepo.saveAppState(state);
  }

  async addDonation(donation: Donation, currentState: AppState): Promise<AppState> {
    return this.fallbackRepo.addDonation(donation, currentState);
  }

  async addCharity(charity: Charity, currentState: AppState): Promise<AppState> {
    return this.fallbackRepo.addCharity(charity, currentState);
  }

  async addMarketer(marketer: Marketer, currentState: AppState): Promise<AppState> {
    return this.fallbackRepo.addMarketer(marketer, currentState);
  }

  async updatePayrollStatus(
    id: string, 
    newStatus: PayrollStatus, 
    approvedBy: string | undefined, 
    currentState: AppState
  ): Promise<AppState> {
    return this.fallbackRepo.updatePayrollStatus(id, newStatus, approvedBy, currentState);
  }

  async resetDemoData(): Promise<AppState> {
    return this.fallbackRepo.resetDemoData();
  }
}

/**
 * Factory that provides the active application repository instance based on environment.
 */
export function getAppRepository(): IAppRepository {
  const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env 
    ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) 
    : undefined;
  const supabaseKey = typeof import.meta !== 'undefined' && import.meta.env 
    ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) 
    : undefined;

  if (supabaseUrl && supabaseKey) {
    return new SupabaseRepository(supabaseUrl, supabaseKey);
  }

  return new LocalStorageRepository();
}
