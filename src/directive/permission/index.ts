import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';
import { intersection } from 'lodash';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { authorities } = userStore;

  if (Array.isArray(value)) {
    
    if (value.length > 0) {
      const hasPermission = intersection(value, authorities).length > 0;
      
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
