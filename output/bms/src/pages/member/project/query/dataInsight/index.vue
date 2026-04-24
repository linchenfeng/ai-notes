<!--
 * @Author       : may.ruan
 * @Date         : 2025-10-20 10:29:50
 * @LastEditors  : may.ruan
 * @LastEditTime : 2025-10-20 11:06:15
 * @Description  : 项目-数据洞察 /member/project/query/dataInsight?id=XXX
-->
<template>
  <NavBar>
    <span v-if="getHasPermissionsById('member:project:query:dataInsight:detail')" class="inviteWrite" @click="router.push(dataInsightPath)">
      详细查询
    </span>
  </NavBar>
  <Superset funid="member:project:query:dataInsight"></Superset>
</template>
<script lang="ts">
import { getHasPermissionsById } from '@/utils/permissions'
import apiAuthz from '@/api/common/api.authz'
export default {
  name: 'DataInsight',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import Superset from '@/components/superset/index.vue'
import { useRouter } from '@/uni-simple-router'
const router = useRouter()

const findTreeNodeById = (treeData, funid) => {
  const idMap = new Map()
  function buildIndex(nodes) {
    if (!nodes || !Array.isArray(nodes)) {
      return
    }
    for (const node of nodes) {
      idMap.set(node.funid, node)
      if (node.childFuns && node.childFuns.length > 0) {
        buildIndex(node.childFuns)
      }
    }
  }
  buildIndex(treeData)
  return idMap.get(funid) || null
}

const dataInsightPath = ref('')
const getMenuList = () => {
  apiAuthz.getMenuList('member:project').then(res => {
    dataInsightPath.value = findTreeNodeById(res.data.menuList, 'member:project:query:dataInsight:detail')?.funPath
  })
}
onMounted(() => {
  getMenuList()
})
</script>
<style lang="scss" scoped>
.inviteWrite {
  color: #fff;
  font-size: 14px;
}
</style>
