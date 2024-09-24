<template>
  <!-- 新增 -->
  <a-button
    v-permission="['BILL_QUERY']"
    v-if="props.isCreate"
    size="small"
    type="primary"
    :style="{ border: '0px' }"
    @click="handleClick"
  >
    <template #icon><icon-plus /></template>
    {{ modalTitle }}
  </a-button>

  <!-- 修改 -->
  <a-button
    v-permission="['BILL_UPDATE']"
    v-if="!props.isCreate"
    size="small"
    type="outline"
    :style="{ marginRight: '10px', padding: '7px', border: '0px' }"
    @click="handleClick"
  >
    <template #icon><icon-edit /></template>
    {{ modalTitle }}
  </a-button>
  <a-modal
    width="700px"
    :visible="visible"
    :footer="false"
    @cancel="handleCancel"
  >
    <template #title>{{ modalTitle }}</template>
    <a-form ref="createEditRef" :model="formData" :style="{ width: '650px' }">
      <a-form-item
        field="companyName"
        :label="$t('ticket.info.companyName')"
        :validate-trigger="['change', 'input']"
        :rules="[
          { required: true, message: t('ticket.info.companyName.required') },
        ]"
        style="line-height: 18px"
      >
        <a-input
          v-model="formData.companyName"
          :placeholder="$t('ticket.info.companyName.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="title"
        :label="$t('ticket.info.title')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('ticket.info.title.required') }]"
      >
        <a-input
          v-model="formData.title"
          :placeholder="$t('ticket.info.title.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="money"
        :label="$t('ticket.info.money')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('ticket.info.money.required') }]"
      >
        <a-input
          v-model="formData.money"
          :placeholder="$t('ticket.info.money.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="contactEmail"
        :label="$t('ticket.info.contactEmail')"
        :validate-trigger="['change', 'input']"
        :rules="[
          { required: true, message: t('ticket.info.contactEmail.required') },
        ]"
      >
        <a-input
          v-model="formData.contactEmail"
          :placeholder="$t('ticket.info.contactEmail.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="type"
        :label="$t('ticket.info.type')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('ticket.info.type.required') }]"
      >
        <a-select
          v-model="formData.type"
          :options="typesOptions"
          :placeholder="$t('ticket.info.type.placeholder')"
        />
      </a-form-item>

      <a-form-item
        field="deptId"
        :label="$t('ticket.info.dept')"
        :rules="[{ required: true, message: t('ticket.info.dept.required') }]"
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
          :placeholder="$t('ticket.info.dept.placeholder')"
          @change="optionDept(true)"
        />
      </a-form-item>

      <a-form-item
        field="auditorId"
        :label="$t('ticket.info.auditor')"
        :rules="[
          { required: true, message: t('ticket.info.auditor.required') },
        ]"
        :validate-trigger="['change']"
      >
        <a-select
          v-model="formData.auditorId"
          :placeholder="$t('ticket.info.auditor.placeholder')"
        >
          <div v-for="(item, id) in auditorOptions" :key="id">
            <a-option :value="item.id">{{ item.username }} </a-option>
          </div>
        </a-select>
      </a-form-item>

      <a-form-item
        field="comment"
        :label="$t('ticket.info.comment')"
        v-if="formData.comment"
      >
        {{ formData.comment }}
      </a-form-item>

      <a-form-item
        field="body"
        :label="$t('ticket.info.body')"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: t('ticket.info.body.required') }]"
      >
        <a-textarea
          v-model="formData.body"
          :placeholder="$t('ticket.info.body.placeholder')"
          style="height: 100px"
        />
      </a-form-item>

      <a-form-item field="attachment" :label="$t('ticket.info.attachment')">
        <a-upload
          :file-list="fileList"
          :custom-request="Onchange"
          :limit="5"
          :on-before-remove="removeAttact"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="dashed" @click="handleCancel">
          {{ $t('cancel') }}</a-button
        >
        <a-button
          type="outline"
          style="margin-left: 15px"
          @click="handleStorage"
        >
          {{ $t('storage') }}</a-button
        >
        <a-button type="primary" style="margin-left: 15px" @click="handleOk">
          {{ $t('submit') }}</a-button
        >
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
import { FileItem, Message } from '@arco-design/web-vue';
import { useTicketStore, useUserStore, useRoleStore } from '@/store';
import { TicketRecord } from '@/api/ticket';
import { deptList } from '@/api/dept';

const props = defineProps({
  prem: {
    type: Object as PropType<TicketRecord>,
  },
  isCreate: Boolean,
});

const { t } = useI18n();
const ticketStore = useTicketStore();
const userStore = useUserStore();
const roleStore = useRoleStore();
const modalTitle = computed(() => {
  return props.isCreate ? t('create') : t('edit');
});
const { visible, setVisible } = useVisible(false);
const createEditRef = ref<FormInstance>();

const formData = ref<TicketRecord>({
  id: undefined,
  title: '',
  body: '',
  money: undefined,
  status: '',
  type: '',
  contactEmail: '',
  companyName: '',
  attachId: [],
  auditorId: '',
  userId: undefined,
  submit: '',
  comment: '',
});

const emit = defineEmits(['refresh']);

const deptOptions = ref();
const getDeptData = async () => {
  const res = await deptList();
  deptOptions.value = res.data.records;
};

const typesOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('bank'),
    value: '银行支票',
  },
  {
    label: t('tax'),
    value: '税务支票',
  },
  {
    label: t('other'),
    value: '其他支票',
  },
]);

let auiditRoleId = '';

// 获取审核员ID
const getRoleId = async () => {
  const res = await roleStore.getRoleList('');
  res.data.records.forEach((item: any) => {
    if (item.name === 'auditor') {
      auiditRoleId = item.id;
    }
  });
};

const auditorOptions = ref([]);

// 根据部门ID查询该部门的审核员
const optionDept = async (flag: boolean) => {
  if (flag) {
    formData.value.auditorId = undefined;
  }
  auditorOptions.value = [];
  const res = await userStore.getUserList({
    page: 1,
    size: 100,
    roleId: auiditRoleId,
    deptId: formData.value.deptId,
  });
  auditorOptions.value = res.data.records;
};

let formDifer = {};
const fileList = ref([]);
const attachList = ref([]);

// 上传附件
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
    console.log('res', res.data.id);
    attachList.value.push(res.data.id);
    formData.value.attachId = attachList;
    console.log('poti', formData.value.attachId);
  } else {
    Message.error({
      content: t('upload.fail'),
      duration: 3 * 1000,
    });
  }
};

// 删除附件
const removeAttact = (fileItem: FileItem) => {
  console.log('2', fileItem.id, fileList.value, attachList.value);
  fileList.value = fileList.value.filter((item) => item.id !== fileItem.id);
  attachList.value = attachList.value.filter((item) => item !== fileItem.id);
  console.log('3', fileList.value, attachList.value);
  formData.value.attachId = attachList.value;
  console.log('3', formData.value.attachId);
};

// 组件被点击时
const handleClick = () => {
  getRoleId();
  getDeptData();
  const ticketId = props.prem?.id;
  // 获取需要修改的数据
  if (ticketId) {
    ticketStore
      .getDetail(ticketId)
      .then(async (res) => {
        // 票据数据
        formData.value = res.data;

        formData.value.attachId.forEach(async (item: any) => {
          console.log('item,', item);
          const data = await ticketStore.getAttachment(item);
          data.data.name = data.data.fileName;
          fileList.value.push(data.data);
        });
        attachList.value = formData.value.attachId;
        // 审核员信息
        const auditInfo = await userStore.getUserDetail(
          formData.value.auditorId
        );
        formData.value.deptId = auditInfo.data.deptId;
        formDifer = { ...res.data };
      })
      .then(() => {
        optionDept(false).then(() => {
          setVisible(true);
        });
      });
  } else {
    setVisible(true);
  }
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
const handleOk = async () => {
  const valid = await createEditRef.value?.validate();
  if (!valid) {
    formData.value.submit = true;
    // 新增
    if (props.isCreate) {
      formData.value.userId = userStore.id;
      const res = await ticketStore.createTicket(formData.value);
      if (res.status === 200) {
        Message.success({
          content: t('create.sucess'),
          duration: 5 * 1000,
        });
      }
    } else {
      // 修改
      formDifer = diffDataForm(formData.value, formDifer);

      // 判断是否有进行修改
      if (Object.keys(formDifer).length === 0) {
        Message.success({
          content: t('unmodified'),
          duration: 3 * 1000,
        });
      } else {
        formDifer.id = formData.value.id;
        formDifer.submit = true;
        const res = await ticketStore.updateTicket(formDifer);
        if (res.status === 200) {
          Message.success({
            content: t('submit.sucess'),
            duration: 5 * 1000,
          });
        }
      }
    }
    createEditRef.value?.resetFields();
    attachList.value = [];
    emit('refresh');
    setVisible(false);
  }
};

// 暂存
const handleStorage = async () => {
  formData.value.submit = false;
  // 新增
  if (props.isCreate) {
    const res = await ticketStore.createTicket(formData.value);
    if (res.status === 200) {
      Message.success({
        content: t('storage.sucess'),
        duration: 5 * 1000,
      });
    }
  } else {
    // 修改
    formDifer = diffDataForm(formData.value, formDifer);
    if (Object.keys(formDifer).length === 0) {
      Message.success({
        content: t('unmodified'),
        duration: 3 * 1000,
      });
    } else {
      formDifer.id = formData.value.id;
      formDifer.submit = false;
      const res = await ticketStore.updateTicket(formDifer);
      if (res.status === 200) {
        Message.success({
          content: t('modify.sucess'),
          duration: 5 * 1000,
        });
      }
    }
  }
  createEditRef.value?.resetFields();
  attachList.value = [];
  fileList.value = [];
  emit('refresh');
  setVisible(false);
};

// 关闭
const handleCancel = async () => {
  attachList.value = [];
  fileList.value = [];
  createEditRef.value?.resetFields();
  setVisible(false);
};
</script>

<style scoped></style>

