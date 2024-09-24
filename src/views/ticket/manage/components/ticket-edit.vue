<template>
  <!-- 详情 -->
  <a-button
    v-permission="['BILL_QUERY']"
    v-if="props.isDetail"
    type="outline"
    size="small"
    :style="{ marginRight: '10px', padding: '7px', border: '0px' }"
    @click="handleClick"
  >
    <template #icon><icon-eye /></template>
    {{ modalTitle }}
  </a-button>

  <!-- 审核 -->
  <a-button
    v-permission="['BILL_AUDIT']"
    v-if="!props.isDetail"
    type="outline"
    size="small"
    :style="{ marginRight: '10px', padding: '7px', border: '0px' }"
    @click="handleClick"
  >
    <template #icon><icon-search /></template>
    {{ modalTitle }}
  </a-button>
  <a-modal
    width="700px"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template #title>{{ modalTitle }}</template>
    <a-form
      ref="createEditRef"
      :label-col-props="{ span: 8 }"
      :wrapper-col-props="{ span: 10 }"
      label-align="right"
      :model="formData"
      :style="{ width: '650px' }"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item
            field="title"
            :label="$t('ticket.info.title')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ formData.title }}
            </div>
          </a-form-item>
        </a-col>

        <a-col :span="12"
          ><a-form-item
            field="money"
            :label="$t('ticket.info.money')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ formData.money }}
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-item
            field="contactEmail"
            :label="$t('ticket.info.contactEmail')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ formData.contactEmail }}
            </div>
          </a-form-item></a-col
        >

        <a-col :span="12">
          <a-form-item
            field="createTime"
            :label="$t('ticket.info.createTime')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ dayjs(formData.createTime).format('YYYY-MM-DD') }}
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-item
            field="deptId"
            :label="$t('ticket.info.dept')"
            style="margin-bottom: 0px"
          >
            {{ formData.deptName }}
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <!-- 审核员 -->
          <a-form-item
            field="auditorId"
            :label="$t('ticket.info.auditor')"
            style="margin-bottom: 0px"
          >
            {{ formData.auditor }}
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-item
            field="type"
            :label="$t('ticket.info.type')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ formData.type }}
            </div>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            field="body"
            :label="$t('ticket.info.body')"
            style="margin-bottom: 0px"
          >
            <div>
              {{ formData.body }}
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 详情 -->
      <a-row v-if="props.isDetail">
        <a-col :span="12">
          <a-form-item field="status" :label="$t('ticket.info.status')">
            <div>
              {{ formData.status }}
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="comment" :label="$t('ticket.info.comment')">
            <div>{{ formData.comment || '无' }}</div>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 审核 -->
      <div v-else style="margin-left: -165px">
        <a-form-item
          field="status"
          :label="$t('ticket.info.status')"
          :disabled="props.isDetail"
          :validate-trigger="['change', 'input']"
          :rules="[
            { required: true, message: t('ticket.info.status.required') },
          ]"
          style="margin-bottom: 5px"
        >
          <a-radio-group
            v-model="formData.submit"
            default-value="true"
            :span="8"
          >
            <a-radio value="true">{{ t('pass') }}</a-radio>
            <a-radio value="false">{{ t('failed') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="comment"
          :label="$t('ticket.info.comment')"
          v-if="!props.isDetail"
        >
          <a-textarea v-model="formData.comment" style="height: 200px" />
        </a-form-item>
      </div>

      <!-- 附件 -->
      <a-form-item
        field="attachment"
        :label="$t('ticket.info.attachment')"
        style="margin-left: -110px"
      >
        <a-upload
          :file-list="fileList"
          :custom-request="Onchange"
          :limit="5"
          :disabled="true"
          :on-before-remove="removeAttact"
          :show-remove-button="false"
          v-model="formData.attachId"
          v-if="fileList.length !== 0"
        />
        <div v-else>无</div>
      </a-form-item>
      <!-- </a-row> -->
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import useVisible from '@/hooks/visible';
import { computed, PropType, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { Button, Message } from '@arco-design/web-vue';
import { useTicketStore, useUserStore, useRoleStore } from '@/store';
import { TicketRecord } from '@/api/ticket';
import { deptList } from '@/api/dept';
import dayjs from 'dayjs';

const props = defineProps({
  prem: {
    type: Object as PropType<TicketRecord>,
  },
  isDetail: Boolean,
});

const { t } = useI18n();
const userStore = useUserStore();
const ticketStore = useTicketStore();
const roleStore = useRoleStore();
const modalTitle = computed(() => {
  return props.isDetail ? t('detail') : t('audit');
});
const { visible, setVisible } = useVisible(false);
const createEditRef = ref<FormInstance>();

const formData = ref<TicketRecord>({
  id: undefined,
  title: '',
  body: '',
  money: undefined,
  type: '',
  contactEmail: '',
  companyName: '',
  attachId: '',
  auditorId: '',
  submit: true,
  comment: '',
  deptName: '',
  auditor: '',
});

const emit = defineEmits(['refresh']);

const deptOptions = ref();
const getDeptData = async () => {
  const res = await deptList();
  deptOptions.value = res.data.records;
};

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
const optionDept = async () => {
  auditorOptions.value = [];
  const res = await userStore.getUserList({
    page: 1,
    size: 100,
    roleId: auiditRoleId,
    deptId: formData.value.deptId,
  });
  auditorOptions.value = res.data.records;
};

const fileList = ref([]);
// 组件被点击时
const handleClick = async () => {
  getRoleId();
  getDeptData();
  const ticketId = props.prem?.id;
  // 获取票据数据
  const res = await ticketStore.getDetail(ticketId);
  // 票据数据
  formData.value = res.data;
  formData.value.submit = 'true';
  // 附件内容
  formData.value.attachId.forEach(async (item: any) => {
    // console.log('item,', item);
    const data = await ticketStore.getAttachment(item);
    data.data.name = data.data.fileName;
    fileList.value.push(data.data);
  });

  // 审核员信息
  const auditInfo = await userStore.getUserDetail(formData.value.auditorId);
  formData.value.deptId = auditInfo.data.deptId;
  optionDept().then(() => {
    deptOptions.value.forEach((item: any) => {
      if (item.id === formData.value.deptId) {
        formData.value.deptName = item.name;
      }
    });
    auditorOptions.value.forEach((item: any) => {
      if (item.id === formData.value.auditorId) {
        formData.value.auditor = item.username;
      }
    });
    setVisible(true);
  });
};

// 提交
const handleSubmit = async () => {
  const valid = await createEditRef.value?.validate();
  if (!valid) {
    // 详情
    if (props.isDetail) {
      createEditRef.value?.resetFields();
    } else {
      // 审核
      const { status, ...auditDate } = formData.value;
      const res = await ticketStore.auditTicket(auditDate);
      if (res.status === 200) {
        Message.success({
          content: t('audit.sucess'),
          duration: 5 * 1000,
        });
      }
    }
    fileList.value = [];
    emit('refresh');
    setVisible(false);
  }
};

// 关闭
const handleCancel = async () => {
  fileList.value = [];
  createEditRef.value?.resetFields();
  setVisible(false);
};
</script>

<style scoped>
</style>
