<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="phone"
      :label="$t('user.info.phone')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.phone.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.phone"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="email"
      :label="$t('user.info.email')"
      :rules="[
        {
          required: true,
          type: 'email',
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="nickName"
      :label="$t('user.info.nickName')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.nickname.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.nickName"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      field="address"
      :label="$t('user.info.address')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea v-model="formData.address" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/store';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { UserState } from '@/store/modules/user/types';
import { selfUpdate, getUserInfo } from '@/api/user';
import { Message } from '@arco-design/web-vue';

const userStore = useUserStore();

const formRef = ref<FormInstance>();
const formData = ref<UserState>({
  ...userStore.userInfo,
});
const validate = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    // do some thing
    // you also can use html-type to submit
    const res = await selfUpdate(formData.value);
    if (res.status === 200) {
      await userStore.info();
      Message.success({
        content: '编辑成功',
        duration: 5 * 1000,
      });
    }
  }
};
const reset = async () => {
  await formRef.value?.resetFields();
};
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 20px auto;
}
</style>
