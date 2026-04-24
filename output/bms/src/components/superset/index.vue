<!--
 * @Author       : may.ruan
 * @Date         : 2025-06-13 13:30:22
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-24 15:49:56
 * @Description  : superset看板嵌入文档：http://106.75.142.50/docs/superset-develop/embedded-dashboard
-->

<template>
  <view v-if="((props.funid && getHasPermissionsById(props.funid)) || !props.funid) && loadingStatus === 'success'" class="superset-container">
    <view id="superset-container" :class="isBusinessBi ? 'business' : ''"></view>
    <slot></slot>
  </view>
  <!-- 接口异常 或 无权限时展示 -->
  <u-empty v-else class="empty" mode="data" :text="'授权中'" :icon="safe" width="156" height="175"></u-empty>
</template>

<script setup lang="ts">
import { embedDashboard } from '@superset-ui/embedded-sdk'
import apiSuperset from '@/api/common/api.superset'
import { useSystemConfigstore } from '@/store/systemConfig'
import { getPlatform } from '@/utils/uniapp'
import { onShow } from '@dcloudio/uni-app'
import { getUrlParam } from '@/utils/crypto'
const systemConfigStore = useSystemConfigstore()
const { systemConfig } = systemConfigStore
import safe from '@/assets/empty/safe.gif'
import { getHasPermissionsById } from '@/utils/permissions'
const props = defineProps({
  // 看板权限id
  funid: {
    type: String,
    default: '',
    required: false
  }
})
type LoadingStatus = 'success' | 'error'
const loadingStatus = ref<LoadingStatus>('success') // 明确变量用途的命名
const emit = defineEmits(['LoadingChange'])

const supersetId = getUrlParam('id')
const isBusinessBi = props.funid === 'member:project:query:business' ? true : false // 是否是业务洞察BI
const getGuestTokenInfo = async () => {
  try {
    const { data } = await apiSuperset.getGuestTokenInfo(supersetId)
    const superset = document.getElementById('superset-container') as HTMLElement
    embedDashboard({
      id: supersetId, // UUID
      supersetDomain: systemConfig.SUPERSET_URL, // superset域名
      mountPoint: superset, // 仪表板挂载点
      fetchGuestToken: async () => data.guestToken,
      dashboardUiConfig: {
        hideTitle: true,
        filters: {
          visible: false, // 完全隐藏过滤器面板
          expanded: false // 面板收起（若 visible 为 true）
        }
      },
      iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
    })

    const iframe = superset.querySelector('iframe')
    if (iframe) {
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
    }
    loadingStatus.value = 'success'
    emit('LoadingChange', loadingStatus.value)
  } catch {
    loadingStatus.value = 'error'
    emit('LoadingChange', loadingStatus.value)
  }
}
onShow(() => {
  const hasPermission = props.funid && getHasPermissionsById(props.funid)
  if (getPlatform() === 'H5' && (hasPermission || !props.funid)) {
    getGuestTokenInfo()
  }
})
</script>
<style lang="scss">
#superset-container {
  width: 100%;
  height: 100%;
}
.business {
  height: 390px !important;
}
.superset-container {
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}
</style>
