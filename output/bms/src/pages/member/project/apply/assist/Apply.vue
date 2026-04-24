<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-05 10:24:37
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-20 09:54:06
 * @Description  : 项目-业务申请-申请协销/征信详情 /member/project/apply/assist/apply
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <view v-if="['4', '5'].includes(vm.assistInfo.applyStatus)" class="returnReason">
        <view>
          <text>{{ vm.assistInfo.applyStatus === '4' ? '退回' : '拒绝' }}原因：</text>
          <text class="reasonValue">
            {{ vm.assistInfo.refuseReason }}
          </text>
        </view>
        <view>
          <text>{{ vm.assistInfo.applyStatus === '4' ? '退回' : '拒绝' }}人员：</text>
          <text class="reasonValue">
            {{ vm.assistInfo.refuseUser }}
          </text>
        </view>
      </view>
      <!-- 申请协销/征信基础信息 -->
      <base-info :assist-info="vm.assistInfo" />
      <!-- 选择协销主管 -->
      <ty-info-card :required="true" title="协销主管">
        <template #subtitle>
          <view class="inviteWrite" @click.stop="selectAssist">
            <text class="name">选择</text>
          </view>
        </template>
        <view class="assist-superior">{{ submitData.assistSuperior }}</view>
      </ty-info-card>
      <ty-info-card title="备注说明">
        <view class="content pre-wrap">
          <u-textarea
            v-model="submitData.applyRemark"
            :confirm-type="null"
            auto-height
            maxlength="300"
            count
            class="inputValueClass"
            placeholder="若有其他说明请备注"
          ></u-textarea>
        </view>
      </ty-info-card>
      <!-- 选择人员弹出组件 -->
      <select-pop
        v-if="showPopup"
        :show-popup="showPopup"
        :list="assistSuperiorList"
        :active-name="submitData.assistSuperior"
        :allow-multiple-selection="false"
        cancel-name="取消申请"
        confirm-name="发起申请"
        @cancel="showPopup = false"
        @confirm="popConfirm"
      />
      <view v-if="getHasPermissionsById('member:project:apply:assist')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <!-- 已撤回,已退回数据允许删除 -->
          <u-button
            v-if="['3', '4'].includes(vm.assistInfo.applyStatus)"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="onDelete"
          >
            删除
          </u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { AssistInfo, SubmitAssistData } from '@/interfaces/member/project/apply/assist'
import { QuerySuperiorInfo, AssistSuperiorList } from '@/interfaces/member/project/internationfinancingCommon'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty } from '@/utils/validate'
import apiAssist from '@/api/member/project/apply/api.assist'
import apiInternationfinancing from '@/api/member/project/api.internationfinancingCommon'
import { decodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import BaseInfo from './components/BaseInfo.vue'
import SelectPop from './components/SelectPop.vue'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
const showPopup = ref(false) // 选择协销主管弹出框
let aplRefcode: string = decodeBase64(route.value.params.aplRefcode) // 业务准入流水号
let refcode: string = decodeBase64(route.value.params.refcode) // 协销流水号
let queryFlag: string = decodeBase64(route.value.params.queryFlag) // 1待申请|0待提交
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
  clmUserName: '',
  /**
   * 申请拒绝原因
   */
  refuseReason: '',
  /**
   * 申请拒绝人员
   */
  refuseUser: ''
}
// 提交数据
let submitData = reactive<SubmitAssistData>({
  applyRemark: '',
  assistSuperior: '',
  refcode: refcode //
})
// 选择协销主管查询条件
let querySuperiorInfo = reactive<QuerySuperiorInfo>({
  refcode: aplRefcode
})
// 协销主管列表
let assistSuperiorList = ref<AssistSuperiorList[]>([])
// 申请详情
let vm = reactive({
  assistInfo: assistInfo // 提交信息
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:获取征信主管列表
 */
const getPreLoanAssistSuperiorInfo = () => {
  apiInternationfinancing.getPreLoanAssistSuperiorInfo(querySuperiorInfo).then(res => {
    assistSuperiorList.value = res.data.assistSuperiorList
    /* if (res.data.assistSuperiorList && res.data.assistSuperiorList.length) {
      submitData.assistSuperior = res.data.assistSuperiorList[0].userName
    } */
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  if (isEmpty(submitData.assistSuperior)) {
    showToast('请选择协销主管')
    return
  }
  loading.value = true
  let apiName = ['3', '4'].includes(vm.assistInfo.applyStatus) ? 'doRefUseResubmit' : 'doSubmitApplyAssist'
  apiAssist[apiName](submitData).then(
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
const onDelete = () => {
  apiAssist.doRemoveApplyAssist({ refcode: refcode }).then(
    () => {
      showToast('删除成功')
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
const getApplyAssistInfo = () => {
  apiAssist.getApplyAssistInfo(refcode, queryFlag).then(res => {
    if (res) {
      vm.assistInfo = res.data.assistAppointM
      getPreLoanAssistSuperiorInfo()
    }
  })
}
const selectAssist = () => {
  showPopup.value = true
}
const popConfirm = assistSuperior => {
  submitData.assistSuperior = assistSuperior
  showPopup.value = false
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    aplRefcode = decodeBase64(route.value.params.aplRefcode)
    queryFlag = decodeBase64(route.value.params.queryFlag)
    if (!isEmpty(refcode)) {
      submitData.refcode = refcode
      getApplyAssistInfo()
    }
  }
})
</script>

<style lang="scss" scoped>
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 60rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
.assist-superior {
  margin-bottom: 30rpx;
}
.returnReason {
  background: #fff;
  padding: 30rpx 30rpx 0 30rpx;
  margin-bottom: -20rpx;
  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
</style>
