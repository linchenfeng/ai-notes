<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-17 11:21:31
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-27 15:10:19
 * @Description  : 打标签
-->
<template>
  <NavBar></NavBar>
  <up-sticky bg-color="#fff">
    <view class="head-tabs" :class="`selectTab${tabIndex}`">
      <view class="tabs-line"></view>
      <u-tabs
        :list="vm.tabsList"
        line-color="#138BEC"
        :active-style="{
          color: '#138BEC',
          fontSize: '32rpx'
        }"
        :inactive-style="{
          color: '#666666',
          fontSize: '28rpx'
        }"
        line-width="50"
        line-height="4"
        @click="selectTab"
      ></u-tabs>
    </view>
  </up-sticky>
  <view class="make-tag-box">
    <MediaPreview ref="mediaPreviewRef" :is-select="true" :media-list="vm.fintCddUserApx.cddApxList" @change-checked="changeChecked"></MediaPreview>
    <u-empty
      v-if="!vm.fintCddUserApx.cddApxList || !vm.fintCddUserApx.cddApxList.length"
      mode="data"
      :text="'暂无数据'"
      :icon="empty"
      width="300"
      height="244"
    ></u-empty>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <up-checkbox-group v-model="isCheckedAll" size="30" @change="checkAll">
        <up-checkbox name="1" shape="circle" label="全选" label-size="14px" label-color="#333"></up-checkbox>
      </up-checkbox-group>
      <view class="count-box">
        <view>
          <text>已选中</text>
          <text class="error">{{ selectedCount }}</text>
          <text>笔</text>
        </view>
        <view>
          <text>共计</text>
          <text class="error">{{ allCount }}</text>
          <text>笔</text>
        </view>
        <!-- <view>
          ({{ selectedCount }}
          <text class="in">/</text>
          {{ allCount }})
        </view> -->
      </view>
      <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="doSaveCddApxTag">完成</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { FintCddApxList } from '@/interfaces/member/project/apply/siteDueDiligence'
import MediaPreview from '@/plugins/mediaPreview/index.vue'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
import empty from '@/assets/empty/empty.png'
const route = useRoute()
const router = useRouter()
let loading = ref(false)
let cddUserRefcode = -1 // 尽调人员流水号
let cddTagRefcode = -1 // 尽调标签流水号
let allCount = ref(0) // 总条数
let selectRefcodeList: number[] = [] // 已选择的材料流水号集合
// let selectCount = ref(0) // 已选中条数
let isCheckedAll = ref<string[]>([]) // 全选
let mediaPreviewRef = ref()
let tabIndex = ref(0) // 当前选中的持仓状态序号
let fintCddUserApx: FintCddApxList = {
  cddApxList: [],
  cddRefcode: 0,
  cddUserid: '',
  cddUserName: '',
  refcode: 0,
  surveyStatus: ''
}
let tabsList = [
  {
    name: '全部'
  },
  {
    name: '未添加标签材料'
  }
]
let vm = reactive({
  fintCddUserApx,
  tabsList,
  selectRefcodeList
})
// 获取已选中数量
const getSelectLength = () => {
  if (tabIndex.value === 0) {
    return vm.selectRefcodeList.length
  }
  let count = 0
  vm.fintCddUserApx.cddApxList.forEach(item => {
    if (vm.selectRefcodeList.includes(item.refcode)) {
      count++
    }
  })
  return count
}
const selectedCount = computed(() => {
  if (getSelectLength() === vm.fintCddUserApx.cddApxList.length && vm.fintCddUserApx.cddApxList.length) {
    isCheckedAll.value = ['1']
  } else {
    isCheckedAll.value = []
  }
  return getSelectLength()
})

// 查询当前用户材料
const queryAllCddApx = () => {
  const data = {
    cddUserRefcode,
    cddApxNoTagFlag: tabIndex.value
  }
  apiSiteDueDiligence.queryAllCddApx(data).then(res => {
    vm.fintCddUserApx = res.data.fintCddUserApx
    vm.fintCddUserApx.cddApxList.forEach(item => {
      if (vm.selectRefcodeList.includes(item.refcode)) {
        // 默认勾选数据
        item.checked = ['1']
      }
    })
    // 初始化数据
    // mediaPreviewRef.value.initMediaData(res.data.fintCddUserApx.cddApxList)
    if (res.data.fintCddUserApx.cddApxList && res.data.fintCddUserApx.cddApxList.length) {
      allCount.value = res.data.fintCddUserApx.cddApxList.length
    } else {
      allCount.value = 0
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  queryAllCddApx()
}
// 更改勾选
const changeChecked = item => {
  if (item.checked && item.checked.length) {
    vm.selectRefcodeList.push(item.refcode)
  } else {
    vm.selectRefcodeList = vm.selectRefcodeList.filter(item1 => item1 !== item.refcode)
  }
}
// 全选
const checkAll = () => {
  if (isCheckedAll.value.length) {
    // 取消全选
    mediaPreviewRef.value.clearAll()
    if (tabIndex.value === 0) {
      // 全部页签清空所有
      vm.selectRefcodeList = []
    } else {
      // 未添加页签进清空当前数据
      vm.selectRefcodeList = vm.selectRefcodeList.filter(refcode => {
        return !vm.fintCddUserApx.cddApxList.some(item => item.refcode === refcode)
      })
    }
  } else {
    // 全选
    mediaPreviewRef.value.checkAll()
  }
}
// 添加标签
const doSaveCddApxTag = () => {
  // if (!vm.selectRefcodeList.length) {
  //   showToast('请选择要添加的标签材料')
  //   return
  // }
  const data = {
    cddTagRefcode,
    cddUserRefcode,
    cddApxRefcodeList: vm.selectRefcodeList
  }
  apiSiteDueDiligence.doSaveCddApxTag(data).then(() => {
    showToast('添加成功')
    router.back(1)
  })
}

onMounted(() => {
  cddUserRefcode = Number(decodeBase64(route.value.params.cddUserRefcode)) // 尽调人员流水号
  cddTagRefcode = Number(decodeBase64(route.value.params.cddTagRefcode)) // 尽调标签流水号
  let selectRefcode = decodeBase64(route.value.params.selectRefcode)

  if (selectRefcode) {
    vm.selectRefcodeList = selectRefcode.split(',').map((item: string) => Number(item)) // 选择的材料流水号集合
  }
  queryAllCddApx()
})
</script>

<style lang="scss" scoped>
.head-tabs {
  margin-top: 10rpx;
  position: relative;
  .tabs-line {
    position: absolute;
    width: 100%;
    height: 1rpx;
    background-color: #dedede;
    bottom: 4rpx;
  }
  :deep(.u-tabs) {
    .u-tabs__wrapper__nav__item {
      padding: 0;
      width: 50%;
      box-sizing: border-box;
    }
  }

  &.selectTab0 {
    :deep(.u-tabs) {
      .u-tabs__wrapper__nav__line {
        transform: translate(160rpx) !important;
      }
    }
  }
  &.selectTab1 {
    :deep(.u-tabs) {
      .u-tabs__wrapper__nav__line {
        transform: translate(540rpx) !important;
      }
    }
  }
}
.make-tag-box {
  margin: 30rpx;
}
:deep(.u-checkbox-group) {
  flex-flow: row;
  .u-checkbox {
    margin: 0;
    .u-icon__icon {
      font-size: 24rpx !important;
    }
    .u-checkbox__icon-wrap {
      margin: 6rpx 14rpx 0 0;
    }
  }
}

.button-fixed-bottom {
  .count-box {
    flex: none;
    // display: flex;
    // align-items: center;
    font-size: 28rpx;
    min-width: 180rpx;
    color: #999;
    .error {
      color: $u-error;
      margin: 0 2rpx;
    }
  }
  :deep(.u-checkbox-group) {
    .u-checkbox .u-checkbox__icon-wrap {
      margin-top: -4rpx;
    }
  }
}
</style>
