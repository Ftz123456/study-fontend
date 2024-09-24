import { defineStore } from 'pinia';
import {
  DeptCreateRecord,
  DeptRecord,
  create,
  queryDeptList,
  enabled,
  remove,
  update,
} from '@/api/dept';
import { deptStore } from './type';

const useDeptStore = defineStore('dept', {
  state: (): deptStore => ({
    id: undefined,
    remark: undefined,
    createTime: undefined,
    name: undefined,
    enabled: undefined,
  }),

  getters: {
    DeptInfo(state: deptStore): deptStore {
      return { ...state };
    },
  },
  actions: {
    // 获取所有的角色列表
    async getDeptList(data: DeptRecord) {
      return queryDeptList(data);
    },

    async enabledDept(id: string) {
      return enabled(id);
    },

    async removeDept(id: string) {
      return remove(id);
    },

    async createDept(params: DeptCreateRecord) {
      return create(params);
    },

    async updateDept(params: DeptRecord) {
      return update(params);
    },
  },
});

export default useDeptStore;
