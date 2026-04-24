<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:35:11
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-19 18:19:39
 * @Description  : 个人中心（我的）/member/myinfo
-->

<template>
  <!-- bg-color="#0022bb" -->
  <NavBar bg-color="#0029c2" />
  <view class="topView">
    <cover-image class="topViewBg" src="@/assets/login/loginBg.png" alt="背景图" />
    <!-- <cover-image class="topViewBg" src="@/assets/member/myinfo/mebg.png"></cover-image> -->
    <view class="contentView">
      <cover-image class="headImg" alt="头部" src="@/assets/member/myinfo/logo.png" />
      <view class="tClass">
        <text>{{ obj.userName }}</text>
        <text v-show="obj.position.length" class="positionClass">/{{ obj.position }}</text>
      </view>
      <view class="tdClass">
        <text class="prClass">{{ obj.department }}</text>
      </view>
      <!-- 列表 -->
      <u-cell-group inset class="card-cell">
        <view v-for="item in itemList" :key="item.id" class="cell-box">
          <u-cell
            v-if="(item.funid && getHasPermissionsById(item.funid)) || !item.funid"
            :is-link="true"
            :class="`driver${item.refcode}`"
            @click="handelClickRowAciton(item)"
          >
            <template #icon>
              <i class="iconfont-bms-colorful" :class="item.iconfont"></i>
              <!-- <cover-image class="leftImg" alt="标题图" :src="item.iconImg" /> -->
            </template>
            <template #title>
              <view class="title-content">
                <text>{{ item.title }}</text>
                <view class="title-badge">
                  <u-badge v-if="item.badgeValue || item.badgeValue === 0" :show-zero="true" :value="item.badgeValue" max="99"></u-badge>
                </view>
              </view>
            </template>
          </u-cell>
        </view>
      </u-cell-group>
    </view>
  </view>
  <!-- 指引完成底部正常展示 -->
  <Tabbar v-if="!showGuide" />
  <!-- 指引期间底部高亮 -->
  <cover-image v-else class="tab" src="@/assets/member/project/myInfoTabs.png" alt="指引" mode="widthFix" />
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
import Tabbar from '@/layout/Tabbar.vue'
import NavBar from '@/layout/NavBar.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import apiMyInfo from '@/api/member/api.myinfo'
import { LoginUser } from '@/interfaces/member/myinfo/myinfo'
import apiSignInfo from '@/api/member/api.signInfo'
import { logOut } from '@/utils/permissions'
import { SipaBurMVoInfo } from '@/interfaces/member/myinfo/contractCollect'
import { useRouter } from '@/uni-simple-router'
import { onShow } from '@dcloudio/uni-app'
import { reLaunch } from '@/utils/uniapp'
import { encodeBase64 } from '@/utils/crypto'
import { useDriverGuide } from '@/hooks/useDriverGuide'
import { getStorage } from '@/utils/storages'
import { MenuItem } from '@/interfaces/common/menu'
const { initDriver, checkMenuHasTargetFunids, setGuideCloseCallback } = useDriverGuide()
// import gatherPng from '@/assets/member/myinfo/gatherPng.png'
// import interest from '@/assets/member/myinfo/interest.png'
// import signing from '@/assets/member/myinfo/signing.png'
// import tuichu from '@/assets/member/myinfo/tuichu.png'
const userName = getStorage('userName') as string
const router = useRouter()
let obj: LoginUser = reactive({
  userName: '',
  imageUuid: '',
  position: '',
  clmStatus: '',
  department: '',
  superiorName: '',
  superior: '',
  userid: ''
})
const search = {
  pageNum: 1,
  pageSize: 10
}
// 功能列表
const itemList = reactive([
  {
    id: 7,
    refcode: 7,
    title: '开票管理',
    iconfont: 'bms-color-fapiao',
    routerUrl: '/member/myinfo/invoice',
    funid: 'member:myinfo:invoice',
    offset: [-20, 90]
  },
  {
    id: 0,
    refcode: 0,
    title: '签约信息收集',
    iconfont: 'bms-color-zhanghuxiugai',
    routerUrl: '/member/myinfo/contractCollect',
    funid: 'member:myinfo:contract',
    badgeValue: 0,
    offset: [-20, 90]
  },
  {
    id: 1,
    refcode: 1,
    title: '逾期利息预缴试算',
    iconfont: 'bms-color-jisuanqi',
    routerUrl: '/member/myinfo/interestTrial',
    funid: 'member:cal:predict',
    badgeValue: 0,
    offset: [-20, 90]
  },
  {
    id: 2,
    refcode: 2,
    title: '预计回款信息反馈',
    iconfont: 'bms-color-fankui',
    routerUrl: '/member/myinfo/paymentInfoFeedback',
    funid: 'member:cal:due',
    badgeValue: 0,
    offset: [-20, 90]
  },
  {
    id: 5,
    refcode: 5,
    title: '我的邀请码',
    iconfont: 'bms-color-fenxiangerweima',
    routerUrl: '/member/myinfo/invitationCode',
    funid: 'member:myinfo:invitationCode'
    // badgeValue: 0,
    // offset: [-20, 90]
  },
  {
    id: 4,
    refcode: 4,
    title: '我的客服',
    iconfont: 'bms-color-kefuguanli',
    routerUrl: '',
    funid: 'member:myinfo:customerService'
  },
  {
    id: 6,
    refcode: 6,
    title: '中登授权',
    iconfont: 'bms-color-zizhibanli',
    routerUrl: '/member/myinfo/zdw',
    funid: 'member:zdw:loginInfo'
  },
  {
    id: 3,
    refcode: 3,
    title: '退出登录',
    iconfont: 'bms-color-lizhishenqing',
    routerUrl: '/member/myinfo/contractCollect',
    funid: ''
  }
])
let sipaBurMVoInfo: SipaBurMVoInfo = reactive({
  expectedPaymentPieces: 0,
  overduePrepaymentPieces: 0
})
let showGuide = ref(false) //是否展示新手指引tab
interface MenuGuideUser {
  userName: string
  flag: string
}
setGuideCloseCallback(() => {
  showGuide.value = false // 指引关闭后，隐藏高亮 Tab，显示正常 Tabbar
})
const totalCount = ref(0)
const findMakingContractPage = () => {
  apiSignInfo.findMakingContractPage(search).then(res => {
    totalCount.value = Number(res.totalCount)
    itemList[1].badgeValue = Number(res.totalCount) // 签约信息收集badgeValue
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-10-24 16:21:25
 * @return {*}
 * @description: 获取数据笔数
 */
const getPiecesInfo = () => {
  apiSignInfo.getPiecesInfo().then(res => {
    sipaBurMVoInfo.expectedPaymentPieces = res.data.sipaBurMVo.expectedPaymentPieces
    sipaBurMVoInfo.overduePrepaymentPieces = res.data.sipaBurMVo.overduePrepaymentPieces
    itemList[2].badgeValue = res.data.sipaBurMVo.overduePrepaymentPieces // 逾期利息预缴试算
    itemList[3].badgeValue = res.data.sipaBurMVo.expectedPaymentPieces // 预计回款信息反馈
  })
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-10-24 16:23:20
 * @return {*}
 * @description: 获取我的信息
 */
const getUserInfo = () => {
  apiMyInfo.getUserInfo().then(res => {
    obj.userName = res.data.loginUser.userName
    obj.department = res.data.loginUser.department
    obj.userid = res.data.loginUser.userid
  })
}
onShow(() => {
  if (getHasPermissionsById('member:myinfo:contract')) {
    findMakingContractPage()
  }
  if (getHasPermissionsById('member:cal:predict,member:cal:due')) {
    getPiecesInfo()
  }
  getUserInfo()
})
onMounted(() => {
  // 原始需要做指引的菜单
  const targetList: string[] = ['member:myinfo:invoice']
  const hasPermissionList = itemList.filter(item => getHasPermissionsById(item.funid))
  // 当前权限是否包含需要做指引的菜单
  const ApplyList = checkMenuHasTargetFunids(hasPermissionList as unknown as MenuItem[], targetList)
  let userList = getStorage('queryMyinfoInvoice') as MenuGuideUser[]
  userList = userList || []
  // 当前登陆人是否已完成新手指引
  const flag = userList.some(item => item.userName === userName && item.flag === '1')
  if (ApplyList && ApplyList.length && !flag) {
    const hasPermission = ApplyList && ApplyList.length
    if (hasPermission) {
      setTimeout(() => {
        initDriver(ApplyList, 'queryMyinfoInvoice', 'myInfo')
        showGuide.value = true
      }, 500)
    }
  }
})
/**
 * @Author: ran.zhu
 * @Date: 2022-10-13 17:33:53
 * @param {*} void
 * @return {*}
 * @description: 退出登录
 */
const handelClickRowAciton = (item): void => {
  if (item.id === 3) {
    // 退出登录
    apiMyInfo.getLogout().then(() => {
      logOut()
      reLaunch('/login')
    })
  } else if (item.id === 4) {
    // 我的客服
    let data = {
      userid: obj.userid,
      platform: 'BMS'
    }
    window.open(`/api-ibusweb/?data=${encodeBase64(JSON.stringify(data))}`, '_blank')
  } else {
    router.push(item.routerUrl)
  }
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-04 16:18:57
 * @description: 跳转至签约信息收集列表页面
 */
// const informationCollection = (routerUrl: string): void => {
//   // router.push('/member/myinfo/interestTrial')
//   router.push(routerUrl)
// }
</script>
<style lang="scss" scoped>
.topView {
  // padding: 0 !important;
  .topViewBg {
    width: 100%;
    position: absolute;
    top: 44px;
    left: 0;
    height: 400rpx;
  }
  // background: url(@/assets/member/myinfo/mebg.png) #dbe8f4 no-repeat center;
  .contentView {
    width: calc(100% - 60rpx);
    // min-height: calc(100vh - 241rpx - 188rpx - 160rpx);
    position: relative;
    top: 270rpx;
    border-radius: 20rpx;
    box-shadow: -0.03125rem 0px 0.625rem 0.03125rem rgba(0, 0, 0, 0.1);
    padding-bottom: 100rpx;
    left: 30rpx;
    right: 0;
    bottom: 0;
    background: white;
    .headImg {
      height: 150rpx;
      width: 150rpx;
      position: absolute;
      left: 42rpx;
      top: -54rpx;
    }
    .tClass {
      margin-left: 212rpx;
      font-size: 32rpx;
      padding: 10rpx 0 0;
      text-align: left;
      min-height: 50rpx;
      span {
        font-size: 32rpx;
        font-weight: bold;
      }
      .positionClass {
        color: #008cd6;
      }
    }

    .tdClass {
      margin-left: 212rpx;
      font-size: 28rpx;
      text-align: left;
      min-height: 40rpx;
      .prClass {
        color: $remark-color;
        font-size: 28rpx;
        font-weight: normal;
      }
    }
    // .lcView {
    //   margin-top: 94rpx;
    //   .lcView-content {
    //     .liView {
    //       display: flex;
    //       flex-direction: row;
    //       align-items: center;
    //       padding: 10rpx 40rpx;
    //       margin-bottom: 40rpx;
    //       .leftImg {
    //         height: 37rpx;
    //         width: 37rpx;
    //       }
    //       .leftView {
    //         display: flex;
    //         position: relative;
    //         // width: 200rpx;
    //         font-size: 32rpx;
    //         margin-left: 31rpx;
    //         flex: 1;
    //       }
    //       .rightImg {
    //         height: 25rpx;
    //         width: 14rpx;
    //         margin-right: 0;
    //       }
    //       :deep(.u-badge) {
    //         padding: 4rpx 14rpx;
    //         background-color: #ebf0ff;
    //         color: #437fff;
    //         font-size: 24rpx;
    //         border-radius: 16rpx 16rpx 16rpx 0;
    //       }
    //     }
    //   }
    // }
    :deep(.u-badge) {
      padding: 4rpx 14rpx;
      background-color: #ebf0ff;
      color: #437fff;
      font-size: 24rpx;
      border-radius: 16rpx 16rpx 16rpx 0;
    }
    :deep(.card-cell.u-cell-group) {
      margin: 0 30rpx;
      padding-top: 50rpx;
      .cell-box {
        &:last-of-type {
          .u-cell {
            border: none;
          }
        }
      }
      .u-cell {
        padding: 30rpx 0;
        border-bottom: 1rpx solid #ededed;
        .u-cell__body {
          height: auto;
          .u-cell__left-icon-wrap {
            margin-right: 20rpx;
          }
          .iconfont-bms-colorful {
            font-size: 88rpx;
          }
        }
      }
    }
    // :deep(.card-cell.u-cell-group) {
    //   margin: 20rpx 40rpx 0;
    //   .iconfont-bms-colorful {
    //     font-size: 88rpx;
    //   }
    //   .u-cell {
    //     padding: 40rpx 0;
    //   }
    // }
  }
}
.title-content {
  display: flex;
  .title-badge {
    position: relative;
    left: 10rpx;
    top: -20rpx;
  }
}
.tab {
  position: fixed;
  bottom: 0;
  z-index: 9999999;
  height: 88rpx;
  width: 100%;
}
:deep(.driver-fix-stacking .driver-highlighted-element) {
  border-bottom: none !important;
}
</style>
