import { defineStore } from 'pinia';
import {
  TicketRecord,
  TicketCreateRecord,
  queryTicket,
  queryAuditTicket,
  remove,
  getDetail,
  create,
  update,
  audit,
  uploadFile,
  attachment,
  home,
  chart,
} from '@/api/ticket';
import { ticketStore } from './type';

const useTicketStore = defineStore('ticket', {
  state: (): ticketStore => ({
    id: undefined,
    remark: undefined,
    createTime: undefined,
    title: undefined,
    body: undefined,
    money: undefined,
    status: undefined,
    type: undefined,
    contactEmail: undefined,
    companyName: undefined,
    userId: undefined,
    submit: undefined
  }),

  getters: {
    TicketInfo(state: ticketStore): ticketStore {
      return { ...state };
    },
  },
  actions: {
    async getTicketList(params: any) {
      return queryTicket(params);
    },

    async getAuditTicketList(params: any){
      return queryAuditTicket(params);
    },

    async getDetail(id: string) {
      return getDetail(id);
    },

    async createTicket(params: TicketCreateRecord) {
      return create(params);
    },

    async removeTicket(id: string) {
      return remove(id);
    },

    async updateTicket(data: TicketRecord) {
      return update(data);
    },

    async uploadFile(file: any) {
      return uploadFile(file);
    },

    async auditTicket(data: TicketRecord) {
      return audit(data);
    },

    async getAttachment(id: string){
      return attachment(id);
    },

    async getHome(data: any){
      return home(data);
    },

    async getChart(){
      return chart();
    },
  },
});

export default useTicketStore;
