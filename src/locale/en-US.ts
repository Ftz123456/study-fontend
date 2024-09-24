import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserSetting from '@/views/user/setting/locale/en-US';

import systemUser from '@/views/system/user/locale/en-US';
import systemRole from '@/views/system/role/locale/en-US';
import systemDept from '@/views/system/dept/locale/en-US';

import ticketManage from '@/views/ticket/manage/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'ticket.manage.system':'Ticket Manage System',
  'menu.dashboard': 'Home',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.user': 'User Center',
  'menu.system': 'System',
  'menu.role': 'Role',
  'menu.customer': 'Customer',
  'menu.ticket': 'Ticket',
  'navbar.action.locale': 'Switch to English',
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
