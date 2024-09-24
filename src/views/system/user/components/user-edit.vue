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
    <a-form ref="CreateRef" :model="formData" :style="{ width: '650px' }">
      <a-form-item
        field="username"
        :label="$t('user.info.username')"
        :validate-trigger="['change', 'input']"
        :rules="[
          { required: true, message: t('user.info.username.required') },
          {
            match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
            message: t('user.info.username.format'),
          },
        ]"
      >
        <a-input
          v-if="props.isCreate"
          v-model="formData.username"
          :placeholder="$t('user.info.username.placeholder')"
        />

        <div v-else>{{ formData.username }}</div>
      </a-form-item>
      <a-form-item
        field="email"
        :label="$t('user.info.email')"
        :rules="[
          {
            required: true,
            type: 'email',
            message: t('user.info.email.required'),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input
          v-model="formData.email"
          :placeholder="$t('user.info.email.placeholder')"
        />
      </a-form-item>
      <a-form-item
        field="phone"
        :label="$t('user.info.phone')"
        :rules="[
          { required: true, message: t('user.info.phone.required') },
          { match: /^1[3-9]\d{9}$/, message: t('user.info.phone.format') },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input
          v-model="formData.phone"
          :placeholder="$t('user.info.phone.placeholder')"
        />
      </a-form-item>
      <a-form-item
        field="password"
        :label="$t('user.info.password')"
        v-if="isCreate"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('user.info.password.required') }]"
      >
        <a-input
          v-model="formData.password"
          :placeholder="$t('user.info.password.placeholder')"
        />
      </a-form-item>
      <a-form-item field="nickName" :label="$t('user.info.nickName')">
        <a-input
          v-model="formData.nickName"
          :placeholder="$t('user.info.nickName.placeholder')"
        />
      </a-form-item>

      <a-form-item field="address" :label="$t('user.info.address')">
        <a-input
          v-model="formData.address"
          :placeholder="$t('user.info.address.placeholder')"
        />
      </a-form-item>
      <a-form-item
        field="deptId"
        :label="$t('user.info.dept')"
        :rules="[{ required: true, message: t('user.info.dept.required') }]"
        :validate-trigger="['change']"
      >
        <a-tree-select
          v-model="formData.deptId"
          :field-names="{
            key: 'id',
            title: 'name',
            children: 'children',
          }"
          :data="deptOptions"
          allow-clear
          :placeholder="$t('user.info.dept.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="roleId"
        :label="$t('user.info.role')"
        :rules="[{ required: true, message: t('user.info.dept.required') }]"
        :validate-trigger="['change']"
      >
        <a-select
          v-model="formData.roleId"
          :options="roleOptions"
          :field-names="{
            value: 'id',
            label: 'name',
          }"
          :placeholder="$t('user.info.role.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import useVisible from '@/hooks/visible';
import { computed, PropType, ref } from 'vue';
import { CreateRecord } from '@/api/user';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { queryRoleList } from '@/api/role';
import { deptList } from '@/api/dept';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

const props = defineProps({
  prem: {
    type: Object as PropType<CreateRecord>,
  },
  isCreate: Boolean,
});
const { t } = useI18n();
const modalTitle = computed(() => {
  return props.isCreate ? t('createUser') : t('editUser');
});
const { visible, setVisible } = useVisible(false);
const checkKeys = ref<number[]>([]);

const CreateRef = ref<FormInstance>();

const formData = ref<CreateRecord>({
  username: '',
  nickName: '',
  password: '',
  phone: '',
  email: '',
  enabled: '',
  address: '',
  deptId: undefined,
  roleId: undefined,
  permissionIds: [],
  authorities: [],
});

let formDifer = {};
const userStore = useUserStore();

// 部门数据
const deptOptions = ref();
const getDeptData = async () => {
  const res = await deptList();
  deptOptions.value = res.data.records;
};
// 角色数据
const roleOptions = ref();
const getRoleData = async () => {
  const res = await queryRoleList('');
  roleOptions.value = res.data.records.filter((item: any) => {
    return item.enabled !== false;
  });
};

// 组件被点击
const handleClick = () => {
  getDeptData();
  getRoleData();
  const userId = props.prem?.id;
  // 编辑
  if (!props.isCreate && userId) {
    formData.value = props.prem;
    formDifer = { ...props.prem };
  }
  setVisible(true);
};

// 做出只修改的部分
const diffDataForm = (newData: any, oldData: any) => {
  const result = {}; // 报错修改的字段内容
  Object.keys(oldData).forEach((key) => {
    if (oldData[key] !== newData[key]) {
      result[key] = newData[key];
    }
  });
  return result;
};

// 提交
const handleSubmit = async () => {
  const valid = await CreateRef.value?.validate();
  if (!valid) {
    formData.value.permissionIds = checkKeys.value;
    // 新增
    if (props.isCreate) {
      // formData.value.username = formData.value.email;
      const res = await userStore.createUser(formData.value);
      if (res.status === 200) {
        Message.success({
          content: t('create.sucess'),
          duration: 5 * 1000,
        });
      }
      CreateRef.value?.resetFields();
    } else {
      // 编辑
      formDifer = diffDataForm(formData.value, formDifer);
      if (Object.keys(formDifer).length === 0) {
        Message.success({
          content: t('unmodified'),
          duration: 3 * 1000,
        });
      } else {
        formDifer.id = formData.value.id;
        const res = await userStore.updateUser(formDifer);
        if (res.status === 200) {
          Message.success({
            content: t('modify.sucess'),
            duration: 5 * 1000,
          });
        }
      }
    }
    checkKeys.value = [];
    setVisible(false);
  }
};

// 关闭
const handleCancel = async () => {
  checkKeys.value = [];
  setVisible(false);
};
</script>

<style scoped></style>
