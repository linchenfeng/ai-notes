<!--
 * @Author       : jacky.cai
 * @Date         : 2022-10-09 17:54:55
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-04 17:16:04
 * @Description  : 项目标签页 卡片栏位
-->

<template>
  <!-- <uni-list> -->
  <uni-list-item v-for="(item, index) in tempArray" :key="item.refcode" @tap="viewDetail(item)">
    <view class="view-top">
      <view class="title margin-bottom-45">{{ item.orgname }}</view>
      <view class="margin-bottom-32 bottom-vertical">
        <text class="sub-heading">交易对手名称</text>
        <text class="sub-content">{{ item.buyerName }}</text>
      </view>
      <view class="center-vertical margin-bottom-32">
        <text class="sub-heading">年度</text>
        <text class="sub-content-noflex" @click.stop="handelYear(index)">{{ item.year }}</text>
        <cover-image src="@/assets/member/project/caret-bottom-gray.png" />
      </view>
      <view class="center-vertical">
        <text class="sub-heading">笔数</text>
        <text class="sub-content">{{ item.total }}</text>
      </view>
    </view>
  </uni-list-item>
  <!-- </uni-list> -->
  <view>
    <u-picker ref="picker" :show="showClassPicker" :columns="columns" @confirm="onConfirm" @cancel="showClassPicker = false" />
  </view>
</template>
<script lang="ts">
export default {
  name: 'ProjectCardList'
}
</script>
<script lang="ts" setup>
import { Project } from '@/interfaces/member/project'
// import dayjs from 'dayjs'

// import { PickerInstance } from 'vant'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
const props = defineProps({
  projectList: { type: Array<Project>, required: true }
})
// const picker = ref<PickerInstance>()
let tempArray: Array<Project> = reactive([])
  // 页面正常渲染
for (let item of props.projectList) {
  tempArray.push(item)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-10-11 10:06:42
 * @param {*} newArray
 * @description: 数组改变，防止页面不刷新
 */
 const changeArray = (newArray) => {
  if (props.projectList.length !== tempArray.length) {
    for (let item of newArray) {
      tempArray.push(item)
    }
  }
}
let showClassPicker = ref(false)

let columns= reactive([
  [] as Array<string>
])

let selectIndex = 0
/**
 * @Author: jacky.cai
 * @Date: 2022-10-11 16:04:29
 * @return {*}
 * @description:改变当条columns
 */

const handelYear = (index: number): void => {
  if (tempArray[index].dateList.length !== 0) {
    selectIndex = index
    columns[0] = []
    for (let item of tempArray[selectIndex].dateList) {
      columns[0].push(item.year)
    }
    // picker.value?.setColumnValues(0, columns)
    showClassPicker.value = true
  }
}

const onConfirm = (value, index) => {
  tempArray[selectIndex].year = value.value[0]
  showClassPicker.value = false
  tempArray[selectIndex].total = tempArray[selectIndex].dateList[index].countTotal
}
let router = useRouter()
/**
 * @Author: jacky.cai
 * @Date: 2022-10-18 18:00:28
 * @param {*} item
 * @return {*}
 * @description: 列表点击事件，进入项目详情
 */
const viewDetail = item => {
  // item.refcode = 123
  // let refcode = encodeBase64(item.refcode)
  // let queryType = 'B'
  // router.push({
  //   path: '/member/customer/signProcess/Detail',
  //   query: {
  //     refcode: refcode,
  //     queryType: queryType
  //   }
  // })
  // router.push(`/404`)

  router.push(`/member/project/query/lending/detail/${encodeBase64(item.orgname)}/${encodeBase64(item.buyerName)}/${encodeBase64(item.year)}`)
}
defineExpose({changeArray})
</script>
<style lang="scss" scoped>
.margin-bottom-32 {
  margin-bottom: 32rpx;
}
.margin-bottom-45 {
  margin-bottom: 45rpx;
}
.view-top {
  padding: 44rpx 42rpx 38rpx 42rpx;
  margin: 0rpx 30rpx 42rpx 30rpx;
  // box-shadow: 0rpx 0rpx 2rpx $remark-color;
  box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.1);
  border-radius: 5rpx;
}
.center-vertical {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: fit-content;
}
.bottom-vertical {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 100%;
  height: fit-content;
}

uni-cover-image {
  width: 16rpx;
  height: 10rpx;
  margin-left: 16rpx;
}
.sub-heading {
  color: $remark-color;
  font-size: 28rpx;
  margin-right: 18rpx;
}
.sub-content {
  flex: 1;
  font-size: 28rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sub-content-noflex {
  font-size: 28rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.title {
  font-size: 32rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
