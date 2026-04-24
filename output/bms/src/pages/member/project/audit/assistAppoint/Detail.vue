<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-06 09:45:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-25 17:11:45
 * @Description  : 项目-业务申请-申请协销/征信详情 /member/project/apply/assistAppoint/detail
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <!-- 申请协销/征信基础信息 -->
      <base-info :assist-info="vm.appointInfo" type="audit" />
      <ty-info-card v-if="!isEmpty(vm.appointInfo.applyRemark)" title="备注说明(申请协销)">
        <view class="content pre-wrap summaryRemark">{{ vm.appointInfo.applyRemark }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.appointInfo.assistSuperior)" title="协销主管">
        <view class="content pre-wrap summaryRemark">{{ vm.appointInfo.assistSuperior }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.appointInfo.assistUsers)" title="协销人员">
        <view class="content pre-wrap summaryRemark">{{ vm.appointInfo.assistUsers }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.appointInfo.creditSuperior)" title="征信主管">
        <view class="content pre-wrap summaryRemark">{{ vm.appointInfo.creditSuperior }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.appointInfo.creditUsers)" title="征信人员">
        <view class="content pre-wrap summaryRemark">{{ vm.appointInfo.creditUsers }}</view>
      </ty-info-card>
    </view>
    <!-- 协销主管,征信主管或审计岗权限展示重新指派 -->
    <view
      v-if="
        !['3', '4', '5'].includes(vm.appointInfo.applyStatus) &&
        ([vm.appointInfo.assistSuperior, vm.appointInfo.creditSuperior].includes(userName) || vm.appointInfo.adminFlag)
      "
      class="button-fixed-bottom"
    >
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button block type="primary" native-type="submit" @click="ReAudit()">重新指派</u-button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { AssistInfo } from '@/interfaces/member/project/apply/assist'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/validate'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import BaseInfo from '@/pages/member/project/apply/assist/components/BaseInfo.vue'
import apiAssist from '@/api/member/project/apply/api.assist'
import { getStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
const router = useRouter()
const userName = getStorage('userName') as string //当前用户名称
const route = useRoute()
let loading = ref(false)
let refcode: number | string = '' // 业务准入流水号
let appointInfo: AssistInfo = {
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
   * 是否管理员标记，true=是/false=否
   */
  adminFlag: ''
}
// 申请详情
let vm = reactive({
  appointInfo: appointInfo // 提交信息
})

const getAppointAssistInfo = () => {
  loading.value = true
  apiAssist.getApplyAssistInfo(refcode).then(
    res => {
      if (res) {
        loading.value = false
        vm.appointInfo = res.data.assistAppointM
      }
    },
    () => {
      loading.value = false
    }
  )
}
const ReAudit = () => {
  const path = `/member/project/audit/assistAppoint/reAudit/${encodeBase64(refcode)}`
  router.push(path)
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    if (!isEmpty(refcode)) {
      getAppointAssistInfo()
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
  margin-bottom: 30rpx;
}
</style>
