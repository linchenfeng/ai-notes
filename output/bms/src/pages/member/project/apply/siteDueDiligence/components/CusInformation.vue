<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-17 15:41:12
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-29 19:18:13
 * @Description  : 现场尽调客户信息
-->
<template>
  <view>
    <ty-info-card title="客户信息" :show-line="false">
      <u-collapse ref="historyCollapseRef" :value="opinionActive" :border="false">
        <u-collapse-item title="客户基本信息" name="1" :border="false">
          <template #title>
            <view class="collapse-item-title">
              <text class="u-cell__title-text">客户基本信息</text>
            </view>
          </template>
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户名称" :value="props.orgInfo.orgname" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="所在国/地区" :value="props.orgInfo.ctyDesc" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="主要经营范围" :value="props.orgInfo.businessScope" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="经营地址" :value="props.orgInfo.operateAddress" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="成立时间" :value="props.orgInfo.regDate" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="法人" :value="props.orgInfo.legalPerson" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="法人联系电话" :value="props.orgInfo.legalPhone" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="联系人姓名" :value="props.orgInfo.legalLinkman" :border="false" />
            </view>
            <view class="item-title">
              <u-cell title="联系人电话" :value="props.orgInfo.legalLinkmanPhone" :border="false" />
            </view>
          </u-cell-group>
        </u-collapse-item>
        <!-- <u-collapse-item title="交易信息" name="2" :border="false">
          <TemOrgHisTradeList :org-his-trade-list="props.orgHisTradeList"></TemOrgHisTradeList>
        </u-collapse-item> -->
      </u-collapse>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { OrgHisTradeList, OrgInfo } from '@/interfaces/member/project/apply/siteDueDiligence'
// import TemOrgHisTradeList from '@/pages/member/project/audit/assignDueDiligence/components/OrgHisTradeList.vue'
import { PropType } from 'vue'
let opinionActive = ref([])
const props = defineProps({
  // 尽调流水号
  orgInfo: {
    type: Object as PropType<OrgInfo>,
    default: () => {
      return {}
    }
  },
  orgHisTradeList: {
    type: Array as PropType<OrgHisTradeList[]>,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.collapse-item-title {
  margin-left: -10rpx;
}
:deep(.u-cell-group) {
  padding-top: 0;
  margin: 0;
  .u-cell__title {
    margin-left: -6rpx;
  }
  .u-cell__body {
    align-items: self-start !important;
  }
}
:deep(.buyerList-item) {
  .orgname {
    width: 400rpx;
  }
}
</style>
