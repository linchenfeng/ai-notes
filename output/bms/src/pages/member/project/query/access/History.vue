<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-12-10 10:31:33
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 15:15:16
 * @Description  : 项目-业务查询-业务准入-历史审核意见 /member/project/query/access/detail/history
-->
<template>
  <div class="history-list-box">
    <u-collapse ref="sellerCollapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="准入历程" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">准入历程</text>
          </view>
        </template>
        <view class="nodes">
          <audit-nodes v-for="(item, index) in vm.historyList" :key="index" :audit-item="item" @toggle="toggle"></audit-nodes>
        </view>
      </u-collapse-item>
    </u-collapse>
  </div>
</template>

<script setup lang="ts">
import apiBusinessQuery from '@/api/member/project/query/api.businessQuery'
import { HistoryListItem } from '@/interfaces/member/project/apply/businessApply'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import AuditNodes from './components/AuditNodes.vue'
const opinionActive = ref<string[]>([])
const route = useRoute()
const sellerCollapseRef = ref()
let refcode = ref('') // 入会结果流水号
let historyList: HistoryListItem[] = []
let vm = reactive({
  historyList: historyList
})
const getInternationalHistoryInfo = () => {
  apiBusinessQuery.getInternationalHistoryInfo(refcode.value).then(res => {
    vm.historyList = res.data.historyList
    setTimeout(() => {
      sellerCollapseRef.value.init()
    }, 200)
  })
}

// 切换审批意见展开，同步初始化高度
const toggle = () => {
  opinionActive.value = ['1']
  nextTick(() => {
    sellerCollapseRef.value.init()
  })
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode) // 上会结果流水号
  }
  getInternationalHistoryInfo()
})
</script>

<style lang="scss" scoped>
.history-list-box {
  background-color: #f6f6f6;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  .nodes {
    background-color: #fff;
    padding: 0 30rpx;
  }
  :deep(.u-collapse-item) {
    box-shadow: none;
    margin-bottom: 0;
    background-color: #fff;

    .u-cell__title-text {
      font-size: 28rpx !important;
      font-weight: bold;
    }
    .u-cell--clickable.u-cell {
      background-color: #fff;
    }
    .u-collapse-item__content__text {
      padding: 0;
    }
    .u-cell__body {
      padding: 27rpx 30rpx !important;
    }
    .node-card:last-of-type {
      .node-content {
        border-left: none;
      }
    }
  }
  .collapse-item-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 24rpx;
    .showInviteGroup {
      margin-left: 20rpx;
      background-color: #e4f2fd;
      border-color: #e4f2fd;
      color: #138bec;
      padding: 8rpx 20rpx;
      border-radius: 6rpx;
      font-weight: normal;
      font-size: 26rpx;
    }
  }
}
</style>
