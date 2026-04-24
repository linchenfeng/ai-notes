<!--
 * @Author       : ran.zhu
 * @Date         : 2022-10-10 09:10:43
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-10-11 10:07:24
 * @Description  : 项目 /member/project
-->

<template>
  <view class="mainView">
    <view class="titleView">
      <u-row :wrap="false">
        <u-col span="3">客户名称</u-col>
        <u-col span="5">交易对手名称</u-col>
        <u-col span="2.5">
          <view class="text-center">年度</view>
        </u-col>
        <u-col span="1.5">
          <view class="text-center">笔数</view>
        </u-col>
      </u-row>
    </view>
    <view class="listView">
      <!-- <uni-list> -->
      <uni-list-item v-for="(data, index) in dataList" :key="data.refcode" @tap="handelClickRowAciton(data)">
        <view class="liView">
          <u-row :wrap="false">
            <u-col class="ttClass ellipsis" span="3">
              {{ data.orgname }}
            </u-col>
            <u-col span="5">{{ data.buyerName }}</u-col>
            <u-col span="2.5">
              <view class="text-center annual">
                <view @click.stop="handelYear(index)">{{ data.year }}</view>
                <cover-image class="ttrightimgClass" :src="cbimgurl" />
              </view>
            </u-col>
            <u-col span="1.5">
              <view class="text-center">{{ data.total }}</view>
            </u-col>
          </u-row>
        </view>
      </uni-list-item>
      <!-- </uni-list> -->
    </view>
  </view>
  <view>
    <u-picker :show="showClassPicker" :columns="columns" @confirm="onClassConfirm" @cancel="showClassPicker = false"></u-picker>
  </view>
</template>
<script lang="ts">
export default {
  name: 'ProjectTable',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import { Project } from '@/interfaces/member/project/index'
import cbimgurl from '@/assets/member/project/caret-bottom-gray.png'
import { showToast } from '@/utils/uniapp/toast'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
const router = useRouter()
let dataList: Array<Project> = reactive([])
// type List=[0]
let columns = reactive([
  [] as Array<string>
])
let showClassPicker = ref(false)
const props = defineProps({ projectList: { type: Array<Project>, required: true } })
for (let item of props.projectList) {
  dataList.push(item)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-10-11 10:06:42
 * @param {*} newArray
 * @description: 数组改变，防止页面不刷新
 */
const changeArray = (newArray) => {
  if (props.projectList.length !== dataList.length) {
    for (let item of newArray) {
      dataList.push(item)
    }
  }
}

// 定义临时变量取选中的下标
let i = ref(0)

// const emit = defineEmits(['changeAction'])

/**
 * @Author: ran.zhu
 * @Date: 2022-10-10 17:47:08
 * @param {*} e 点击年传入的下标
 * @return {*}
 * @description: 点击年 弹框选择
 */
const handelYear = (e): void => {
  columns[0] = []
  for (let item of dataList[e].dateList) {
    columns[0].push(item.year)
  }
  showClassPicker.value = true
}
/**
 * @Author: ran.zhu
 * @Date: 2022-10-10 17:48:07
 * @param {*} e 获取选择的值
 * @return {*}
 * @description: 选中年份对数据进行更改
 */
const onClassConfirm = (e): void => {
  dataList[i.value].year = e.value[0]
  showClassPicker.value = false
  // emit('changeAction', dataList)
}

/**
 * @Author: ran.zhu
 * @Date: 2022-10-10 17:53:24
 * @param {*} e 行下标
 * @return {*}
 * @description: 点击行跳转下一界面
 */
const handelClickRowAciton = (data): void => {
  if (data.orgname && data.buyerName && data.year) {
    router.push(`/member/project/query/lending/detail/${encodeBase64(data.orgname)}/${encodeBase64(data.buyerName)}/${encodeBase64(data.year)}`)
  } else {
    showToast('数据不全')
  }
}
defineExpose({ changeArray })
</script>
<style lang="scss" scoped>
.mainView {
  .titleView {
    padding: 0rpx 30rpx 29rpx;
    border-bottom: 1rpx solid $border-color;

    :deep(.u-col) {
      color: $remark-color;
    }
  }
}

.liView {
  padding: 30rpx 30rpx;

  &:nth-of-type(even) {
    background: var(--u-stripe);
  }
}

:deep(.u-col) {
  .ttletfimgClass {
    width: 20rpx;
    height: 20rpx;
  }

  .annual {
    display: flex;
    justify-content: center;

    .ttrightimgClass {
      width: 20rpx;
      height: 14rpx;
      margin: 10rpx 0 0 10rpx;
    }
  }
}
</style>
