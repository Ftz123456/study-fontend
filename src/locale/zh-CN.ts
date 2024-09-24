import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import systemUser from '@/views/system/user/locale/zh-CN';
import systemRole from '@/views/system/role/locale/zh-CN';
import systemDept from '@/views/system/dept/locale/zh-CN';

import ticketManage from '@/views/ticket/manage/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'ticket.manage.system':'票据管理系统',
  'menu.dashboard': '首页',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.user': '个人中心',
  'menu.system': '系统管理',
  'menu.role': '角色中心',
  'menu.customer': '用户中心',
  'menu.ticket': '票据中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserSetting,
  ...ticketManage,
  ...systemUser,
  ...systemRole,
  ...systemDept,
};
