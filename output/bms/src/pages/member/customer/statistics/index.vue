<template>
  <NavBar></NavBar>
  <Superset funid="member:customer:statistics"></Superset>
</template>
<script lang="ts">
export default {
  name: 'CustomerStatistics',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import Superset from '@/components/superset/index.vue'
</script>
