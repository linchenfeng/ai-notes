<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-12-04 16:38:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-06-24 14:32:32
 * @Description  : 融资企业签约信息收集首页 /finFirmCollect
-->
<template>
  <view class="box">
    <view class="head">
      <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
      <view><cover-image class="logo" src="@/assets/member/myinfo/collect/logo.png"></cover-image></view>
      <view><cover-image class="gather" src="@/assets/member/myinfo/collect/gather.png"></cover-image></view>
      <view class="head-text">
        <view class="title">嗨，我是{{ userName }}</view>
        <view class="desc">
          <view>我正在邀请您补充相关企业信息，请填写</view>
          <view>以下信息吧</view>
        </view>
      </view>
    </view>
    <view class="collect-body">
      <view v-if="collectStatus === '0'">
        <view class="count-down">
          请在
          <text class="danger">
            <text>{{ finishHr }}</text>
            时
            <text>{{ finishMin }}</text>
            分
            <text>{{ finishSec }}</text>
            秒
          </text>
          内填写
        </view>
        <!-- 签约信息是收集模块 -->
        <ContractCollect
          :share-time="vm.collectPathObj.shareTime"
          @get-collect-status="getCollectStatus"
          @get-user-name="getUserName"
        ></ContractCollect>
      </view>
      <view v-else class="no-need-collect">
        <view class="icon">
          <text v-if="['1', '2'].includes(collectStatus)" class="iconfont icon-jinggao"></text>
          <text v-if="collectStatus === '3'" class="iconfont icon-yiwancheng"></text>
        </view>
        <view class="content">
          <view class="contentInfo">{{ linkrotText }}</view>
          <view v-if="collectStatus === '1'" class="contentDesc">可联系微信好友重新发起邀请</view>
        </view>
      </view>
    </view>
    <view v-if="collectStatus === '0'" class="placeholderBtn"></view>
  </view>
</template>

<script setup lang="ts">
import ContractCollect from '@/pages/member/myinfo/contractCollect/CollectInfo.vue'
import { CollectPathObj } from '@/interfaces/member/myinfo/contractCollect'
import { decodeBase64, getUrlParam } from '@/utils/crypto'
import apiSignInfo from '@/api/member/api.signInfo'
// import { onShow } from '@dcloudio/uni-app'
// import { getStorage, removeStorage } from '@/utils/storages'
import { onBeforeRouteLeave } from '@/uni-simple-router'
const collectStatus = ref('0') // 【0=正常录入/1=链接失效/2=客户经理已完善/3=提交成功】
const linkrotText = ref('')
const userName = ref('')
let finishHr = ref('') // 剩余小时
let finishMin = ref('') // 剩余分钟
let finishSec = ref('') // 剩余秒
let collectPathObj: CollectPathObj = {
  // 融资企业通过分享链接跳入带入的参数
  refcode: 0,
  verifySign: 0,
  shareTime: 0
}
let vm = reactive({
  collectPathObj: collectPathObj
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-12-08 17:42:00
 * @param {*} userName
 * @return {*}
 * @description: 获取客户经理名称
 */
const getUserName = name => {
  userName.value = name
}
const getCollectStatus = (status: string) => {
  collectStatus.value = status
  if (collectStatus.value === '1') {
    linkrotText.value = '邀请已过期'
  } else if (collectStatus.value === '2') {
    linkrotText.value = '客户经理已完善信息'
  } else if (collectStatus.value === '3') {
    linkrotText.value = '提交成功'
  }
  // removeStorage('loanOrgInfo')
  // removeStorage('loanOrgTransferLinkInfo')
  // removeStorage('fconScmVo')
  // removeStorage('buyerInfoList')
  // removeStorage('suretyEnterpriseList')
  // removeStorage('suretyPersonList')
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-12-08 15:57:29
 * @return {*}
 * @description: 倒计时
 */
const countdown = startTime => {
  const endTime = startTime + 1000 * 60 * 60 * 24
  // const endTime = startTime + 1000 * 60 * 10
  const nowTime = new Date().getTime()
  const msec = endTime - nowTime //  计算失效时间与当前时间差
  if (msec < 0) {
    getCollectStatus('1')
    return
  }
  // let temH = (msec / 1000 / 60 / 60) % 24
  // eslint-disable-next-line no-extra-parens
  const hr = Number(parseInt(((msec / 1000 / 60 / 60) % 24).toString()))
  // eslint-disable-next-line no-extra-parens
  const min = Number(parseInt(((msec / 1000 / 60) % 60).toString()))
  // eslint-disable-next-line no-extra-parens
  const sec = Number(parseInt(((msec / 1000) % 60).toString()))
  // console.error(hr, min, sec)
  finishHr.value = hr > 9 ? hr.toString() : '0' + hr
  finishMin.value = min > 9 ? min.toString() : '0' + min
  finishSec.value = sec > 9 ? sec.toString() : '0' + sec
  // if (min >= 0 && sec >= 0) {
  // if (min === 0 && sec === 0) {
  //   return
  // }
  setTimeout(function () {
    countdown(startTime)
  }, 1000)
  // }
}

if (getUrlParam('data')) {
  vm.collectPathObj = JSON.parse(decodeBase64(getUrlParam('data'))) as CollectPathObj
  countdown(vm.collectPathObj.shareTime) // 计算倒计时
  apiSignInfo.getLoanOrgInfo({ refcode: vm.collectPathObj.refcode }).then(res => {
    userName.value = res.data.loanOrgInfo.managerMc
  })
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-10 14:17:08
 * @return {*}
 * @description: 前往子页面补录信息，缓存数据,跳转至列表页时清除缓存数据
 */
onBeforeRouteLeave(() => {
  if (['1', '2', '3'].includes(collectStatus.value)) {
    return false
  }
})
</script>

<style lang="scss" scoped>
.box {
  min-height: 100vh;
  background-color: rgba(242, 242, 242);
}

.head {
  width: 100%;
  position: relative;
  height: 365rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 365rpx;
    // z-index: -1;
  }
  .logo {
    position: absolute;
    width: 76rpx;
    height: 76rpx;
    top: 60rpx;
    left: 30rpx;
  }
  .gather {
    position: absolute;
    width: 271rpx;
    height: 158rpx;
    top: 115rpx;
    right: 0;
    // opacity: 0.3;
  }
  .head-text {
    position: relative;
    color: #fff;
    padding-top: 56rpx;
    padding-left: 126rpx;
    .title {
      font-size: 34rpx;
    }
    .desc {
      margin-top: 16rpx;
      line-height: 38rpx;
      font-size: 28rpx;
    }
  }
}
.collect-body {
  margin: -90rpx 30rpx 0;
  padding-top: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  // box-shadow: 2rpx 2rpx 6rpx 6rpx rgba(0, 0, 0, 0.1);
  position: relative;
  .count-down {
    font-size: 32rpx;
    margin-bottom: 30rpx;
    text-align: center;
    height: 48rpx;
    .danger {
      color: $danger;
    }
  }
  :deep(.button-fixed-bottom .placeholder) {
    height: 0;
  }
  .no-need-collect {
    padding: 90rpx 30rpx 300rpx;
    height: 750rpx;
    box-sizing: border-box;
    text-align: center;
    .icon {
      .iconfont {
        font-size: 90rpx;
      }
      .icon-jinggao {
        color: $danger;
      }
      .icon-yiwancheng {
        color: $primary;
      }
    }
    .contentInfo {
      margin-top: 50rpx;
      font-weight: bold;
      font-size: 36rpx;
    }
    .contentDesc {
      margin-top: 30rpx;
      font-size: 30rpx;
      color: $sub-color;
    }
  }
}
.placeholderBtn {
  width: 100%;
  padding: 60rpx 0;
}
</style>
