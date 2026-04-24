<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-22 14:11:07
 * @Description  : 申请协销/征信基础信息
-->
<template>
  <view class="basicInfo">
    <up-sticky v-if="props.assistInfo.dqscStatus && type === 'query'">
      <state-module
        :state-name="getValueByKey(props.assistInfo.examineStatus, 'examineStatus')"
        :state-color="stateColor[props.assistInfo.examineStatus]"
      ></state-module>
    </up-sticky>
    <ty-info-card :show-line="false">
      <view class="card-cell-group" :class="type === 'query' ? 'top-cell' : ''">
        <u-cell-group>
          <u-cell title="客户经理" :value="props.assistInfo.username" />
          <u-cell title="业务主管" :value="props.assistInfo.superiorUsername" />
          <u-cell
            v-if="props.type === 'query' && !isEmpty(props.assistInfo.reviewDate)"
            title="申请日期"
            :value="dateFormat(props.assistInfo.reviewDate)"
          ></u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card>
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="业务产品" :value="getProduceType" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="卖方基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="卖方名称" :value="props.assistInfo.orgname" />
          <u-cell title="卖方所在国" :value="props.assistInfo.orgctyDesc" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card v-if="!isEmpty(props.assistInfo.orgname)">
      <view class="detail" @click="viewDetail()">
        <text>客户上传资料</text>
        <view class="status">
          <text :class="`dqscStatus` + props.assistInfo.dqscStatus">{{ getValueByKey(props.assistInfo.dqscStatus, 'dqscStatus') }}</text>
          <up-icon name="arrow-right" color="#999999"></up-icon>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { DocumentReviewInfo } from '@/interfaces/member/project/audit/documentReview'
import { getValueByKey } from '@/utils/constant'
import type { PropType } from 'vue'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
import { isEmpty } from '@/utils/validate'
import { dateFormat } from '@/utils/format'
import StateModule from '@/plugins/StateModule.vue'
const router = useRouter()
const props = defineProps({
  assistInfo: {
    type: Object as PropType<DocumentReviewInfo>,
    default: () => ({})
  },
  refcode: {
    type: String as PropType<string | number>,
    default: ''
  },
  // audit审核|query详情
  type: {
    type: String,
    default: ''
  }
})
const stateColor = {
  12: 'warning',
  13: 'warning',
  19: 'success',
  22: 'warning',
  23: 'warning',
  28: 'danger',
  29: 'success'
}
const getProduceType = computed(() => {
  const bizScene = getValueByKey(props.assistInfo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${props.assistInfo.productType}` : props.assistInfo.productType
})
const viewDetail = () => {
  const path = `/member/project/audit/documentReview/fileList/${encodeBase64(props.assistInfo.orgname)}/${encodeBase64(props.assistInfo.dqscNo)}`
  router.push(path)
}
</script>

<style lang="scss" scoped>
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.top-cell {
  padding-top: 70rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  border-radius: 4px;
  background: #f7f7f7;
  padding: 30rpx 20rpx;
  color: #666;
}
.detail {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0 10rpx 0;
  margin-bottom: 30rpx;
  .dqscStatus1,
  .dqscStatus2,
  .dqscStatus3 {
    color: $u-warning;
  }
  .dqscStatus8 {
    color: $u-error;
  }
  .dqscStatus9 {
    color: $u-success;
  }
  .status {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
  }
}
</style>
