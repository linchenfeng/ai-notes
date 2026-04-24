<template>
  <view v-show="showFormat" @click="showFormat = false">
    <view class="unFocus">
      <u-input
        v-model="formatNumber"
        :placeholder="props.placeholder"
        placeholder-class="uni-input-placeholder"
        @focus="showFormat = false"
      ></u-input>
    </view>
  </view>
  <view v-show="!showFormat" class="nativeInput" :class="numberRef ? 'showCl' : ''">
    <input
      v-model="numberRef"
      type="digit"
      :focus="isRefFocus"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      placeholder-style="color:#c0c4cc;font-size: 28rpx;text-align: right;"
      @input="updateNum"
      @blur="onBlur"
    />
    <i v-if="clearable && numberRef && false" class="iconfont icon-guanbi" @click="clearValue"></i>
  </view>
</template>

<script lang="ts">
import { isEmpty } from '@/utils/validate'
export default {
  name: 'InputNumber',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
const props = defineProps({
  number: {
    default: '',
    type: [Number, String],
    required: true
  },
  // 小数点长度
  point: {
    default: 2,
    type: Number,
    required: false
  },
  // 输入的最大字符数(整数+小数点+小数位)
  maxlength: {
    default: 15,
    type: [Number, String],
    required: false
  },
  // 最大输入数值
  max: {
    type: [Number],
    required: false,
    default: null
  },
  // 是否为只读状态
  readonly: {
    default: false,
    type: Boolean,
    required: false
  },
  // 是否禁用输入框
  disabled: {
    default: false,
    type: Boolean,
    required: false
  },
  // 是否启用清除图标，点击清除图标后会清空输入框
  clearable: {
    default: false,
    type: Boolean,
    required: false
  },
  // 输入框占位提示文字
  placeholder: {
    default: '',
    type: String,
    required: false
  },
  // 格式化自动补全小数
  fixed: {
    default: true,
    type: Boolean,
    required: false
  },
  // 是否允许输入负数
  negative: {
    default: false,
    type: Boolean,
    required: false
  },
  // 是否展示格式化后的金额
  formatFlag: {
    default: true,
    type: Boolean,
    required: false
  }
})
const showFormat = ref(true)
const numberRef = ref('') // 输入值
const formatNumber = ref('') // 输入格式化值
const isRefFocus = ref(false)
const emits = defineEmits(['update:number', 'exceedMax']) // 新增超出最大值事件

watch(showFormat, val => {
  if (!val) {
    nextTick(() => {
      isRefFocus.value = true
    })
  }
})

/**
 * 检查是否超过最大值限制
 */
const checkMaxLimit = (num: number): boolean => {
  if (props.max === null) {
    return false
  }
  return num > props.max
}

/**
 * 格式化输入
 */
const setFormatNumber = num => {
  if (num) {
    const $num = Number(num).toString()
    const numArrs = $num.split('.')
    const formatNum = numArrs[0].toString() // 取整数
    const isFloat = numArrs.length > 1 // 判断是否为有效小数
    const len = isFloat ? numArrs[1].length : 0 // 需补0长度
    let zero = isFloat ? [numArrs[1]] : [] // 小数
    // 格式化自动补全小数
    if (props.fixed) {
      for (let i = 0; i < props.point - len; i++) {
        zero.push('0')
      }
    }
    if (zero.length) {
      zero.unshift('.')
    }
    const decimal = zero.join('')
    formatNumber.value = formatNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    formatNumber.value += decimal
  } else {
    formatNumber.value = ''
  }
}

const updateNum = e => {
  const num = e.detail?.value || e
  let $num = num.toString().replace(/,/gi, '') // 千分位转换数字

  // 允许输入负数
  if (props.negative) {
    $num = $num.replace(/[^-\d.]/g, '') // 非负号|非数字|小数点不可输入
    $num = $num.replace(/^-+/g, '-') // 只能一个负数
    if ($num.length > 1) {
      $num = $num.replace(/-+$/g, '')
    } // 不能以-号结尾
  } else {
    $num = $num.replace(/[^\d.]/g, '') // 非数字|小数点不可输入
  }

  // 去零（数字前的零）
  if (/^0+([0-9]+)/.test($num)) {
    $num = RegExp.$1
  }

  // 小数点开头补零
  if (/^\..*/.test($num)) {
    $num = '0' + $num
  }

  // 去掉多余的小数点
  if (/^(.*\..*)\.$/.test($num)) {
    $num = RegExp.$1
  }

  if ($num) {
    const numArrs = $num.split('.')
    numArrs[0] = numArrs[0].substr(0, Number(props.maxlength) - props.point - 1)

    if (props.point === 0) {
      $num = numArrs[0]
    } else {
      if (numArrs.length > 1) {
        numArrs[1] = numArrs[1].substr(0, props.point)
      }
      $num = numArrs.join('.')
    }

    // 检查最大值限制
    if (props.max !== null && $num !== '') {
      const numValue = Number($num)
      if (checkMaxLimit(numValue)) {
        $num = props.max.toString()
        emits('exceedMax', props.max) // 触发超出最大值事件
      }
    }
  }

  nextTick(() => {
    numberRef.value = $num
  })

  emits('update:number', $num === '' ? '' : Number($num))

  if (props.formatFlag) {
    setFormatNumber($num)
  } else {
    formatNumber.value = $num
  }
}

/**
 * 失焦事件切换input框，重置isRefFocus值
 */
const onBlur = () => {
  showFormat.value = true
  isRefFocus.value = false
}

// 页面初始化
onMounted(() => {
  watch(
    () => props.number,
    val => {
      if (!isEmpty(val)) {
        // 初始化时检查是否超过最大值
        if (props.max !== null && val !== '' && Number(val) > props.max) {
          updateNum(props.max.toString())
          emits('exceedMax', props.max)
        } else {
          updateNum(val)
        }
      }
    },
    { immediate: true }
  )
})

const clearValue = () => {
  numberRef.value = ''
  updateNum(numberRef.value)
}

defineExpose({ updateNum })
</script>
<style lang="scss" scoped>
.nativeInput {
  position: relative;
  input {
    height: 48rpx;
    text-align: right;
    font-size: 28rpx;
    color: $default-color;
  }
  .icon-guanbi {
    color: #c0c4cc;
    position: absolute;
    top: -4rpx;
    right: 4rpx;
  }
}
</style>
