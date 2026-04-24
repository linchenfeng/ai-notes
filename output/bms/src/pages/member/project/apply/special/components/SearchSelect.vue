<!--
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-08-20 14:47:37
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-08-30 15:09:53
 * @Description  : 带搜索框的下拉框
-->
<template>
  <view class="select-box">
    <view v-if="props.disabled && props.field === 'buyername' && viewList.length > 1" class="buyer-boxs">
      <view v-for="(item, index) in viewList" :key="index" class="buyer-box">{{ `买方${index + 1}：${item}` }}</view>
    </view>
    <view v-else class="unFocus" @click="open">
      <u-input v-model="thisData.text" :placeholder="props.placeholder" disabled />
    </view>
    <u-popup class="popup-con" :show="popup" mode="bottom">
      <view class="search-select" :style="{ height: props.height }">
        <view class="search-select_top">
          <view class="search-select_top_left">
            <span @click="clear">取消</span>
          </view>
          <view class="search-select_top_right">
            <span class="confirm-btn" @click="confirm">确认</span>
          </view>
        </view>
        <view class="search-select_main">
          <scroll-view v-if="thisData.dataList && thisData.dataList.length > 0" scroll-y="true">
            <u-checkbox-group v-model="thisData.checkId" placement="column">
              <u-checkbox v-for="(item, index) in thisData.dataList" :key="index" :label="item.value" :name="item.key"></u-checkbox>
            </u-checkbox-group>
          </scroll-view>
          <view v-else class="empty">暂无数据</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref ,watch} from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import { Constant } from '@/interfaces/common/constant'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 提交值
  modelText: { type: String, default: '' }, // 页面显示值
  disabled: { type: Boolean, default: false }, // 是否禁用
  placeholder: { type: String, default: '请选择' }, // 输入框placeholder
  localdata: { type: Array<Constant>, default: () => [] }, // popup展示的数据
  field: { type: String, default: '' },
  height: { type: String, default: '40vh'}
})
const emit = defineEmits(['update:modelValue', 'update:modelText', 'change'])
const thisData = reactive({
  text: props.modelText,
  dataList: Array<Constant>(),
  checkId: [],
  searchValue: ''
})
const viewList = ref<string[]>([])

const popup = ref(false)
// 打开时加载数据
const open = () => {
  if (!props.disabled) {
    thisData.dataList = props.localdata
    // 买方名称的时候特殊处理
    if (props.field === 'buyername') {
        const valueArray = props.modelValue.split(',');
        const keyArray = valueArray.map(value => {
          const item = thisData.dataList.find(dataItem => dataItem.value === value);
          return item ? item.key : ''
        })
        thisData.checkId = keyArray as []
      }
      popup.value = true
  }
}
// 点击取消
const clear = () => {
  popup.value = false
}
// 点击确认
const confirm = () => {
  if (!thisData.checkId.length) {
    showToast('请选择后再确认')
  } else {
    let valueArr = thisData.checkId.map(item => thisData.dataList.find(checkItem => checkItem.key === item)?.key)
    let textArr = thisData.checkId.map(item => thisData.dataList.find(checkItem => checkItem.key === item)?.value)
    thisData.text = textArr.join(',')
    emit('update:modelText', textArr.join(','))
    if (props.field === 'buyername') {
      emit('update:modelValue', textArr.join(','))
    } else {
      emit('update:modelValue', valueArr.join(','))
    }
    popup.value = false
  }
}

watch(
  () => props.modelText,
  (newVal) => {
    if (props.disabled) {
      viewList.value = newVal.split(',')
      thisData.text = newVal
    } else {
      thisData.text = newVal
    }
  },
  { immediate: true }
)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      thisData.checkId = newVal.split(',') as []
    } else {
      thisData.checkId = []
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.search-select {
  width: 100%;
  height: 45vh;
  background-color: #fff;
  border-bottom: 2px solid #eee;
  border-radius: 5px 5px 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  &_top {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #efefef;

    &_left {
      flex: 1;
      padding-left: 15px;
    }

    &_right {
      flex: 1;
      padding-right: 10px;
      text-align: right;

      button + button {
        margin-left: 5px;
      }
    }
  }
  &_main {
    flex: 1;
    min-height: 5px;
    padding: 10px 15px;

    scroll-view {
      height: 100%;
    }
  }
}
.popup-con {
  :deep(.u-popup__content) {
    width: 100%;
  }
}
:deep(.uni-scroll-view-content) {
  display: flex;
  justify-content: center;
  .u-checkbox-group {
    width: 100%;
    .u-checkbox {
      margin: 0;
      align-items: center;
      height: 72rpx;
      line-height: 72rpx;
      .u-icon__icon {
        font-size: 24rpx !important;
      }
      .uicon-checkbox-mark {
        // display: none;
        span {
          color: #fff;
        }
      }
      .u-checkbox__icon-wrap {
        margin-right: 10rpx;
        width: 36rpx !important;
        height: 36rpx !important;
      }
      span {
        font-size: 36rpx;
      }
    }
  }
}
.confirm-btn {
  color: #3c9cff;
}
:deep(.u-input__content) {
  background: #ffffff;
}
:deep(.uni-input-input:disabled) {
  color: #303133 !important;
}

.select-box {
  width: 100%;
  .buyer-boxs {
    .buyer-box {
      min-height: 24px;
      line-height: 24px;
      font-size: 15px;
    }
  }
}
</style>
