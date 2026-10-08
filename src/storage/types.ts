import { AppState } from './appRepository';
import { Donation, Charity, Marketer, PayrollStatus } from '../types';

/**
 * Unified abstract interface for App Data Persistence (Supports LocalStorage, Supabase, Neon, REST).
 */
export interface IAppRepository {
  /**
   * Retrieves full app state.
   */
  getAppState(): Promise<AppState>;

  /**
   * Persists entire app state snapshot.
   */
  saveAppState(state: AppState): Promise<boolean>;

  /**
   * Appends or updates a donation record.
   */
  addDonation(donation: Donation, currentState: AppState): Promise<AppState>;

  /**
   * Adds a new charity partner.
   */
  addCharity(charity: Charity, currentState: AppState): Promise<AppState>;

  /**
   * Adds a new marketer.
   */
  addMarketer(marketer: Marketer, currentState: AppState): Promise<AppState>;

  /**
   * Updates payroll record status following lifecycle rules.
   */
  updatePayrollStatus(
    id: string, 
    newStatus: PayrollStatus, 
    approvedBy: string | undefined, 
    currentState: AppState
  ): Promise<AppState>;

  /**
   * Restores initial demo state.
   */
  resetDemoData(): Promise<AppState>;
}
