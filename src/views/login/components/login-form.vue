<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <!--    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>-->
    <!--    <div class="login-form-sub-title">请先登录</div>-->
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <!-- <a-link>{{ $t('login.form.forgetPassword') }}</a-link> -->
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>

        <a-button
          type="text"
          long
          class="login-form-register-btn"
          @click="handleClick"
        >
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>

  <a-modal
    width="600px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>{{ modalTitle }}</template>
    <a-form ref="userCreateRef" :model="formData" :style="{ width: '500px' }">
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
          v-model="formData.username"
          :placeholder="$t('user.info.username.placeholder')"
        />
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
          :placeholder="$t('user.info.emailCode.placeholder')"
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
        field="code"
        :label="$t('user.info.code')"
        :rules="[
          {
            required: true,
            message: t('user.info.code.required'),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input
          v-model="formData.code"
          :placeholder="$t('user.info.code.placeholder')"
        />
        <a-button
          type="primary"
          style="margin-left: 50px; margin-right: 50px"
          @click="getCodeData"
          :disabled="flag"
          >发送验证码
          <div v-if="flag">({{ totalCount }}s)</div>
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import useVisible from '@/hooks/visible';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import { LoginData, CreateRecord } from '@/api/user';
import { deptList } from '@/api/dept';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const { visible, setVisible } = useVisible(false);
const userCreateRef = ref<FormInstance>();
const modalTitle = t('create.user');
const formData = ref<CreateRecord>({
  username: '',
  nickName: '',
  password: '',
  phone: '',
  email: '@qq.com',
  enabled: 'true',
  address: '',
  deptId: 235,
  roleId: undefined,
  permissionIds: [],
  authorities: [],
  code: '',
});

const flag = ref(false);
const totalCount = ref(60);
const deptOptions = ref();
const getDeptData = async () => {
  const res = await deptList();
  deptOptions.value = res.data.records;
};

const loginConfig = useStorage('login-config', {
  // 使用 useStorage 创建一个响应式变量，存储登录相关配置
  rememberPassword: true,
  username: '', // 演示默认值
  password: '', // demo default value
});

const userInfo = reactive({
  // 创建一个响应式对象，反映 loginConfig 中的 username 和 password
  username: loginConfig.value.username,
  password: loginConfig.value.password,
});

// 登录
const handleSubmit = async ({
  // 处理表单提交的异步函数
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  // 如果正在加载中，提前返回
  if (loading.value) return;

  // 如果没有表单验证错误
  if (!errors) {
    setLoading(true);

    try {
      const res = await userStore.me();
      await userStore.login(values as LoginData, res.data.csrf.token);
      const csrf = await userStore.me();
      await userStore.info();
      // 获取路由信息，处理重定向
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: 'Workplace',
        query: {
          ...othersQuery,
        },
      });

      // 显示登录成功的消息
      Message.success(t('login.form.login.success'));
      const { rememberPassword } = loginConfig.value;
      const { username, password } = values;

      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword ? username : '';
      loginConfig.value.password = rememberPassword ? password : '';
    } catch (err) {
      // errorMessage.value = (err as Error).message;
      errorMessage.value = t('login.form.login.errMsg');
    } finally {
      setLoading(false);
    }
  }
};

// 记住密码
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};

// 打开弹窗
const handleClick = () => {
  setVisible(true);
};

// 关闭弹窗
const handleCancel = async () => {
  userCreateRef.value?.resetFields();
  setVisible(false);
};

// 获取验证码
const getCodeData = async () => {
  if (formData.value.email === '') {
    Message.error({
      content: t('user.info.email.required'),
      duration: 5 * 1000,
    });
  } else {
    const res = await userStore.getCode(formData.value.email);
    if (res.status === 200) {
      flag.value = true;
      setInterval(() => {
        if (totalCount.value !== 0) {
          totalCount.value = totalCount.value * 1 - 1;
        }
      }, 1000);
      setTimeout(() => {
        flag.value = false;
        totalCount.value = 60;
      }, 60000);
    }
  }
};

// 提交注册
const handleOk = async () => {
  const valid = await userCreateRef.value?.validate();
  if (!valid) {
    //  formData.value.username = formData.value.email;
    const res = await userStore.registerUser(formData.value);
    if (res.status === 200) {
      Message.success({
        content: t('create.sucess'),
        duration: 5 * 1000,
      });
    }
    userCreateRef.value?.resetFields();
    setVisible(false);
  }
};
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
