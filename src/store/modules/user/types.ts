import { RoleRecord } from '@/api/role';

export type RoleType = '' | '*' | 'admin' | 'user' | string[];
export interface UserState {
  username?: string;
  nickName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  address?: string;
  createAt?: string;
  remark?: string;
  id?: number;
  role?: RoleRecord;
  roles?: RoleRecord[];
  permissions?: string[] | '' | '*' | 'admin' | 'user'|'auditor';
  authorities?: string[]
}
