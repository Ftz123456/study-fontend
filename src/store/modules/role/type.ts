export type RoleType = '' | '*' | 'admin' | 'user' | string[];
export interface roleState {
  id?: string;
  remark?: string;
  name?: string;
  enabled?: string;
  authorities?: string;
}
