import { 
  Charity, 
  Marketer, 
  Donation, 
  MonthlyTarget, 
  PayrollRecord, 
  CurrentUser 
} from '../types';
import { 
  initialCharities, 
  initialMarketers, 
  initialDonations, 
  initialMonthlyTargets, 
  initialPayrollRecords, 
  demoUsers 
} from '../data/mockData';

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
