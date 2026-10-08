import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  LocalStorageRepository, 
  SupabaseRepository, 
  getAppRepository, 
  getSeedState 
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

describe('Repository Factory & Implementations', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  it('should instantiate LocalStorageRepository by default', () => {
    const repo = getAppRepository();
    expect(repo).toBeDefined();
    expect(repo instanceof LocalStorageRepository).toBe(true);
  });

  it('should perform async addDonation through LocalStorageRepository', async () => {
    const repo = new LocalStorageRepository();
    const seed = getSeedState();
    
    const newDonation = {
      id: 'don_test_async',
      receiptNumber: 'REC-2026-9999',
      charityId: 'cht_1',
      charityName: 'جمعية إحسان',
      marketerId: 'mkt_1',
      marketerName: 'أحمد',
      amount: 10000,
      donorName: 'متبرع تجريبي',
      donorPhone: '050',
      donorType: 'individual' as const,
      paymentMethod: 'apple_pay' as const,
      status: 'completed' as const,
      date: '2026-10-08',
      time: '12:00',
    };

    const nextState = await repo.addDonation(newDonation, seed);
    expect(nextState.donations[0].id).toBe('don_test_async');
    expect(nextState.charities.find(c => c.id === 'cht_1')?.totalRaised).toBe(
      seed.charities.find(c => c.id === 'cht_1')!.totalRaised + 10000
    );
  });

  it('should fallback cleanly in SupabaseRepository when unconfigured', async () => {
    const cloudRepo = new SupabaseRepository();
    expect(cloudRepo.isConfigured()).toBe(false);

    const state = await cloudRepo.getAppState();
    expect(state.version).toBe(1);
    expect(state.charities.length).toBeGreaterThan(0);
  });
});
