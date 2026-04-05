import type { UserRole } from '@/types/domain';

export function isAdminRole(role: UserRole): boolean {
  return role === 'admin' || role === 'super_admin';
}
