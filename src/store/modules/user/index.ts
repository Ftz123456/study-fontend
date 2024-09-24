import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  me,
  queryUserList,
  UserParams,
  enabled,
  remove,
  create,
  register,
  UserRecord,
  update,
  userDetail,
  deptAudit,
  code
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: undefined,
    nickName: undefined,
    avatar: undefined,
    email: undefined,
    phone: undefined,
    address: undefined,
    createAt: undefined,
    remark: undefined,
    id: undefined,
    role: undefined,
    roles: undefined,
    permissions: [],
    authorities: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) { 
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    async info() {
      const res = await getUserInfo();
      res.data.user.permissions = res.data.permissions;
      res.data.user.authorities = res.data.authorities;
      this.setInfo(res.data.user); 
    },

    // Get user's crsf
    async me() {
      return me();
    },

    // Login
    async login(loginForm: LoginData, token: string) {
      try {
        setToken(token);
        const res = await userLogin(loginForm);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Get user's List
    async getUserList(data: any) {
      return queryUserList(data);
    },

    // Change user'status
    async enabledUser(id: string) {
      return enabled(id);
    },

    // Remove user
    async removeUser(id: string) {
      return remove(id);
    },

    // Create user
    async createUser(data: UserRecord) {
      return create(data);
    },

    // register user
    async registerUser(data: UserRecord) {
      return register(data);
    },

    // Update user
    async updateUser(data: UserRecord) {
      return update(data);
    },

    async getUserDetail(id: string){
      return userDetail(id);
    },

    async getDeptAudit(deptId: string,roleId: string){
      return deptAudit(deptId,roleId)
    },

    async getCode(params: string){
      return code(params)
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
  persist: true,
});

export default useUserStore;
