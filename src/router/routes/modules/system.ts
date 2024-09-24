import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    icon: 'icon-computer',
    requiresAuth: true,
    order: 2,
  },
  children: [
    // {
    //   path: 'permission',
    //   name: 'Permission',
    //   component: () => import('@/views/system/permission/index.vue'),
    //   meta: {
    //     locale: 'menu.system.permission',
    //     requiresAuth: true,
    //     permissions: ['*'],
    //   },
    // },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        permissions: ['admin'],
      },
    },
    {
      path: 'dept',
      name: 'Dept',
      component: () => import('@/views/system/dept/index.vue'),
      meta: {
        locale: 'menu.system.dept',
        requiresAuth: true,
        permissions: ['admin'],
      },
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
        requiresAuth: true,
        permissions: ['admin'],
      },
    },
  ],
};

export default SYSTEM;
