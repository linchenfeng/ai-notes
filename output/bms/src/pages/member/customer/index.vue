<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:35:11
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:55:14
 * @Description  : 客户 /member/customer
-->
<template>
  <NavBar>
    <span v-if="getHasPermissionsById('member:customer:statistics')" class="inviteWrite" @click="router.push(statisticsPath)">统计查询</span>
  </NavBar>
  <!-- 客户页面 -->
  <view class="contentBox">
    <view class="search-box">
      <u-search
        v-model="search.data.orgname"
        v-insert-clear:[search.data.orgname]="resetSearch"
        :clearabled="false"
        shape="round"
        :search-icon-size="0"
        placeholder-color="#999"
        placeholder="请输入企业名称"
        :action-style="{ color: '#395fee' }"
        @search="onSearch"
        @custom="onSearch"
      />
    </view>
    <view class="u-list-item">
      <uni-list v-if="vm.companyInfoList && vm.companyInfoList.length">
        <uni-list-item v-for="item in vm.companyInfoList" :key="item.refcode" clickable @tap="viewDetail(item)">
          <CompanyInfo :company-info="item" :show-invited="true" />
        </uni-list-item>
        <view v-if="finished" class="list-is-finished">已经到底了</view>
      </uni-list>
      <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
    </view>
  </view>
  <Tabbar />
</template>
<script lang="ts">
export default {
  name: 'Customer',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import Tabbar from '@/layout/Tabbar.vue'
import NavBar from '@/layout/NavBar.vue'
import apiCustormer from '@/api/member/api.custormer'
import CompanyInfo from './components/CompanyInfo.vue'
import { CustomerInfo } from '@/interfaces/member/customer'
import { encodeBase64 } from '@/utils/crypto'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { $messageSkip } from '@/hooks/memberMinxin'
import apiAuthz from '@/api/common/api.authz'
import { getHasPermissionsById } from '@/utils/permissions'
// import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
const router = useRouter()
const finished = ref(false)
// 定义数据
const vm = reactive({
  companyInfoList: Array<CustomerInfo>()
})

let search = reactive({
  data: {
    orgname: '' // 企业名称
  },
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
})
let totalCount = 0 //总条数
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 09:44:36
 * @description: 获取我的客户列表数据
 */
const findCustomInfoPage = (): void => {
  apiCustormer.findCustomInfoPage(search).then(res => {
    if (res.data.fbpaOrgMVoList && res.data.fbpaOrgMVoList.length) {
      vm.companyInfoList.push(...res.data.fbpaOrgMVoList)
    }
    totalCount = res.totalCount as number
    if (vm.companyInfoList.length === totalCount && totalCount > 0) {
      finished.value = true
    }
  })
}
const findFunPathRecursive = (data, funId) => {
  for (const item of data) {
    if (item.funid === funId) {
      return item.funPath
    }
    if (item.childFuns && item.childFuns.length > 0) {
      const foundInChild = findFunPathRecursive(item.childFuns, funId)
      if (foundInChild) {
        return foundInChild
      }
    }
  }
  return null
}

const statisticsPath = ref('')
const getMenuList = () => {
  apiAuthz.getMenuList('member:customer').then(res => {
    const menuList = res.data.menuList
    statisticsPath.value = findFunPathRecursive(menuList, 'member:customer:statistics')
  })
}
onMounted(() => {
  getMenuList()
  // 初始化数据
  findCustomInfoPage()
  // 模板消息中转跳转
  $messageSkip()
})

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 09:43:40
 * @param {*} void
 * @return {*}
 * @description: 上滑加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount / search.pageSize)) {
    search.pageNum++
    findCustomInfoPage()
  }
})
// 下拉
onPullDownRefresh(() => {
  search.pageNum = 1 // 刷新数据初始化pageNum
  vm.companyInfoList = []
  finished.value = false
  findCustomInfoPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 09:42:55
 * @return {*}
 * @description: 点击跳转至详情页面(refcode:企业流水号)
 */
const viewDetail = item => {
  let refcode = encodeBase64(item.refcode)
  router.push(`/member/customer/detail/${refcode}`)
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 09:45:27
 * @param {*} val
 * @return {*}
 * @description: 输入企业名称搜索
 */
const onSearch = val => {
  search.data.orgname = val
  search.pageNum = 1 // 搜索时初始化页码
  finished.value = false
  vm.companyInfoList = []
  findCustomInfoPage()
}
const resetSearch = () => {
  search.data.orgname = ''
  onSearch('')
}
</script>
<style lang="scss" scoped>
.search-box {
  border-bottom: 1rpx solid $border-color;
}
.inviteWrite {
  color: #fff;
  font-size: 14px;
}
.u-list-item {
  margin: 0 30rpx;
}
// .view-u-list-item {
//   margin: 0 30rpx;
// }
.png {
  cover-image {
    width: 368rpx;
  }
}
.ball-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ball {
  /*设置动画盒子的整体样式*/
  width: 150px; /*设置整体大小*/
  height: 100px;
  text-align: center; /*设置对齐方式*/
  color: #fff; /*设置文字颜色*/
  background: rgba(0, 0, 0, 0.7); /*设置背景颜色*/
  margin: 20px auto;
  border-radius: 15px;
}

.ball > p {
  /*设置加载的提示文字的样式*/
  padding: 18px 0;
}

.ball > div {
  /*设置动画中三个小球的样式*/
  width: 15px; /*设置大小*/
  height: 15px;
  background: #1abc9c; /*设置背景颜色*/
  border-radius: 100%; /*设置圆角边框*/
  display: inline-block; /*设置其显示方式*/
  animation: move 1.4s infinite ease-in-out both; /*添加动画*/
}

.ball .ball1 {
  /*设置第一个小球的动画延迟*/
  animation-delay: 0.16s;
}

.ball .ball2 {
  /*设置第二个小球的动画延迟*/
  animation-delay: 0.32s;
}

.ball .ball3 {
  /*设置第二个小球的动画延迟*/
  animation-delay: 0.48s;
}

@keyframes move {
  /*创建动画*/
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
