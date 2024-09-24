import axios from 'axios';

export interface RoleCreateRecord {
  name: string;
  dataScope: string;
  permissionIds: (number | undefined)[];
  remark: string;
  authorities: (number | undefined)[];
}

// 基础信息
export interface RoleRecord extends RoleCreateRecord {
  id: string;
}

export interface RoleListRecord extends RoleRecord {
  name: string;
}

// 查询所有的角色列表、
export function queryRoleList(data: any) {
  // return axios.get('/api/rest/role',data);
  return axios({
    url: '/api/rest/role', // 路径
    method: 'get',
    params: data, // 参数
  })
}

// 切换启用状态
export function enabled(id: string) {
  return axios.patch(`/api/rest/role/${id}/toggle`);
}

// 删除
export function remove(id: string) {
  return axios.delete(`/api/rest/role/${id}`);
}

// 添加
export function create(data: RoleCreateRecord) {
  return axios.post(`/api/rest/role`, data);
}

// 更新
export function update(data: RoleRecord) {
  return axios.patch(`/api/rest/role/${data.id}`, data);
}

// 获取详情
export function getDetail(id: string) {
  return axios.get<RoleRecord>(`/api/rest/role/${id}`);
}

// export function queryRoles(params?: ListParams<Partial<RoleRecord>>) {
//   return queryList<RoleRecord>(`/api/rest/role/query`, params);
// }
