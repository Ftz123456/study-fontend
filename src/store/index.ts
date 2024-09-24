import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useRoleStore from './modules/role';
import useDeptStore from './modules/dept';
import useTicketStore from './modules/ticket';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export {
  useAppStore,
  useUserStore,
  useTabBarStore,
  useDeptStore,
  useRoleStore,
  useTicketStore,
};
export default pinia;
