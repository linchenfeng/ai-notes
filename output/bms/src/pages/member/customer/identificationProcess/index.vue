<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-10 22:49:47
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-08 15:10:27
 * @LastEditors  : longcan.Yangme : 2022-10-27 14:07:54
 * @Description  : 我的客户详情页面 认证进度模块
-->
<template>
  <view class="operationContainer identifyProcess">
    <ty-info-card>
      <template #subtitle>
        <view class="operation">
          <view class="operationName">
            <view>{{ '认证进度' }}</view>
          </view>
          <view class="autherized">
            {{
              Number(props.sigStatus) >= 2 && Number(props.authStatus) !== 8
                ? sigStatusNode[Number(props.sigStatus)]
                : authenticationNode[Number(props.authStatus)]
            }}
          </view>
        </view>
      </template>
      <view v-if="getHasPermissionsById('member:customer')" class="detail">
        <view class="line">
          <view class="node" @click="viewDetil('authStatus', ['1'])">
            <view class="image-con">
              <cover-image :src="Number(props.authStatus) >= 1 ? zhuce1 : zhuce" alt="注册" />
            </view>
            <text :class="['text', Number(props.authStatus) >= 1 ? 'textBlue' : 'textGray']">已注册</text>
            <view v-if="!['2', '3', '4'].includes(props.sigStatus) && props.authStatus === '1'" class="click-datail click-datail-type1">查详情</view>
          </view>
          <view class="arrowsIn">
            <cover-image :src="Number(props.authStatus) >= 2 ? right1 : right" alt="" />
          </view>
          <view class="node" @click="viewDetil('authStatus', ['2', '3'])">
            <view class="image-con"><cover-image :src="Number(props.authStatus) >= 2 ? renzheng1 : renzheng" alt="认证" /></view>
            <text :class="['text', Number(props.authStatus) >= 2 ? 'textBlue' : 'textGray']">认证中</text>
            <view v-if="!['2', '3', '4'].includes(props.sigStatus) && ['2', '3'].includes(props.authStatus)" class="click-datail click-datail-type1">
              查详情
            </view>
          </view>
          <view class="arrowsIn">
            <cover-image :src="Number(props.authStatus) >= 8 ? right1 : right" alt="" />
          </view>
          <view class="node" @click="viewDetil('authStatus', ['8', '9'])">
            <view class="image-con"><cover-image :src="Number(props.authStatus) >= 8 ? shenhe1 : shenhe" alt="审核" /></view>
            <text :class="['text', Number(props.authStatus) >= 8 ? 'textBlue' : 'textGray']">已实名</text>
            <view v-if="!['2', '3', '4'].includes(props.sigStatus) && ['8', '9'].includes(props.authStatus)" class="click-datail click-datail-type2">
              查详情
            </view>
          </view>
        </view>
        <view class="middleLine">
          <view class="arrowsOut">
            <cover-image :src="Number(props.sigStatus) >= 2 && Number(props.authStatus) !== 8 ? down1 : down" alt="图片" />
          </view>
        </view>
        <view class="line">
          <view class="node" @click="viewDetil('sigStatus', ['4'])">
            <view class="image-con"><cover-image :src="Number(props.sigStatus) >= 4 ? yiqianshou1 : yiqianshou" alt="已签收" /></view>
            <text :class="['text', Number(props.sigStatus) >= 4 ? 'textBlue' : 'textGray']">已签收</text>
            <view v-if="props.sigStatus === '4'" class="click-datail click-datail-type1">查详情</view>
          </view>
          <view class="arrowsIn">
            <cover-image :src="Number(props.sigStatus) >= 4 ? left1 : left" alt="" />
          </view>
          <view class="node" @click="viewDetil('sigStatus', ['3'])">
            <view class="image-con"><cover-image :src="Number(props.sigStatus) >= 3 ? yijisong1 : yijisong" alt="已寄送" /></view>
            <text :class="['text', Number(props.sigStatus) >= 3 ? 'textBlue' : 'textGray']">已寄送</text>
            <view v-if="props.sigStatus === '3'" class="click-datail click-datail-type1">查详情</view>
          </view>
          <view class="arrowsIn">
            <cover-image :src="Number(props.sigStatus) >= 3 ? left1 : left" alt="" />
          </view>
          <view class="node" @click="viewDetil('sigStatus', ['2'])">
            <view class="image-con">
              <cover-image :src="Number(props.sigStatus) >= 2 && Number(props.authStatus) !== 8 ? zhizhen1 : zhizhen" alt="制证" />
            </view>
            <text :class="['text', Number(props.sigStatus) >= 2 && Number(props.authStatus) !== 8 ? 'textBlue' : 'textGray']">已制证</text>
            <view v-if="props.sigStatus === '2'" class="click-datail click-datail-type2">查详情</view>
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'IdentificationProcess'
}
</script>
<script setup lang="ts">
import right from '@/assets/member/customer/identifyProcess/right.png'
import right1 from '@/assets/member/customer/identifyProcess/right1.png'
import left from '@/assets/member/customer/identifyProcess/left.png'
import left1 from '@/assets/member/customer/identifyProcess/left1.png'
import down from '@/assets/member/customer/identifyProcess/down.png'
import down1 from '@/assets/member/customer/identifyProcess/down1.png'
import zhuce from '@/assets/member/customer/identifyProcess/zhuce.png'
import zhuce1 from '@/assets/member/customer/identifyProcess/zhuce1.png'
import renzheng from '@/assets/member/customer/identifyProcess/renzheng.png'
import renzheng1 from '@/assets/member/customer/identifyProcess/renzheng1.png'
import shenhe from '@/assets/member/customer/identifyProcess/shenhe.png'
import shenhe1 from '@/assets/member/customer/identifyProcess/shenhe1.png'
import zhizhen from '@/assets/member/customer/identifyProcess/zhizhen.png'
import zhizhen1 from '@/assets/member/customer/identifyProcess/zhizhen1.png'
import yijisong from '@/assets/member/customer/identifyProcess/yijisong.png'
import yijisong1 from '@/assets/member/customer/identifyProcess/yijisong1.png'
import yiqianshou from '@/assets/member/customer/identifyProcess/yiqianshou.png'
import yiqianshou1 from '@/assets/member/customer/identifyProcess/yiqianshou1.png'
import { encodeBase64 } from '@/utils/crypto'
import { getHasPermissionsById } from '@/utils/permissions'

import { useRouter } from '@/uni-simple-router'
// 公众号消息跳入默认展开
const authenticationNode = {
  0: '未注册',
  1: '已注册',
  2: '认证中',
  3: '认证中',
  8: '已认证',
  9: '已认证'
}
const sigStatusNode = {
  2: '已制证',
  3: '已寄送',
  4: '已签收'
}
// 根据需求，此处使用authStatus及sigStatus来判断认证节点
//authStatus【0=未注册/1=已注册/2,3=认证中/8,9=已认证】
//sigStatus【2=已制证/3=已寄送/4=已签收】
const props = defineProps({
  refcode: { type: Number, required: true }, //企业流水号
  authStatus: { type: String, require: true, default: '-1' }, // 认证状态[0=未入驻/1=未认证/2=审核中/3=审核打回/8=审核拒绝/9=已认证]
  sigStatus: { type: String, require: true, default: '-1' } //签章状态[0=未申请/1=申请中/2=已生效/3=已寄送/4=已签收]
})
let router = useRouter()
const viewDetil = (type, status) => {
  // 点击最新状态才能跳转  authStatus=8时为绑定ukey此时仅显示已认证
  if (Number(props.sigStatus) >= 2 && Number(props.authStatus) !== 8) {
    if (type === 'sigStatus' && status.includes(props.sigStatus)) {
      router.push(`/member/customer/identificationProcess/detail/${encodeBase64(props.refcode)}`)
    } else {
      return
    }
  }
  if (Number(props.sigStatus) < 2 || Number(props.authStatus) === 8) {
    if (type === 'authStatus' && status.includes(props.authStatus)) {
      router.push(`/member/customer/identificationProcess/detail/${encodeBase64(props.refcode)}`)
    } else {
      return
    }
  }
}
</script>

<style lang="scss" scoped>
uni-cover-image {
  overflow: inherit;
}
.detail {
  padding-top: 20rpx;
  // padding-right: 60rpx;
  .line {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    cover-image {
      width: 54rpx;
      height: 54rpx;
      vertical-align: middle;
    }
    .arrowsIn {
      // margin-top: 4rpx;
      display: flex;
      align-items: center;
      cover-image {
        margin-top: -60rpx;
        width: 54rpx;
        height: 10rpx;
      }
    }
    .image-con {
      display: block;
      text-align: center;
    }
    .text {
      line-height: 66rpx;
      margin-left: 4rpx;
      &.textGray {
        color: $remark-color;
      }
      &.textBlue {
        color: #0f6dd2;
      }
    }
  }
  .arrowsOut {
    // height: 60rpx;
    text-align: right;
    padding-right: 40rpx;
    cover-image {
      width: 10rpx;
      height: 60rpx;
    }
  }
  .click-datail {
    width: 100rpx;
    height: 36rpx;
    background: linear-gradient(90deg, #ffae27, #ffae27);
    color: #fff;
    font-size: 22rpx;
    line-height: 36rpx;
    text-align: center;
    position: absolute;
  }
  .click-datail-type1 {
    border-radius: 18rpx 18rpx 18rpx 0rpx;
    left: 60rpx;
    top: -20rpx;
  }
  .click-datail-type2 {
    border-radius: 18rpx 18rpx 0rpx 18rpx;
    left: -80rpx;
    top: -20rpx;
  }
  .node {
    position: relative;
  }
}
</style>
