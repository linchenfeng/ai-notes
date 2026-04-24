<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 16:10:25
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-14 17:34:43
 * @Description  : 项目-业务审核-指派尽调-指派尽调-新增/修改 /member/project/audit/assignDueDiligence/edit
-->
<template>
  <view>
    <NavBar></NavBar>
    <up-sticky v-if="vm.dueDiligenceInfo.appointStatus && surveyStatus === '3'" bg-color="#fff">
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
    <!-- 基本信息 -->
    <view v-if="tabIndex === 0">
      <ty-info-card title="客户基本信息" :show-line="false">
        <u-form>
          <u-form-item label="客户名称" label-width="30%" required>
            <view v-if="vm.dueDiligenceInfo.orgname" class="form-item-text" @click="selectName()">{{ vm.dueDiligenceInfo.orgname }}</view>
            <view v-else class="unFocus" @click="selectName()">
              <u-input v-model="vm.dueDiligenceInfo.orgname" placeholder="请选择客户" />
            </view>
            <template #right>
              <up-icon v-if="!refcode" name="arrow-right" @click="selectName()"></up-icon>
            </template>
          </u-form-item>
          <u-form-item label="所在国/地区" label-width="35%">
            <!-- <u-input v-model="vm.dueDiligenceInfo.ctyDesc" readonly /> -->
            <view class="form-item-text">{{ vm.dueDiligenceInfo.ctyDesc }}</view>
          </u-form-item>
          <u-form-item label="主要经营范围" label-width="35%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.businessScope }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.businessScope" readonly /> -->
          </u-form-item>
          <u-form-item label="经营地址" label-width="30%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.operateAddress }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.operateAddress" readonly /> -->
          </u-form-item>
          <u-form-item label="成立时间" label-width="30%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.regDate }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.regDate" readonly /> -->
          </u-form-item>
          <u-form-item label="法人" label-width="30%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.legalPerson }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.legalPerson" readonly /> -->
          </u-form-item>
          <u-form-item label="法人联系电话" label-width="35%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.legalPhone }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.legalPhone" readonly /> -->
          </u-form-item>
          <u-form-item label="联系人姓名" label-width="35%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.legalLinkman }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.legalLinkman" readonly /> -->
          </u-form-item>
          <u-form-item label="联系人电话" label-width="35%">
            <view class="form-item-text">{{ vm.dueDiligenceInfo.legalLinkmanPhone }}</view>
            <!-- <u-input v-model="vm.dueDiligenceInfo.legalLinkmanPhone" readonly /> -->
          </u-form-item>
        </u-form>
      </ty-info-card>
      <!-- 一期暂时屏蔽交易信息 -->
      <!-- <ty-info-card title="交易信息">
        <OrgHisTradeList v-if="vm.dueDiligenceInfo.orgHisTradeList" :org-his-trade-list="vm.dueDiligenceInfo.orgHisTradeList"></OrgHisTradeList>
      </ty-info-card> -->
      <ty-info-card v-if="vm.dueDiligenceInfo.assistUsers" title="协销人员">
        <view class="assist-superior">{{ vm.dueDiligenceInfo.assistUsers }}</view>
      </ty-info-card>
      <ty-info-card v-if="vm.dueDiligenceInfo.creditUsers" title="征信人员">
        <view class="assist-superior">{{ vm.dueDiligenceInfo.creditUsers }}</view>
      </ty-info-card>
      <!-- 选择协销人员 -->
      <ty-info-card :required="true" title="现场尽调人员">
        <template #subtitle>
          <view class="inviteWrite" @click.stop="selectUser()">
            <text class="name">选择</text>
          </view>
        </template>
        <view class="assist-superior">{{ activeNames }}</view>
      </ty-info-card>
      <ty-info-card title="设置尽调截止日">
        <template #subtitle>
          <view class="inviteWrite" @click.stop="selectendDate">
            <text class="name">选择</text>
          </view>
        </template>
        <view class="assist-superior">{{ dateFormat(vm.dueDiligenceInfo.endDate || '') }}</view>
      </ty-info-card>
      <ty-info-card title="尽调任务要求">
        <!-- <u-form> -->
        <view class="content pre-wrap">
          <u-textarea
            v-model="vm.dueDiligenceInfo.remark"
            :confirm-type="null"
            auto-height
            maxlength="300"
            count
            class="inputValueClass"
            placeholder="请输入尽调任务要求"
          ></u-textarea>
        </view>
        <!-- </u-form> -->
      </ty-info-card>
    </view>
    <!-- 尽调结果 -->
    <DueDiligenceResult v-if="tabIndex === 1" :refcode="refcode"></DueDiligenceResult>
    <u-popup :show="showSelectOrg" mode="center">
      <OrgList
        type="list"
        title="客户信息"
        id-key="orgname"
        name-key="orgname"
        :data="vm.orgnameList"
        placeholder="请输入客户名称"
        :search-fun="queryAplOrgNameByPerConf"
        @back="closeOrg"
        @click-fun="clickOrgFun"
      ></OrgList>
    </u-popup>
    <!-- 选择人员弹出组件 -->
    <!-- 再次尽调当作新增处理，不传refcode -->
    <select-pop
      :show-popup="showPopup"
      :list="(vm.optionalCddUserList as unknown as AssistSuperiorList[])"
      :active-name="activeNames"
      :refcode="isAgain === '1' ? 0 : refcode"
      value-key="cddUserName"
      :allow-multiple-selection="false"
      source-type="dueDiligence"
      @cancel="showPopup = false"
      @confirm="popConfirm"
    />
    <u-datetime-picker
      ref="datePicker"
      v-model="date.defaultDate"
      :show="showDatePicker"
      mode="date"
      item-height="88"
      title="尽调截止日"
      :min-date="date.minDate"
      :max-date="date.maxDate"
      @cancel="showDatePicker = false"
      @confirm="doDateConfirm"
    />
    <u-modal
      :show="dialogShow"
      mode="center"
      title="温馨提示"
      :round="10"
      confirm-text="确定"
      :show-cancel-button="false"
      show-confirm-button
      @confirm="onConfirm"
    >
      <view class="slot-content">
        <view>{{ toastMsg }}</view>
      </view>
    </u-modal>
    <view v-if="getHasPermissionsById('member:project:audit:assignDueDiligence:insert')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button
          v-if="vm.dueDiligenceInfo.appointStatus && surveyStatus === '1'"
          :loading="loading"
          block
          type="warning"
          native-type="submit"
          @click="submitCancelDueDiligence"
        >
          取消指派
        </u-button>
        <u-button
          v-if="vm.dueDiligenceInfo.appointStatus !== '9'"
          :loading="loading"
          block
          type="primary"
          class="submit"
          native-type="submit"
          @click="onSubmit()"
        >
          {{ vm.dueDiligenceInfo.appointStatus === '2' ? '修改' : '指派' }}
        </u-button>
      </view>
    </view>
  </view>
  <u-modal
    :show="modalShow"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="确定"
    show-cancel-button
    @confirm="doCancelDueDiligence"
    @cancel="modalShow = false"
  >
    <view class="warmPrompt">是否确认取消指派？</view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { AssignDiligenceInfo, OrgnameList, OptionalCddUserList } from '@/interfaces/member/project/audit/assignDueDiligence'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { getHasPermissionsById } from '@/utils/permissions'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { showToast } from '@/utils/uniapp/toast'
// import OrgHisTradeList from './components/OrgHisTradeList.vue'
import OrgList from '@/pages/member/project/apply/access/components/OrgList.vue'
import SelectPop from '@/pages/member/project/apply/assist/components/SelectPop.vue'
import { dateFormat } from '@/utils/format'
import dayjs from 'dayjs'
import DueDiligenceResult from './components/DueDiligenceResult.vue'
import { AssistSuperiorList } from '@/interfaces/member/project/internationfinancingCommon'

const modalShow = ref(false)
const router = useRouter()
const route = useRoute()
const loading = ref(false)
let dialogShow = ref(false)

let initFlag = ref(true) // 是否初始化
let toastMsg = ref('')
let selectOrgname = ref('') // 当前选择的客户名称
let defaultCreditUser = ref('') // 默认尽调人员
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '基本信息'
  },
  {
    name: '尽调结果'
  }
]
// 1=待尽调3=尽调中
const surveyStatus = ref('') // 尽调人员尽调状态 【1=均未开始尽调/3=尽调中】
let showSelectOrg = ref(false) // 是否展示选择客户弹窗
const showPopup = ref(false) // 选择指派尽调
let activeNames = ref('') // 选择人员默认活跃态人员
const showDatePicker = ref(false) // 截止日期
const orgName = ref('')
let isAgain = ref('') // 是否再次尽调
const date = {
  // 日期选择区间，设置为十年后
  minDate: dayjs().toDate(),
  maxDate: dayjs().add(10, 'year').toDate(),
  // 默认日期为当月月底
  defaultDate: dayjs().endOf('month').valueOf()
}

const orgnameList: OrgnameList[] = []
const optionalCddUserList: OptionalCddUserList[] = []
const cddUserNameList: string[] = [] // 已开始尽调的人员
const dueDiligenceInfo: AssignDiligenceInfo = {
  cddUserList: [],
  optionalCddUsers: '',
  appointStatus: '',
  orgname: '',
  creditUsers: '',
  assistUsers: '',
  refcode: '',
  ctyDesc: ''
}
let refcode = ref(0)
let vm = reactive({
  dueDiligenceInfo, // 提交数据
  orgnameList, // 客户名称供选
  optionalCddUserList, // 可选尽调人员
  tabsList: tabsList, // tab标签栏位
  alreadyJoinCddUserList: optionalCddUserList, // 已选择的尽调人员
  cddUserNameList
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    default:
      break
  }
}
// 检查协销人员尽调状态
const checkUserDueDiligenceStatus = async () => {
  const data = {
    cddRefcode: refcode.value
  }
  const res = await apiAssignDueDiligence.checkUserDueDiligenceStatus(data)
  vm.cddUserNameList = res.data.cddUserNameList
  if (res.data.cddUserNameList && res.data.cddUserNameList.length) {
    // 存在一人尽调中
    surveyStatus.value = '3'
  } else {
    // 均未开始尽调
    surveyStatus.value = '1'
  }
}
// 数据更新，点击确定刷新页面
const onConfirm = () => {
  // eslint-disable-next-line no-use-before-define
  queryDueDiligenceInfo()
  dialogShow.value = false
  tabIndex.value = -1
  nextTick(() => {
    tabIndex.value = 0
  })
}
// 取消指派
const doCancelDueDiligence = async () => {
  loading.value = true
  await checkUserDueDiligenceStatus()
  if (surveyStatus.value === '3') {
    const cddUserStr = vm.cddUserNameList.join(',')
    const msg = cddUserStr + '已开始尽调，'
    toastMsg.value = msg + '请刷新页面获取最新信息'
    dialogShow.value = true
    loading.value = false
    return
  }
  const camcelData = {
    refcode: refcode.value
  }
  apiAssignDueDiligence.doCancelDueDiligence(camcelData).then(
    () => {
      showToast('取消指派成功')
      loading.value = false
      modalShow.value = false
      router.back(1)
    },
    () => {
      loading.value = false
    }
  )
}
// 取消指派弹窗
const submitCancelDueDiligence = () => {
  modalShow.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:38:30
 * @param {*} val 查询关键字
 * @return {*}
 * @description: 指派尽调客户列表查询
 */
const queryAplOrgNameByPerConf = (val: string) => {
  orgName.value = val
  return new Promise<Array<OrgnameList>>((resolve, reject) => {
    vm.orgnameList = []
    const data = {
      orgname: val
    }
    apiAssignDueDiligence.queryAplOrgNameByPerConf(data).then(
      res => {
        vm.orgnameList = res.data.orgnameList
        resolve(res.data.orgnameList)
      },
      () => {
        reject(false)
      }
    )
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 11:00:52
 * @param {*}
 * @description: 选择客户名称
 */
const selectName = async () => {
  if (refcode.value) {
    // 已指派不允许修改客户
    return
  }
  try {
    if (orgName.value) {
      // 获取卖方名称数据
      await queryAplOrgNameByPerConf('')
      showSelectOrg.value = true
    } else {
      showSelectOrg.value = true
    }
  } catch (err) {
    showToast(err as string)
  }
}
// 指派尽调可选协销人员查询
const queryOptionalCddUserList = (type?: string) => {
  const data = {
    orgname: selectOrgname.value || vm.dueDiligenceInfo.orgname
  }
  apiAssignDueDiligence.queryOptionalCddUserList(data).then(res => {
    vm.optionalCddUserList = res.data.optionalCddUserList
    if (initFlag.value) {
      initFlag.value = false
      // 初始化默认选中
      let temList: string[] = []
      let selectIds: { cddUserid: string }[] = []
      if (!refcode.value && defaultCreditUser.value) {
        // 新增 && 存在征信人员
        vm.optionalCddUserList.forEach(item => {
          if (item.cddUserName === defaultCreditUser.value) {
            temList.push(item.cddUserName)
            selectIds.push(item)
          }
        })
      } else if (refcode.value) {
        // 修改指派||再次尽调
        vm.alreadyJoinCddUserList.forEach(item => {
          const index = vm.optionalCddUserList.findIndex(obj => item.cddUserName === obj.cddUserName)
          if (index !== -1) {
            // 修改指派尽调||再次尽调 带入选中的尽调人员
            vm.optionalCddUserList.splice(index, 1, item)
            temList.push(item.cddUserName)
            selectIds.push(item)
          } else if (!isAgain.value) {
            // 修改指派尽调，未匹配上也带入
            temList.push(item.cddUserName)
            selectIds.push(item)
          }
        })
      }
      activeNames.value = temList.join(',') // 展示
      vm.dueDiligenceInfo.cddUserList = selectIds // 提交服务端
    }
    if (type === 'select') {
      // 打开选择弹窗
      showPopup.value = true
    }
  })
}
// 选择尽调人员
const selectUser = () => {
  if (!vm.dueDiligenceInfo.orgname) {
    showToast('请选择客户名称')
    return
  }
  queryOptionalCddUserList('select')
}
const popConfirm = (selectNames: string, selectIds: []) => {
  activeNames.value = selectNames
  vm.dueDiligenceInfo.cddUserList = selectIds
  showPopup.value = false
}
const selectendDate = () => {
  showDatePicker.value = true
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-15 10:18:12
 * @param {*} value
 * @description: 选择日期
 */
const doDateConfirm = value => {
  vm.dueDiligenceInfo.endDate = dateFormat(value.value)
  showDatePicker.value = false
}
// 查询客户信息
const queryOrgInfo = (orgname: string) => {
  apiAssignDueDiligence.queryOrgInfo(orgname).then(res => {
    let submitData = {
      // 提交的数据
      orgname: selectOrgname.value,
      remark: vm.dueDiligenceInfo.remark,
      endDate: vm.dueDiligenceInfo.endDate,
      // 新增时每次更换客户，清空已选择的尽调人员
      cddUserList: refcode.value ? vm.dueDiligenceInfo.cddUserList : []
    }
    vm.dueDiligenceInfo = {
      ...res.data.orgInfo,
      regDate: dateFormat(res.data.orgInfo.regDate || ''),
      ...submitData,
      orgHisTradeList: res.data.orgHisTradeList
    }
    if (!refcode.value) {
      // 新增时查询可选择的尽调人员
      initFlag.value = true
      queryOptionalCddUserList()
    }
  })
}
// 选择客户名称
const clickOrgFun = (data: OrgnameList) => {
  selectOrgname.value = data.orgname // 选中的客户名称
  defaultCreditUser.value = data.creditUsers // 默认征信人员
  showSelectOrg.value = false
  queryOrgInfo(selectOrgname.value)
}

// 修改指派尽调
const doUpdateDueDiligence = () => {
  apiAssignDueDiligence.doUpdateDueDiligence(vm.dueDiligenceInfo).then(
    () => {
      showToast('修改成功')
      loading.value = false
      router.back(1)
    },
    () => {
      loading.value = false
    }
  )
}
const doSubmitDueDiligence = () => {
  apiAssignDueDiligence.doSubmitDueDiligence(vm.dueDiligenceInfo).then(
    () => {
      showToast('指派成功')
      loading.value = false
      if (isAgain.value === '1') {
        router.back(2)
      } else {
        router.back(1)
      }
    },
    () => {
      loading.value = false
    }
  )
}
// 指派
const onSubmit = () => {
  if (!vm.dueDiligenceInfo.orgname) {
    showToast('请选择客户名称')
    return
  }
  if (!vm.dueDiligenceInfo.cddUserList || !vm.dueDiligenceInfo.cddUserList.length) {
    showToast('请选择尽调人员')
    return
  }
  if (vm.dueDiligenceInfo.remark && vm.dueDiligenceInfo.remark.length > 300) {
    showToast('尽调任务要求字数超长')
    return
  }
  // const cddUserNames = vm.optionalCddUserList?.map(item => item.cddUserName) || []
  // vm.dueDiligenceInfo.optionalCddUsers = cddUserNames.join(',')
  loading.value = true
  if (refcode.value && !isAgain.value) {
    // 修改 && 非再次尽调
    doUpdateDueDiligence()
  } else {
    // 提交
    doSubmitDueDiligence()
  }
}
// 关闭选择客户名称
const closeOrg = () => {
  showSelectOrg.value = false
}
// 指派尽调详情查询
const queryDueDiligenceInfo = () => {
  apiAssignDueDiligence.queryDueDiligenceInfo(refcode.value).then(res => {
    if (!isAgain.value) {
      // 正常列表进入
      vm.dueDiligenceInfo = {
        ...res.data.orgInfo,
        regDate: dateFormat(res.data.orgInfo.regDate || ''),
        orgHisTradeList: res.data.orgHisTradeList
      }

      if (vm.dueDiligenceInfo.appointStatus === '9') {
        showToast('当前尽调状态已变更')
        router.back(1)
      }
      // 查询尽调人员尽调状态
      checkUserDueDiligenceStatus()
    }
    vm.alreadyJoinCddUserList = res.data.alreadyJoinCddUserList
    // 查询可选择的尽调人员
    queryOptionalCddUserList()
  })
}

onMounted(async () => {
  refcode.value = Number(decodeBase64(route.value.params.refcode)) // 指派尽调流水号
  let orgname = decodeBase64(route.value.params.orgname) // 企业名称
  if (refcode.value) {
    if (orgname) {
      // 再次尽调，默认选中客户名称
      selectOrgname.value = orgname
      isAgain.value = '1'
      // 查客户信息
      queryOrgInfo(selectOrgname.value)
    }
    // 列表进入查详情，
    queryDueDiligenceInfo()
  } else {
    // 新增
    queryAplOrgNameByPerConf('')
  }
})
</script>

<style lang="scss" scoped>
.unFocus {
  width: 100%;
}
.assist-superior {
  min-height: 30rpx;
  margin-bottom: 30rpx;
  line-height: 40rpx;
}
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
:deep(.u-sticky) {
  top: 44px !important;
}
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
    // .u-tabs__wrapper__nav {
    //   // justify-content: space-around;
    // }
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
.slot-content {
  color: #646566;
}
</style>
