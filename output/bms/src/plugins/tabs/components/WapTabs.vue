<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-08-06 14:34:44
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-25 17:23:08
 * @Description  : 移动端tabs
-->
<template>
  <scroll-view
    class="ty-tabs__scrollbox"
    :class="{ 'ty-tabs__fixed': isFixed && !isSticky, 'ty-tabs__sticky': isSticky }"
    :scroll-with-animation="true"
    :scroll-x="scroll"
    :show-scrollbar="false"
    :scroll-into-view="scrollInto"
    :style="{ background: background, zIndex: isFixed || isSticky ? zIndex : 1, top: isFixed || isSticky ? top + 'px' : 'auto' }"
    @touchmove.stop
  >
    <view class="ty-scroll__view" :class="{ 'ty-tabs__full': !alignLeft }">
      <view
        v-for="(tab, index) in vals"
        :id="tab.tySId"
        :key="index"
        class="ty-tabs__item"
        :class="{ 'ty-tabs__full': !alignLeft }"
        @tap="switchTab(index)"
      >
        <view
          class="ty-tabs__text-wrap"
          :class="{ 'ty-tabs__wrap-disabled': tab.disabled, 'ty-tabs__item-column': direction === 'column' && tab.icon }"
          :style="{ height: height + 'px' }"
        >
          <view
            v-if="isSlider"
            class="ty-tabs__line-wrap"
            :class="{ 'ty-tabs__line-center': center }"
            :style="{ bottom: bottom + 'rpx', left: `-${padding}rpx`, right: `-${padding}rpx` }"
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
          <image
            v-if="tab.icon"
            class="ty-tabs__icon"
            :class="{ 'ty-tabs__icon-column': direction === 'column' }"
            :src="tabIndex === index && tab.selectedIcon ? tab.selectedIcon : tab.icon"
          ></image>
          <!-- @vue-ignore -->
          <view
            class="ty-tabs__text"
            :class="{ 'ty-tabs__selected-color': !getSelectedColor && tabIndex === index, 'ty-tabs__text-color': !color && tabIndex !== index }"
            :style="{ fontSize: (tabIndex === index? selectedSize : size) + 'rpx', color: tabIndex === index? getSelectedColor : color, fontWeight:
            (tabIndex === index? selectedFontWeight : fontWeight) as string }"
          >
            {{ tab.name }}
          </view>
        </view>
        <view class="badge">
          <u-badge :show-zero="true" :value="tab.value" :max="99999"></u-badge>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

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
const vals = ref<TabItem[]>([])
const scrollInto = ref('')
const tabIndex = ref(0)

const getSelectedColor = computed(() => {
  let color = props.selectedColor
  return color
})

const getSliderBgColor = computed(() => {
  let color = props.sliderBackground
  return color
})

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
  let scrollIndex = index - 1 < 0 ? 0 : index - 1
  const id = vals.value[scrollIndex]?.tySId
  if (id) {
    scrollInto.value = id
  }

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

watch(
  () => props.current,
  newVal => {
    switchTab(newVal)
  }
)

onMounted(() => {
  tabIndex.value = props.current
  initData(props.tabs)
})
</script>

<style lang="scss" scoped>
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
.ty-tabs__scrollbox {
  flex: 1;
  flex-direction: row;
  overflow: hidden;
  z-index: 9999;
}

.ty-tabs__fixed {
  position: fixed;
  left: 0;
  right: 0;
}

.ty-tabs__sticky {
  position: sticky;
  left: 0;
  right: 0;
}

.ty-scroll__view {
  min-width: 100%;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.ty-tabs__item {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: 32rpx;
  padding-right: 32rpx;
  position: relative;
}

.ty-tabs__full {
  flex: 1;
}

.ty-tabs__text-wrap {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
}

.ty-tabs__wrap-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ty-tabs__icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 12rpx;
}

.ty-tabs__item-column {
  flex-direction: column !important;
}

.ty-tabs__icon-column {
  margin-right: 0 !important;
  margin-bottom: 8rpx;
}

.ty-tabs__text {
  white-space: nowrap;
  display: flex;
  transition: transform 0.2s linear;
  z-index: 3;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}
.ty-tabs__text-nvue {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
}
.ty-tabs__badge {
  height: 36rpx;
  padding: 0 12rpx;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 36rpx;
  border-radius: 100px;
  position: absolute;
  min-width: 36rpx !important;
  display: flex;
  box-sizing: border-box;
  right: -32rpx;
  top: -18rpx;
  z-index: 10;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transform: scale(0.9);
}

.ty-tabs__badge-dot {
  height: 8px !important;
  width: 8px !important;
  border-radius: 100px;
  position: absolute;
  display: inline-block;
  right: -6px;
  top: -3px;
  border-radius: 50%;
  z-index: 10;
  right: 0;
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

.ty-tabs__ac-line {
  transition: transform 0.2s linear;
}

.ty-tabs__line-short {
  width: 50rpx !important;
}

.ty-tabs__selected-color {
  color: var(--ty-color-primary, #138bec) !important;
}

.ty-tabs__text-color {
  color: var(--ty-color-subtitle, #666666) !important;
}

.ty-tabs__slider-color {
  background: var(--ty-color-primary, #138bec) !important;
}
</style>
