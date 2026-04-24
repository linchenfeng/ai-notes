<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-01-09 10:02:53
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-31 17:18:11
 * @Description  : 多选组件用于贷前查询条件搜索
-->
<template>
  <view class="custom-checkbox" :class="{ 'is-checked': isChecked }" @click="toggle">
    <view class="label-content">
      <view class="item-icon">
        <i class="iconfont" :class="icon"></i>
      </view>
      <text class="checkbox-label" :class="icon ? 'checkbox-head' : ''">{{ label }}</text>
    </view>
    <view v-if="showCheck" class="checkbox-icon">
      <up-icon v-if="isChecked" name="checkbox-mark" color="#4c4c4c" size="28"></up-icon>
    </view>
    <input type="checkbox" :value="value" :checked="isChecked" class="hidden-input" @change="handleChange" />
  </view>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  // 复选框的标签
  label: {
    type: String,
    default: ''
  },
  // 复选框的图标
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 控制是单个复选框还是复选框组
  isGroup: {
    type: Boolean,
    default: false
  },
  // 是否展示复选框
  showCheck: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['update:modelValue'])

// 计算属性判断是否选中
const isChecked = computed({
  get() {
    if (props.isGroup) {
      return props.modelValue.includes(props.value)
    }
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

// 点击切换选中状态
const toggle = () => {
  if (props.disabled || !props.showCheck) {
    return
  }

  if (props.isGroup) {
    const newValue = [...props.modelValue]
    if (isChecked.value) {
      const index = newValue.indexOf(props.value)
      if (index !== -1) {
        newValue.splice(index, 1)
      }
    } else {
      newValue.push(props.value)
    }
    emits('update:modelValue', newValue)
  } else {
    emits('update:modelValue', !props.modelValue)
  }
}

// 处理原生input的change事件
const handleChange = e => {
  if (props.disabled) {
    return
  }
  emits('update:modelValue', e.detail.value)
}
</script>

<style lang="scss" scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 72rpx;
  line-height: 72rpx;
  justify-content: space-between;
  .label-content {
    display: flex;
    .item-icon {
      width: 30rpx;
      margin-right: 19rpx;
    }
  }
  .checkbox-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32rpx;
    height: 32rpx;
    border: 1rpx solid #999;
    border-radius: 50%;
    transition: all 0.2s;

    .iconfont {
      font-size: 14rpx;
      color: #fff;
    }
  }
  .checkbox-head {
    font-size: 32rpx !important;
    color: #fff !important;
  }
  .checkbox-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &.is-checked {
    .checkbox-label {
      color: #fff;
    }
    .checkbox-icon {
      background-color: #fff;
      border-color: #fff;
    }
  }

  &:hover {
    .checkbox-icon {
      border-color: #fff;
    }
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
