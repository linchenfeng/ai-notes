<!--
 * @Author       : may.ruan
 * @Date         : 2025-10-20 10:29:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-13 14:37:54
 * @Description  : 项目-业务洞察 /member/project/query/business?id=XXX
-->
<template>
  <NavBar />
  <Superset funid="member:project:query:business" @loading-change="loadingChange">
    <view v-if="hasVisibleMenu && supersetLoadingStatus === 'success'" class="main">
      <view class="menu-list">
        <view class="title">业务透视</view>
        <view class="cell-box">
          <view
            v-for="child in menuList"
            v-show="isMenuVisible(child)"
            :key="child.funid"
            :class="`driver${child.refcode}`"
            class="menu-cell"
            @click="handelClickRowAciton(child)"
          >
            <view class="icon-box"><text class="iconfont-menu" :class="child.icon"></text></view>
            <view class="fun-desc">{{ child.funDesc }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="hasVisibleMenu" class="temp"></view>
  </Superset>
</template>
<script lang="ts">
import { getHasPermissionsById } from '@/utils/permissions'
import apiAuthz from '@/api/common/api.authz'
export default {
  name: 'Business',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import Superset from '@/components/superset/index.vue'
import { useRouter } from '@/uni-simple-router'
import { MenuItem } from '@/interfaces/common/menu'
import { getStorage } from '@/utils/storages'
import { useDriverGuide } from '@/hooks/useDriverGuide'
const userName = getStorage('userName') as string
const { initDriver } = useDriverGuide()
const router = useRouter()
const supersetLoadingStatus = ref<'success' | 'error'>() //bi面板是否加载成功
const menuList = ref<MenuItem[]>([])
// 存储需要指引的菜单列表（接口返回后赋值）
const guideMenuList = ref<MenuItem[]>([])
interface FoundItem {
  refcode: number | string
  index: number | string // 记录当前项在同级数组中的索引
  funid: string
}
interface MenuGuideUser {
  userName: string
  flag: string
}
/**
 * 判断单个菜单项是否可见
 * @param item 菜单项
 * @returns 是否可见
 */
const isMenuVisible = (item: MenuItem): boolean => {
  // eslint-disable-next-line no-extra-parens
  return (item.funid && getHasPermissionsById(item.funid)) || !item.funid
}
/**
 * 计算属性：判断是否有至少一个可展示的菜单项
 * 用于控制整个插槽内容的显示隐藏
 */
const hasVisibleMenu = computed(() => {
  // 遍历menuList，判断是否存在可见的菜单项
  return menuList.value.some(item => isMenuVisible(item))
})
/**
 * 递归查找指定funid的节点的childFuns
 * @param nodes 菜单节点数组
 * @param targetFunId 要查找的funid
 * @returns 匹配节点的childFuns，未找到则返回空数组
 */
function findChildFunsByFunId(nodes, targetFunId: string) {
  // 遍历当前层级的节点
  for (const node of nodes) {
    // 找到目标funid，返回其childFuns
    // 边界处理：节点不是对象或没有funid属性，跳过
    if (!node || typeof node !== 'object' || !('funid' in node)) {
      continue
    }
    if (node.funid === targetFunId) {
      return node.childFuns
    }
    // 递归遍历子节点，查找目标
    const childResult = findChildFunsByFunId(node.childFuns, targetFunId)
    // 如果子节点中找到，直接返回结果
    if (childResult.length > 0) {
      return childResult
    }
  }
  // 未找到目标，返回空数组
  return []
}
const handelClickRowAciton = (item): void => {
  router.push(item.funPath)
}
/**
 * 执行新手指引初始化（封装为独立方法）
 */
const initDriverGuide = () => {
  // 前置条件：1. superset加载成功 2. 有需要指引的菜单 3. 当前用户未完成指引
  if (supersetLoadingStatus.value !== 'success' || !guideMenuList.value.length) {
    return
  }
  let userList = getStorage('overDueGuides') as MenuGuideUser[]
  userList = userList || []
  const hasFinishedGuide = userList.some(item => item.userName === userName && item.flag === '1')
  if (hasFinishedGuide) {
    return
  }
  // 构造指引菜单列表
  const list: FoundItem[] = []
  guideMenuList.value.forEach(item => {
    const realIndex = menuList.value.findIndex(menuItem => menuItem.funid === item.funid)
    list.push({
      funid: item.funid,
      refcode: item.refcode,
      index: `bi${realIndex % 4}`
    })
  })
  // 延迟执行，确保DOM渲染完成
  setTimeout(() => {
    initDriver(list, 'overDueGuides')
  }, 500)
}

const getMenuList = () => {
  apiAuthz.getMenuList('member:project').then(res => {
    menuList.value = findChildFunsByFunId(res.data.menuList, 'member:project:query:business')
    // 筛选需要做指引的菜单
    const targetList: string[] = ['member:project:query:business:overdue']
    guideMenuList.value = menuList.value.filter(item => targetList.includes(item.funid))
    // 接口返回后，立即尝试执行指引初始化（若superset已加载成功）
    initDriverGuide()
  })
}
const loadingChange = (status: 'success' | 'error') => {
  supersetLoadingStatus.value = status
  if (status === 'success') {
    initDriverGuide()
  }
}
// 初始化时立即调用接口获取菜单数据
onMounted(() => {
  getMenuList()
})
</script>
<style lang="scss" scoped>
.cell-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 关键：强制每行靠左对齐（默认值，可省略） */
  gap: 10rpx;
  .menu-cell {
    min-width: 120rpx;
    flex: 1;
    margin-bottom: 24rpx;
    text-align: center;
    position: relative;
    font-size: 26rpx;
    .fun-desc {
      color: #000;
    }
    .icon-box {
      min-height: 67rpx;
      margin-bottom: 20rpx;
      .iconfont-menu {
        font-size: 67rpx;
      }
    }
    .subTitle {
      font-size: 30rpx;
      color: #333;
    }
  }
}
.title {
  font-size: 26rpx;
  margin-bottom: 32rpx;
  font-weight: bold;
}
.main {
  padding: 0 32px 0 32px;
  background: #f7f7f7;
}
.menu-list {
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 4px;
  padding: 40rpx 23rpx 0;
}
.temp {
  height: 180rpx;
  background: #f7f7f7;
}
</style>
