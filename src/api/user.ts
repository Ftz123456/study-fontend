import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { RoleRecord } from '@/api/role';
import { DeptRecord } from '@/api/dept';

export interface Res {
  code: number;
  data: object;
  msg: string;
}

// 登录数据
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

// 重置密码数据
export interface PasswordReSetModel {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

// 添加用户数据
export interface CreateRecord {
value: any;
code: any;
  
  username: string;
  nickName: string;
  password: string;
  phone: string;
  email: string;
  enabled: string;
  address: string;
  deptId: DeptRecord | undefined;
  roleId: string| RoleRecord | undefined;
  permissionIds: (number | undefined)[];
  authorities: string[];
}

export interface SelfRecord {
  username: string;
  name: string;
  phone: string;
  email: string;
  remark: string;
}

// 用户数据
export interface UserRecord extends CreateRecord {
  value: any;
  id: string;
  avatar: string;
  createAt: string
}

export interface UserParams extends Partial<UserRecord> {
  page: number;
  size: number;
  current: number
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface UserListRes {
  content: UserRecord[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  pageable: Pageable;
}

// 获取令牌
export function me() {
  return axios.get('/api/rest/user/me');
}

// 用户登录
export function login(data: LoginData) {
  return axios.post('/api/rest/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/rest/user/logout');
}

// 更新密码
export function resetPassword(data: PasswordReSetModel) {
  return axios.patch('/api/rest/user/self/update-password', data);
}

// 注册用户
export function register(data: CreateRecord) {
  return axios.post('/api/rest/user/register', data);
}

// 新建用户
export function create(data: CreateRecord) {
  return axios.post('/api/rest/user', data);
}

// 模糊查询用户列表
export function queryUserList(params: any) {
  return axios({
    url: '/api/rest/user',
    params,
    method: 'get',
  });
}

// 根据id查询用户信息
export function userDetail(id: string){
  return axios.get(`/api/rest/user/${id}`)
}


// 是否启用
export function enabled(id: string) {
  return axios.patch(`/api/rest/user/${id}/toggle`);
}

// 删除用户
export function remove(id: string) {
  return axios.delete(`/api/rest/user/${id}`);
}

// 更新用户信息
export function update(data: UserRecord) {
  return axios.patch<Res>(`/api/rest/user/${data.id}`, data);
}

export function selfUpdate(data: UserState) {
  return axios.patch<Res>(`/api/rest/user/self`, data);
}

// 获取个人用户信息
export function getUserInfo() {
  return axios.get<UserState>('/api/rest/user/self');
}

// 部门的审核员
export function deptAudit(id: string,roleId:string){
  return axios({
    url: `/api/rest/user/dept/${id}?roleId=${roleId}`, // 路径
    method: 'get',
  }); 
}

// 获取验证码
export function code(data: string){
  return axios.get(`/api/rest/user/send-email?email=${data}`);
}

export function switchRole(roleId: number) {
  return axios.patch<UserState>(`/api/user/self/switch-role/${roleId}`);
}

export function getUserDetail(id: number) {
  return axios.get<UserState>(`/api/user/${id}`);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

