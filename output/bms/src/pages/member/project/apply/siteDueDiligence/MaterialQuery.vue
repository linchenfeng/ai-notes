<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-15 19:24:28
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-13 19:17:45
 * @Description  : 下一步查询材料
-->

<template>
  <view>
    <NavBar></NavBar>
    <ty-info-card title="尽调材料" :show-line="false">
      <template #subtitle>
        <view class="tagMangement" @click="doTagManagement">标签管理</view>
      </template>
      <view class="tag-button-box">
        <view
          v-for="item in vm.cddTagList"
          :key="item.refcode"
          class="tag-button"
          :class="{ active: item.refcode === vm.selectTag.refcode, addTag: item.refcode === -99 }"
          @click="selectCddTag(item)"
        >
          {{ item.tagName }}
        </view>
      </view>
      <view v-for="item in vm.fintCddApxList" :key="item.refcode">
        <view class="cddUserName">{{ item.cddUserName }}</view>
        <!-- <mediaPreview :media-list="item.cddApxList"></mediaPreview> -->
        <view class="cdd-apx-list">
          <view v-for="(subItem, i) in item.cddApxList" :key="i" :class="(i + 1) % 5 === 0 ? 'removeSpacing' : ''">
            <view v-if="!subItem.resourceUuid" class="to-sign-box" @click="doMakeTag">
              <text class="iconfont icon-addOrDel"></text>
            </view>
            <MediaPreview v-else :media-info="subItem"></MediaPreview>
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button :loading="loading" block type="success" native-type="submit" @click="doSaveCddInfo">保存</u-button>
      <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="submitCddInfo">提交</u-button>
    </view>
  </view>
  <u-modal
    :show="showModalFlag"
    title="添加标签"
    confirm-text="确认"
    cancel-text="取消"
    show-cancel-button="true"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <view class="slot-content">
      <view class="input-box">
        <u-input v-model="tagName" maxlength="20" clearable placeholder="请输入标签名称" />
      </view>
    </view>
  </u-modal>
  <u-modal
    :show="confirmDialog"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="确定"
    show-cancel-button
    @confirm="doSubmitCddInfo"
    @cancel="confirmDialog = false"
  >
    <view class="warmPrompt">是否确认提交？</view>
  </u-modal>
  <u-modal
    :show="fillInFlag"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="去填写"
    show-cancel-button
    @confirm="fillInResult"
    @cancel="fillInFlag = false"
  >
    <view class="warmPrompt">尽调结论未填写</view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { CddUserList, CddTagItem, FintCddApxList, CddApxList } from '@/interfaces/member/project/audit/assignDueDiligence'
import { CddInfo, SaveCddInfo } from '@/interfaces/member/project/apply/siteDueDiligence'
import MediaPreview from '@/plugins/mediaPreview/index.vue'
import { useRoute, useRouter } from '@/uni-simple-router'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { showToast } from '@/utils/uniapp/toast'
import { onShow } from '@dcloudio/uni-app'
import { setSession } from '@/utils/storages'
const router = useRouter()
const route = useRoute()
let cddUserRefcode = -1 // 尽调人员流水号
let cddRefcode = -1 // 尽调流水号
let tagName = ref('') // 标签名称
let showModalFlag = ref(false)
let confirmDialog = ref(false)
let fillInFlag = ref(false)
let loading = ref(false)
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
//  现场尽调详情
const cddInfo: CddInfo = {
  cddRefcode: -1,
  cddUserApxList: [],
  cddUserid: '',
  positionLatitude: '',
  positionLocation: '',
  positionLongitude: '',
  refcode: 0,
  surveyStatus: '',
  taskConclusion: '',
  cddUserName: ''
}
const selectTag: CddTagItem = {
  cddRefcode: 0,
  cddUserRefcode: 0,
  commonFlag: '',
  ownFlag: '',
  refcode: 0,
  tagName: ''
}
const vm = reactive({
  cddUserList, // 尽调人员信息集合
  cddTagList, // 当前尽调人员标签集合
  fintCddApxList, // 当前尽调人员当前标签
  selectCddUser, //当前选中的尽调人员
  selectTag, // 当前选择的标签
  cddInfo
})

// 尽调结果查询尽调材料信息
const queryDueDiligenceApx = () => {
  const data = {
    cddRefcode: cddRefcode,
    tagRefcodeList: vm.selectTag.refcode === -100 ? [] : [vm.selectTag.refcode]
  }
  apiAssignDueDiligence.queryDueDiligenceApx(data).then(res => {
    vm.fintCddApxList = res.data.fintCddApxList || []
    const index = vm.fintCddApxList.findIndex(item => item.cddUserName === vm.cddInfo.cddUserName)
    if (index === -1) {
      vm.fintCddApxList.unshift({
        cddApxList: [],
        cddUserName: vm.cddInfo.cddUserName
      } as unknown as FintCddApxList)
    } else {
      // 如果找到了匹配项，则将其移到第一位
      const [matchedItem] = vm.fintCddApxList.splice(index, 1)
      vm.fintCddApxList.unshift(matchedItem)
    }
    if (vm.selectTag.refcode !== -100) {
      vm.fintCddApxList.forEach(item => {
        if (item.cddUserName === vm.cddInfo.cddUserName) {
          item.cddApxList.unshift({ resourceUuid: '' } as CddApxList)
        }
      })
    }
  })
}
// 尽调标签信息查询
const queryDueDiligenceTagList = () => {
  const data = {
    cddRefcode: cddRefcode,
    cddUserRefcode: cddUserRefcode
  }
  apiAssignDueDiligence.queryDueDiligenceTagList(data).then(res => {
    vm.cddTagList = res.data.cddTagList
    vm.cddTagList.unshift({
      tagName: '全部',
      cddRefcode: -100,
      cddUserRefcode: -100,
      commonFlag: '',
      ownFlag: '',
      refcode: -100
    })
    vm.cddTagList.push({
      tagName: '添加标签',
      cddRefcode: -99,
      cddUserRefcode: -99,
      commonFlag: '',
      ownFlag: '',
      refcode: -99
    })
    // 检查当前选中的标签是否在新获取的标签列表中
    const isTagExist = vm.cddTagList.some(item => item.refcode === vm.selectTag.refcode)

    // 如果当前选中的标签不存在于列表中，则默认选择第一个标签
    if (!isTagExist) {
      vm.selectTag = vm.cddTagList[0]
    }
    queryDueDiligenceApx()
  })
}

// 选择标签
const selectCddTag = (item: CddTagItem) => {
  if (item.refcode === -99) {
    // 添加标签
    showModalFlag.value = true
    return
  }
  vm.selectTag = item
  // 当前标签的材料
  queryDueDiligenceApx()
}
// 添加标签
const onConfirm = () => {
  if (!tagName.value) {
    showToast('请输入标签名称')
    return
  }
  const data = {
    cddRefcode,
    cddUserRefcode,
    tagName: tagName.value
  }
  apiSiteDueDiligence.doSaveCddTag(data).then(() => {
    showModalFlag.value = false
    tagName.value = ''
    queryDueDiligenceTagList()
  })
}
// 取消
const onCancel = () => {
  tagName.value = ''
  showModalFlag.value = false
}
// 标签管理
const doTagManagement = () => {
  router.push(`/member/project/apply/siteDueDiligence/edit/tagManagement/${encodeBase64(cddRefcode)}/${encodeBase64(cddUserRefcode)}`)
}
// 打标记
const doMakeTag = () => {
  // 获取当前标签下当前用户的材料流水号
  let temList = vm.fintCddApxList[0].cddApxList.filter(item => item.refcode).map(item => item.refcode)
  router.push(
    `/member/project/apply/siteDueDiligence/edit/makeTag/${encodeBase64(cddUserRefcode)}/${encodeBase64(vm.selectTag.refcode)}/${encodeBase64(
      temList.join(',')
    )}`
  )
}
// 获取现场尽调详情
const queryCddInfo = () => {
  apiSiteDueDiligence.queryCddInfo(cddUserRefcode).then(res => {
    vm.cddInfo = res.data.userCddInfo
  })
}
// 尽调保存
const doSaveCddInfo = () => {
  apiSiteDueDiligence.doSaveCddInfo(vm.cddInfo as SaveCddInfo).then(() => {
    showToast('保存成功')
  })
}
// 尽调提交
const doSubmitCddInfo = () => {
  loading.value = true
  apiSiteDueDiligence.doSubmitCddInfo(vm.cddInfo as SaveCddInfo).then(
    () => {
      showToast('提交成功')
      loading.value = false
      router.back(2)
      confirmDialog.value = false
    },
    () => {
      loading.value = false
      confirmDialog.value = false
    }
  )
}
const fillInResult = () => {
  setSession('diligencefillInFlag', '1')
  router.back(1)
}
// 提交弹出确认框
const submitCddInfo = () => {
  if (!vm.cddInfo.taskConclusion) {
    // showToast('请输入尽调结论')
    // router.back(1)
    fillInFlag.value = true
    return
  }
  confirmDialog.value = true
}
onBeforeMount(() => {
  cddUserRefcode = Number(decodeBase64(route.value.params.cddUserRefcode)) // 尽调人员流水号
  cddRefcode = Number(decodeBase64(route.value.params.cddRefcode)) // 尽调流水号
  queryCddInfo()
  queryDueDiligenceTagList()
})
onShow(() => {
  if (cddUserRefcode !== -1) {
    queryDueDiligenceTagList()
  }
})
</script>

<style lang="scss" scoped>
.tagMangement {
  margin-left: auto;
  color: #138bec;
  font-weight: normal;
}
.tag-button-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 34rpx;
  .tag-button {
    width: fit-content;
    padding: 14rpx 20rpx;
    background: #eff7ff;
    border-radius: 5rpx;
    font-size: 28rpx;
    color: #333;
    &.active {
      color: #138bec;
    }
    &.addTag {
      background: #138bec;
      border-radius: 5rpx;
      color: #fff;
    }
  }
}
.info-item {
  margin: 20rpx 0;
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
  font-size: 28rpx;
  font-weight: bold;
  margin: 20rpx 0;
}
.cdd-apx-list {
  display: flex;
  align-items: self-start;
  flex-wrap: wrap;
  .to-sign-box {
    width: 110rpx;
    height: 110rpx;
    margin-right: 34rpx;
    border-radius: 5rpx;
    border: 1rpx dashed #d8d8d8;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-addOrDel {
      font-size: 40rpx;
      color: #999;
    }
  }
  .removeSpacing {
    :deep(.successImg) {
      margin-right: 0 !important;
    }
  }
}
.input-box {
  margin-top: 20rpx;
}
</style>
