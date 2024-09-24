import axios from 'axios';

export interface DeptCreateRecord {
  remark: string;
  createTime: string;
  name: string;
  enabled: string;
}

export interface DeptRecord extends DeptCreateRecord {
  id: string;
}

// 添加区域
export function create(data: DeptCreateRecord) {
  return axios.post(`/api/rest/dept`, data);
}

// 更新区域信息
export function update(data: DeptRecord) {
  return axios.patch(`/api/rest/dept/${data.id}`, data);
}

// 删除区域
export function remove(id: string) {
  return axios.delete(`/api/rest/dept/${id}`);
}

// 模糊查询获取区域列表
export function queryDeptList(data: DeptRecord) {
  return axios({
    url: '/api/rest/dept',
    method: 'get',
    params: data,
  });
}

// 获取区域列表
export function deptList() {
  return axios.get(`/api/rest/dept`);
}

// 启用状态
export function enabled(id: string) {
  return axios.patch(`/api/rest/dept/toggle/${id}`, id);
}

// export function getDeptTree(params?: Partial<DeptRecord>) {
//   return axios.get<DeptRecord[]>(`/api/dept/trees`, {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   });
// }
// export function listDepts(params?: ListParams<Partial<DeptRecord>>) {
//   return axios.get<DeptRecord[]>(`/api/dept`, {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   });
// }
// export function queryDepts(params?: ListParams<Partial<DeptRecord>>) {
//   return queryList(`/api/dept`, params);
// }
