<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-11 14:24:56
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-17 11:17:33
 * @Description  : 基本信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card :title="props.title" :show-line="false">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="开票主体名称" :value="props.self.bankrollOrgName" />
          <u-cell title="申请人全称(卖方)" :value="props.self.applyOrgname" />
          <u-cell v-if="isNotEmpty(props.self.applyNo)" title="申请书编号" :value="props.self.applyNo" />
          <u-cell title="开票申请编号" :value="props.self.appNo" />
          <u-cell title="开票申请日期" :value="props.self.appDate ? dateFormat(props.self.appDate, 1) : ''" />
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { dateFormat } from '@/utils/format'
import { FgaiAppVo } from '@/interfaces/member/myinfo/invoice'
import type { PropType } from 'vue'
import { isNotEmpty } from '@/utils/validate'
const props = defineProps({
  self: {
    type: Object as PropType<FgaiAppVo>,
    default: () => ({})
  },
  title: {
    type: String,
    default: '卖方信息'
  }
})
</script>

<style lang="scss" scoped></style>
