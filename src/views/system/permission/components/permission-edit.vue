<template>
  <a-button v-if="props.isCreate" type="primary" @click="handleClick">
    <template #icon><icon-plus /></template>
    {{ modalTitle }}
  </a-button>
  <a-button
    v-if="!props.isCreate"
    type="outline"
    size="small"
    :style="{ marginRight: '10px' }"
    @click="handleClick"
  >
    {{ modalTitle }}
  </a-button>
  <a-modal
    width="600px"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template #title>{{ modalTitle }}</template>
    <a-form ref="createEditRef" :model="formData" :style="{ width: '500px' }">
      <a-form-item
        field="module"
        label="权限模块"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: '模块名称不能为空' }]"
      >
        <a-input v-model="formData.module" />
      </a-form-item>
      <a-form-item
        field="title"
        label="权限名"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: '权限名不能为空' }]"
      >
        <a-input v-model="formData.title" />
      </a-form-item>
      <a-form-item
        field="code"
        label="权限编码"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: '权限编码不能为空' }]"
      >
        <a-input v-model="formData.code" />
      </a-form-item>
      <a-form-item field="remark" label="备注">
        <a-textarea v-model="formData.remark" placeholder="权限备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import useVisible from '@/hooks/visible';
  import { computed, PropType, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { PermissionRecord, create, update } from '@/api/permission';

  const props = defineProps({
    prem: {
      type: Object as PropType<PermissionRecord>,
    },
    isCreate: Boolean,
  });

  const modalTitle = computed(() => {
    return props.isCreate ? '新增' : '编辑';
  });

  const { visible, setVisible } = useVisible(false);

  const createEditRef = ref<FormInstance>();

  const formData = ref<PermissionRecord>({
    id: undefined,
    module: '',
    title: '',
    code: '',
    remark: '',
    ...props.prem,
  });

  const emit = defineEmits(['refresh']);
  const handleClick = () => {
    setVisible(true);
  };
  const handleSubmit = async () => {
    const valid = await createEditRef.value?.validate();
    if (!valid) {
      if (props.isCreate) {
        const res = await create(formData.value);
        if (res.status === 200) {
          Message.success({
            content: `${modalTitle.value}成功`,
            duration: 5 * 1000,
          });
        }
        createEditRef.value?.resetFields();
      } else {
        const res = await update(formData.value);
        if (res.status === 200) {
          Message.success({
            content: `${modalTitle.value}成功`,
            duration: 5 * 1000,
          });
        }
      }
      emit('refresh');
      setVisible(false);
    }
  };
  const handleCancel = async () => {
    createEditRef.value?.resetFields();
    setVisible(false);
  };
</script>

<style scoped></style>
