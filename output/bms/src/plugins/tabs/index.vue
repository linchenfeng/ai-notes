<template>
  <component
    :is="currentTabsComponent"
    :tabs="tabs"
    :current="current"
    :scroll="scroll"
    :height="height"
    :background="background"
    :size="size"
    :color="color"
    :font-weight="fontWeight"
    :selected-color="selectedColor"
    :selected-size="selectedSize"
    :selected-font-weight="selectedFontWeight"
    :badge-color="badgeColor"
    :badge-background="badgeBackground"
    :is-dot="isDot"
    :is-slider="isSlider"
    :slider-height="sliderHeight"
    :slider-background="sliderBackground"
    :slider-radius="sliderRadius"
    :padding="padding"
    :bottom="bottom"
    :short="short"
    :center="center"
    :is-fixed="isFixed"
    :is-sticky="isSticky"
    :top="top"
    :align-left="alignLeft"
    :direction="direction"
    :z-index="zIndex"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WapTabs from './components/WapTabs.vue' // 假设移动端组件路径
import PCTabs from './components/PcTabs.vue' // PC端组件路径

interface TabItem {
  name: string
  disabled?: boolean
  icon?: string
  value?: number
  selectedIcon?: string
  badge?: string
  tySId?: string
}

interface Props {
  tabs: Array<TabItem | string>
  current?: number
  scroll?: boolean
  height?: number | string
  background?: string
  size?: number | string
  color?: string
  fontWeight?: string
  selectedColor?: string
  selectedSize?: number | string
  selectedFontWeight?: string
  badgeColor?: string
  badgeBackground?: string
  isDot?: boolean
  isSlider?: boolean
  sliderHeight?: number | string
  sliderBackground?: string
  sliderRadius?: number | string
  padding?: number | string
  bottom?: number | string
  short?: boolean
  center?: boolean
  isFixed?: boolean
  isSticky?: boolean
  top?: number | string
  alignLeft?: boolean
  direction?: string
  zIndex?: number | string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  current: 0,
  scroll: true,
  height: 44,
  background: '#fff',
  size: 28,
  color: '#666666',
  fontWeight: 'normal',
  selectedColor: '',
  selectedSize: 32,
  selectedFontWeight: 'normal',
  badgeColor: '#fff',
  badgeBackground: '',
  isDot: false,
  isSlider: true,
  sliderHeight: 4,
  sliderBackground: '',
  sliderRadius: -1,
  padding: 0,
  bottom: 0,
  short: true,
  center: true,
  isFixed: false,
  isSticky: false,
  top: 44,
  alignLeft: false,
  direction: 'row',
  zIndex: 996
})

const emit = defineEmits(['change'])
const isMobile = ref(false)

// 检测设备类型
const checkDeviceType = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : ''
  const mobileRegex = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  isMobile.value = mobileRegex.test(userAgent)
}

// 监听窗口大小变化，动态切换设备类型
const handleResize = () => {
  checkDeviceType()
}

onMounted(() => {
  checkDeviceType()
  window.addEventListener('resize', handleResize)
})

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 根据设备类型选择对应的组件
const currentTabsComponent = computed(() => {
  return isMobile.value ? WapTabs : PCTabs
})

// 转发change事件
const handleChange = data => {
  emit('change', data)
}
</script>
