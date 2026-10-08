import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  loadAppState, 
  saveAppState, 
  resetDemoData, 
  getSeedState, 
  APP_STORAGE_KEY, 
  AppState 
} from './appRepository';

class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }
}

const mockLocalStorage = new LocalStorageMock();
(globalThis as unknown as { window: { localStorage: Storage } }).window = {
  localStorage: mockLocalStorage,
};

describe('App Storage Repository', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return seed state when localStorage is empty', () => {
    const state = loadAppState();
    const seed = getSeedState();

    expect(state.version).toBe(1);
    expect(state.charities).toHaveLength(seed.charities.length);
    expect(state.marketers).toHaveLength(seed.marketers.length);
    expect(state.donations).toHaveLength(seed.donations.length);
  });

  it('should persist and load valid state', () => {
    const seed = getSeedState();
    const customState: AppState = {
      ...seed,
      donations: [
        {
          id: 'custom_don_1',
          receiptNumber: 'REC-999',
          charityId: 'cht_1',
          charityName: 'جمعية إحسان',
          marketerId: 'mkt_1',
          marketerName: 'أحمد',
          amount: 5000,
          donorName: 'سلطان',
          donorPhone: '050',
          donorType: 'individual',
          paymentMethod: 'mada',
          status: 'completed',
          date: '2026-10-08',
          time: '10:00',
        },
      ],
    };

    const saved = saveAppState(customState);
    expect(saved).toBe(true);

    const loaded = loadAppState();
    expect(loaded.donations).toHaveLength(1);
    expect(loaded.donations[0].receiptNumber).toBe('REC-999');
  });

  it('should recover safely with seed state when localStorage contains malformed JSON', () => {
    mockLocalStorage.setItem(APP_STORAGE_KEY, '{ invalid_json_syntax %%%');

    const state = loadAppState();
    expect(state).toBeDefined();
    expect(state.version).toBe(1);
    expect(state.charities.length).toBeGreaterThan(0);
  });

  it('should reset demo data and clear stored state', () => {
    mockLocalStorage.setItem(APP_STORAGE_KEY, JSON.stringify({ version: 1, donations: [] }));
    const reset = resetDemoData();

    expect(reset.donations.length).toBeGreaterThan(0);
    const loadedAfterReset = loadAppState();
    expect(loadedAfterReset.donations.length).toBe(reset.donations.length);
  });
});
