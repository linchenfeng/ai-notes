<!--
 * @Author       : ran.zhu
 * @Date         : 2025-08-04 09:37:06
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-23 15:30:17
 * @Description  : 资料复核历程
-->
<template>
  <NavBar></NavBar>
  <ty-info-card :show-line="false">
    <view class="nodes">
      <template v-for="(item, index) in vm.historyList" :key="index">
        <audit-nodes :audit-item="item" />
        <audit-nodes v-if="item.fintMemList && item.fintMemList.length" type="2" :audit-item="item" />
      </template>
    </view>
  </ty-info-card>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiDocumentReview from '@/api/member/project/audit/api.documentReview'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import AuditNodes from './components/AuditNodes.vue'
import { PreLoanExamineHistoryList } from '@/interfaces/member/project/audit/documentReview'
const route = useRoute()
let dqscNo = ref('') // 入会结果流水号
let historyList: PreLoanExamineHistoryList[] = []
let vm = reactive({
  historyList: historyList
})
const getPreLoanExamineHistory = () => {
  apiDocumentReview.getPreLoanExamineHistory({ dqscNo: dqscNo.value }).then(res => {
    vm.historyList = res.data
  })
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    dqscNo.value = decodeBase64(route.value.params.dqscNo)
  }
  getPreLoanExamineHistory()
})
</script>

<style lang="scss" scoped>
.history-list-box {
  background-color: #f6f6f6;
  // padding-top: 20rpx;
  .metStatus {
    margin-left: 30rpx;
  }
  :deep(.u-collapse-item) {
    box-shadow: none !important;
    background-color: #fff;
    margin-bottom: 20rpx;
    &:last-of-type {
      margin-bottom: 0;
      border-bottom: 4rpx solid #f6f6f6;
      border-radius: 0;
    }
    .collapse-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .u-cell__title-text {
      margin-left: -8rpx;
      font-size: 32rpx !important;
      font-weight: bold;
      position: relative;
    }
    .u-cell--clickable.u-cell {
      background-color: #fff;
    }
    .u-collapse-item__content__text {
      padding: 0;
    }
    .u-cell__body {
      padding: 35rpx 28rpx !important;
    }
  }
  .review-opinion-box {
    padding: 28rpx;
    margin: 4rpx 30rpx 20rpx;
    &.condition-list {
      padding-bottom: 0rpx;
    }
    &:last-of-type {
      margin-bottom: 40rpx;
    }
    box-shadow: 0 2rpx 6rpx 2rpx rgba(0, 0, 0, 0.1);
    .title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
    }
    .content {
      margin-top: 10rpx;
      font-size: 28rpx;
      line-height: 46rpx;
      color: $sub-color;
      word-break: break-all;
    }
    .head-box {
      display: flex;
      // align-items: center;
      .right-box {
        width: 100%;
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
      .iconfont-bms-colorful {
        margin: 4rpx 18rpx 0 0;
      }
    }
    .condition-box {
      // padding: 0 30rpx;
      border-bottom: 2rpx solid #dedede;
      margin-bottom: 50rpx;
      &:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
      }
      .condition-content {
        width: 100%;
        word-break: break-all;
      }
      .condition {
        background: #f6fafd;
        border-radius: 5rpx;
        padding: 30rpx 30rpx 28rpx 18rpx;
        color: $sub-color;
        font-size: 26rpx;
        margin-bottom: 50rpx;
        line-height: 40rpx;
        display: flex;
        align-items: baseline;
        .condition-title {
          font-weight: bold;
        }
        .iconfont {
          font-size: 28rpx;
          color: $remark-color;
          margin-right: 10rpx;
          vertical-align: bottom;
        }
      }

      .group-box {
        display: flex;
        &.lastOne {
          .right-box {
            padding-bottom: 50rpx;
          }
        }
        .left-box {
          margin-right: 18rpx;
          padding-top: 2rpx;
          .color-line {
            margin-top: 2rpx;
            width: 4rpx;
            height: calc(100% - 46rpx);
            margin-left: 50%;
            transform: translateX(-50%);
            border-left: 2rpx dashed #d3e3fc;
            // color: #d3e3fc;
          }
        }
        .right-box {
          width: 100%;
          padding-bottom: 60rpx;
          .head {
            display: flex;
            justify-content: space-between;
            .memberName {
              font-size: 28rpx;
              color: $default-color;
            }
            .reviewTime {
              font-size: 24rpx;
              color: $remark-color;
            }
            .btn-box {
              font-size: 24rpx;
              color: $remark-color;
            }
          }
          .reviewRemarkBox {
            color: $sub-color;
            line-height: 46rpx;
            font-size: 28rpx;
            margin-top: 10rpx;
          }
        }
      }
    }
  }
}
.status {
  border: 1rpx solid $warning;
  color: $warning;
  border-radius: 5rpx;
  padding: 10rpx 16rpx;
  text-align: center;
  font-size: 26rpx;
  &.success {
    border: 1rpx solid $u-success;
    color: $u-success;
  }
  &.error {
    border: 1rpx solid $u-error;
    color: $u-error;
  }
}
:deep(.nodes) {
  .node-card:last-of-type {
    .node-content {
      border-left: none;
    }
  }
}
</style>
