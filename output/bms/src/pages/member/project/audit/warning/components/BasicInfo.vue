<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-07 18:38:32
 * @Description  : 预警解除基本信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card title="基本信息">
      <view class="topCell">
        <u-cell-group :border="false" :stop="true">
          <view class="item-title">
            <u-cell title="客户名称" :value="props.self.customerName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="监控对象类型" :value="getValueByKey(props.self.monitorObjectType, 'monitorObjectType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="监控对象" :value="props.self.monitorObjectName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell :title="getMonitorIdDesc()" :value="props.self.monitorObjectId" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="预警规则" :value="props.self.ruleName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="风险等级" :value="getValueByKey(props.self.warningLevel, 'warningLevel')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="预警日期" :value="dateFormat(props.self.warningTriggerTime)" :border="false" />
          </view>
        </u-cell-group>
      </view>
    </ty-info-card>
    <!-- 企业风险信息 -->
    <BusinessRisk v-if="props.self.qccList && props.self.qccList.length" :self="props.self"></BusinessRisk>
    <ty-info-card title="解除原因">
      <view class="content pre-wrap">{{ props.self.remark }}</view>
      <u-cell-group v-if="props.self.warningNextLogicTime" :border="false" :stop="true">
        <u-cell title="下次预警日期" :value="dateFormat(props.self.warningNextLogicTime)" :border="false" />
      </u-cell-group>
    </ty-info-card>
    <ty-info-card v-if="props.self.apxList.length" title="附件">
      <Uploader :editable="false" :res-uuid-vo="{ fileList: props.self.apxList as unknown  as FileItem[]}"></Uploader>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { WarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
import BusinessRisk from '@/pages/member/project/apply/warning/components/BusinessRisk.vue'
import type { PropType } from 'vue'
interface FileItem {
  [key: string]: string | number
}
const props = defineProps({
  self: {
    type: Object as PropType<WarningAppInfo>,
    default: () => ({})
  }
})
// 监控对象对应的唯一业务标识，根据监控对象类型及证件类型区分展示
const getMonitorIdDesc = () => {
  if (['1', '2'].includes(props.self.monitorObjectType)) {
    if (props.self.monitorOrgType === '1') {
      return '统一社会信用代码'
    } else if (['3', '9'].includes(props.self.monitorOrgType)) {
      return '商业登记证号码'
    } else if (props.self.monitorOrgType === '5') {
      return '证件号码'
    }
  } else if (props.self.monitorObjectType === '4') {
    return '证件号码'
  } else if (props.self.monitorObjectType === '5') {
    return '店铺ID'
  }
}
</script>

<style lang="scss" scoped>
// .topCell {
//   padding-top: 70rpx;
//   margin-bottom: 6rpx;
// }

:deep(.upload-file) {
  margin-bottom: 30rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 30rpx;
}
.basicInfo {
  :deep(.u-cell-group) {
    padding-top: 0;
    margin: 0;
    .u-cell__body {
      align-items: self-start;
    }
  }
}
</style>
