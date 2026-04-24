<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-09 16:37:10
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-31 15:24:03
 * @Description  : 尽调历程
-->
<template>
  <view class="diligence-history">
    <view v-for="(item, index) in vm.fintCddHistory" :key="index" class="item-box" @click="viewDetail(item.refcode)">
      <u-cell-group :border="false">
        <u-cell :stop="false" title="指派发起人" :value="item.applyUserName" :border="false" />
        <u-cell :stop="false" title="现场尽调人员" :value="item.cddUserNames" :border="false" />
        <u-cell :stop="false" title="任务指派时间" :value="dateFormat(item.applyDate, 2)" :border="false" />
        <u-cell :stop="false" title="完成尽调时间" :value="dateFormat(item.completionDate, 2)" :border="false" />
        <u-cell :stop="false" title="尽调编号" :value="item.businessNo" :border="false" />
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
// import AuditNodes from './AuditNodes.vue'
import { encodeBase64 } from '@/utils/crypto'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { FintCddHistory } from '@/interfaces/member/project/audit/assignDueDiligence'
import { dateFormat } from '@/utils/format'
import { useRouter } from '@/uni-simple-router'
const router = useRouter()
const fintCddHistory: FintCddHistory[] = []
const vm = reactive({
  fintCddHistory: fintCddHistory
})
const props = defineProps({
  // 客户名称
  orgname: {
    type: String,
    default: ''
  }
})
const queryDueDiligenceHistory = () => {
  const data = {
    orgname: props.orgname
  }
  apiAssignDueDiligence.queryDueDiligenceHistory(data).then(res => {
    vm.fintCddHistory = res.data.fintCddHistory
  })
}
const viewDetail = refcode => {
  // 跳转
  router.push(`/member/project/audit/assignDueDiligence/detail/${encodeBase64(refcode)}`)
}
onMounted(() => {
  queryDueDiligenceHistory()
})
</script>

<style lang="scss" scoped>
.diligence-history {
  padding-bottom: 10rpx;
  .item-box {
    margin: 30rpx;
    border: 1rpx solid #ededed;
    border-radius: 10rpx;
  }
}
</style>
