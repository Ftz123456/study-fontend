<template>
  <div class="container">
    <Breadcrumb :items="['menu.ticket', 'menu.ticket.manage']" />
    <a-card class="general-card">
      <a-tabs default-active-key="" @change="changeTop">
        <a-tab-pane key="" :title="t('set')"> </a-tab-pane>
        <a-tab-pane key="PASS" :title="t('pass')"> </a-tab-pane>
        <a-tab-pane key="FAILED" :title="t('failed')"> </a-tab-pane>
        <a-tab-pane key="EXAMINE" :title="t('unreviewed')"> </a-tab-pane>
        <a-tab-pane
          key="SUBMIT"
          :title="t('drafts')"
          v-if="userStore.permissions !== 'auditor'"
        >
        </a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="right"
          >
            <a-row :gutter="16">
              <!-- 公司名称 -->
              <a-col :span="8">
                <a-form-item
                  field="companyName"
                  :label="$t('searchTable.form.companyName')"
                >
                  <a-input
                    v-model="formModel.companyName"
                    :placeholder="
                      $t('searchTable.form.companyName.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>

              <!-- 标题 -->
              <a-col :span="8">
                <a-form-item
                  field="title"
                  :label="$t('searchTable.form.title')"
                >
                  <a-input
                    v-model="formModel.title"
                    :placeholder="$t('searchTable.form.title.placeholder')"
                  />
                </a-form-item>
              </a-col>

              <!-- 用户 -->
              <a-col :span="8">
                <a-form-item
                  field="userName"
                  :label="$t('searchTable.form.userName')"
                >
                  <a-input
                    v-model="formModel.userName"
                    :placeholder="$t('searchTable.form.committer.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <!-- 金额 -->
              <a-col :span="8">
                <a-form-item
                  field="money"
                  :label="$t('searchTable.form.money')"
                >
                  <a-input-group>
                    <a-input
                      v-model="formModel.minMoney"
                      :placeholder="$t('searchTable.form.min')"
                    />
                    <a-input
                      v-model="formModel.maxMoney"
                      :placeholder="$t('searchTable.form.max')"
                    />
                  </a-input-group>
                </a-form-item>
              </a-col>

              <!-- 票据类型 -->
              <a-col :span="8">
                <a-form-item field="type" :label="$t('searchTable.form.type')">
                  <a-select
                    v-model="formModel.type"
                    :options="typesOptions"
                    :placeholder="$t('searchTable.form.type.placeholder')"
                  />
                </a-form-item>
              </a-col>

              <!-- 时间 -->
              <a-col :span="8">
                <a-form-item field="time" :label="$t('searchTable.form.time')">
                  <a-range-picker
                    v-model="formModel.time"
                    style="width: 360px"
                    show-time
                    @select="onSelect"
                    value-format="YYYY-MM-DD"
                    :allow-clear="false"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-divider style="margin-top: 10px" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <TicketForm
              v-if="formModel.status === 'SUBMIT' || formModel.status === ''"
              ref="createEditRef"
              :prem="formModel"
              :is-create="true"
              @refresh="search"
            />
          </a-space>
          <a-button @click="generateExcel" style="margin-left: 5px">
            <template #icon>
              <icon-download size="16" />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :default-expand-all-rows="true"
        :loading="loading"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :pagination="false"
        :size="size"
        :expandable="expandable"
        @page-change="onPageChange"
        style="margin-bottom: 40px"
      >
        <template #expand-row="{ record }">
          <!-- 下面展示子表格,根据需求对子table进行属性配置 -->
          <a-descriptions layout="inline-horizontal" :column="1" bordered>
            <descriptions-item :label="t('ticket.info.contactEmail')">
              {{ record.contactEmail }}
            </descriptions-item>
            <descriptions-item :label="t('ticket.info.body')">
              {{ record.body }}
            </descriptions-item>
          </a-descriptions>
        </template>
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.size }}
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD') }}
        </template>

        <template #status="{ record }">
          <a-button status="success" v-if="record.status === '审核通过'">{{
            record.status
          }}</a-button>
          <a-button status="danger" v-if="record.status === '审核未通过'">{{
            record.status
          }}</a-button>
          <a-button status="normal" v-if="record.status === '待审核'">{{
            record.status
          }}</a-button>
          <a-button status="warning" v-if="record.status === '待提交'">{{
            record.status
          }}</a-button>
        </template>

        <template #operations="{ record }">
          <!-- 详情 -->
          <TicketEdit
            ref="editRef"
            :prem="record"
            :is-detail="true"
            @refresh="search"
          />

          <!-- 修改 -->
          <TicketForm
            ref="createEditRef"
            :prem="record"
            :is-create="false"
            @refresh="search"
            v-if="record.status === '待提交' || record.status === '审核未通过'"
          />

          <!-- 审核 -->
          <TicketEdit
            ref="editRef"
            :prem="record"
            :is-detail="false"
            @refresh="search"
            v-if="record.status === '待审核'"
          />

          <a-popconfirm
            :content="t('Confirm the deletion of this ticket')"
            @ok="handleDelete(record)"
          >
            <a-button
              type="outline"
              size="small"
              v-permission="['BILL_DELETE']"
              v-if="
                record.status === '待提交' || record.status === '审核未通过'
              "
              style="padding: 7px; border: 0px"
            >
              <template #icon><icon-delete /></template>
              {{ $t('delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        style="float: right; position: relative; right: 1px; bottom: 25px"
        :total="pagination.total"
        @page-size-change="onSizeChange"
        :size="size"
        @change="onPageChange"
        show-total
        show-jumper
        show-page-size
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import useTableOption from '@/hooks/table-option';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import dayjs from 'dayjs';
import { Message } from '@arco-design/web-vue';
import { useTicketStore, useUserStore } from '@/store';
import { TicketRecord } from '@/api/ticket';
import { downloadExcel, DownloadExcelPrams } from '@/utils/excel';
import TicketEdit from './components/ticket-edit.vue';
import TicketForm from './components/form-edit.vue';

const { loading, setLoading } = useLoading(true);
const ticketStore = useTicketStore();
const userStore = useUserStore();

const {
  cloneColumns,
  showColumns,
  size,
  densityList,
  handleSelectDensity,
  handleChange,
  popupVisibleChange,
  deepClone,
} = useTableOption();

const generateFormModel = () => {
  return {
    companyName: '',
    title: '',
    type: '',
    // 默认先展示票据审核通过的
    status: '',
    time: [],
    userName: '',
    minMoney: '',
    maxMoney: '',
    startTime: '',
    endTime: '',
  };
};

const { t } = useI18n();
const renderData = ref<TicketRecord[]>([]);
const formModel = ref(generateFormModel());
const currentStatus = ref('PASS');

// 拓展行
const expandable = reactive({
  title: ' ',
  expandedRowRender: (record: any) => {},
});

// 表格头部
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('ticketTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('ticketTable.columns.companyName'),
    dataIndex: 'companyName',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('ticketTable.columns.title'),
    dataIndex: 'title',
  },
  {
    title: t('ticketTable.columns.money'),
    dataIndex: 'money',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('ticketTable.columns.userName'),
    dataIndex: 'userName',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('ticketTable.columns.createTime'),
    dataIndex: 'createTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    slotName: 'createTime',
  },
  {
    title: t('ticketTable.columns.type'),
    dataIndex: 'type',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('ticketTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const typesOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('bank'),
    value: 'BANK',
  },
  {
    label: t('tax'),
    value: 'TAX',
  },
  {
    label: t('other'),
    value: 'OTHER',
  },
]);

// 基础分页查询的信息
const pagination: Pagination = {
  page: 1,
  size: 10,
  current: 1,
  total: 1,
};

// 下载表格
const generateExcel = () => {
  const param: DownloadExcelPrams = {
    columns: [
      { title: '公司', key: 'companyName' },
      { title: '标题', key: 'title' },
      { title: '金额', key: 'money' },
      { title: '内容', key: 'body' },
      { title: '联系邮箱', key: 'contactEmail' },
      { title: '创建时间', key: 'createTime' },
      { title: '类型', key: 'type' },
      { title: '审核状态', key: 'status' },
    ],
    rows: renderData.value,
    name: '票据表格',
  };
  downloadExcel(param);
};

// 时间段选择
const onSelect = (dateString: any, date: any) => {
  formModel.value.startTime = String(dateString[0]);
  formModel.value.endTime = String(dateString[1]);
};

// 时间段改变
const onChange = (dateString: any, date: any) => {
  formModel.value.startTime = String(dateString[0]);
  formModel.value.endTime = String(dateString[1]);
};

// 分页发生改变
const onPageChange = (current: number) => {
  pagination.page = current;
  pagination.current = current;
  search();
};

// 数据条数改变
const onSizeChange = (size: number) => {
  pagination.size = size;
  search();
};

// 获取数据
const fetchData = async (params: {
  auditorId: number | undefined;
  userId: number | undefined;
  page: 1;
  current: 1;
  size: 10;
}) => {
  setLoading(true);
  try {
    let res = {};

    // 根据用户角色，传相应的字段id获取票据列表
    if (userStore.permissions === 'admin') {
      res = await ticketStore.getTicketList(params);
    } else if (userStore.permissions === 'auditor') {
      params.auditorId = userStore.id;
      res = await ticketStore.getAuditTicketList(params);
    } else if (userStore.permissions === 'user') {
      params.userId = userStore.id;
      res = await ticketStore.getTicketList(params);
    }

    renderData.value = res.data.records;
    pagination.page = params.page;
    pagination.current = params.current;
    pagination.total = res.data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

// 模糊查询
const search = () => {
  // 删除time
  const { time, ...auditDate } = formModel.value;

  fetchData({
    ...pagination,
    ...auditDate,
  } as unknown as any);
};

// 切换标签页
const changeTop = (key: any) => {
  formModel.value.status = key;
  currentStatus.value = key;
  search();
};

search();

// 重置
const reset = () => {
  formModel.value = generateFormModel();
  formModel.value.status = currentStatus.value;
};

// 删除票据
const handleDelete = async (record: any) => {
  const res = await ticketStore.removeTicket(record.id);
  if (res.status === 200) {
    Message.success({
      content: t('delete.ticket.sucess'),
      duration: 5 * 1000,
    });
    search();
  } else {
    Message.error({
      content: t('delete.role.fail'),
      duration: 3 * 1000,
    });
  }
};

watch(() => columns.value, deepClone, { deep: true, immediate: true });
</script>

<script lang="ts">
export default {
  name: 'Dept',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
