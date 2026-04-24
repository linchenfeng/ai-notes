<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 15:15:23
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-16 16:28:28
 * @Description  : 底部弹出文本域组件(提问、回复组件)
-->
<template>
  <up-popup :show="props.showPopup" :round="10" close-on-click-overlay @close="closePopup">
    <view class="pop-input-box">
      <view class="showBigAreaClass">
        <view class="answer">
          <u-textarea
            v-model="textValue"
            :confirm-type="null"
            focus
            auto-height
            count
            :maxlength="props.maxlength"
            :cursor="-1"
            :placeholder="props.placeholder"
            placeholder-style="font-size: 28rpx;"
            @change="input"
          ></u-textarea>
        </view>
      </view>
      <view class="bottom">
        <slot name="btn"></slot>
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
const props = defineProps({
  // 是否弹出组件
  showPopup: {
    type: Boolean,
    default: false
  },

  // 文本域默认值
  modelValue: {
    type: String,
    default: ''
  },
  // 文本域占位符
  placeholder: {
    type: String,
    default: '请输入提问的内容'
  },
  // 最大长度
  maxlength: {
    type: Number,
    default: 300
  }
})
const emit = defineEmits(['close', 'update:modelValue'])
let textValue = ref('')
// 监听外部设置值
watch(
  () => props.modelValue,
  val => {
    textValue.value = val
    emit('update:modelValue', val)
  }
)
const { modelValue } = toRefs(props)
if (modelValue.value) {
  // 若传值则设置默认值
  textValue.value = modelValue.value
}
// 将数据同步给父组件
const input = () => {
  emit('update:modelValue', textValue.value)
}
// 关闭弹出层
const closePopup = () => {
  emit('close')
}
</script>
<style lang="scss" scoped>
.pop-input-box {
  padding: 22rpx 30rpx 22rpx;
  :deep(.u-textarea) {
    text-align: left;
    padding: 20rpx 20rpx 40rpx;
    min-height: 114rpx;
    background: #f5f5f5;
    border: none;
    border-radius: 44rpx;
    margin-bottom: 0;
    font-size: 28rpx !important;
    .u-textarea__field {
      height: auto !important;
      font-size: 28rpx !important;
    }
    .u-textarea__count {
      bottom: -40rpx !important;
      //  background-color: #f5f5f5 !important;
    }
    .uni-textarea-placeholder {
      font-size: 28rpx;
      line-height: 38rpx;
      color: $remark-color;
      word-break: break-all;
    }
  }
  .showBigAreaClass {
    background: #f5f5f5;
    border-radius: 44rpx;
    .answer {
      background: #f5f5f5;
      border-radius: 10rpx;
      display: flex;
      margin-bottom: 30rpx;
      .bigTextarea {
        background: #f5f5f5;
        border: none;
      }
    }
  }

  :deep(.bottom) {
    display: flex;
    justify-content: flex-end;
    .u-button {
      width: 150rpx;
      height: 68rpx;
      background: #138bec, #53b7f6;
      border-radius: 10rpx !important;
      margin: 22rpx 0 0;
    }
  }
}
</style>
