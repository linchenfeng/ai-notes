<!--
 * @Author       : Mingchun.Cheng
 * @Date         : 2024-10-14 13:38:17
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-10-30 20:15:59
 * @Description  : 我的邀请码 /member/myinfo/invitationCode
-->
<template>
  <!-- bg-color="#0022bb" -->
  <NavBar />
  <view class="topView">
    <cover-image class="topViewBg" :src="invitationCodeBg3" alt="背景图" />
    <view class="contentView">
      <view class="uni-padding-wrap" :class="itemList[current].tabItemStyle">
        <view v-for="(item, index) in itemList" :key="index" class="tab-item" :class="{ active: index === current }" @click="selectTab(item)">
          <text>{{ item.title }}</text>
        </view>
      </view>
      <view id="qrcode-view" class="content">
        <!--  -->
        <view v-if="!qrcodeImgUrl">
          <view id="show-qrcode">
            <view class="qrcode-con">
              <!-- <cover-image :class="itemList[current].platLogoClass" :src="itemList[current].platLogo" alt="logo图" /> -->
              <div :class="itemList[current].platLogoClass"></div>
            </view>
          </view>
          <view class="managerid-view" :class="current === 2 ? 'ipu-view' : ''">
            <text>{{ obj.invitationCodeInfo.clientManager ? `邀请码：${obj.invitationCodeInfo.clientManager}` : '您还没有自己的专属邀请码哦' }}</text>
          </view>
          <view v-if="obj.invitationCodeInfo.appInvitationCodeLink" class="qrcode-view-con">
            <view class="new-code-container">
              <u-qrcode
                :key="'2'"
                :size="180"
                :val="obj.invitationCodeInfo.appInvitationCodeLink"
                :show-loading="loading"
                :icon="itemList[current].qrCodeLogo"
                @result="saveQRcodePic"
              ></u-qrcode>
            </view>
            <view class="tip-text-con">
              <text class="tip-text">{{ `扫一扫二维码,注册成为${itemList[current].title}会员` }}</text>
            </view>
          </view>
          <view v-else class="qrcode-view-con">
            <view class="code-container">
              <u-qrcode :key="'1'" :size="180" val="uview-plus"></u-qrcode>
            </view>
            <up-button v-if="!loading" class="soon-btn" size="small" type="primary" @click="doGenerateInvitationCodeLink">立即生成</up-button>
          </view>
        </view>
        <!--  -->
        <view v-else class="qrcode-img-con" :class="itemList[current].qrCodeLogoClass">
          <cover-image class="qrcode-img" :src="qrcodeImgUrl" alt="二维码" />
        </view>
      </view>
      <view v-if="obj.invitationCodeInfo.appInvitationCodeLink">
        <view class="url-view">
          <text class="url-text">{{ obj.invitationCodeInfo.pcInvitationCodeLink }}</text>
          <text class="url-btn" @click="copyText">复制</text>
          <up-divider text="长按图片即可保存二维码" :dashed="true"></up-divider>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'Myinfo',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { CodeInfo } from '@/interfaces/member/myinfo/invitationCodeInfo'
import apiInvitationCode from '@/api/member/api.invitationCode'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { encodeBase64 } from '@/utils/crypto'
import invitationCodeBg3 from '@/assets/login/invitationCodeBg-3.png'
import vtcbeQrcodeLogo from '@/assets/login/vtcbe-qrcode-logo.png'
import jyjlQrcodeLogo from '@/assets/login/jyjl-qrcode-logo.png'
import ipuQrcodeLogo from '@/assets/login/interpaylink_logo.png'
import vtcbeLogo from '@/assets/login/vtcbe-logo.png'
import ipuLogo from '@/assets/login/ipu-logo.png'
import jyjlLogo from '@/assets/login/jyjl-logo.png'
import { getPlatform } from '@/utils/uniapp'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import wx from 'jweixin-1.6.0'
import { showToast } from '@/utils/uniapp/toast'
import * as htmlToImage from 'html-to-image'
// import html2canvas from 'html2canvas'
let obj = ref<CodeInfo>({
  invitationCodeInfo: {
    appInvitationCodeLink: '',
    pcInvitationCodeLink: '',
    clientManager: ''
  }
})
const loading = ref(false)
const picFlag = ref(false)
// 功能列表
const itemList = reactive([
  {
    type: '1', // 品牌类型
    platformCode: 'vtcbe', // 品牌代码
    platLogo: vtcbeQrcodeLogo, // 品牌logo
    platLogoClass: 'vtcbe-logo-img', // logo样式
    qrCodeLogo: vtcbeLogo, // 二维码logo
    qrCodeLogoClass: 'vtcbe-img-con', // 生成图片的整体样式
    shareLogo: 'vtcbe-head.png', // 分享链接的样式
    tabItemStyle: 'product-type-title-left',
    title: '电商宝', // 品牌名
    qrcodeImgUrl: '',
    invitationCodeInfo: {
      appInvitationCodeLink: '',
      pcInvitationCodeLink: '',
      clientManager: ''
    }
  },
  {
    type: '2',
    platformCode: 'jyjl',
    platLogo: jyjlQrcodeLogo,
    platLogoClass: 'jyjl-logo-img',
    qrCodeLogo: jyjlLogo,
    qrCodeLogoClass: 'jyjl-img-con',
    shareLogo: 'head.png',
    tabItemStyle: 'product-type-title-medium',
    title: '融逸金链',
    qrcodeImgUrl: '',
    invitationCodeInfo: {
      appInvitationCodeLink: '',
      pcInvitationCodeLink: '',
      clientManager: ''
    }
  },
  {
    type: '3',
    platformCode: 'ipu',
    platLogo: ipuQrcodeLogo,
    platLogoClass: 'ipu-logo-img',
    qrCodeLogo: ipuLogo,
    qrCodeLogoClass: 'ipu-img-con',
    shareLogo: 'ipu-head.png',
    tabItemStyle: 'product-type-title-right',
    title: 'IPU',
    qrcodeImgUrl: '',
    invitationCodeInfo: {
      appInvitationCodeLink: '',
      pcInvitationCodeLink: '',
      clientManager: ''
    }
  }
])
const current = ref(1)
const platformCode = ref('jyjl')
const qrcodeImgUrl = ref()

/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-27 11:19:15
 * @return {*}
 * @description: 分享给融资企业
 */
const doShareInfo = (shareFlag: boolean) => {
  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      // 仅待补充信息能分享朋友
      if (!shareFlag) {
        wx.hideAllNonBaseMenuItem()
      } else {
        wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
        // 解决PC端分享链接title、描述不生效
        wx.onMenuShareAppMessage({
          title: '我的邀请链接', // 分享标题
          desc: '我正在邀请您入驻平台，快来注册吧', // 分享描述
          link: `${window.location.origin}/transfer?url=${encodeBase64(obj.value.invitationCodeInfo.appInvitationCodeLink)}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/${itemList[current.value].shareLogo}` // 分享图标
        })
        wx.updateAppMessageShareData({
          title: '我的邀请链接', // 分享标题
          desc: '我正在邀请您入驻平台，快来注册吧', // 分享描述
          link: `${window.location.origin}/transfer?url=${encodeBase64(obj.value.invitationCodeInfo.appInvitationCodeLink)}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/${itemList[current.value].shareLogo}` // 分享图标
        })
      }
    })

    // #endif
  } else {
    // 小程序端分享
    return {
      title: '我的邀请链接',
      path: obj.value.invitationCodeInfo.pcInvitationCodeLink
    }
  }
}

const selectTab = item => {
  if (loading.value) {
    return
  }
  if (item.type !== String(current.value + 1)) {
    current.value = Number(item.type) - 1
    platformCode.value = item.platformCode
    obj.value.invitationCodeInfo = itemList[current.value].invitationCodeInfo
    qrcodeImgUrl.value = itemList[current.value].qrcodeImgUrl
  }
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2024-10-15 17:31:22
 * @return {*}
 * @description: 生成邀请链接
 */
const doGenerateInvitationCodeLink = () => {
  let data = {
    platformCode: platformCode.value
  }
  loading.value = true
  apiInvitationCode.doGenerateInvitationCodeLink(data).then(
    res => {
      getInvitationCodeLinkByPlatformCode()
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2024-10-15 17:31:12
 * @return {*}
 * @description: 获取邀请链接
 */
const getInvitationCodeLinkByPlatformCode = () => {
  loading.value = true
  apiInvitationCode.getInvitationCodeLinkByPlatformCode(platformCode.value).then(
    res => {
      if (res.data.invitationCodeInfo) {
        obj.value.invitationCodeInfo = res.data.invitationCodeInfo
        itemList[current.value].invitationCodeInfo = res.data.invitationCodeInfo
        doShareInfo(true)
      } else {
        picFlag.value = false
      }
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2024-11-19 17:02:54
 * @return {*}
 * @description: 初始化邀请链接
 */
const initInvitationCode = (index: number, platformCode: string) => {
  apiInvitationCode.getInvitationCodeLinkByPlatformCode(platformCode).then(
    res => {
      if (res.data.invitationCodeInfo) {
        itemList[index].invitationCodeInfo = res.data.invitationCodeInfo
      }
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}

const saveQRcodePic = () => {
  nextTick(() => {
    loading.value = true
    let dom = document.getElementById('qrcode-view') // 需要生成图片内容的 dom 节点
    if (dom) {
      if (getPlatform() === 'H5' && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // IOS端
        htmlToImage
          .toPng(dom)
          .then(() => {
            htmlToImage.toPng(dom).then(() => {
              htmlToImage.toPng(dom).then(() => {
                htmlToImage.toPng(dom).then(imgUrl => {
                  qrcodeImgUrl.value = imgUrl
                  itemList[current.value].qrcodeImgUrl = imgUrl
                  loading.value = false
                  picFlag.value = false
                })
              })
            })
          })
          .catch(err => {
            loading.value = false
          })
      } else {
        // 非IOS，解决图片模糊，瑕疵问题
        htmlToImage
          .toPng(dom)
          .then(imgUrl => {
            qrcodeImgUrl.value = imgUrl
            itemList[current.value].qrcodeImgUrl = imgUrl
            loading.value = false
            picFlag.value = false
          })
          .catch(err => {
            loading.value = false
          })
      }
    }
  })
}

/**
 * @Author: Mingchun.Cheng
 * @Date: 2024-10-15 16:01:04
 * @return {*}
 * @description: 复制
 */
const copyText = () => {
  uni.setClipboardData({
    data: obj.value.invitationCodeInfo.pcInvitationCodeLink,
    success: function () {
      showToast('复制成功')
    }
  })
}

onShow(() => {
  doShareInfo(false)
  getInvitationCodeLinkByPlatformCode()
})
onMounted(() => {
  initInvitationCode(0, 'vtcbe')
  initInvitationCode(1, 'jyjl')
  initInvitationCode(2, 'ipu')
})
</script>
<style lang="scss" scoped>
.topView {
  .topViewBg {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0rpx;
    height: 520rpx;
    background-size: 100% 436rpx;
  }
  .contentView {
    width: calc(100% - 60rpx);
    position: relative;
    top: 300rpx;
    border-radius: 20rpx;
    box-shadow: -0.03125rem 0px 0.625rem 0.03125rem rgba(0, 0, 0, 0.1);
    padding-bottom: 30rpx;
    left: 30rpx;
    right: 0;
    bottom: 0;
    background: white;
    min-height: 700rpx;
    .uni-padding-wrap {
      display: flex;
      border-top-left-radius: 10rpx;
      border-top-right-radius: 10rpx;
      .tab-item {
        width: 50%;
        padding: 30rpx 0;
        border-top-left-radius: 10rpx;
        border-top-right-radius: 10rpx;
        text-align: center;
      }
    }
  }
  .content {
    background-color: #fff;
    .qrcode-con {
      display: flex;
      justify-content: center;
      padding-top: 30rpx;
      .vtcbe-logo-img {
        width: 595rpx;
        height: 60rpx;
        background: url(@/assets/login/vtcbe-qrcode-logo.png) no-repeat center;
        background-size: 100%;
      }
      .jyjl-logo-img {
        width: 291rpx;
        height: 98rpx;
        background: url(@/assets/login/jyjl-qrcode-logo.png) no-repeat center;
        background-size: 100%;
      }
      .ipu-logo-img {
        width: 120rpx;
        height: 128rpx;
        background: url(@/assets/login/interpaylink-logo.png) no-repeat center;
        background-size: 100%;
      }
    }
    .ipu-view {
      padding: 15rpx 30rpx 15rpx 30rpx !important;
    }
    .managerid-view {
      text-align: center;
      padding: 25rpx 0 30rpx;
      font-size: 32rpx;
      font-weight: bold;
    }

    .qrcode-view-con {
      position: relative;
      text-align: center;
      .code-container {
        pointer-events: none;
        .u-qrcode {
          opacity: 0.1;
        }
        :deep(.u-qrcode__canvas) {
          margin: 0 auto;
        }
      }
      .new-code-container {
        :deep(.u-qrcode__canvas) {
          margin: 0 auto;
        }
      }
      .soon-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 32rpx;
        height: 80rpx;
        width: 200rpx;
      }
    }
  }
  .url-view {
    text-align: center;
    margin: 0 20rpx;
    .url-text {
      margin-right: 15rpx;
      font-size: 28rpx;
      color: $sub-color;
    }
    .url-btn {
      color: $primary;
      font-size: 28rpx;
    }
    :deep(.u-divider) {
      width: 80%;
      margin: 15px auto;
      .u-divider__text {
        color: $remark-color !important;
        font-size: 24rpx !important;
      }
    }
  }
  .operation-view {
    text-align: center;
    padding-bottom: 20rpx;
    .btn-container {
      display: inline-block;
      .ope-btn {
        width: 300rpx;
        height: 80rpx;
        font-size: 32rpx;
        margin: 0 auto;
        float: left;
      }
      .save-btn {
        margin-right: 30rpx;
      }
    }
  }
  .active {
    color: $primary;
  }
  .product-type-title-right {
    background-image: url('@/assets/member/myinfo/register-bgc-left.png');
    background-repeat: no-repeat;
    background-position: left;
    background-size: 69% 100%;
  }
  .product-type-title-left {
    background-image: url('@/assets/member/myinfo/register-bgc-right.png');
    background-repeat: no-repeat;
    background-position: right;
    background-size: 69% 100%;
  }
  .product-type-title-medium {
    background-image: url('@/assets/member/myinfo/register-bgc-medium.png');
    background-repeat: no-repeat;
    background-position: left;
    background-size: 100% 100%;
  }
}
.tip-text-con {
  padding: 10rpx 0 25rpx;
}
.tip-text {
  color: $remark-color;
  font-size: 24rpx;
}
.guide-group {
  z-index: 10072;
  .guide-arrows {
    position: fixed;
    z-index: 10072;
    width: 117rpx;
    height: 101rpx;
    top: 8rpx;
    right: 66rpx;
  }
  .guide-tip {
    position: fixed;
    z-index: 10072;
    width: 382rpx;
    height: 100rpx;
    top: 86rpx;
    right: 43rpx;
  }
  .guide-know {
    position: fixed;
    z-index: 10072;
    width: 194rpx;
    height: 78rpx;
    top: 600rpx;
    right: 290rpx;
  }
}
.qrcode-img-con {
  display: flex;
  width: 100%;
  overflow: hidden;
  .qrcode-img {
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 0 auto;
    :first-child {
      background-size: 100% auto !important;
    }
  }
}
</style>
