import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TICKET: AppRouteRecordRaw = {
  path: '/ticket',
  name: 'ticket',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.ticket',
    icon: 'icon-folder-add',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: 'manage',
      name: 'TicketManage',
      component: () => import('@/views/ticket/manage/index.vue'),
      meta: {
        locale: 'menu.ticket.manage',
        requiresAuth: true,
        permissions: ['*'],
      },
    },
    // {
    //   path: 'form',
    //   name: 'TicketForm',
    //   component: () => import('@/views/ticket/form/index.vue'),
    //   meta: {
    //     locale: 'menu.ticket.form',
    //     requiresAuth: true,
    //     permissions: ['*'],
    //   },
    // },
  ],
};

export default TICKET;
