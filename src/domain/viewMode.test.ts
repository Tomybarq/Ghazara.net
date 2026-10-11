import { describe, it, expect } from 'vitest';
import { ViewMode, UserRole } from '../types';
import { demoUsers } from '../data/mockData';

describe('Landing & Authentication View Domain Tests', () => {
  it('should support all standard view modes', () => {
    const validModes: ViewMode[] = ['landing', 'login', 'platform'];
    expect(validModes).toContain('landing');
    expect(validModes).toContain('login');
    expect(validModes).toContain('platform');
    expect(validModes.length).toBe(3);
  });

  it('should have valid demo credentials mapped for all three system roles', () => {
    const roles: UserRole[] = ['admin', 'marketer', 'charity_rep'];

    roles.forEach(role => {
      const user = demoUsers.find(u => u.role === role);
      expect(user).toBeDefined();
      expect(user?.email).toBeTruthy();
      expect(user?.name).toBeTruthy();
      expect(user?.avatar).toBeTruthy();
    });
  });

  it('should assign correct context IDs for marketer and charity_rep demo users', () => {
    const adminUser = demoUsers.find(u => u.role === 'admin');
    const marketerUser = demoUsers.find(u => u.role === 'marketer');
    const charityRepUser = demoUsers.find(u => u.role === 'charity_rep');

    expect(adminUser?.role).toBe('admin');
    expect(marketerUser?.marketerId).toBe('mkt_1');
    expect(charityRepUser?.charityId).toBe('cht_1');
  });
});
