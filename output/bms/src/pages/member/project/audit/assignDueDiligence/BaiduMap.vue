<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-28 13:54:31
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-10 10:39:42
 * @Description  : 百度地图 具体参考https://map.heifa.site/doc/begin/use.html
-->
<template>
  <NavBar bg-color="#0029c2">
    <text v-if="isSignIn" class="iconfont icon-duigou" @click="signIn"></text>
  </NavBar>
  <baidu-map
    class="baidu-map"
    ak="m7LKvrOQowZMRvIM59snZVkLdWkm1ZKy"
    v="3.0"
    type="API"
    :continuous-zoom="true"
    :center="center"
    :zoom="zoom"
    @ready="mapReady"
  >
    <bm-marker :position="center"></bm-marker>
  </baidu-map>
  <view class="location-info">
    <view class="location">
      <text class="title">我的位置</text>
      <text class="jingdu">当前定位精度 30.0米</text>
    </view>
    <view class="location-detail">
      {{ originalAddress }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { BaiduMap, BmMarker } from 'vue-baidu-map-3x'
import { showToast } from '@/utils/uniapp/toast'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import { decodeBase64 } from '@/utils/crypto'
import wx from 'jweixin-1.6.0'
import { useRoute, useRouter } from '@/uni-simple-router'
import { setSession } from '@/utils/storages'
import { webLoading } from '@/utils/uniapp/toast'
const route = useRoute()
const router = useRouter()
const BMapValue = ref<any>(null)
const miniLoading = ref<any>({}) // webloading
const center = ref({ lng: 0, lat: 0 })
const zoom = ref(18)
let isSignIn = ref(false)
let originalAddress = ref('')
let errorMessage = ref('')
// 打卡成功，返回上级页面
const signIn = () => {
  if (!originalAddress.value) {
    if (errorMessage.value) {
      showToast(errorMessage.value)
    } else {
      showToast('地址信息获取中，请稍后再试')
    }
    return
  }
  const data = {
    // 传给后端百度坐标
    longitude: String(center.value.lng),
    latitude: String(center.value.lat),
    address: originalAddress.value
  }
  setSession('baiDuMapInfo', data)
  router.back(1)
}
// 逆地理编码
const reverseGeocode = point => {
  if (!BMapValue.value) {
    return
  }
  const geocoder = new BMapValue.value.Geocoder()
  geocoder.getLocation(new BMapValue.value.Point(point.lng, point.lat), result => {
    let surroundingPois = { address: '', title: '' }
    if (result.surroundingPois && result.surroundingPois.length > 0) {
      surroundingPois = result.surroundingPois[0]
      originalAddress.value = surroundingPois.address + '靠近' + surroundingPois.title
    } else {
      originalAddress.value = result.address
    }
    // 计算 location-info 高度并设置 baidu-map 高度
    nextTick(() => {
      const locationInfo = document.querySelector('.location-info')
      const navbarHeight = 44 // NavBar 高度
      if (locationInfo) {
        const locationInfoHeight = locationInfo.clientHeight
        const viewportHeight = window.innerHeight
        const mapHeight = viewportHeight - navbarHeight - locationInfoHeight

        const baiduMap = document.querySelector('.baidu-map') as HTMLElement
        if (baiduMap) {
          baiduMap.style.height = `${mapHeight}px`
        }
      }
    })
    miniLoading.value.close()
  })
}
// 转换坐标，convert是否需要转换
const convertPoint = ({ lng, lat }, convert) => {
  if (!BMapValue.value) {
    return
  }

  // 创建原始坐标点
  const originalPoint = new BMapValue.value.Point(lng, lat)
  if (convert) {
    // 使用百度地图转换器进行坐标转换
    // 3 表示从 GCJ-02 转换为 BD-09（百度坐标）
    const convertor = new BMapValue.value.Convertor()
    convertor.translate([originalPoint], 3, 5, data => {
      if (data.status === 0) {
        center.value = {
          lng: data.points[0].lng,
          lat: data.points[0].lat
        }
        reverseGeocode(center.value)
      }
    })
  } else {
    // 查询无需转换
    center.value = originalPoint
    reverseGeocode(center.value)
  }
}
// 浏览器定位 (备用方案)
// const getBrowserLocation = () => {
//   if (!navigator.geolocation) {
//     return
//   }
//   navigator.geolocation.getCurrentPosition(
//     async position => {
//       const point = { lng: position.coords.longitude, lat: position.coords.latitude }
//       convertPoint(point, true)
//     },
//     () => {
//       miniLoading.value.close()
//       showToast('获取位置失败，请检查是否打开定位权限')
//       // console.error('浏览器获取位置失败:', error)
//     }
//   )
// }
const initWechatConfig = () => {
  const jsApiList = ['getLocation']
  doWxConfig(jsApiList)
    .then(() => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          convertPoint({ lng: longitude, lat: latitude }, true)
        },
        fail: function (res) {
          // showToast('微信获取位置失败:' + JSON.stringify(res))
          // eslint-disable-next-line no-console
          console.error('微信获取位置失败:' + JSON.stringify(res))
          miniLoading.value.close()
          errorMessage.value = '获取位置失败，请检查是否打开定位权限'
          router.back(1)
          showToast(errorMessage.value)
          // 获取浏览器定位
          // getBrowserLocation()
        }
      })
    })
    .catch(error => {
      // showToast('微信获取位置失败1:' + JSON.stringify(error))
      // eslint-disable-next-line no-console
      console.error('微信获取位置失败1:' + JSON.stringify(error))
      miniLoading.value.close()
      errorMessage.value = '授权失败，暂无法获取位置'
      router.back(1)
      showToast(errorMessage.value)
      // 获取浏览器定位
      // getBrowserLocation()
    })
}
const mapReady = ({ BMap }) => {
  const longitude = decodeBase64(route.value.params.longitude) // 指派尽调流水号
  const latitude = decodeBase64(route.value.params.latitude)
  BMapValue.value = BMap

  if (longitude) {
    // center.value = { lng: 114.52162395024177, lat: 30.496137146457293 }
    const point = { lng: longitude, lat: latitude }
    // 数据库的存的百度坐标，无需转换
    convertPoint(point, false)
    isSignIn.value = false
  } else {
    initWechatConfig()
    // center.value = { lng: 114.52162395024177, lat: 30.496137146457293 }
    // convertPoint(center.value, false)
    isSignIn.value = true
  }
}
onBeforeMount(async () => {
  miniLoading.value = await webLoading()
  miniLoading.value.loading()
})
</script>

<style lang="scss">
.baidu-map {
  width: 100%;
  height: calc(100vh - 134px);
}
.iconfont {
  font-size: 48rpx;
  color: #fff;
}
:deep(.anchorBL) {
  display: none;
}
.location-info {
  padding: 16rpx;
  box-sizing: border-box;
  min-height: 90px;
  background-color: #f0f0f0;
  color: #6c7379;
  .jingdu {
    margin-left: 20rpx;
    color: #f1c181;
    font-size: 28rpx;
  }
  .location {
    margin-bottom: 10rpx;
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
}
</style>
