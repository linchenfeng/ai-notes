<!--
 * @Author       : may.ruan
 * @Date         : 2025-10-20 10:29:50
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-10-27 13:52:35
 * @Description  : 项目-数据洞察-详细查询 /member/project/query/dataInsight/detail?id=XXX
-->
<template>
  <NavBar></NavBar>
  <Superset funid="member:project:query:dataInsight:detail"></Superset>
  <u-modal :show="show" title="温馨提示" @confirm="show = false">
    <view class="slot-content">
      <view>
        <text>详细数据请用</text>
        <text class="bold">微信电脑端</text>
        <text>查看</text>
      </view>
    </view>
  </u-modal>
</template>
<script lang="ts">
export default {
  name: 'DataInsightDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import Superset from '@/components/superset/index.vue'
const show = ref<boolean>(true)
</script>
<style lang="scss">
.bold {
  font-weight: bold;
}
</style>
