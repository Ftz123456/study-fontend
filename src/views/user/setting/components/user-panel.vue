<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-upload
        :custom-request="Onchange"
        list-type="picture-card"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        @change="Onchange"
      >
        <template #upload-button>
          <a-avatar :size="100" class="info-avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <img
              v-if="userStore.avatar"
              :src="'/api/rest/attachment/' + userStore.avatar"
              alt=""
            />
            <img v-else :src="userIcon" alt="" />
          </a-avatar>
        </template>
      </a-upload>
      <a-descriptions
        :data="renderData"
        :column="2"
        align="right"
        layout="inline-horizontal"
        :label-style="{
          width: '140px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <template #label="{ label }">{{ $t(label) }} :</template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import type {
  FileItem,
  RequestOption,
} from '@arco-design/web-vue/es/upload/interfaces';
import { useUserStore, useTicketStore } from '@/store';
import { userUploadApi } from '@/api/user-center';
import userIcon from '@/assets/images/user-circle.png';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import dayjs from 'dayjs';
import { Message } from '@arco-design/web-vue';
import { selfUpdate } from '@/api/user';

const userStore = useUserStore();
const { t } = useI18n();
const ticketStore = useTicketStore();

const file = {
  uid: '-2',
  name: 'avatar.png',
  url: userStore.avatar ? userStore.avatar : userIcon,
};
const renderData = [
  {
    label: 'userSetting.label.name',
    value: userStore.username,
  },
  {
    label: 'userSetting.label.accountId',
    value: userStore.id,
  },
  {
    label: 'userSetting.label.phone',
    value: userStore.phone,
  },
  {
    label: 'userSetting.label.registrationDate',
    value: dayjs(userStore.createAt).format('YYYY-MM-DD hh:mm:ss'),
  },
] as DescData[];

const fileList = ref<FileItem[]>([file]);

const Onchange = async (option: any) => {
  const FormDatas = new FormData();
  FormDatas.append('file', option.fileItem.file);
  const res = await ticketStore.uploadFile(FormDatas);
  if (res.status === 200) {
    Message.success({
      content: t('upload.sucess'),
      duration: 3 * 1000,
    });
    res.data.name = res.data.fileName;
    fileList.value.push(res.data);
    const data = await selfUpdate({ avatar: res.data.id });
    await userStore.info();
  } else {
    Message.error({
      content: t('upload.fail'),
      duration: 3 * 1000,
    });
  }
};

// const customRequest = (options: RequestOption) => {
//   // docs: https://axios-http.com/docs/cancellation
//   const controller = new AbortController();

//   (async function requestWrap() {
//     const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;
//     onProgress(20);
//     const formData = new FormData();
//     formData.append(name as string, fileItem.file as Blob);
//     const onUploadProgress = (event: ProgressEvent) => {
//       let percent;
//       if (event.total > 0) {
//         percent = (event.loaded / event.total) * 100;
//       }
//       onProgress(parseInt(String(percent), 10), event);
//     };

//     try {
//       // https://github.com/axios/axios/issues/1630
//       // https://github.com/nuysoft/Mock/issues/127

//       const res = await userUploadApi(formData, {
//         controller,
//         onUploadProgress,
//       });
//       onSuccess(res);
//     } catch (error) {
//       onError(error);
//     }
//   })();
//   return {
//     abort() {
//       controller.abort();
//     },
//   };
// };
</script>

<style scoped lang="less">
.arco-card {
  padding: 14px 0 4px 4px;
  border-radius: 4px;
}
:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;
  .arco-icon-camera {
    margin-top: 8px;
    color: rgb(var(--arcoblue-6));
    font-size: 14px;
  }
}
</style>
