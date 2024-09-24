import axios from 'axios';

export interface TicketCreateRecord {
  title: string;
  body: string;
  money: undefined;
  type: string;
  contactEmail: string;
  companyName: string;
  attachId: [];
  auditorId: string;
  submit: boolean;
  userId: undefined;
  comment: string;
}

export interface TicketRecord extends TicketCreateRecord {
auditor: any;
createTime(createTime: any): unknown;
deptName: any;
  value: any;
  id: undefined;
  status: string
}


// 票据列表
export function queryTicket(data: any) {
  return axios({
    url: '/api/rest/bill', // 路径
    method: 'get',
    params: data, // 参数
  });
}

// 审核票据列表
export function queryAuditTicket(data: any) {
  return axios({
    url: '/api/rest/bill/audit/list', // 路径
    method: 'get',
    params: data, // 参数
  });
}

// 详情
export function getDetail(id: string) {
  return axios.get(`/api/rest/bill/${id}`);
}


// 更新票据
export function update(data: TicketRecord) {
  return axios.patch(`/api/rest/bill/${data.id}`, data);
}

// 删除票据
export function remove(id: string) {
  return axios.delete(`/api/rest/bill?id=${id}`);
}

// 添加票据
export function create(params: TicketCreateRecord) {
  return axios.post('/api/rest/bill', params);
}

// 上传附件
export function uploadFile(file: any) {
  return axios.post('/api/rest/attachment', file);
}

// 获取附件信息
export function attachment(id:string){
  return axios.get(`/api/rest/attachment/find/${id}`);
}

// 审核票据
export function audit(data: TicketRecord) {
  return axios.patch(`/api/rest/bill/audit/${data.id}`, data);
}

// 首页数据
export function home(data: any){
  return axios({
    url: '/api/rest/bill/home', // 路径
    method: 'get',
    params: data, // 参数
  });
}

// 首页统计图
export function chart(){
  return axios.get('/api/rest/bill/trend')
}