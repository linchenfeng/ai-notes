<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-05-13 16:08:54
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-27 18:26:52
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
        <view class="title">
          {{ props.type === '2' ? '信审委员意见' : props.auditItem.operationScene === '1' ? '上会结果复核' : metStatusVo[props.auditItem.metStatus] }}
        </view>
        <text v-if="['3', '5', '8', '213', '223', '233'].includes(props.auditItem.metStatus)" class="status success">通过</text>
        <text v-if="props.auditItem.operationScene === '1' || ['9'].includes(props.auditItem.metStatus)" class="status">撤回</text>
        <text v-if="['2', '4', '7', '211', '221', '231'].includes(props.auditItem.metStatus)" class="status">退回</text>
        <text v-if="['212', '222', '232'].includes(props.auditItem.metStatus)" class="status error">拒绝</text>
      </view>
    </view>
    <view v-if="type === '1'" class="node-content">
      <view class="name-box">
        <view>{{ props.auditItem.approveUserName }}</view>
        <view class="reviewTime">{{ dateFormat(props.auditItem.lastModDate, 2) }}</view>
      </view>
      <view v-if="!['1', '6', '9'].includes(props.auditItem.metStatus) && props.auditItem.approveRemark" class="text-folding">
        <ty-text-folding>
          {{ props.auditItem.approveRemark }}
        </ty-text-folding>
      </view>
    </view>
    <view v-if="type === '2'" class="node-content">
      <view class="review-opinion-box condition-list">
        <view v-for="(obj, j) in props.auditItem.fintMemList" :key="j" class="condition-box">
          <view class="condition">
            <text class="iconfont icon-jinggao"></text>
            <view class="condition-content">
              <text class="condition-title">条件说明：</text>
              <text class="pre-wrap">{{ obj.conditionRemark }}</text>
            </view>
          </view>
          <view v-for="(subItem, k) in obj.groupList" :key="k" class="group-box" :class="{ lastOne: k === obj.groupList.length - 1 }">
            <view class="right-box">
              <view class="head">
                <text class="memberName">{{ subItem.memberName }}</text>
                <text v-if="subItem.reviewTime" class="reviewTime">{{ dateFormat(subItem.reviewTime, 2) }}</text>
                <view v-else class="btn-box">
                  <view class="wait-reply">未回复</view>
                </view>
              </view>
              <view v-if="subItem.reviewRemark" class="reviewRemarkBox">
                <ty-text-folding>
                  {{ subItem.reviewRemark }}
                </ty-text-folding>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { PreLoanExamineHistoryList } from '@/interfaces/member/project/audit/documentReview'
import { dateFormat } from '@/utils/format'
const props = defineProps({
  auditItem: {
    type: Object as () => PreLoanExamineHistoryList, // 明确类型为 HistoryListItem
    default: () => ({} as PreLoanExamineHistoryList) // 默认值类型断言
  },
  type: {
    type: String,
    default: '1' // 1||审核节点2||信审委员节点
  }
})
const metStatusVo = {
  1: '上会结果录入',
  2: '上会结果复核',
  3: '上会结果复核',
  4: '上会结果审批',
  5: '上会结果审批',
  6: '上会结果意见汇整',
  7: '意见汇整复核结果',
  8: '意见汇整复核结果',
  9: '上会结果录入',
  211: '资料检查',
  212: '资料检查',
  213: '资料检查',
  221: '资料复核',
  222: '资料复核',
  223: '资料复核',
  231: '贷前审查',
  232: '贷前审查',
  233: '贷前审查'
}
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
  }
}
.node-content {
  margin-left: 14rpx;
  margin-top: 8rpx;
  padding-bottom: 20rpx;
  border-left: solid 1rpx #395fee;
  padding-left: 34rpx;
  .name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    padding-top: 5rpx;
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
  margin-top: 14rpx;
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
    margin-bottom: 14rpx;
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
      color: $sub-color;
      font-size: 26rpx;
      margin-bottom: 14rpx;
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
