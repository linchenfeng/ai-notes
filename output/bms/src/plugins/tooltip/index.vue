<template>
  <div ref="wrapperRef" class="ty-tooltip-wrapper">
    <!-- 触发元素插槽 -->
    <div ref="triggerRef" class="ty-tooltip-trigger" @click="handleClick" @touchstart.stop="handleTriggerTouchStart">
      <slot></slot>
    </div>

    <!-- 气泡弹出层（通过teleport挂载到body，避免父元素样式影响） -->
    <teleport to="body">
      <div
        v-if="visible"
        ref="popupRef"
        class="ty-tooltip-popup"
        :class="[`position-${position}`]"
        :style="{
          top: `${popupTop}px`,
          left: `${popupLeft}px`,
          zIndex: zIndex,
          maxWidth: maxWidth + 'rpx'
        }"
        @click.stop
        @touchstart.stop
      >
        <!-- 气泡内容 -->
        <div class="ty-tooltip-content">{{ content }}</div>
        <!-- 气泡箭头 -->
        <div v-if="showArrow" class="ty-tooltip-arrow" :class="[`arrow-${position}`]"></div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

// 定义组件Props类型
interface Props {
  // 提示内容
  content: string
  // 弹出位置：top/bottom/left/right（默认bottom）
  position?: 'top' | 'bottom' | 'left' | 'right'
  // 气泡最大宽度（默认200px）
  maxWidth?: number
  // 偏移量（气泡与触发元素的距离，默认8px）
  offset?: number
  // 是否显示箭头（默认true）
  showArrow?: boolean
  // z-index层级（默认1000）
  zIndex?: number
  // 触发方式（暂时实现click，可扩展hover）
  trigger?: 'click'
}
const emit = defineEmits(['visible-change'])
// 配置Props默认值
const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  maxWidth: 450,
  offset: 8,
  showArrow: true,
  zIndex: 1000,
  trigger: 'click'
})
// DOM引用
const wrapperRef = ref<HTMLDivElement | null>(null)
const triggerRef = ref<HTMLDivElement | null>(null)
const popupRef = ref<HTMLDivElement | null>(null)

// 气泡显示状态
const visible = ref(false)
// 气泡坐标
const popupTop = ref(0)
const popupLeft = ref(0)
// 标记：是否是触摸触发（用于过滤click事件）
const isTouchTriggered = ref(false)
// 标记：是否触摸了触发元素（用于区分移动端touch事件）
const isTriggerTouched = ref(false)
// 切换气泡显示/隐藏
const toggleVisible = () => {
  visible.value = !visible.value
  emit('visible-change', visible.value)
}
// 处理桌面端click事件（过滤移动端的click事件）
const handleClick = () => {
  // 如果是移动端触摸触发的后续click事件，直接返回
  if (isTouchTriggered.value) {
    // 重置标记
    isTouchTriggered.value = false
    return
  }
  // 桌面端正常执行切换
  toggleVisible()
}
// 处理触发元素的touchstart事件
const handleTriggerTouchStart = (e: TouchEvent) => {
  // 标记为触摸了触发元素
  isTriggerTouched.value = true
  // 标记为触摸触发，用于过滤后续的click事件
  isTouchTriggered.value = true
  // 切换气泡状态
  toggleVisible()
  // 阻止事件冒泡（避免立刻触发全局的touchstart）
  e.stopPropagation()
  // 阻止浏览器默认行为（可选，进一步防止click事件）
  // e.preventDefault()
  // 延迟重置标记（确保外部事件判断时能识别）
  setTimeout(() => {
    isTriggerTouched.value = false
    // 延长一点时间，确保click事件被过滤
  }, 500)
}
// 计算气泡的位置
const calculatePopupPosition = () => {
  if (!triggerRef.value || !popupRef.value) {
    return
  }

  // 获取触发元素的位置和尺寸
  const triggerRect = triggerRef.value.getBoundingClientRect()
  // 获取气泡的位置和尺寸
  const popupRect = popupRef.value.getBoundingClientRect()

  const { offset, position } = props
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 根据不同位置计算坐标
  switch (position) {
    case 'bottom':
      // 垂直：触发元素底部 + 偏移量
      popupTop.value = triggerRect.bottom + offset
      // 水平：触发元素中间 - 气泡宽度的一半（居中）
      popupLeft.value = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2
      break
    case 'top':
      popupTop.value = triggerRect.top - popupRect.height - offset
      popupLeft.value = triggerRect.left - offset
      break
    case 'right':
      popupTop.value = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2
      popupLeft.value = triggerRect.right + offset
      break
    case 'left':
      popupTop.value = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2
      popupLeft.value = triggerRect.left - popupRect.width - offset
      break
    default:
      break
  }

  // 边界处理：防止气泡超出屏幕
  // 左边界
  if (popupLeft.value < 0) {
    popupLeft.value = 8
  }
  // 右边界
  if (popupLeft.value + popupRect.width > windowWidth) {
    popupLeft.value = windowWidth - popupRect.width - 8
  }
  // 上边界
  if (popupTop.value < 0) {
    popupTop.value = 8
  }
  // 下边界
  if (popupTop.value + popupRect.height > windowHeight) {
    popupTop.value = windowHeight - popupRect.height - 8
  }
}

// 监听visible变化，计算气泡位置
watch(
  () => visible.value,
  async newVal => {
    if (newVal) {
      // 等待DOM渲染完成后再计算位置
      await nextTick()
      calculatePopupPosition()
    }
  },
  { immediate: false }
)

// 监听窗口大小变化，重新计算位置（适配H5屏幕旋转/尺寸变化）
const handleResize = () => {
  if (visible.value) {
    calculatePopupPosition()
  }
}

// 点击外部关闭气泡
const handleClickOutside = (e: MouseEvent | TouchEvent) => {
  if (!visible.value) {
    return
  }

  // 如果是触摸了触发元素，直接返回（不关闭）
  if (e.type === 'touchstart' && isTriggerTouched.value) {
    return
  }

  // 获取事件目标元素
  const target = e.target as Node
  // 判断目标元素是否属于组件内部（wrapper、trigger、popup）
  const isInside = wrapperRef.value?.contains(target) || popupRef.value?.contains(target)

  if (!isInside) {
    visible.value = false
    emit('visible-change', false)
  }
}

onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  // 监听点击外部事件
  document.addEventListener('click', handleClickOutside)
  // 监听全局touchstart事件（移动端触摸，优先于click触发）
  document.addEventListener('touchstart', handleClickOutside)
})

onUnmounted(() => {
  // 移除事件监听，防止内存泄漏
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('touchstart', handleClickOutside)
})
</script>

<style scoped>
/* 包裹层：相对定位，用于包含触发元素 */
.ty-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

/* 触发元素：行内块级，适应内容大小 */
.ty-tooltip-trigger {
  display: inline-block;
  cursor: pointer;
}

/* 气泡弹出层：绝对定位，基础样式 */
.ty-tooltip-popup {
  position: fixed;
  padding: 16rpx 24rpx;
  background-color: #333;
  color: #fff;
  border-radius: 8rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  line-height: 1.4;
  white-space: normal;
  word-wrap: break-word;
}

/* 气泡内容：防止内容溢出 */
.ty-tooltip-content {
  max-width: 100%;
}

/* 箭头基础样式：使用CSS边框实现 */
.ty-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 12rpx solid transparent;
}

/* 不同位置的箭头样式 */
/* 底部弹出：箭头向上，指向触发元素 */
.arrow-bottom {
  top: -24rpx;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #333;
}

/* 顶部弹出：箭头向下 */
.arrow-top {
  bottom: -22rpx;
  left: 9%;
  transform: translateX(-50%);
  border-top-color: #333;
}

/* 右侧弹出：箭头向左 */
.arrow-right {
  left: -24rpx;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #333;
}

/* 左侧弹出：箭头向右 */
.arrow-left {
  right: -24rpx;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #333;
}
</style>
