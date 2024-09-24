<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card class="general-card" title=" ">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="right"
          >
            <a-row :gutter="18">
              <a-col :span="9">
                <a-form-item
                  field="username"
                  :label="$t('searchTable.form.username')"
                >
                  <a-input
                    v-model="formModel.username"
                    :placeholder="$t('searchTable.form.username.placeholder')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="9">
                <a-form-item
                  field="phone"
                  :label="$t('searchTable.form.phone')"
                >
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('searchTable.form.phone.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item
                  field="email"
                  :label="$t('searchTable.form.email')"
                >
                  <a-input
                    v-model="formModel.email"
                    :placeholder="$t('searchTable.form.email.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item
                  field="enable"
                  :label="$t('searchTable.form.status')"
                >
                  <a-select
                    v-model="formModel.enable"
                    :options="statusOptions"
                    :placeholder="$t('searchTable.form.status.placeholder')"
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

      <a-divider style="margin-top: 0" />
      <a-row>
        <a-col :span="12">
          <a-space>
            <UserEdit ref="createUserRef" :is-create="true" @refresh="search" />
          </a-space>
          <a-button @click="generateExcel" style="margin-left: 20px">
            <template #icon>
              <icon-download size="18" />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
        </a-col>
        <a-col
          :span="12"
          style="
            display: flex;
            align-items: center;
            justify-content: end;
            padding-bottom: 20px;
          "
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
        :loading="loading"
        :pagination="false"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
        style="margin-bottom: 40px"
        :filter-icon-align-left="alignLeft"
        @change="handleSortChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.size }}
        </template>
        <template #enabled="{ record }">
          <a-switch
            :model-value="record.enabled"
            :checked-value="true"
            :unchecked-value="false"
            @change="enabledStatus(record)"
          />
        </template>
        <template #operations="{ record }">
          <UserEdit
            ref="editUserRef"
            :prem="record"
            :is-create="false"
            @refresh="fetchData"
          />
          <Userc
            ref="editUserRef"
            :user="record"
            :is-create="false"
            @refresh="search"
          />
          <!-- <a-popconfirm
            content="确认删除此用户?"
            type="error"
            @ok="handleDelete(record)"
          >
            <a-button type="primary" status="danger" size="small">
              删除
            </a-button>
          </a-popconfirm> -->
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
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { UserRecord, UserParams } from '@/api/user';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import { downloadExcel, DownloadExcelPrams } from '@/utils/excel';
import useTableOption from '@/hooks/table-option';
import UserEdit from './components/user-edit.vue';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    id: '',
    name: '',
    phone: '',
    email: '',
    createdTime: [],
    enable: '',
  };
};

const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<UserRecord[]>([]);
const formModel = ref(generateFormModel());

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

const userStore = useUserStore();

const pagination: Pagination = {
  page: 1,
  size: 10,
  current: 1,
  total: null,
};

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('userTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
    width: 60,
  },
  {
    title: t('userTable.columns.username'),
    dataIndex: 'username',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('userTable.columns.phone'),
    dataIndex: 'phone',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('userTable.columns.email'),
    dataIndex: 'email',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('userTable.columns.nickName'),
    dataIndex: 'nickName',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('userTable.columns.address'),
    dataIndex: 'address',
    width: 180,
  },
  {
    title: t('userTable.columns.enabled'),
    dataIndex: 'enabled',
    slotName: 'enabled',
  },
  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('searchTable.form.status.enable'),
    value: 'true',
  },
  {
    label: t('searchTable.form.status.disable'),
    value: 'false',
  },
]);

// 获取用户列表
const fetchData = async (
  params: UserParams = { page: 1, size: 10, current: 1 }
) => {
  setLoading(true);
  try {
    const res = await userStore.getUserList(params);
    renderData.value = res.data.records;
    pagination.page = res.data.page;
    pagination.current = res.data.current;
    pagination.total = res.data.total;
    pagination.size = res.data.size;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

// 下载表格
const generateExcel = () => {
  const param: DownloadExcelPrams = {
    columns: [
      { title: '用户名', key: 'username' },
      { title: '昵称', key: 'nickName' },
      { title: '电话号码', key: 'phone' },
      { title: '部门Id', key: 'deptId' },
      { title: '角色Id', key: 'roleId' },
      { title: 'email', key: 'email' },
      { title: '启用状态', key: 'enabled' },
    ],
    rows: renderData.value,
    name: '用户表格',
  };
  downloadExcel(param);
};

// 查询
const search = () => {
  fetchData({
    ...pagination,
    ...formModel.value,
  } as unknown as UserParams);
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

search();

// 重置
const reset = () => {
  formModel.value = generateFormModel();
};

// 表格内部排序
const alignLeft = ref(false);
const handleSortChange = (data: any, extra: any, currentDataSource: any) => {
  console.log('change', data, extra, currentDataSource);
};

// 是否启用
const enabledStatus = async (record: string) => {
  record.enabled = !record.enabled;
  const res = await userStore.enabledUser(record.id);
  if (res.status === 200) {
    Message.success({
      content: t('modify.status.sucess'),
      duration: 3 * 1000,
    });
  } else {
    Message.error({
      content: t('modify.status.fail'),
      duration: 3 * 1000,
    });
  }
};

// 删除
// const handleDelete = async (record: UserRecord) => {
//   const res = await userStore.removeUser(record.id);
//   if (res.status === 200) {
//     Message.success({
//       content: '删除成功',
//       duration: 5 * 1000,
//     });
//     search();
//   }
// };

watch(() => columns.value, deepClone, { deep: true, immediate: true });
</script>

<script lang="ts">
export default {
  name: 'User',
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
