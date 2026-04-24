<!--
 * @Author       : may.ruan
 * @Date         : 2025-10-20 10:29:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-17 16:43:37
 * @Description  : 项目-业务洞察-业绩过程 /member/project/query/business/performance?id=XXX
-->
<template>
  <NavBar />
  <Superset funid="member:project:query:business:performance" />
</template>
<script lang="ts">
export default {
  name: 'Performance',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import Superset from '@/components/superset/index.vue'
</script>
