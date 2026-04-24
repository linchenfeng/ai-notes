<!--
 * @Author       : Mingchun.Cheng
 * @Date         : 2024-10-22 14:30:53
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2024-10-22 15:34:00
 * @Description  : 中转页面
-->
<template>
  <view class="root-router-view">
    <text></text>
  </view>
</template>

<script lang="ts">
export default {
  name: 'Transfer'
}
</script>
<script lang="ts" setup>
import { decodeBase64, getUrlParam } from '@/utils/crypto'
let url = decodeBase64(getUrlParam('url')) as string
if (url) {
  window.open(url, '_self')
}
</script>
