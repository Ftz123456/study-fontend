<template>
  <div style="width: 100%">
    <a-grid :cols="24" :row-gap="16" class="panel">
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      >
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-statistic
            :title="$t('workplace.pass')"
            :value="formData.pass || 0"
            :value-from="0"
            animation
            show-group-separator
          >
            <template #suffix>
              <span class="unit">{{ $t('workplace.pecs') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      >
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-statistic
            :title="$t('workplace.notPass')"
            :value="formData.notPass || 0"
            :value-from="0"
            animation
            show-group-separator
          >
            <template #suffix>
              <span class="unit">{{ $t('workplace.pecs') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      >
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-statistic
            :title="$t('workplace.notAudit')"
            :value="formData.notAudit || 0"
            :value-from="0"
            animation
            show-group-separator
          >
            <template #suffix>
              <span class="unit">{{ $t('workplace.pecs') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item
        v-if="userStore.permissions !== 'auditor'"
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
        style="border-right: none"
      >
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-statistic
            v-model="formData.notFiled"
            :title="$t('workplace.notFiled')"
            :value="formData.notFiled || 0"
            :value-from="0"
            animation
            show-group-separator
          >
            <template #suffix>
              <span class="unit">{{ $t('workplace.pecs') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item :span="24">
        <a-divider class="panel-border" />
      </a-grid-item>
    </a-grid>
    <a-card :bordered="false" v-if="userStore.permissions === 'admin'">
      <a-space id="TicketEcharts" style="width: 98%; height: 400px"></a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useTicketStore, useUserStore } from '@/store';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const { t } = useI18n();
const ticketStore = useTicketStore();
const userStore = useUserStore();
const formData = ref({
  notAudit: undefined,
  notFiled: undefined,
  notPass: undefined,
  pass: undefined,
});

const getEchartData = () => {
  const res = ticketStore.getChart();
  console.log('chart', res);
};

onMounted(async () => {
  const res = await ticketStore.getChart();
  console.log('chart', res.data);
  type EChartsOption = echarts.EChartsOption;
  const chartDom = document.getElementById('TicketEcharts');
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: t('workplace.chart'),
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        t('workplace.pass'),
        t('workplace.notPass'),
        t('workplace.notAudit'),
      ],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: res.data.dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('workplace.pass'),
        type: 'line',
        data: res.data.status2Counts,
      },
      {
        name: t('workplace.notPass'),
        type: 'line',
        data: res.data.status3Counts,
      },
      {
        name: t('workplace.notAudit'),
        type: 'line',
        data: res.data.status1Counts,
      },
    ],
  };

  myChart.setOption(option);
});

const getHomeData = async (params: {
  auditorId: number | undefined;
  userId: number | string | undefined;
}) => {
  if (userStore.permissions === 'admin') {
    params.userId = '';
  } else if (userStore.permissions === 'auditor') {
    params.auditorId = userStore.id;
  } else if (userStore.permissions === 'user') {
    params.userId = userStore.id;
  }

  ticketStore.getHome(params).then((res) => {
    formData.value = res.data;
  });
};
getHomeData({});
</script>

<style lang="less" scoped>
.arco-grid.panel {
  margin-bottom: 0;
  padding: 16px 20px 0 20px;
}
.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}
.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}
.up-icon {
  color: rgb(var(--red-6));
}
.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}
:deep(.panel-border) {
  margin: 4px 0 0 0;
}
</style>
