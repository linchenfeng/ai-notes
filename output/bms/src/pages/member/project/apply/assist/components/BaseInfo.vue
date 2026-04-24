<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-20 14:18:54
 * @Description  : 申请协销/征信基础信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card :show-line="false">
      <view class="card-cell-group top-cell">
        <u-cell-group>
          <u-cell title="客户经理" :value="props.assistInfo.clmUserName" />
          <u-cell title="业务主管" :value="props.assistInfo.superiorUserid" />
          <u-cell
            v-if="['apply', 'audit'].includes(props.type) && !isEmpty(props.assistInfo.applyDate)"
            title="申请日期"
            :value="dateFormat(props.assistInfo.applyDate)"
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
          <u-cell title="卖方所在国" :value="props.assistInfo.ctyDesc" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="买方及贸易基本信息">
      <buyer-list
        v-if="!isEmpty(props.assistInfo.orgname)"
        :orgname="props.assistInfo.orgname"
        :biz-scene="props.assistInfo.bizScene"
        :product-type="props.assistInfo.productType"
        :clm-user-id="props.assistInfo.clmUserId"
      />
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { AssistInfo } from '@/interfaces/member/project/apply/assist'
import { getValueByKey } from '@/utils/constant'
import type { PropType } from 'vue'
import BuyerList from './BuyerList.vue'
import { isEmpty } from '@/utils/validate'
import { dateFormat } from '@/utils/format'
const props = defineProps({
  assistInfo: {
    type: Object as PropType<AssistInfo>,
    default: () => ({})
  },
  // apply申请|audit详情
  type: {
    type: String,
    default: 'query'
  }
})
const getProduceType = computed(() => {
  const bizScene = getValueByKey(props.assistInfo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${props.assistInfo.productType}` : props.assistInfo.productType
})
</script>

<style lang="scss" scoped>
.top-cell {
  margin-top: 20rpx;
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
.apply-amt {
  line-height: 48rpx;
  font-size: 28rpx;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .ccyid {
    margin-right: 7rpx;
  }
}
:deep(.node-card:last-of-type) {
  .node-content {
    border-left: none;
  }
}
.review-name-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  .reviewTime {
    font-size: 24rpx;
    color: $remark-color;
  }
}
</style>
