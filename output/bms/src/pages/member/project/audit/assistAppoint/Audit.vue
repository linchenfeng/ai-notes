<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-05 10:24:37
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-17 17:37:03
 * @Description  : 项目-业务申请-申请协销/征信详情 /member/project/apply/assistAppoint/audit
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <!-- 申请协销/征信基础信息 -->
      <base-info :assist-info="vm.assistInfo" type="audit" />
      <ty-info-card v-if="!isEmpty(vm.assistInfo.applyRemark)" title="备注说明(申请协销)">
        <view class="content pre-wrap summaryRemark">{{ vm.assistInfo.applyRemark }}</view>
      </ty-info-card>
      <!-- 选择协销人员 -->
      <ty-info-card :required="true" title="协销人员">
        <template v-if="vm.assistInfo.appointStatus === '1'" #subtitle>
          <view class="inviteWrite" @click.stop="selectUser('1')">
            <text class="name">选择</text>
          </view>
        </template>
        <view class="assist-superior">{{ submitData.assistUsers }}</view>
      </ty-info-card>
      <!-- 选择征信人员 -->
      <!-- 待指派时,征信主管等于协销主管时展示 -->
      <!-- 已指派待选择征信人员时，征信主管展示 -->
      <ty-info-card
        v-if="(vm.assistInfo.appointStatus === '1' && vm.creditUsersInfo.creditFlag === '1') || vm.assistInfo.appointStatus === '2'"
        :required="true"
        title="征信人员"
      >
        <template #subtitle>
          <view class="inviteWrite" @click.stop="selectUser('2')">
            <text class="name">选择</text>
          </view>
        </template>
        <view class="assist-superior">{{ submitData.creditUsers }}</view>
      </ty-info-card>
      <!-- 选择人员弹出组件 -->
      <select-pop
        v-if="showPopup"
        :show-popup="showPopup"
        :list="list"
        :active-name="activeUsers"
        @cancel="showPopup = false"
        @confirm="popConfirm"
      />
      <ty-pop-text-area
        v-model:model-value="rejectData.refuseReason"
        :show-popup="showRefuseReason"
        :placeholder="`请输入${operateType === '1' ? '拒绝' : '退回'}原因`"
        @close="showRefuseReason = false"
      >
        <template #btn>
          <u-button type="primary" :loading="loading" @click="onReject()">提交</u-button>
        </template>
      </ty-pop-text-area>
      <view v-if="getHasPermissionsById('member:project:audit:assistAppoint:submit')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="error" native-type="submit" @click="rejectAssist()">拒绝</u-button>
          <u-button :loading="loading" block type="warning" native-type="submit" @click="returnAssist()">退回</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="getAppointAssistInfo('check')">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { AppointSubmitData, RejectData } from '@/interfaces/member/project/audit/assistAppoint'
import { AssistInfo } from '@/interfaces/member/project/apply/assist'
import { QuerySuperiorInfo, AssistSuperiorList, CreditUsersInfo } from '@/interfaces/member/project/internationfinancingCommon'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty } from '@/utils/validate'
import apiAppointAssist from '@/api/member/project/audit/api.assistAppoint'
import apiAssist from '@/api/member/project/apply/api.assist'
import apiInternationfinancing from '@/api/member/project/api.internationfinancingCommon'
import { decodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import BaseInfo from '@/pages/member/project/apply/assist/components/BaseInfo.vue'
import SelectPop from '@/pages/member/project/apply/assist/components/SelectPop.vue'
import { getStorage } from '@/utils/storages'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
const showPopup = ref(false) // 选择协销主管弹出框
let isCreditSuperior = ref(false) //是否是征信主管
let selectType = ref('') //1选择协销人员|2选择征信人员
let activeUsers = ref('') // 选择人员默认活跃态人员
let refcode: string = decodeBase64(route.value.params.refcode) // 业务准入流水号
const userName = getStorage('userName') as string //当前用户名称
let baseStatus = '' // 记录原始状态
let showRefuseReason = ref(false) //退回拒绝弹窗
let operateType = ref('') // 操作类型 1拒绝2退回
let assistInfo: AssistInfo = {
  /**
   * 申请状态，1=待申请/2=已申请
   */
  applyStatus: '',
  /**
   * 准入流水号
   */
  aplRefcode: '',
  /**
   * 申请日期
   */
  applyDate: '',
  /**
   * 指派日期
   */
  appointDate: '',
  /**
   * 申请备注
   */
  applyRemark: '',
  /**
   * 指派状态[1=待指派协销/2=待指派征信/9=已指派]
   */
  appointStatus: '',
  /**
   * 协销主管
   */
  assistSuperior: '',
  /**
   * 协销人员
   */
  assistUsers: '',
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene: '',
  /**
   * 征信人员
   */
  creditUsers: '',
  /**
   * 业务申请编号
   */
  financingNo: '',
  /**
   * 卖方国家描述
   */
  ctyDesc: '',
  /**
   * 卖方所在国
   */
  orgctyid: '',
  /**
   * 卖方名称
   */
  orgname: '',
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 申请人主管名称
   */
  superiorUserid: '',
  /**
   * 客户经理
   */
  clmUserName: ''
}
// 提交数据
let submitData = reactive<AppointSubmitData>({
  assistSuperior: '',
  creditSuperior: '',
  assistUsers: '',
  creditUsers: '',
  refcode: refcode //
})
// 选择协销人员,征信人员查询条件
let querySuperiorInfo = reactive<QuerySuperiorInfo>({
  refcode: refcode,
  assistSuperior: ''
})
let rejectData = reactive<RejectData>({
  refcode: refcode,
  refuseReason: '',
  refuseUser: userName
})
// 选择人员列表
let list = ref<AssistSuperiorList[]>([])
// 协销人员列表
let assistUsersList = ref<AssistSuperiorList[]>([])
// 征信人员列表
let creditUsersInfo: CreditUsersInfo = {
  /**
   * 征信展示标记，0=协销主管不等于征信主管/1=协销主管等于征信主管
   */
  creditFlag: '',
  /**
   * 征信主管，逗号拼接
   */
  creditSuperiors: '',
  /**
   * 征信人员列表
   */
  creditUsersList: []
}
// 申请详情
let vm = reactive({
  assistInfo: assistInfo, // 提交信息
  creditUsersInfo: creditUsersInfo //征信人员信息
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:获取协销人员列表
 */
const getPreLoanAssistUsersInfo = () => {
  apiInternationfinancing.getPreLoanAssistUsersInfo(querySuperiorInfo).then(res => {
    assistUsersList.value = res.data.assistUsersList
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:获取征信人员列表
 */
const getPreLoanCreditUsersInfo = () => {
  apiInternationfinancing.getPreLoanCreditUsersInfo(querySuperiorInfo).then(res => {
    vm.creditUsersInfo = res.data
    submitData.creditSuperior = res.data.creditSuperiors
    const creditSuperiors = res.data.creditSuperiors ? res.data.creditSuperiors.split(',') : ''
    if (creditSuperiors.includes(userName)) {
      isCreditSuperior.value = true
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  if (isEmpty(submitData.assistUsers)) {
    showToast('请选择协销人员')
    return
  }
  // eslint-disable-next-line no-extra-parens
  if ((vm.assistInfo.appointStatus === '1' && vm.creditUsersInfo.creditFlag === '1') || vm.assistInfo.appointStatus === '2') {
    if (isEmpty(submitData.creditUsers)) {
      showToast('请选择征信人员')
      return
    }
  }
  loading.value = true
  apiAppointAssist.doSubmitAppointAssist(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
const getAppointAssistInfo = (type: string) => {
  loading.value = true
  apiAssist.getApplyAssistInfo(refcode).then(
    res => {
      if (res) {
        loading.value = false
        vm.assistInfo = res.data.assistAppointM
        //当前用户是且是已完成指派提示
        if (vm.assistInfo.appointStatus !== baseStatus) {
          showToast('当前任务已被指派')
          setTimeout(() => {
            router.back(1)
          }, 1000)
          return
        }
        baseStatus = vm.assistInfo.appointStatus
        if (type === 'query') {
          querySuperiorInfo.assistSuperior = vm.assistInfo.assistSuperior
          submitData.assistUsers = vm.assistInfo.assistUsers || ''
          submitData.assistSuperior = vm.assistInfo.assistSuperior || ''
          //获取协销人员
          getPreLoanAssistUsersInfo()
          // 获取征信主管
          getPreLoanCreditUsersInfo()
        } else if (type === 'check') {
          onSubmit()
        }
      }
    },
    () => {
      loading.value = false
    }
  )
}
// 拒绝
const rejectAssist = () => {
  operateType.value = '1'
  rejectData.refuseReason = ''
  showRefuseReason.value = true
}
// 退回
const returnAssist = () => {
  operateType.value = '2'
  rejectData.refuseReason = ''
  showRefuseReason.value = true
}
const doReturnApplyAssist = () => {
  apiAppointAssist.doReturnApplyAssist(rejectData).then(
    () => {
      showToast('退回成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
const doRefUseApplyAssist = () => {
  apiAppointAssist.doRefUseApplyAssist(rejectData).then(
    () => {
      showToast('拒绝成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
// 确认拒绝或退回
const onReject = () => {
  if (isEmpty(rejectData.refuseReason)) {
    showToast(`请输入${operateType.value === '1' ? '拒绝' : '退回'}原因`)
    return
  }
  if (operateType.value === '1') {
    doRefUseApplyAssist()
  } else if (operateType.value === '2') {
    doReturnApplyAssist()
  }
}
const selectUser = type => {
  selectType.value = type
  if (type === '1') {
    list.value = assistUsersList.value
    activeUsers.value = submitData.assistUsers || ''
    showPopup.value = true
  } else if (type === '2') {
    list.value = vm.creditUsersInfo.creditUsersList
    activeUsers.value = submitData.creditUsers || ''
    showPopup.value = true
  }
}
const popConfirm = user => {
  if (selectType.value === '1') {
    submitData.assistUsers = user
  } else if (selectType.value === '2') {
    submitData.creditUsers = user
    submitData.creditSuperior = vm.creditUsersInfo.creditSuperiors
  }
  showPopup.value = false
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    baseStatus = decodeBase64(route.value.params.appointStatus)
    if (!isEmpty(refcode)) {
      submitData.refcode = refcode
      getAppointAssistInfo('query')
    }
  }
})
</script>

<style lang="scss" scoped>
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  padding-bottom: 30rpx;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
  }
}
.assist-superior {
  min-height: 30rpx;
  margin-bottom: 30rpx;
  line-height: 40rpx;
}
</style>
