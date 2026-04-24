<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-05 10:24:37
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-20 11:09:15
 * @Description  : 选择协销/征信人员组件
-->
<template>
  <up-popup :show="props.showPopup" :round="14" @close="cancel">
    <view class="operate">
      <view class="cancel" @tap="cancel">取消</view>
      <view class="submit" @tap="handleConfirm">确认</view>
    </view>
    <view class="line"></view>
    <scroll-view v-if="list.length" class="list-wrap" scroll-y="true" scroll-with-animation="true">
      <view class="userName-list">
        <view v-for="(item, i) in list" :key="i" class="item-box">
          <text>{{ item[props.valueKey] }}</text>
          <text class="invite" @tap.stop="toggleSelect(item[props.valueKey], item.cddUserid)">
            {{ isSelected(item[props.valueKey]) ? props.cancelName : props.confirmName }}
          </text>
        </view>
      </view>
    </scroll-view>
    <view v-else class="empty">暂无数据</view>
  </up-popup>
</template>
<script setup lang="ts">
import { AssistSuperiorList } from '@/interfaces/member/project/internationfinancingCommon'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import type { PropType } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
// 定义组件属性
const props = defineProps({
  showPopup: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array as PropType<AssistSuperiorList[]>,
    default: () => []
  },
  // 初始选中的名称字符串，多个用逗号拼接
  activeName: {
    type: String,
    default: ''
  },
  // 新增：控制是否允许多选，默认true
  allowMultipleSelection: {
    type: Boolean,
    default: true
  },
  // 展示的默认值
  valueKey: {
    type: String,
    default: 'userName'
  },
  confirmName: {
    type: String,
    default: '指派'
  },
  cancelName: {
    type: String,
    default: '取消指派'
  },
  // 尽调流水号
  refcode: {
    type: Number,
    default: 0
  },
  // 来源类型 【assist=指派协销/dueDiligence=指派尽调】
  sourceType: {
    type: String,
    default: 'assist'
  }
})

// 定义事件
const emit = defineEmits(['cancel', 'confirm'])

// 选中的名称集合
const selectedNames = ref<string[]>([])

// 初始化选中状态
const initSelectedNames = () => {
  if (props.activeName) {
    selectedNames.value = props.activeName.split(',').filter(name => name.trim())
  } else {
    selectedNames.value = []
  }
}

// 监听activeName变化，更新选中状态
watch(
  () => props.activeName,
  () => {
    initSelectedNames()
  },
  { immediate: true }
)
// 检查是否选中
const isSelected = (name: string) => {
  return selectedNames.value.includes(name)
}
// 切换选中状态
const toggleSelect = async (name: string, cddUserid: string) => {
  const index = selectedNames.value.indexOf(name)
  if (index > -1) {
    // 取消选中
    if (props.sourceType === 'dueDiligence' && props.refcode) {
      // 取消选中
      const data = {
        cddRefcode: props.refcode,
        cddUseridList: [cddUserid]
      }
      const res = await apiAssignDueDiligence.checkUserDueDiligenceStatus(data)
      if (res.data.cddUserNameList && res.data.cddUserNameList.length > 0) {
        showToast('该人员已开始尽调，暂不允许取消')
        return
      }
    }
    selectedNames.value = selectedNames.value.filter(item => item !== name)
  } else {
    // 选中
    if (!props.allowMultipleSelection && selectedNames.value.length > 0) {
      let msg = '当前只能选择一个协销主管'
      if (props.sourceType === 'dueDiligence') {
        msg = '只能选择一个尽调人员'
      }
      showToast(msg)
      return
    }
    selectedNames.value.push(name)
  }
}
// 取消操作
const cancel = () => {
  emit('cancel')
}

// 确认操作
const handleConfirm = () => {
  // 如果不允许多选且选择了多个（理论上通过toggleSelect控制不会出现这种情况，做个双重保险）
  if (!props.allowMultipleSelection && selectedNames.value.length > 1) {
    showToast('当前不允许选择多个选项')
    return
  }
  let lastSelectedList: any[] = []
  props.list.forEach(item => {
    selectedNames.value.forEach(name => {
      if (item[props.valueKey] === name) {
        let item1 = { ...item, cddRefcode: props.refcode }
        lastSelectedList.push(item1)
      }
    })
  })
  if (props.sourceType === 'dueDiligence' && !lastSelectedList.length && selectedNames.value.length) {
    showToast('尽调人员配置已变更')
    return
  }
  // 将选中的合集用字符串拼接传递出去
  const result = selectedNames.value.join(',')
  emit('confirm', result, lastSelectedList)
}
</script>
<style lang="scss" scoped>
.operate {
  display: flex;
  padding: 20rpx 30rpx;
  justify-content: space-between;
  .cancel {
    color: #909193;
  }
  .submit {
    color: #3c9cff;
  }
}
.line {
  height: 10rpx;
  background: #f6f6f6;
}
.userName-list {
  min-height: 300rpx;
  max-height: 60vh;
  .item-box {
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    line-height: 100rpx;
    border-bottom: 2rpx solid #ededed;
    font-size: 28rpx;
    &:last-of-type {
      border-bottom: none;
      margin-bottom: 40rpx;
    }
    .invite {
      color: $primary;
    }
  }
}
.empty {
  min-height: 150rpx;
  text-align: center;
  line-height: 150rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
