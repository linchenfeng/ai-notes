<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-14 11:41:20
 * @Description  : 买方额度基础信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card title="买方及额度申请信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="props.self.buyerOrgname" />
          <u-cell :title="'统一社会信用代码\n(Company Registration\n No.或相关登记号)'" :value="props.self.companyRegistrationNo" />
          <u-cell title="所在国" :value="props.self.ctyDesc" />
          <u-cell title="详细地址" :value="props.self.address" />
          <u-cell title="额度申请金额(万元)">
            <template #value>
              <view class="apply-amt">
                <text class="ccyid">{{ props.self.applyCcyid }}</text>
                <text>{{ moneyFormat(props.self.applyAmt) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(props.self.applyRemark)" title="备注说明" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ props.self.applyRemark }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card v-if="props.self.acceptResultVo" title="情况说明">
      <view class="review-name-box">
        <view>{{ props.self.acceptResultVo.acceptUserName }}：</view>
        <view class="reviewTime">{{ dateFormat(props.self.acceptResultVo.acceptDate as string, 2) }}</view>
      </view>
      <view class="content pre-wrap summaryRemark">{{ props.self.acceptResultVo.acceptRemark }}</view>
    </ty-info-card>
    <!-- 额度开立历程 -->
    <ty-info-card v-if="props.self.historyOrgClList && props.self.historyOrgClList.length" title="额度开立历程">
      <view class="nodes">
        <audit-nodes v-for="(item, index) in props.self.historyOrgClList" :key="index" :audit-item="item" />
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { dateFormat, moneyFormat } from '@/utils/format'
import { QuotaInfo } from '@/interfaces/member/project/audit/quotaAudit'
import AuditNodes from './AuditNodes.vue'
import { isEmpty } from '@/utils/validate'
import type { PropType } from 'vue'
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
