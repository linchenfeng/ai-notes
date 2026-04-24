<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-05-13 16:08:54
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-02 17:26:17
 * @Description  : 审批节点
-->
<template>
  <view class="node-card">
    <view class="node-header">
      <view class="left">
        <view class="out">
          <view class="in"></view>
        </view>
      </view>
      <view class="title-box">
        <view class="title">{{ intLoanStatusVo[props.auditItem.intLoanStatus] }}</view>
        <text v-if="['5'].includes(props.auditItem.intLoanStatus)" class="status">撤回</text>
        <text v-if="['7', 'B'].includes(props.auditItem.intLoanStatus)" class="status">退回</text>
        <text v-if="['3', '63', 'F', 'C'].includes(props.auditItem.intLoanStatus)" class="status success">通过</text>
        <text v-if="['4', '8', 'A'].includes(props.auditItem.intLoanStatus)" class="status error">拒绝</text>
        <text v-if="['51'].includes(props.auditItem.intLoanStatus)" class="status">代撤回</text>
        <text v-if="['9'].includes(props.auditItem.intLoanStatus)" class="status">暂缓</text>
        <text v-if="['10'].includes(props.auditItem.intLoanStatus)" class="status">解除暂缓</text>
        <text v-if="['D'].includes(props.auditItem.intLoanStatus)" class="status primary">发表意见</text>
        <text v-if="['E'].includes(props.auditItem.intLoanStatus)" class="status success">确认</text>
      </view>
    </view>
    <view class="node-content">
      <view class="name-box">
        <view>{{ props.auditItem.approveUser }}</view>
        <view class="reviewTime">{{ dateFormat(props.auditItem.approveDate, 2) }}</view>
      </view>
      <view v-if="props.auditItem.approveRemark || props.auditItem.historyOrgname || props.auditItem.automaticFlag === '1'" class="text-folding">
        <ty-text-folding :rows="4" @toggle="emit('toggle')">
          {{
            props.auditItem.automaticFlag === '1'
              ? '系统自动批准'
              : props.auditItem.approveRemark || `卖方${props.auditItem.historyOrgname}变更为${props.auditItem.orgname}`
          }}
        </ty-text-folding>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { HistoryListItem } from '@/interfaces/member/project/apply/businessApply'
import { dateFormat } from '@/utils/format'
const props = defineProps({
  auditItem: {
    type: Object as () => HistoryListItem, // 明确类型为 HistoryListItem
    default: () => ({} as HistoryListItem) // 默认值类型断言
  }
})
const intLoanStatusVo = {
  1: '业务申请',
  3: '业务准入',
  4: '业务准入',
  5: '业务申请',
  6: '申请业务',
  7: '受理客户申请',
  8: '受理客户申请',
  51: '业务准入',
  63: '受理客户申请',
  9: '业务准入',
  10: '业务申请',
  A: '业务准入',
  B: '业务准入',
  C: '业务准入',
  D: '业务准入',
  E: '业务准入',
  F: '业务准入'
}
const emit = defineEmits({
  // 展开收起意见、通知父级重新计算折叠板高度
  toggle: () => {
    return true
  }
})
</script>
<style lang="scss" scoped>
.nodes > .node-card:first-of-type {
  padding-top: 0;
}
.node-card {
  padding-top: 10rpx;
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
  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .title {
    height: 34rpx;
    color: #333333;
    font-weight: 700;
    font-size: 28rpx;
    line-height: 34rpx;
    margin-left: 20rpx;
    margin-top: 2rpx;
  }
  .status {
    border: 1rpx solid $warning;
    color: $warning;
    border-radius: 5rpx;
    padding: 4rpx 16rpx;
    text-align: center;
    font-size: 24rpx;
    &.success {
      border: 1rpx solid $u-success;
      color: $u-success;
    }
    &.error {
      border: 1rpx solid $u-error;
      color: $u-error;
    }
    &.primary {
      border: 1rpx solid $u-primary;
      color: $u-primary;
    }
  }
}
.node-content {
  margin-left: 14rpx;
  margin-top: 14rpx;
  padding-bottom: 20rpx;
  border-left: solid 1rpx #395fee;
  padding-left: 34rpx;
  padding-top: 4rpx;
  .name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 14rpx;
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
