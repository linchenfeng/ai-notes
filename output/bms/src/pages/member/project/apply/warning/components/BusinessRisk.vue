<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-02 17:59:55
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-11 10:13:56
 * @Description  : 企业风险信息
-->
<template>
  <view>
    <!-- <ty-info-card title="企业风险信息">
      <view v-for="(item, i) in props.self.qccList" :key="i" class="risk-info" @click="toDetail(item)">
        <view>
          <text>{{ item.mainTypeName }}</text>
          <text class="interval">-</text>
          <text>{{ item.typeName }}</text>
        </view>
        <up-icon name="arrow-right" color="#999999"></up-icon>
      </view>
    </ty-info-card> -->
    <view class="line"></view>
    <u-collapse ref="collapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="客户授信信息" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">企业风险信息</text>
          </view>
        </template>
        <view v-for="(item, i) in props.self.qccList" :key="i" class="risk-info" @click="toDetail(item)">
          <view>
            <text>{{ item.mainTypeName }}</text>
            <text class="interval">-</text>
            <text>{{ item.typeName }}</text>
          </view>
          <up-icon name="arrow-right" color="#999999"></up-icon>
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from '@/uni-simple-router'
import type { PropType } from 'vue'
import { WarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
import { setStorage, removeStorage } from '@/utils/storages'
const router = useRouter()
const opinionActive = ref(['1'])
const props = defineProps({
  self: {
    type: Object as PropType<WarningAppInfo>,
    default: () => ({})
  }
})
// 查看详情
const toDetail = item => {
  setStorage('business-risk-data', item)
  router.push('/member/project/apply/warning/riskDetail')
}
onMounted(() => {
  removeStorage('business-risk-data')
})
</script>

<style lang="scss" scoped>
.line {
  height: 20rpx;
  background-color: #f6f6f6;
}
:deep(.u-collapse-item) {
  background-color: #fff;
  box-shadow: none;
  margin-bottom: 0;
  .collapse-item-title .u-cell__title-text {
    margin-left: -6rpx;
  }
  .u-cell--clickable.u-cell {
    background-color: #fff;
  }
}
.risk-info {
  border-bottom: 1rpx solid #e6e6e6;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  &:first-of-type {
    margin-top: -20rpx;
  }
  &:last-of-type {
    margin-bottom: 40rpx;
  }
  .interval {
    margin: 0 4rpx;
  }
}
</style>
