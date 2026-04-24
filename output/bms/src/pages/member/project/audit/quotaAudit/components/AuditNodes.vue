<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-10 15:10:40
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-12 18:01:25
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
      <view class="title">
        {{ dateFormat(props.auditItem.lastModDate, 2) }}
        <view class="status" :class="`status${props.auditItem.finalStatus}`">
          {{ getValueByKey(props.auditItem.finalStatus, 'intClFinalStatus') }}
        </view>
      </view>
    </view>
    <view class="node-content">
      <u-cell-group>
        <u-cell title="额度申请金额(万元)：">
          <template #value>
            <view class="apply-amt">
              <text class="ccyid">{{ props.auditItem.applyCcyid }}</text>
              <text>{{ moneyFormat(props.auditItem.applyAmt) }}</text>
            </view>
          </template>
        </u-cell>
        <u-cell v-if="props.auditItem.finalStatus === '99' && !isEmpty(props.auditItem.checkAmt)" title="额度核准金额(万元)：">
          <template #value>
            <view class="apply-amt">
              <text class="ccyid">{{ props.auditItem.applyCcyid }}</text>
              <text>{{ moneyFormat(props.auditItem.checkAmt as number) }}</text>
            </view>
          </template>
        </u-cell>
      </u-cell-group>
      <view v-if="props.auditItem.reviewRemark" class="text-folding">
        <ty-text-folding :rows="4">
          {{ props.auditItem.reviewRemark }}
        </ty-text-folding>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { HistoryOrgClList } from '@/interfaces/member/project/audit/quotaAudit'
import { dateFormat, moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import { isEmpty } from '@/utils/validate'
const props = defineProps({
  auditItem: {
    type: Object as () => HistoryOrgClList, // 明确类型为 HistoryList
    default: () => ({} as HistoryOrgClList) // 默认值类型断言
  }
})
</script>
<style lang="scss" scoped>
.nodes > .node-card:first-of-type {
  padding-top: 0;
}
.node-card {
  padding: 20rpx 0 0 0;
}
.node-header {
  display: flex;
  align-items: center;
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
    color: #333333;
    font-weight: 700;
    font-size: 28rpx;
    margin-left: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
  .status {
    border: 1rpx solid $warning;
    color: $warning;
    border-radius: 5rpx;
    padding: 4rpx 16rpx;
    text-align: center;
    font-size: 24rpx;
    &.status97 {
      border: 1rpx solid $u-error;
      color: $u-error;
    }
    &.status99 {
      border: 1rpx solid $success;
      color: $success;
    }
  }
}
.node-content {
  margin-left: 14rpx;
  padding-bottom: 30rpx;
  border-left: solid 1rpx #395fee;
  padding-left: 34rpx;
  padding-top: 12rpx;
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
:deep(.u-cell-group) {
  padding-top: 0;
  margin: 0;
  .u-cell__body {
    justify-content: space-between;
    align-items: center;
  }
}
:deep(.u-cell-group .u-cell-group__wrapper) {
  padding: 0;
}
.ccyid {
  margin-right: 7rpx;
}
:deep(.u-cell) {
  padding-bottom: 5rpx;
}
</style>
