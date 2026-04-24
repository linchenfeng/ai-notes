<!--
 * @Author       : Charon.Lin
 * @Date         : 2024-12-25 14:24:11
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-01 15:03:44
 * @Description  : 项目-业务查询-贷前项目 /member/project
-->
<template>
  <NavBar bg-color="#0022bb" />
  <view class="member-project">
    <view class="topView">
      <cover-image class="topViewBg" src="@/assets/member/project/pbg.png"></cover-image>
      <view class="toppClass">
        <view>{{ '项目进度' }}</view>
        <!--         <text class="numClass">({{ progressObj.dataCount + progressObj.aplCount + progressObj.appCount + progressObj.metCount }})</text>
 -->
      </view>
      <view class="uRowClass">
        <u-row>
          <u-col class="alpttClass" span="2.25" @click="toDetail('1')">
            <view class="circleClass">
              <text>{{ progressObj.aplCount <= 9999 ? progressObj.aplCount : 9999 }}</text>
            </view>
            <view class="ttTitleClass threeTitle">已准入</view>
          </u-col>
          <u-col class="alpttClass" span="1">
            <view class="imgContainClass">
              <cover-image class="ttimgClass" :src="imagUrl" />
            </view>
          </u-col>
          <u-col class="alpttClass" span="2.25" @click="toDetail('2')">
            <view class="circleClass">
              <text>{{ progressObj.appCount <= 9999 ? progressObj.appCount : 9999 }}</text>
            </view>
            <view class="ttTitleClass">申请书通过</view>
          </u-col>
          <u-col class="alpttClass" span="1">
            <view class="imgContainClass">
              <cover-image class="ttimgClass" :src="imagUrl" />
            </view>
          </u-col>
          <u-col class="alpttClass" span="2.25" @click="toDetail('3')">
            <view class="circleClass">
              <text>{{ progressObj.quotaCount <= 9999 ? progressObj.quotaCount : 9999 }}</text>
            </view>
            <view class="ttTitleClass fiveTitle">已开买方额度</view>
          </u-col>
          <u-col class="alpttClass" span="1">
            <view class="imgContainClass">
              <cover-image class="ttimgClass" :src="imagUrl" />
            </view>
          </u-col>
          <u-col class="alpttClass" span="2.25" @click="toDetail('4')">
            <view class="circleClass">
              <text>{{ progressObj.metCount <= 9999 ? progressObj.metCount : 9999 }}</text>
            </view>
            <view class="ttTitleClass threeTitle">已过会</view>
          </u-col>
        </u-row>
      </view>
    </view>
    <!-- 拥有bms权限且getGuestTokenInfo调用成功才展示 -->
    <view class="superset-container">
      <Superset funid="member:project:query:preLoan:superset"></Superset>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'Project',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import imagUrl from '@/assets/member/project/line.png'
import apiLoanBrforeQuery from '@/api/member/project/query/api.loanBeforeQuery'
import { useRouter } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import Superset from '@/components/superset/index.vue'
let progressObj = reactive({
  aplCount: 0,
  appCount: 0,
  dataCount: 0,
  metCount: 0,
  quotaCount: 0
})
let router = useRouter()
/**
 * @Author: longcan.Yang
 * @Date: 2023-07-28 17:20:51
 * @param {*} preLoadType 跳转type
 * @description: 点击状态进入项目列表
 */
const toDetail = (preLoadType): void => {
  // 根据类型跳转
  switch (preLoadType) {
    case '1':
      router.push({
        path: '/member/project/query/access'
      })
      break
    case '2':
      router.push({
        path: '/member/project/query/application'
      })
      break
    case '3':
      router.push({
        path: '/member/project/query/buyerQuota'
      })
      break
    case '4':
      router.push({
        path: '/member/project/query/meeting'
      })
      break
    default:
      break
  }
}
onShow(() => {
  apiLoanBrforeQuery.getBusinessCount().then(res => {
    progressObj.aplCount = res.data.aplCount
    progressObj.appCount = res.data.appCount
    progressObj.quotaCount = res.data.quotaCount
    progressObj.metCount = res.data.metCount
  })
})
</script>
<style lang="scss" scoped>
.member-project {
  :deep(.u-badge) {
    color: $primary !important;
    font-weight: 100;
    background-color: #ffffff !important;
    padding: 4rpx 12rpx;
  }
  .top-title {
    position: relative;
    top: -20rpx;
    border-radius: 20rpx 20rpx 0 0;
    left: 0;
    right: 0;
    background: white;
    // padding: 20rpx 30rpx 0;

    padding: 42rpx 30rpx 22rpx 30rpx;
    display: flex;
    flex-direction: row;

    span {
      font-size: 28rpx;
      font-weight: bold;
      text-align: left;
      line-height: 28rpx;
      flex: 1;
    }
    cover-image {
      position: absolute;
      right: 30rpx;
      top: 50rpx;
      width: 28rpx;
      height: 28rpx;
    }
  }

  .topView {
    position: relative;
    .topViewBg {
      position: absolute;
      width: 100%;
      height: 320rpx;
      z-index: -5;
      left: 0;
      top: -2rpx;
    }
    min-height: 320rpx;
    height: 320rpx;
    text-align: center;
    padding: 0 30rpx;
    .toppClass {
      display: flex;
      color: white;
      font-size: 28rpx;
      line-height: 44rpx;
      padding: 35rpx 0rpx;
      text-align: left;
      font-weight: bold;
      .numClass {
        color: rgba(255, 255, 255, 0.8);
      }
      /* 添加这段样式后，Primary Button 会变成红色 */
      :root {
        --u-badge-color: red;
        --u-badge-background-color: var(--u-danger-color);
      }
    }
  }
  .uRowClass {
    :deep(.u-row) {
      height: 230rpx;
      align-items: inherit !important;
      .u-col {
        // height: 140rpx;
        overflow: visible;
        .imgContainClass {
          height: 130rpx;
          width: 100%;
          .ttimgClass {
            margin-top: 40rpx;
            width: 100%;
            height: 5rpx;
          }
        }

        .ttTitleClass {
          white-space: nowrap;
          font-size: 28rpx;
          height: 35rpx;
          color: white;
          margin-top: 20rpx;
          margin-left: -10rpx;
          text-align: center;
          width: 100rpx;
        }
        .threeTitle {
          margin: 20rpx auto !important;
        }
        .fiveTitle {
          margin-left: -20rpx;
        }
        .circleClass {
          display: flex;
          align-items: center;
          justify-content: center;
          background: url(@/assets/member/project/circle.png) no-repeat top center;
          background-size: 100rpx 100rpx;
          min-height: 100rpx;
          p {
            color: $primary;
            font-size: 30rpx;
          }
        }
      }
    }
  }
}
</style>
