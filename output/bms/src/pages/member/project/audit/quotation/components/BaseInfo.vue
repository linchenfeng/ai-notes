<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-29 10:07:08
 * @Description  : 业务报价基础信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card title="卖方信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="卖方名称" :value="props.self.orgname" />
          <u-cell title="所在国" :value="props.self.ctyDesc" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="买方及额度申请信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="props.self.buyerOrgname" />
          <u-cell title="所在国" :value="props.self.buyerCtyDesc" />
          <u-cell title="详细地址" :value="props.self.address" />
          <u-cell title="账期(天)" :value="props.self.tenor" />
          <u-cell title="额度申请金额(万元)">
            <template #value>
              <view class="apply-amt">
                <text class="unit">{{ props.self.applyCcyid }}</text>
                <text>{{ moneyFormat(props.self.applyAmt) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(props.self.checkAmt)" title="额度核准金额(万元)">
            <template #value>
              <view class="apply-amt">
                <text class="unit">{{ props.self.checkCcyid }}</text>
                <text>{{ moneyFormat(props.self.checkAmt) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell title="额度开立结果" :value="getValueByKey(props.self.applyStatus, 'intClStatus')" />
          <!-- 已开立外部才展示 -->
          <template v-if="props.self.applyType === '2'">
            <u-cell v-if="props.self.applyStatus === '99'" title="外部成本(%)" :value="props.self.relFeeRatio" />
            <u-cell title="承保公司" :value="props.self.facOrgname" />
            <u-cell v-if="!isEmpty(props.self.relSerialUuid) || !isEmpty(props.self.fintAppApxVoList)" title="审批单及附件" class="vertical-cell">
              <template #value>
                <Uploader
                  v-if="!isEmpty(props.self.relSerialUuid)"
                  class="cell-value"
                  :editable="false"
                  :resource-uuid="props.self.relSerialUuid"
                ></Uploader>
                <Uploader
                  v-else-if="props.self.fintAppApxVoList"
                  class="cell-value"
                  :editable="false"
                  :res-uuid-vo="{ fileList: props.self.fintAppApxVoList }"
                ></Uploader>
              </template>
            </u-cell>
            <u-cell v-if="!isEmpty(props.self.applyRemark)" title="情况说明" class="vertical-cell">
              <template #value>
                <view class="cell-value">
                  <text>{{ props.self.applyRemark }}</text>
                </view>
              </template>
            </u-cell>
          </template>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { moneyFormat } from '@/utils/format'
import { QuotaInfo } from '@/interfaces/member/project/audit/quotation'
import { getValueByKey } from '@/utils/constant'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import type { PropType } from 'vue'
import { isEmpty } from '@/utils/validate'
const props = defineProps({
  self: {
    type: Object as PropType<QuotaInfo>,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 30rpx;
}
.apply-amt {
  line-height: 48rpx;
  font-size: 28rpx;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .unit {
    padding-right: 10rpx;
  }
}
</style>
