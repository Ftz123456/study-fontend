<template>
  <a-button v-if="props.isCreate" type="primary" @click="handleClick">
    <template #icon><icon-plus /></template>
    {{ t('create') }}
  </a-button>
  <a-button
    v-if="!props.isCreate"
    type="outline"
    size="small"
    :style="{ marginRight: '10px', padding: '7px' }"
    @click="handleClick"
  >
    <template #icon><icon-edit /></template>
    {{ t('edit') }}
  </a-button>
  <a-modal
    width="700px"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template #title>{{ modalTitle }}</template>
    <a-form ref="createEditRef" :model="formData" :style="{ width: '650px' }">
      <a-form-item
        field="name"
        :label="$t('role.info.name')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('role.info.name.required') }]"
      >
        <a-input
          v-model="formData.name"
          :placeholder="$t('role.info.name.placeholder')"
        />
      </a-form-item>

      <a-form-item field="remark" :label="$t('role.info.remark')">
        <a-textarea
          v-model="formData.remark"
          :show-word-limit="true"
          :placeholder="$t('role.info.remark.placeholder')"
          style="height: 100px"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import useVisible from '@/hooks/visible';
import { computed, PropType, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { Message } from '@arco-design/web-vue';
import { RoleRecord } from '@/api/role';
import { useRoleStore } from '@/store';

const props = defineProps({
  prem: {
    type: Object as PropType<RoleRecord>,
  },
  isCreate: Boolean,
});
const { t } = useI18n();
const modalTitle = computed(() => {
  return props.isCreate ? t('createRole') : t('editRole');
});
const { visible, setVisible } = useVisible(false);
const createEditRef = ref<FormInstance>();
const roleStore = useRoleStore();
const formData = ref<RoleRecord>({
  id: '',
  name: '',
  dataScope: '',
  permissionIds: [],
  remark: '',
  authorities: [],
});

const emit = defineEmits(['refresh']);

// 组件被点击
const handleClick = () => {
  const roleId = props.prem?.id;
  // 编辑
  if (!props.isCreate && roleId) {
    roleStore
      .getRoleDetail(roleId)
      .then((res) => {
        formData.value = res.data;
      })
      .then(() => {
        setVisible(true);
      });
  } else {
    setVisible(true);
  }
};

// 提交
const handleSubmit = async () => {
  const valid = await createEditRef.value?.validate();
  if (!valid) {
    // 新增
    if (props.isCreate) {
      const res = await roleStore.createRole(formData.value);
      if (res.status === 200) {
        Message.success({
          content: t('create.sucess'),
          duration: 5 * 1000,
        });
      }
      createEditRef.value?.resetFields();
    } else {
      // 编辑
      const res = await roleStore.updateRole(formData.value);
      if (res.status === 200) {
        Message.success({
          content: t('modify.sucess'),
          duration: 5 * 1000,
        });
      }
    }
    emit('refresh');
    setVisible(false);
  }
};

// 关闭
const handleCancel = async () => {
  createEditRef.value?.resetFields();
  setVisible(false);
};
</script>

<style scoped></style>
