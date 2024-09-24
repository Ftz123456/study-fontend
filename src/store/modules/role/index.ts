import { defineStore } from 'pinia';
import {
  RoleRecord,
  RoleCreateRecord,
  queryRoleList,
  enabled,
  remove,
  create,
  update,
  getDetail,
} from '@/api/role';
import { roleState } from './type';

const useRoleStore = defineStore('role', {
  state: (): roleState => ({
    id: undefined,
    remark: undefined,
    name: undefined,
    enabled: undefined,
    authorities: undefined,
  }),

  getters: {
    RoleInfo(state: roleState): roleState {
      return { ...state };
    },
  },
  actions: {
    // 获取所有的角色列表
    async getRoleList(params: any) {
      return queryRoleList(params);
    },

    async enabledRole(id: string) {
      return enabled(id);
    },

    async removeRole(id: string) {
      return remove(id);
    },

    async createRole(params: RoleCreateRecord) {
      return create(params);
    },

    async updateRole(params: RoleRecord) {
      return update(params);
    },

    async getRoleDetail(id: string) {
      return getDetail(id);
    },
  },
});

export default useRoleStore;
