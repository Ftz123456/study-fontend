<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <!-- <a-form-item
      field="oldPassword"
      :label="$t('userSetting.passwordReset.form.label.oldPassword')"
      :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
    >
      <a-input-password
        v-model="formData.oldPassword"
        :placeholder="
          $t('userSetting.passwordReset.form.label.oldPassword.placeholder')
        "
        allow-clear
      >
      </a-input-password>
    </a-form-item> -->

    <a-form-item
      field="password"
      :label="$t('userSetting.passwordReset.form.label.newPassword')"
      :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password
        v-model="formData.password"
        :placeholder="
          $t('userSetting.passwordReset.form.label.newPassword.placeholder')
        "
        allow-clear
      >
      </a-input-password>
    </a-form-item>
    <a-form-item
      field="confirmPassword"
      :label="$t('userSetting.passwordReset.form.label.confirmPassword')"
      :rules="[{ required: true, validator: checkEquals }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password
        v-model="formData.confirmPassword"
        :placeholder="
          $t('userSetting.passwordReset.form.label.confirmPassword.placeholder')
        "
        allow-clear
      >
      </a-input-password>
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
import { useI18n } from 'vue-i18n';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { PasswordReSetModel, resetPassword } from '@/api/user';
import { Message } from '@arco-design/web-vue';
import useUser from '@/hooks/user';
import router from '@/router';
import { clearToken } from '@/utils/auth';

const { t } = useI18n();

const formRef = ref<FormInstance>();
const formData = ref<PasswordReSetModel>({
  oldPassword: '',
  password: '',
  confirmPassword: '',
});
const checkEquals = (
  value: string | undefined,
  callback: (error?: string) => void
) => {
  if (!value) {
    callback(t('userSetting.passwordReset.form.validate.blank'));
  } else if (formData.value.password !== formData.value.confirmPassword) {
    callback(t('userSetting.passwordReset.form.validate.noEquals'));
  }
};

const user = useUser();

const validate = async () => {
  const vali = await formRef.value?.validate();
  if (!vali) {
    // do some thing
    // you also can use html-type to submit

    const res = await resetPassword(formData.value);
    if (res.status === 200) {
      Message.success({
        content: t('passwordReset.sucess'),
        duration: 5 * 1000,
      });
      clearToken();
      router.push({
        name: 'login',
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
