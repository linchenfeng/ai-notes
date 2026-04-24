<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:45:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-16 14:50:05
 * @Description  : 项目-业务申请-申请准入 /member/project/apply/access/detail
-->
<template>
  <NavBar />
  <view>
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.submitInfo.intLoanStatus"
        :state-name="stateName[vm.submitInfo.intLoanStatus]"
        :state-color="stateColor[vm.submitInfo.intLoanStatus]"
      ></state-module>
    </up-sticky>
    <view class="businessApply-internation">
      <ty-info-card :show-line="false">
        <view class="card-cell-group" :class="vm.submitInfo.intLoanStatus ? 'paddingTop' : ''">
          <view v-if="vm.submitInfo.postponeRemark" class="returnReason">
            <view>
              <text>暂缓原因：</text>
              <text class="reasonValue">
                {{ vm.submitInfo.postponeRemark }}
              </text>
            </view>
          </view>
          <u-cell-group class="topCell">
            <u-cell title="客户经理" :value="vm.submitInfo.userName" />
            <u-cell title="业务主管" :value="vm.submitInfo.superiorName" />
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card>
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell title="业务产品" :value="getProduceType" />
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card title="卖方基本信息">
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell title="卖方名称" :value="vm.submitInfo.orgname" />
            <u-cell title="卖方所在国" :value="vm.submitInfo.orgctyDesc" />
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card title="买方及贸易信息">
        <view v-for="(item, i) in vm.submitInfo.fintAplDtcVoList" :key="i" class="buyer-swipe" @click="viewBuyerInfo(i)">
          <view class="buyerList-item">
            <view class="orgname">{{ item.counterpartyName }}</view>
            <view :class="`supplementStatus` + item.supplementStatus">
              {{ getValueByKey(item.supplementStatus, 'supplementStatus') }}
            </view>
            <up-icon name="arrow-right" color="#999999"></up-icon>
          </view>
        </view>
      </ty-info-card>
      <!-- 准入历程 -->
      <History />
      <view v-if="getHasPermissionsById('member:project:apply:access')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view v-if="vm.submitInfo.intLoanStatus === '9'" class="fixed">
          <u-button :loading="loading" block type="primary" native-type="submit" @click="doCancelPostpone">解除暂缓</u-button>
        </view>
        <view v-else class="fixed">
          <u-button :loading="loading" block type="error" native-type="submit" @click="onDelete">删除</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onCancel">撤回</u-button>
        </view>
      </view>
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
      <u-modal
        :show="showCancelPostpone"
        title="温馨提示"
        confirm-text="确认解除"
        show-cancel-button="true"
        class="accessModal"
        @confirm="onConfirmCancelPostpone"
        @cancel="showCancelPostpone = false"
      >
        <view class="slot-content">
          <view>请与有权人确认是否解除暂缓？</view>
        </view>
      </u-modal>
    </view>
  </view>
</template>

<script setup lang="ts">
import { FintAplMVo } from '@/interfaces/member/project/apply/businessApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { setStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import StateModule from '@/plugins/StateModule.vue'
import History from '@/pages/member/project/query/access/History.vue'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let refcode: number | string = '-1' // 业务准入流水号【-1=新增/其他=修改】
let showModalFlag = ref(false) //删除提示弹窗
let operateType = ref('')
let showCancelPostpone = ref(false) // 解除暂缓提示弹窗
const stateColor = {
  '1': 'warning',
  '3': 'success',
  '4': 'error',
  '6': 'warning',
  '5': 'warning',
  '0': 'warning',
  '2': 'error',
  '7': 'warning',
  '8': 'error',
  '9': 'warning',
  '10': 'warning'
}
let submitInfo: FintAplMVo = {
  intLoanStatus: '',
  returnReason: '',
  rejectReason: '',
  annualTurnover: '',
  ccyid: '',
  counterpartyName: '',
  ctyid: '',
  futureAnnualTurnover: '',
  orgctyid: '',
  orgname: '',
  productName: '',
  projectSource: '',
  tenor: '',
  ctyDesc: '',
  orgctyDesc: '',
  ccyidDesc: '',
  superiorName: '',
  superior: '',
  userName: '',
  applyStatus: '',
  referFlag: '',
  applyDate: '',
  tenorStartType: '',
  tenorStartDesc: '',
  transactionYears: '',
  productType: '',
  isSubmit: '',
  customType: '',
  fintAplDtcVoList: [],
  postponeRemark: ''
}
let vm = reactive({
  submitInfo: submitInfo // 提交信息
})
const stateName = computed(() => ({
  '1': '待准入',
  '3': vm.submitInfo.conditionFlag === '1' ? '有条件准入' : '已准入',
  '4': '已拒绝',
  '6': '待受理',
  '5': '已撤回',
  '0': '已保存',
  '2': '已退回',
  '7': '受理退回',
  '8': '已拒绝',
  '9': '已暂缓',
  '10': '解除暂缓'
}))
const getOverseasBusinessInfo = () => {
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    vm.submitInfo = res.data
  })
}
const getProduceType = computed(() => {
  const bizScene = getValueByKey(vm.submitInfo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${vm.submitInfo.productType}` : vm.submitInfo.productType
})
const onConfirmDel = () => {
  loading.value = true
  const data = {
    financingNo: vm.submitInfo.financingNo as string,
    refcode: vm.submitInfo.refcode as number,
    delFlag: '1'
  }
  apiBusinessApply.doWithdrawOverseasBusinessInfo(data).then(
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
const onCancel = () => {
  loading.value = true
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    const intLoanStatus = res.data.intLoanStatus
    //待准入允许撤回
    if (['1'].includes(intLoanStatus)) {
      operateType.value = 'cancel'
      showModalFlag.value = true
      loading.value = false
    } else {
      showToast('当前业务申请已被审核，暂无法撤回')
      loading.value = false
      return
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务删除
 */
const onDelete = () => {
  loading.value = true
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    const intLoanStatus = res.data.intLoanStatus
    //待准入允许撤回
    if (['1'].includes(intLoanStatus)) {
      operateType.value = 'delete'
      showModalFlag.value = true
      loading.value = false
    } else {
      showToast('当前业务申请已被审核，暂无法删除')
      loading.value = false
      return
    }
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:10:38
 * @description: 业务准入申请撤回
 */
const onConfirmCancel = () => {
  loading.value = true
  const data = {
    financingNo: vm.submitInfo.financingNo as string,
    refcode: vm.submitInfo.refcode as number,
    intLoanStatus: '5'
  }
  apiBusinessApply.doWithdrawOverseasBusinessInfo(data).then(
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
const onConfirm = () => {
  if (operateType.value === 'delete') {
    onConfirmDel()
  } else if (operateType.value === 'cancel') {
    onConfirmCancel()
  }
}
/**
 * @Author: aolin.qu
 * @Date: 2025-12-03 14:22:12
 * @description: 解除暂缓
 */
const doCancelPostpone = () => {
  showCancelPostpone.value = true
}
/**
 * @Author: aolin.qu
 * @Date: 2025-12-03 15:06:20
 * @description: 确认解除
 */
const onConfirmCancelPostpone = () => {
  loading.value = true
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    const intLoanStatus = res.data.intLoanStatus
    // 校验状态是否发生变化 若没变化则允许解除
    if (['9'].includes(intLoanStatus)) {
      apiBusinessApply.doCancelPostpone({ refcode }).then(
        () => {
          loading.value = false
          showToast('解除暂缓成功')
          setTimeout(() => {
            router.back(1)
          }, 1500)
        },
        () => {
          loading.value = false
        }
      )
    } else {
      loading.value = false
      showToast('当前业务申请已被审核，暂无法解除暂缓')
      setTimeout(() => {
        router.back(1)
      }, 1500)
      return
    }
  })
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 13:56:49
 * @description: 获取个人信息
 */
const getUserInfo = () => {
  apiBusinessApply.getUserInfo().then(res => {
    vm.submitInfo.superior = res.data.loginUser.superior
    vm.submitInfo.superiorName = res.data.loginUser.superiorName // 申请人主管
    vm.submitInfo.userName = res.data.loginUser.userName // 申请人
  })
}
// 查看买方信息详情
const viewBuyerInfo = (i: number) => {
  setStorage('application-fintAplDtcVoList', vm.submitInfo.fintAplDtcVoList)
  const path = `/member/project/apply/access/detail/buyerInfo/${encodeBase64(i)}/${encodeBase64(vm.submitInfo.productType)}/${encodeBase64(
    vm.submitInfo.bizScene as string
  )}`
  router.push(path)
}
onMounted(() => {
  getUserInfo() // 获取个人信息
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode)
    if (refcode) {
      getOverseasBusinessInfo()
    }
  }
})
</script>

<style lang="scss" scoped>
.buyer-swipe:last-child {
  margin-bottom: 20rpx;
}
.buyer-swipe {
  height: 100rpx;
  display: flex;
  align-items: center;
  user-select: none; /* 禁止文本选中 */
  -webkit-user-select: none; /* 兼容iOS */
  -moz-user-select: none; /* 兼容Firefox */
  .slide-right {
    width: 140rpx;
    height: 100rpx;
    background: $u-error;
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .del {
      padding-bottom: 5rpx;
    }
  }
}
.buyerList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  width: 100%;
  .orgname {
    width: 470rpx;
    color: $default-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .supplementStatus0 {
    color: $u-warning;
  }
  .supplementStatus1 {
    color: $u-success;
  }
}
.returnReason {
  min-height: 20rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.paddingTop {
  padding-top: 60rpx;
}
</style>
