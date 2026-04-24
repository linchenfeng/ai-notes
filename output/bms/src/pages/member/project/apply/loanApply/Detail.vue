<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-01 10:07:47
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-08 10:51:29
 * @Description  : 项目-业务申请-申请融资-发起融资申请 /member/project/apply/loanApply/apply
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <apply-info :fint-loa-vo="vm.fintLoaVo" />
      <u-modal
        :show="showModalFlag"
        title="温馨提示"
        confirm-text="确认"
        show-cancel-button="true"
        class="accessModal"
        @confirm="onConfirm"
        @cancel="showModalFlag = false"
      >
        <view class="slot-content">
          <view v-if="operateType === 'delete'">请确认是否删除？</view>
          <view v-else-if="operateType === 'cancel'">请确认是否撤回？</view>
        </view>
      </u-modal>
      <view v-if="getHasPermissionsById('member:project:apply:loanApply')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="error" native-type="submit" @click="onDelete()">删除</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onCancel()">撤回</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { FintLoaVo } from '@/interfaces/member/project/apply/loanApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiLoanApply from '@/api/member/project/apply/api.loanApply'
import { isNotEmpty } from '@/utils/validate'
import { decodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import ApplyInfo from './components/ApplyInfo.vue'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let showModalFlag = ref(false) //删除提示弹窗
let operateType = ref('')
let refcode = '0' // 融资申请流水号【0=新增/其他=修改】
let fintLoaVo: FintLoaVo = {
  /**
   * 申请日期，【未传递流水号自动初始化】
   */
  applyDate: '',
  /**
   * 申请备注说明
   */
  applyRemark: '',
  /**
   * 客户经理，【未传递流水号自动初始化】
   */
  applyUser: '',
  /**
   * 客户经理名称，【未传递流水号自动初始化】
   */
  applyUsername: '',
  /**
   * 业务大类，3=跨境电商（前端不传后端默认）
   */
  bizScene: '',
  /**
   * 共借人法人名称
   */
  borrowerLegalPerson: '',
  /**
   * 共借人名称
   */
  borrowerPerson: '',
  /**
   * 过桥对手方
   */
  bridgeCounterparty: '',
  /**
   * 是否需要过桥[0=否/1=是]
   */
  bridgeLoanFlag: '',
  /**
   * 过桥类型[1=单锁过桥/2=双锁过桥]
   */
  bridgeLoanType: '',
  /**
   * 字符渠道名称，第三方获取
   */
  channelName: '',
  /**
   * 用户编号
   */
  companyCreditCode: '',
  /**
   * 授信产品[1=天e贸/2=天e贷]，可多选（逗号拼接）
   */
  creditProducts: '',
  guaList: [],
  /**
   * 法人名称
   */
  legalPerson: '',
  /**
   * 币种
   */
  loanCcyid: '',
  /**
   * 月利率%，天e贸必填
   */
  loanMonthRate: '',
  /**
   * 年利率%，天e贷必填
   */
  loanYearRate: '',
  /**
   * 客户名称
   */
  orgname: '',
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 预估额度说明
   */
  quotaRemark: '',
  /**
   * 流水号，保存后存在
   */
  refcode: '',
  /**
   * 业务主管，【未传递流水号自动初始化】
   */
  superiorUserid: '',
  /**
   * 业务主管名称，【未传递流水号自动初始化】
   */
  superiorUsername: '',
  /**
   * 融资状态，[0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核]
   */
  loanStatus: ''
}
let vm = reactive({
  fintLoaVo: fintLoaVo // 申请信息
})
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取融资详情
 */
const getLoanDetail = () => {
  apiLoanApply.getLoanDetail(refcode).then(res => {
    vm.fintLoaVo = res.data.fintLoaVo
    vm.fintLoaVo.guaList = vm.fintLoaVo.guaList || []
  })
}
const onConfirmCancel = () => {
  apiLoanApply.doWithdrawLoanInfo(refcode).then(
    () => {
      loading.value = false
      showToast('撤回成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:10:38
 * @description: 业务准入申请撤回
 */
const onCancel = () => {
  loading.value = true
  apiLoanApply.getLoanDetail(refcode).then(
    res => {
      const loanStatus = res.data.fintLoaVo.loanStatus
      //待审核允许撤回
      if (['1'].includes(loanStatus)) {
        operateType.value = 'cancel'
        showModalFlag.value = true
        loading.value = false
      } else {
        showToast('当前融资申请已被审核，暂无法撤回')
        loading.value = false
        return
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:10:38
 * @description: 业务准入申请撤回
 */
const onDelete = () => {
  loading.value = true
  apiLoanApply.getLoanDetail(refcode).then(
    res => {
      const loanStatus = res.data.fintLoaVo.loanStatus
      //待审核允许撤回
      if (['1'].includes(loanStatus)) {
        operateType.value = 'delete'
        showModalFlag.value = true
        loading.value = false
      } else {
        showToast('当前融资申请已被审核，暂无法撤回')
        loading.value = false
        return
      }
    },
    () => {
      loading.value = false
    }
  )
}
const onConfirmDel = () => {
  loading.value = true
  apiLoanApply.doDeleteLoanInfo(refcode).then(
    () => {
      loading.value = false
      showToast('删除成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
const onConfirm = () => {
  if (operateType.value === 'delete') {
    onConfirmDel()
  } else if (operateType.value === 'cancel') {
    onConfirmCancel()
  }
}
onMounted(() => {
  if (route.value.params) {
    if (isNotEmpty(route.value.params.refcode)) {
      refcode = decodeBase64(route.value.params.refcode)
      getLoanDetail()
    }
  }
})
</script>

<style lang="scss" scoped></style>
