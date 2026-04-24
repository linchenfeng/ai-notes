<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-08-06 14:34:44
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 17:16:39
 * @Description  : pc端tabs
-->
<template>
  <div class="swiper-container">
    <ty-swiper :modules="modules" :slides-per-view="slidesPerView" :space-between="0" @swiper="onSwiper">
      <swiper-slide v-for="(tab, index) in vals" :id="tab.tySId" :key="index" @click="switchTab(index)">
        <view>
          <view :class="{ 'ty-tabs__selected-color': !getSelectedColor && tabIndex === index, 'ty-tabs__text-color': !color && tabIndex !== index }">
            {{ tab.name }}
          </view>
        </view>
        <view class="badge">
          <u-badge :show-zero="true" :value="tab.value" :max="99999"></u-badge>
        </view>
        <view
          v-if="isSlider"
          class="ty-tabs__line-wrap"
          :class="{ 'ty-tabs__line-center': center }"
          :style="{ bottom: 2 + 'rpx', left: `-${padding}rpx`, right: `-${padding}rpx` }"
        >
          <view
            class="ty-tabs__ac-line"
            :class="{ 'ty-tabs__line-short': short, 'ty-tabs__full': !short, 'ty-tabs__slider-color': !getSliderBgColor }"
            :style="{
              height: sliderHeight + 'rpx',
              background: getSliderBgColor,
              borderRadius: sliderRadius == -1 ? sliderHeight + 'rpx' : sliderRadius + 'rpx',
              transform: `scale(${tabIndex === index ? 1 : 0}`
            }"
          ></view>
        </view>
      </swiper-slide>
    </ty-swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper as TySwiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

// 定义需要使用的模块
const modules = [Navigation, Pagination, Scrollbar, A11y]

// Swiper 实例
const swiper = ref(null)

// Swiper 初始化事件
const onSwiper = swiperInstance => {
  swiper.value = swiperInstance
}

const emit = defineEmits(['change'])
interface TabItem {
  name: string
  disabled?: boolean
  icon?: string
  value?: number
  selectedIcon?: string
  badge?: string
  tySId?: string
}

// 定义 Props 接口，用于接收组件的属性
interface Props {
  // 表示标签页的列表，可以是 TabItem 对象或字符串的数组
  tabs: Array<TabItem | string>
  // 当前选中的标签页的索引，默认为 0
  current?: number
  // 是否允许滚动，默认为 true
  scroll?: boolean
  // 标签页的高度，可以是数字或字符串，默认为 44
  height?: number | string
  // 标签页的背景颜色，默认为白色
  background?: string
  // 标签页的字体大小，可以是数字或字符串，默认为 28
  size?: number | string
  // 标签页的字体颜色，默认为 '#666666'
  color?: string
  // 标签页的字体粗细，默认为 'normal'
  fontWeight?: string
  // 选中状态下标签页的字体颜色
  selectedColor?: string
  // 选中状态下标签页的字体大小，可以是数字或字符串，默认为 32
  selectedSize?: number | string
  // 选中状态下标签页的字体粗细，默认为 'normal'
  selectedFontWeight?: string
  // 徽章的字体颜色，默认为白色
  badgeColor?: string
  // 徽章的背景颜色
  badgeBackground?: string
  // 是否将徽章显示为点，默认为 false
  isDot?: boolean
  // 是否显示滑块，默认为 true
  isSlider?: boolean
  // 滑块的高度，可以是数字或字符串，默认为 4
  sliderHeight?: number | string
  // 滑块的背景颜色
  sliderBackground?: string
  // 滑块的半径，可以是数字或字符串，默认为 -1
  sliderRadius?: number | string
  // 内边距，可以是数字或字符串，默认为 0
  padding?: number | string
  // 滑块的底部位置，可以是数字或字符串，默认为 0
  bottom?: number | string
  // 滑块是否为短样式，默认为 true
  short?: boolean
  // 滑块是否居中，默认为 true
  center?: boolean
  // 是否固定标签栏，默认为 false
  isFixed?: boolean
  // 是否使用粘性定位，默认为 false
  isSticky?: boolean
  // 标签栏的顶部位置，可以是数字或字符串，默认为 44
  top?: number | string
  // 是否左对齐，默认为 true
  alignLeft?: boolean
  // 布局方向，默认为 'row'
  direction?: string
  // z 轴索引，可以是数字或字符串，默认为 996
  zIndex?: number | string
}

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
  bottom: 2,
  short: true,
  center: true,
  isFixed: false,
  isSticky: false,
  top: 44,
  alignLeft: false,
  direction: 'row',
  zIndex: 996
})
const tabIndex = ref(0)
const getSelectedColor = computed(() => {
  let color = props.selectedColor
  return color
})
const getSliderBgColor = computed(() => {
  let color = props.sliderBackground
  return color
})
const vals = ref<TabItem[]>([])
const getId = () => {
  return `ty_${Math.ceil(Math.random() * 10e5).toString(36)}`
}
const initData = (valsArray: Array<TabItem | string>) => {
  if (valsArray && valsArray.length > 0) {
    let modifiedVals: TabItem[] = []
    modifiedVals = valsArray.map(item => {
      const scrollId = getId()
      if (typeof item === 'string') {
        return {
          name: item,
          tySId: scrollId
        }
      }
      return {
        ...item,
        tySId: scrollId
      }
    })
    vals.value = modifiedVals
  }
}
const switchTab = (index: number) => {
  const item = {
    ...vals.value[index]
  }
  if (tabIndex.value === index || item.disabled) {
    return
  }
  tabIndex.value = index
  delete item.tySId
  emit('change', {
    index: index,
    ...item
  })
}
watch(
  () => props.tabs,
  newVals => {
    initData(newVals)
  }
)
// 核心：动态计算 slides-per-view
const slidesPerView = computed(() => {
  // 小于5个标签时，设置为auto（自动适配宽度），否则为5
  return vals.value.length < 5 ? vals.value.length : 5
})
onMounted(() => {
  tabIndex.value = props.current
  initData(props.tabs)
})
</script>

<style>
.swiper-container {
  width: 100%;
  cursor: pointer;
}
.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  height: 88rpx;
  color: #666;
}
.ty-tabs__selected-color {
  color: var(--ty-color-primary, #138bec) !important;
}
.ty-tabs__slider-color {
  background: var(--ty-color-primary, #138bec) !important;
}
.ty-tabs__line-wrap {
  position: absolute;
  border-radius: 2px;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: row;
}
.ty-tabs__line-center {
  justify-content: center;
  left: 0;
}
.ty-tabs__line-short {
  width: 50rpx !important;
}
.badge {
  position: absolute;
  right: 2rpx;
  top: 2rpx;
}
:deep(.u-badge) {
  padding: 4rpx 10rpx;
  background-color: #ebf0ff;
  color: #437fff;
  font-size: 20rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
}
</style>
