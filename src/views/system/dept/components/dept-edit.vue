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
        :label="$t('dept.info.name')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('dept.info.name.required') }]"
      >
        <a-input
          v-model="formData.name"
          :placeholder="$t('dept.info.name.placeholder')"
        />
      </a-form-item>
      <a-form-item field="remark" :label="$t('dept.info.remark')">
        <a-textarea
          v-model="formData.remark"
          :placeholder="$t('dept.info.remark.placeholder')"
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
import { Message, TreeNodeData } from '@arco-design/web-vue';
import { DeptRecord, DeptCreateRecord } from '@/api/dept';
import { useDeptStore } from '@/store';

const props = defineProps({
  dept: {
    type: Object as PropType<DeptRecord>,
  },
  isCreate: Boolean,
});
const { t } = useI18n();
const modalTitle = computed(() => {
  return props.isCreate ? t('createDept') : t('editDept');
});
const { visible, setVisible } = useVisible(false);
const deptStore = useDeptStore();
const createEditRef = ref<FormInstance>();

const formData = ref<DeptRecord>({
  id: '',
  remark: '',
  createTime: '',
  name: '',
  enabled: '',
  ...props.dept,
});

const emit = defineEmits(['refresh']);

// 组件被点击
const handleClick = () => {
  setVisible(true);
};

// 提交
const handleSubmit = async () => {
  const valid = await createEditRef.value?.validate();
  if (!valid) {
    // 新增
    if (props.isCreate) {
      const res = await deptStore.createDept(formData.value);
      if (res.status === 200) {
        Message.success({
          content: t('create.sucess'),
          duration: 5 * 1000,
        });
      }
      createEditRef.value?.resetFields();
    } else {
      // 编辑
      const res = await deptStore.updateDept(formData.value);
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
