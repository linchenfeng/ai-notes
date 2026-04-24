<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-05-13 17:55:42
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 15:12:43
 * @Description  : 文本折叠组件
-->
<template>
  <!-- @vue-ignore -->
  <view
    class="text-fold text-fold-item"
    :style="{
      '--line-height': lineHeightStr,
      '--rows': rows,
      '--ellipsis-color': ellipsisColor,
      '--font-size': fontSizeStr,
      height: status || isNeedFold === 2 ? maxHeight : fontSize * rows * lineHeight + 'rpx'
    }"
  >
    <view class="text-fold-content text-fold-item" :style="{ height: status || isNeedFold !== 1 ? maxHeight : fontSize * rows * lineHeight + 'rpx' }">
      <view
        v-if="isNeedFold === 1"
        class="fold-btn"
        :class="{ ellipsis: !status, ellipsisBefore: ellipsisPos === 'before', ellipsisAfter: ellipsisPos === 'after' }"
        @click="openText"
      >
        <slot name="foldbtn" :status="status">
          <text class="fold-btn-item" :style="{ ...btnStyle }">
            <up-icon color="#333" size="12px" :name="!status ? 'arrow-down' : 'arrow-up'"></up-icon>
          </text>
        </slot>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits, getCurrentInstance } from 'vue'
const props = defineProps({
  // 字体大小
  fontSize: {
    type: [Number],
    default: 28
  },
  // 字体行高
  lineHeight: {
    type: [Number],
    default: 1.5
  },

  // 最多显示行数
  rows: {
    type: Number,
    default: 5
  },

  // 省略号颜色
  ellipsisColor: {
    type: String,
    default: '#666'
  },

  // 省略号位置 前或者后
  ellipsisPos: {
    type: String,
    default: 'before'
  },

  // 展开按钮样式定义
  btnStyle: {
    type: Object,
    default() {
      return {}
    }
  },

  // 展开按钮文本配置
  bthText: {
    type: Array,
    default() {
      return ['展开', '收起']
    }
  }
})

const emit = defineEmits({
  toggle: (payload: { initHeight: number; maxHeight: number }) => {
    return typeof payload.initHeight === 'number' && typeof payload.maxHeight === 'number'
  }
})

import type { ComponentPublicInstance } from 'vue'
interface NodeInfo {
  height: number | undefined
}
const selectorAll = (selector: string, obj: ComponentPublicInstance | null = null): Promise<Array<NodeInfo>> => {
  return new Promise((resolve, reject) => {
    try {
      const query = obj ? uni.createSelectorQuery().in(obj) : uni.createSelectorQuery()
      query
        .selectAll(selector)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .boundingClientRect((data: NodeInfo | NodeInfo[]) => {
          const result = Array.isArray(data) ? data : [data]
          resolve(result)
        })
        .exec()
    } catch (err) {
      reject(err)
    }
  })
}
const isNeedFold = ref(-1) // 是否需要展开收起，-1初始状态，1需要，2不需要
const status = ref(false) // false：收起，true：展开
const maxHeight = ref('auto')

const fontSizeStr = computed(() => {
  if (typeof props.fontSize === 'string') {
    return props.fontSize
  }
  return `${props.fontSize}rpx`
})

const lineHeightStr = computed(() => {
  if (typeof props.lineHeight === 'string') {
    return props.lineHeight
  }
  return `${props.lineHeight}em`
})

let initH = 0
let maxH = 0

const init = () => {
  initH = 0
  maxH = 0
  selectorAll('.text-fold-item', getCurrentInstance()?.proxy).then((res: Array<NodeInfo>) => {
    const [firstItem, secondItem] = res
    if (firstItem && secondItem) {
      initH = firstItem.height ?? 0
      maxH = secondItem.height ?? 0
      if ((res[1].height ?? 0) > (res[0].height ?? 0)) {
        isNeedFold.value = 1
      } else {
        isNeedFold.value = 2
      }
      maxHeight.value = isNeedFold.value === 1 ? `${Math.max(res[1].height ?? 0, res[0].height ?? 0) + 21}px` : 'auto'
    }
  })
}

const openText = () => {
  status.value = !status.value
  emit('toggle', {
    initHeight: initH,
    maxHeight: maxH
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.text-fold {
  overflow: hidden;
}
.text-fold-content {
  font-size: var(--font-size);
  line-height: var(--line-height);
  height: calc(var(--rows) * var(--line-height));
  color: #666;
  overflow: hidden;
  white-space: pre-wrap;
}
.text-fold-content::before {
  content: '';
  width: 0;
  font-size: var(--font-size);
  height: calc(100% - var(--line-height));
  float: right;
}
.fold-btn {
  float: right;
  clear: both;
  .fold-btn-item {
    display: inline-block;
    font-size: var(--font-size);
    padding: 0 12rpx;
    line-height: var(--line-height);
    border-radius: 8rpx;
    cursor: pointer;
    color: #fff;
  }
  &.ellipsis::before {
    content: '...';
    font-size: var(--font-size);
    color: var(--ellipsis-color);
    white-space: nowrap; /* 防止省略号换行 */
    pointer-events: none; /* 避免遮挡按钮点击 */
  }
  &.ellipsisBefore {
    &::before {
      left: -8rpx;
      transform: translateX(-100%);
    }
  }
  &.ellipsisAfter {
    &::before {
      right: 0;
      transform: translateX(95%);
    }
  }
}
</style>
