<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-25 18:47:26
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-04 10:37:28
 * @Description  : 尽调结果
-->
<template>
  <view class="due-diligence-result">
    <ty-info-card title="尽调信息" :show-line="props.firstShowLine">
      <view class="tag-button-box">
        <view
          v-for="item in vm.cddUserList"
          :key="item.refcode"
          class="tag-button"
          :class="item.refcode === vm.selectCddUser.refcode ? 'active' : ''"
          @click="selectUser(item)"
        >
          {{ item.cddUserName }}
        </view>
      </view>
      <view class="info-item">
        <view class="label">尽调定位：</view>
        <view class="value">
          <text class="mgr10">{{ vm.selectCddUser.positionLocation }}</text>
          <text v-if="vm.selectCddUser.positionLocation" class="link" @click="viewMap(vm.selectCddUser)">查看定位</text>
        </view>
      </view>
      <view class="info-item">
        <view class="label">尽调结论：</view>
        <view class="value">{{ vm.selectCddUser.taskConclusion }}</view>
      </view>
    </ty-info-card>
    <ty-info-card title="尽调材料">
      <view class="tag-button-box">
        <view
          v-for="item in vm.cddTagList"
          v-show="vm.cddTagList.length > 1 && item.useFlag === '1'"
          :key="item.refcode"
          class="tag-button"
          :class="{ active: item.refcode === vm.selectTag.refcode }"
          @click="selectCddTag(item)"
        >
          {{ item.tagName }}
        </view>
      </view>
      <view v-for="item in vm.fintCddApxList" :key="item.refcode">
        <view class="cddUserName">{{ item.cddUserName }}</view>
        <mediaPreview :media-list="item.cddApxList"></mediaPreview>
      </view>
      <u-empty v-if="!vm.fintCddApxList.length" mode="data" :text="'暂无数据'" :icon="empty" width="160" height="130"></u-empty>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { CddUserList, CddTagItem, FintCddApxList } from '@/interfaces/member/project/audit/assignDueDiligence'
import mediaPreview from '@/plugins/mediaPreview/index.vue'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import empty from '@/assets/empty/empty.png'
const router = useRouter()
const cddUserList: CddUserList[] = []
const cddTagList: CddTagItem[] = []
const fintCddApxList: FintCddApxList[] = []
const selectCddUser: CddUserList = {
  cddUserid: '',
  cddUserName: '',
  cddRefcode: 0,
  refcode: 0,
  surveyStatus: '',
  taskConclusion: '',
  positionLatitude: '',
  positionLocation: '',
  positionLongitude: ''
}
const selectTag: CddTagItem = {
  cddRefcode: 0,
  cddUserRefcode: 0,
  commonFlag: '',
  ownFlag: '',
  refcode: 0,
  tagName: '',
  useFlag: ''
}
const vm = reactive({
  cddUserList, // 尽调人员信息集合
  cddTagList, // 当前尽调人员标签集合
  fintCddApxList, // 当前尽调人员当前标签
  selectCddUser, //当前选中的尽调人员
  selectTag // 当前选择的标签
})
const props = defineProps({
  // 尽调流水号
  refcode: {
    type: Number,
    default: 0
  },
  // 第一个是否展示分割线
  firstShowLine: {
    type: Boolean,
    default: false
  }
})
// 尽调结果查询尽调材料信息
const queryDueDiligenceApx = () => {
  const data = {
    cddRefcode: props.refcode,
    tagRefcodeList: vm.selectTag.refcode ? [vm.selectTag.refcode] : []
  }
  apiAssignDueDiligence.queryDueDiligenceApx(data).then(res => {
    vm.fintCddApxList = res.data.fintCddApxList
  })
}
// 尽调标签信息查询
const queryDueDiligenceTagList = () => {
  const data = {
    cddRefcode: props.refcode,
    cddUserRefcode: vm.selectCddUser.refcode
  }
  apiAssignDueDiligence.queryDueDiligenceTagList(data).then(res => {
    vm.cddTagList = res.data.cddTagList
    vm.cddTagList.unshift({
      tagName: '全部',
      cddRefcode: 0,
      cddUserRefcode: 0,
      commonFlag: '',
      ownFlag: '',
      refcode: 0,
      useFlag: '1'
    })
    // 默认选择第一个标签
    vm.selectTag = vm.cddTagList[0]
    queryDueDiligenceApx()
  })
}
// 查询尽调结果人员信息
const queryDueDiligenceUserList = () => {
  apiAssignDueDiligence.queryDueDiligenceUserList(props.refcode).then(res => {
    vm.cddUserList = res.data.cddUserList.filter(item => item.surveyStatus !== '1')
    // 默认选中第一个
    vm.selectCddUser = vm.cddUserList[0]
    //获取当前用户的标签信息
    queryDueDiligenceTagList()
  })
}
// 选择尽调人员
const selectUser = (item: CddUserList) => {
  vm.selectCddUser = item
  //获取当前用户的标签信息
  queryDueDiligenceTagList()
}
// 选择标签
const selectCddTag = (item: CddTagItem) => {
  vm.selectTag = item
  // 获取当前人员、当前标签的材料
  queryDueDiligenceApx()
}
const viewMap = (item: CddUserList) => {
  router.push(`/member/project/audit/assignDueDiligence/baiduMap/${encodeBase64(item.positionLongitude)}/${encodeBase64(item.positionLatitude)}`)
}
onMounted(() => {
  queryDueDiligenceUserList()
})
</script>

<style lang="scss" scoped>
.due-diligence-result {
  .tag-button-box {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    .tag-button {
      width: fit-content;
      padding: 14rpx 28rpx;
      background: #eff7ff;
      border-radius: 5rpx;
      color: #333;
      &.active {
        color: #138bec;
      }
    }
  }
  .info-item {
    margin: 34rpx 0;
    display: flex;
    .label {
      flex: none;
    }
    .value {
      word-break: break-all;
      .mgr10 {
        margin-right: 10rpx;
      }
      .link {
        display: inline-block;
        color: $primary;
      }
    }
  }
  .cddUserName {
    margin: 20rpx 0;
  }
  :deep(.u-empty) {
    padding-top: 60rpx !important;
  }
}
</style>
