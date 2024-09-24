<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />
    <a-card class="general-card" title=" ">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 12 }"
            label-align="right"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="title" :label="$t('searchTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('searchTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'46px'" style="text-align: right">
          <a-space :size="18">
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
            <RoleEdit ref="createRef" :is-create="true" @refresh="fetchData" />
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="fetchData">
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
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD') }}
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
          <!-- 编辑 -->
          <RoleEdit
            ref="editRef"
            :prem="record"
            :is-create="false"
            @refresh="fetchData"
          />
          <a-popconfirm
            :content="t('Confirm the deletion of this role')"
            type="error"
            @ok="handleDelete(record)"
          >
            <a-button
              type="primary"
              size="small"
              status="danger"
              style="padding: 7px"
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
import { computed, ref, reactive, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/types/global';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { Message } from '@arco-design/web-vue';
import useTableOption from '@/hooks/table-option';
import dayjs from 'dayjs';
import { useRoleStore } from '@/store';
import { RoleRecord, RoleCreateRecord } from '@/api/role';
import RoleEdit from './components/role-edit.vue';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<RoleRecord[]>([]);
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
const roleStore = useRoleStore();
const generateFormModel = () => {
  return {
    name: undefined,
  };
};

const formModel = ref(generateFormModel());
const pagination: Pagination = {
  page: 1,
  size: 10,
  current: 1,
  total: 10,
};

// 表格头部
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('roleTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('roleTable.columns.name'),
    dataIndex: 'name',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('roleTable.columns.remark'),
    dataIndex: 'remark',
  },
  {
    title: t('roleTable.columns.createTime'),
    dataIndex: 'createTime',
    slotName: 'createTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('roleTable.columns.enabled'),
    dataIndex: 'enabled',
    slotName: 'enabled',
  },
  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

// 获取表格数据
const fetchData = async (params: any) => {
  setLoading(true);
  try {
    const res = await roleStore.getRoleList(params);
    console.log('info', res.data);
    renderData.value = res.data.records;
    pagination.page = res.data.page;
    pagination.current = res.data.current;
    pagination.total = res.data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

// 模糊查询
const search = () => {
  fetchData({
    ...pagination,
    ...formModel.value,
  } as unknown as any);
};

search();

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

// 重置
const reset = () => {
  formModel.value = generateFormModel();
};

// 是否启用
const enabledStatus = async (record: string) => {
  record.enabled = !record.enabled;
  const res = await roleStore.enabledRole(record.id);
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
const handleDelete = async (record: RoleRecord) => {
  const res = await roleStore.removeRole(record.id);
  if (res.status === 200) {
    Message.success({
      content: t('delete.role.sucess'),
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
  name: 'Role',
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
