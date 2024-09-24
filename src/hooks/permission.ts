import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import { intersection } from 'lodash';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const userPermissions = userStore.permissions ?? '';
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.permissions ||
        route.meta?.permissions?.includes('*') ||
        intersection(route.meta?.permissions, userPermissions).length > 0
        || route.meta?.permissions?.includes(userPermissions)
      );
    },
    // TODO 不知道是干嘛的
    // findFirstPermissionRoute(_routers: any, role: string | string[] = 'admin') {
    //   const cloneRouters = [..._routers];
    //   while (cloneRouters.length) {
    //     const firstElement = cloneRouters.shift();
    //     if (
    //       firstElement?.meta?.roles?.find((el: string[]) => {
    //         return el.includes('*') || el.includes(role);
    //       })
    //     )
    //       return { name: firstElement.name };
    //     if (firstElement?.children) {
    //       cloneRouters.push(...firstElement.children);
    //     }
    //   }
    //   return null;
    // },
    // You can add any rules you want
  };
}
