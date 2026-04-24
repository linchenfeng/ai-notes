<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-08 10:30:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-06-23 10:07:46
 * @Description  : 尾部标签栏
-->
<template>
  <view class="vteam-tabbar">
    <u-tabbar
      :fixed="true"
      :placeholder="true"
      :safe-area-inset-bottom="true"
      :border="false"
      :value="activeRouteName"
      active-color="#148aea"
      inactive-color="#b3bfd0"
      @change="changeTabbar"
    >
      <template v-for="item in tabbarList" :key="item.name">
        <u-tabbar-item v-if="getHasPermissionsById(item.funids)" :name="item.router.name" :text="item.title">
          <template #active-icon>
            <image class="image" :src="item.active"></image>
          </template>
          <template #inactive-icon>
            <image class="image" :src="item.inactive"></image>
          </template>
        </u-tabbar-item>
      </template>
    </u-tabbar>
  </view>
</template>
<script lang="ts">
export default {
  name: 'Tabbar',
  options: {
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import customer from '/static/img/tabbar/customer.png'
import customerActive from '/static/img/tabbar/customerActive.png'
import project from '/static/img/tabbar/project.png'
import projectActive from '/static/img/tabbar/projectActive.png'
import myinfo from '/static/img/tabbar/myinfo.png'
import myinfoActive from '/static/img/tabbar/myinfoActive.png'
import { getHasPermissionsById } from '@/utils/permissions'
import { useRoute } from '@/uni-simple-router'
import { redirectTo } from '@/utils/uniapp'
import { $refreshFunids } from '@/hooks/initMinxin'
// const router = useRouter()
const route = useRoute()
const activeRouteName = ref(route?.value?.name) // 当前tabbar选中值
onMounted(() => {
  activeRouteName.value = route.value.name
})
/**
 * @Author: may.ruan
 * @Date: 2023-09-12 10:39:25
 * @param {*} val 切换项的路由name
 * @description: 切换选项
 */
const changeTabbar = async name => {
  // 等待权限刷新完成
  await $refreshFunids()
  // 根据name执行页面跳转
  if (name === 'Customer') {
    redirectTo('/member/customer')
  } else if (name === 'Project') {
    redirectTo('/member/project')
  } else {
    redirectTo('/member/myinfo')
  }
}
const tabbarList = [
  {
    name: 'customer',
    title: '客户',
    router: {
      name: 'Customer'
    },
    inactive: customer,
    active: customerActive,
    funids: 'member:customer'
  },
  {
    name: 'project',
    title: '项目',
    router: {
      name: 'Project'
    },
    inactive: project,
    active: projectActive,
    funids: 'member:project'
  },
  {
    name: 'myinfo',
    title: '我的',
    router: {
      name: 'Myinfo'
    },
    inactive: myinfo,
    active: myinfoActive,
    funids: 'member:myinfo'
  }
]
</script>
<style lang="scss" scoped>
.vteam-tabbar {
  :deep(.u-tabbar) {
    .u-tabbar__content {
      .u-tabbar-item {
        background-color: #f9f9f9;
      }
      .image {
        width: 39rpx;
        height: 39rpx;
      }
    }
  }
}
</style>
