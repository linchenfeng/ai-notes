<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 09:54:18
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-19 18:56:21
 * @Description  : 项目首页 /member/project
-->
<template>
  <NavBar bg-color="#2b5cf8" />
  <!-- 展示客户指引 -->
  <view class="project-index-main">
    <cover-image class="wenan" src="@/assets/member/project/wenan.png" alt="wenan"></cover-image>
    <view
      v-for="item in vm.menuList"
      v-show="(item.funid && getHasPermissionsById(item.funid) && !isEmpty(item.childFuns)) || !item.funid"
      :key="item.funid"
      inset
      class="card-box"
    >
      <view class="title">{{ item.funDesc }}</view>
      <view class="cell-box">
        <view
          v-for="child in item.childFuns"
          v-show="(child.funid && getHasPermissionsById(child.funid)) || !child.funid"
          :key="child.funid"
          :class="`driver${child.refcode}`"
          class="menu-cell"
          @click="handelClickRowAciton(child)"
        >
          <view class="icon-box"><text class="iconfont-menu" :class="child.icon"></text></view>
          <!-- <view class="subTitle">{{ child.funDesc }}</view> -->
          <view v-for="(funitem, index) in splitByFirstLeftParen(child.funDesc as string)" :key="index" class="subTitle">{{ funitem }}</view>
          <u-badge v-if="child.badgeValue" :show-zero="true" :value="child.badgeValue" max="99"></u-badge>
        </view>
      </view>
    </view>
    <!-- 指引完成底部正常展示 -->
    <Tabbar v-if="!showGuide" />
    <!-- 指引期间底部高亮 -->
    <cover-image v-else class="tab" src="@/assets/member/project/projecttab.png" alt="指引" mode="widthFix" />
  </view>
</template>

<script lang="ts">
export default {
  name: 'MemberHome'
}
</script>

<script lang="ts" setup>
import Tabbar from '@/layout/Tabbar.vue'
import NavBar from '@/layout/NavBar.vue'
import { useRouter } from '@/uni-simple-router'
import { getHasPermissionsById } from '@/utils/permissions'
// import { showToast } from '@/utils/uniapp/toast'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { $messageSkip, $wxLogin } from '@/hooks/memberMinxin'
import { webLoading } from '@/utils/uniapp/toast'
import apiAuthz from '@/api/common/api.authz'
import { MenuItem, TodoData } from '@/interfaces/common/menu'
import { getStorage } from '@/utils/storages'
import { isEmpty } from '@/utils/validate'
import { useDriverGuide } from '@/hooks/useDriverGuide'
const userName = getStorage('userName') as string
const { initDriver, checkMenuHasTargetFunids, setGuideCloseCallback } = useDriverGuide()
const router = useRouter()
const miniLoading = ref<any>({}) // webloading
const menuList: MenuItem[] = []
const todoData: TodoData = {}
const getMenuFlag = ref(false) // 是否获取了菜单数据
const getToDoFlag = ref(false) // 是否获取了代办数据
let showGuide = ref(false) //是否展示新手指引tab
interface MenuGuideUser {
  userName: string
  flag: string
}
setGuideCloseCallback(() => {
  showGuide.value = false // 指引关闭后，隐藏高亮 Tab，显示正常 Tabbar
})
const vm = reactive({
  menuList,
  todoData
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 14:40:53
 * @param {*} item
 * @description: 跳转页面
 */
const handelClickRowAciton = (item): void => {
  router.push(item.funPath)
}
// 设置代办数量
const setBadgeValue = menuList => {
  // 代办funid集合
  const todoDataKeys = Object.keys(vm.todoData)
  const todoDataKeySet = new Set(todoDataKeys)
  const processMenuItems = items => {
    items.forEach(item => {
      if (item.funid && todoDataKeySet.has(item.funid)) {
        item.badgeValue = vm.todoData[item.funid]
      }
      // 递归处理子菜单
      if (item.childFuns && item.childFuns.length) {
        processMenuItems(item.childFuns)
      }
    })
  }
  processMenuItems(menuList)
}
// 监听菜单和代办接口，当两接口都返回成功时，调用 setBadgeValue 方法
watch([getMenuFlag, getToDoFlag], ([menuFlag, todoFlag]) => {
  if (menuFlag && todoFlag) {
    setBadgeValue(vm.menuList)
  }
})
/**
 * @Author: Longcan.Yang
 * @Date: 2025-07-28 15:33:03
 * @description: 项目——待办统计
 */
const getMyTodoDataStatistics = () => {
  getToDoFlag.value = false
  apiAuthz.getMyTodoDataStatistics().then(res => {
    vm.todoData = res.data
    getToDoFlag.value = true
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-07-28 15:33:03
 * @description: 获取菜单
 */
const getMenuList = () => {
  getMenuFlag.value = false
  apiAuthz.getMenuList('member:project').then(res => {
    vm.menuList = res.data.menuList
    getMenuFlag.value = true
    //业务申请菜单
    const needBindFlag = getStorage('needBindFlag') // 每次登录需要绑定openid
    // 原始需要做指引的菜单
    const targetList: string[] = ['member:project:audit:invoice', 'member:project:query:business']
    // 当前权限是否包含需要做指引的菜单
    const ApplyList = checkMenuHasTargetFunids(vm.menuList, targetList)
    let userList = getStorage('queryBusinessGuides') as MenuGuideUser[]
    userList = userList || []
    // 当前登陆人是否已完成新手指引
    const flag = userList.some(item => item.userName === userName && item.flag === '1')
    if (ApplyList && ApplyList.length && !flag && !needBindFlag) {
      const hasPermission = ApplyList && ApplyList.length
      if (hasPermission) {
        setTimeout(() => {
          initDriver(ApplyList, 'queryBusinessGuides')
          showGuide.value = true
        }, 500)
      }
    }
  })
}
const splitByFirstLeftParen = (str: string): string[] => {
  // 确保输入为字符串，非字符串则转为空字符串
  const targetStr = typeof str === 'string' ? str : ''
  // 分别获取'('和'/'首次出现的位置（-1表示未出现）
  const firstParenIndex = targetStr.indexOf('(')
  const firstSlashIndex = targetStr.indexOf('/')
  // 收集所有出现过的符号位置（过滤掉-1）
  const positions = [firstParenIndex, firstSlashIndex].filter(pos => pos !== -1)
  // 如果没有任何符号，直接返回原字符串数组
  if (positions.length === 0) {
    return [targetStr]
  }
  // 取最早出现的符号位置作为切割点
  const firstSpecialIndex = Math.min(...positions)
  // 切割为两部分：符号前的内容 + 符号及之后的内容
  const leftPart = targetStr.slice(0, firstSpecialIndex)
  const rightPart = targetStr.slice(firstSpecialIndex)
  return [leftPart, rightPart]
}
onShow(() => {
  getMenuList()
  getMyTodoDataStatistics()
  // 解决IOS底部导航栏返回一直存在遮罩层问题
  const needBindFlag = getStorage('needBindFlag') // 每次登录需要绑定openid
  if (!needBindFlag && miniLoading.value.close) {
    miniLoading.value.close()
  }
})
onLoad(async () => {
  // 模板消息中转跳转
  $messageSkip()
  const needBindFlag = getStorage('needBindFlag') // 每次登录需要绑定openid
  if (needBindFlag) {
    miniLoading.value = await webLoading()
    // 微信权限登录
    // 返回【true=关闭loading/false=开启loading】
    if (!$wxLogin('/member/project')) {
      miniLoading.value.loading()
    } else if (miniLoading.value.close) {
      miniLoading.value.close()
    }
  } else if (miniLoading.value.close) {
    miniLoading.value.close()
  }
})
</script>
<style lang="scss" scoped>
.project-index-main {
  box-sizing: border-box;
  padding: 70rpx 20rpx 0;
  background: url('@/assets/member/project/banner.png') no-repeat top center;
  background-position-y: -40rpx;
  background-size: 100% 457rpx;
  width: 100%;
  padding-bottom: 30rpx;
  .wenan {
    width: 420rpx;
    height: 50rpx;
    margin-bottom: 146rpx;
  }

  .card-box {
    box-sizing: border-box;
    padding: 40rpx 23rpx 0;
    margin-bottom: 20rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: -1rpx 0px 20rpx 1rpx rgba(0, 0, 0, 0.1);
    width: 100%;
    .title {
      font-size: 30rpx;
      margin-bottom: 32rpx;
      font-weight: bold;
    }
    .cell-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start; /* 关键：强制每行靠左对齐（默认值，可省略） */
      gap: 10rpx;
      .menu-cell {
        width: 158rpx;
        margin-bottom: 24rpx;
        text-align: center;
        position: relative;
        .icon-box {
          min-height: 67rpx;
          margin-bottom: 20rpx;
          .iconfont-menu {
            font-size: 67rpx;
          }
        }
        .subTitle {
          font-size: 26rpx;
          color: #333;
        }
        :deep(.u-badge) {
          position: absolute;
          left: 100rpx;
          top: -4rpx;
          padding: 3rpx 8rpx 0;
          background-color: #ff0000;
          color: #fff;
          font-size: 22rpx;
          border-radius: 12rpx 12rpx 12rpx 0px;
        }
      }
    }
  }
}
.tab {
  position: fixed;
  bottom: 0;
  z-index: 9999999;
  height: 88rpx;
  width: 100%;
}
</style>
