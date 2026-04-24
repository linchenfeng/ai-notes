<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-10 15:10:40
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-04 15:54:52
 * @Description  : 特批申请历程节点
-->

<template>
  <view class="node-card">
    <view class="node-header">
      <view class="left">
        <view class="out">
          <view class="in"></view>
        </view>
      </view>
      <view class="title">{{ props.auditItem.handleDesc }}</view>
      <text v-if="props.auditItem.handleResult" class="status" :class="`status${props.auditItem.handleResult}`">
        {{ handleResult[props.auditItem.handleResult] }}
      </text>
    </view>
    <view class="node-content">
      <view class="name-box">
        <view>{{ cutEnStr(props.auditItem.nodeOperatorName) }}</view>
        <view class="reviewTime">{{ dateFormat(props.auditItem.handleTime, 2) }}</view>
      </view>
      <view v-if="props.auditItem.handleReason || props.auditItem.automaticFlag === '1'" class="text-folding">
        <ty-text-folding :rows="4" @toggle="emit('toggle')">
          {{ props.auditItem.automaticFlag === '1' ? '系统自动批准' : props.auditItem.handleReason }}
        </ty-text-folding>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { HistoryItem } from '@/interfaces/member/project/audit/warningApprovalAudit'
import { dateFormat } from '@/utils/format'
import { isEmpty } from '@/utils/validate'
const props = defineProps({
  auditItem: {
    type: Object as () => HistoryItem, // 明确类型为 HistoryList
    default: () => ({} as HistoryItem) // 默认值类型断言
  }
})

const handleResult = {
  A: '拒绝',
  B: '退回',
  C: '通过',
  D: '发表意见'
}
const emit = defineEmits({
  // 展开收起意见、通知父级重新计算折叠板高度
  toggle: () => {
    return true
  }
})

// 截取掉括号中的英文
const cutEnStr = str => {
  if (isEmpty(str)) {
    return
  }
  const regex = /\([^()]*?\)/g
  const result = str.replace(regex, '')
  return result
}
</script>
<style lang="scss" scoped>
.node-card {
  padding: 20rpx 0 0 0;
}
.node-header {
  display: flex;
  align-items: center;
  position: relative;
  & .left {
    flex-shrink: 0;
    .out {
      width: 28rpx;
      height: 28rpx;
      border: 1rpx solid #395fee;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      box-sizing: border-box;
      .in {
        width: 20rpx;
        height: 20rpx;
        background: #395fee;
        border-radius: 50%;
      }
    }
  }
  .title {
    height: 34rpx;
    color: #333333;
    font-weight: 700;
    font-size: 28rpx;
    line-height: 34rpx;
    margin-left: 20rpx;
  }
  .status {
    border: 1rpx solid $warning;
    color: $warning;
    border-radius: 5rpx;
    padding: 4rpx 16rpx;
    text-align: center;
    font-size: 24rpx;
    position: absolute;
    right: 0;
    &.statusA {
      border: 1rpx solid $u-error;
      color: $u-error;
    }
    &.statusB {
      border: 1rpx solid $warning;
      color: $warning;
    }
    &.statusC {
      border: 1rpx solid $success;
      color: $success;
    }
    &.statusD {
      border: 1rpx solid $u-primary;
      color: $u-primary;
    }
  }
}
.node-content {
  margin-left: 14rpx;
  margin-top: 8rpx;
  padding-bottom: 30rpx;
  border-left: solid 1rpx #395fee;
  padding-left: 34rpx;
  padding-top: 10rpx;
  .name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 20rpx;
    color: #333;
    .reviewTime {
      font-size: 24rpx;
      color: $remark-color;
    }
  }
}
.text-folding {
  padding: 30rpx 20rpx;
  border-radius: 4px;
  background: #f7f7f7;
}
.review-opinion-box {
  &.condition-list {
    padding-bottom: 0rpx;
  }
  &:last-of-type {
    margin-bottom: 0rpx;
  }
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
    // border-bottom: 2rpx solid #dedede;
    margin-bottom: 20rpx;
    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }
    .condition-content {
      width: 100%;
      word-break: break-all;
    }
    .condition {
      border-radius: 5rpx;
      padding: 10rpx 0 10rpx 0;
      color: $sub-color;
      font-size: 26rpx;
      margin-bottom: 10rpx;
      line-height: 40rpx;
      display: flex;
      align-items: baseline;
      .condition-title {
        font-weight: bold;
      }
      .iconfont {
        font-size: 28rpx;
        color: #008cd6;
        margin-right: 10rpx;
        vertical-align: bottom;
      }
    }

    .group-box {
      display: flex;
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
        margin-bottom: 20rpx;
        background: #f7f7f7;
        padding: 30rpx 20rpx;
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
</style>
