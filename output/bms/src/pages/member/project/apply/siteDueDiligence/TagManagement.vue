<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-16 10:58:00
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-13 15:01:44
 * @Description  : 标签管理
-->
<template>
  <NavBar></NavBar>
  <view class="tag-management">
    <view class="title">点击可编辑标签</view>
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
  </view>
  <u-modal
    :show="showModalFlag"
    :title="modadType === '1' ? '添加标签' : '修改标签'"
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
  <u-popup :show="showPopup" mode="bottom" :round="14">
    <view class="popup-btn border" @click="modTag">修改标签名称</view>
    <view class="popup-btn" @click="doRemoveCddTag">仅删除标签（不删除材料）</view>
    <view class="line"></view>
    <view class="popup-btn" @click="cancelPopup">取消</view>
  </u-popup>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { CddTagItem } from '@/interfaces/member/project/audit/assignDueDiligence'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { useRoute /* useRouter */ } from '@/uni-simple-router'
import { /* encodeBase64 */ decodeBase64 } from '@/utils/crypto'
import { showToast } from '@/utils/uniapp/toast'
// const router = useRouter()
const route = useRoute()
let showModalFlag = ref(false)
let tagName = ref('') // 标签名称
let modadType = ref('1')
let showPopup = ref(false)
const cddTagList: CddTagItem[] = []
let cddUserRefcode = -1 // 尽调人员流水号
let cddRefcode = -1 // 尽调流水号
const selectTag: CddTagItem = {
  cddRefcode: 0,
  cddUserRefcode: 0,
  commonFlag: '',
  ownFlag: '',
  refcode: 0,
  tagName: ''
}
const vm = reactive({
  cddTagList, // 当前尽调人员标签集合
  selectTag
})

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
    // 默认选择第一个标签
    vm.selectTag = vm.cddTagList[0]
  })
}
const cancelPopup = () => {
  showPopup.value = false
}
// 删除标签
const doRemoveCddTag = () => {
  const data = {
    refcode: vm.selectTag.refcode
  }
  apiSiteDueDiligence.doRemoveCddTag(data).then(() => {
    showToast('删除成功')
    showPopup.value = false
    queryDueDiligenceTagList()
  })
}
const doSaveCddTag = () => {
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
const doUpdateCddTag = () => {
  const data = {
    refcode: vm.selectTag.refcode,
    tagName: tagName.value
  }
  apiSiteDueDiligence.doUpdateCddTag(data).then(() => {
    showModalFlag.value = false
    tagName.value = ''
    queryDueDiligenceTagList()
  })
}

const onConfirm = () => {
  if (modadType.value === '1') {
    // 添加标签
    if (!tagName.value) {
      showToast('请输入标签名称')
      return
    }
    doSaveCddTag()
  } else {
    // 修改标签
    doUpdateCddTag()
  }
}
// 取消
const onCancel = () => {
  tagName.value = ''
  showModalFlag.value = false
}
// 选择标签
const selectCddTag = (item: CddTagItem) => {
  if (item.refcode === -99) {
    // 添加标签
    modadType.value = '1'
    showModalFlag.value = true
    return
  } else if (item.ownFlag === '1') {
    showPopup.value = true
    vm.selectTag = item
  }
}
// 修改自己的标签名称
const modTag = () => {
  modadType.value = '2'
  showModalFlag.value = true
  tagName.value = vm.selectTag.tagName
  showPopup.value = false
}
onMounted(() => {
  cddUserRefcode = Number(decodeBase64(route.value.params.cddUserRefcode)) // 尽调人员流水号
  cddRefcode = Number(decodeBase64(route.value.params.cddRefcode)) // 尽调流水号
  queryDueDiligenceTagList()
})
</script>

<style lang="scss" scoped>
.line {
  height: 10rpx;
  background: #f6f6f6;
}
.popup-btn {
  font-size: 28rpx;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  &.border {
    border: 2rpx solid #ededed;
  }
}
.tag-management {
  padding: 50rpx 30rpx;
  .title {
    font-size: 32rpx;
    color: #333333;
    margin-bottom: 30rpx;
    line-height: 1;
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
}
</style>
