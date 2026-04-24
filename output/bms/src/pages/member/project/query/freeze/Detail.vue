<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:48:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 11:23:13
 * @Description  : 冻结/解冻申请审批 /member/project/query/freeze/detail/:refcode
-->

<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.freezeInfo.applyStatus"
        :state-name="stateName[vm.freezeInfo.applyStatus]"
        :state-color="stateColor[vm.freezeInfo.applyStatus]"
      ></state-module>
    </up-sticky>
    <view class="topCell">
      <u-cell-group :border="false" :stop="true">
        <view class="item-title">
          <u-cell title="申请人" :value="vm.freezeInfo.createUser" :border="false" />
        </view>
        <view class="item-title">
          <u-cell :stop="false" title="申请日期" :value="dateFormat(vm.freezeInfo.applyDate)" :border="false" />
        </view>
      </u-cell-group>
    </view>

    <view class="special-audit">
      <!-- 预警解除基本信息 -->
      <BasicInfo ref="basicRef" :base-info="vm.freezeInfo" :credit-info-list="vm.freezeCreditList" type="audit"></BasicInfo>
      <History></History>
    </view>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import NavBar from '@/layout/NavBar.vue'
import BasicInfo from '@/pages/member/project/audit/freeze/components/BasicInfo.vue'
import History from '@/pages/member/project/audit/freeze/History.vue'
import { FreezeAppInfo, FlowNodeVo, FreezeCreditItem } from '@/interfaces/member/project/audit/freezeApprovalAudit'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiFreezeApprovalAudit from '@/api/member/project/audit/api.freezeApprovalAudit'
import { /*  encodeBase64,  */ decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
// import { onPageScroll } from '@dcloudio/uni-app'
import { dateFormat } from '@/utils/format'
// import router from '@/router'
const router = useRouter()
let loading = ref(false)
let showModalFlag = ref(false) // 展示提示框
// let showPopup = ref(false) // 展示提问框
const basicRef = ref()
let modalType = ref('') // 弹窗类型【1=拒绝提示/2=提问/3=退回】
// let questions = ref('') // 提问的内容
let conditionRemark = ref('') // 审批意见
let disabledFlag = ref(false)
const route = useRoute()
// let showFixed = ref(false)
const stateName = {
  '1': '审批中',
  '3': '已通过',
  '4': '已拒绝'
}
const stateColor = {
  '1': 'warning',
  '3': 'success',
  '4': 'error'
}

const flowNodeVo: FlowNodeVo = {
  examineType: '',
  nodeMode: '',
  nodeLevel: '',
  nodePassLogic: ''
}
const intFreezeMVo: FreezeAppInfo = {
  refcode: 0,
  orgname: '',
  applyNo: '',
  applyType: '',
  creditProduct: '',
  createUser: '',
  applyDate: '',
  clmUserName: '',
  managerUserName: '',
  remark: '',
  applyStatus: '',
  curApproverName: '',
  taskRefcode: 0
}
const freezeCreditList: FreezeCreditItem[] = []
// 提交的数据
const submitData = {
  refcode: Number(decodeBase64(route.value.params.refcode)), // 申请流水号
  taskRefcode: Number(decodeBase64(route.value.params.taskRefcode)), // 任务流水号
  handleResult: '', // 【A=拒绝/B=打回/C=通过/D=批注】
  handleReason: '' // 审批意见
}

// 业务申请信息
let vm = reactive({
  freezeInfo: intFreezeMVo,
  freezeCreditList: freezeCreditList,
  flowNodeVo
})

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:44:57
 * @param {*} type 类型【A=拒绝/B=打回/C=通过/D=批注】
 * @description: 提交数据
 */
const onSubmit = (type: string) => {
  submitData.handleResult = type
  submitData.handleReason = conditionRemark.value
  loading.value = true
  apiFreezeApprovalAudit.doHandleFreezeApp(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
        disabledFlag.value = false
      }, 1500)
    },
    () => {
      loading.value = false
      disabledFlag.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取特批申请详情
 */
const getFreezeAppInfo = (type?: string) => {
  const data = {
    refcode: submitData.refcode,
    queryFlag: '0' // 是否为待处理数据列表查询标记
  }
  apiFreezeApprovalAudit.getFreezeAppInfo(data).then(res => {
    if (type) {
      if (res.data.nodata === '1') {
        showToast('当前预警解除申请已删除')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (res.data.fintFreezeMVo && !['1', '2'].includes(res.data.fintFreezeMVo.applyStatus)) {
        showToast('当前冻结数据申请状态已变更')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (type === 'onRefuse') {
        // 拒绝获取最新信息
        showModalFlag.value = true
        modalType.value = '1'
      }
      if (type === 'onReturn') {
        // 退回操作先获取最新信息
        showModalFlag.value = true
        modalType.value = '3'
      }
      if (type === 'doSubmit') {
        onSubmit('C')
      }
    } else {
      vm.freezeInfo = res.data.fintFreezeMVo as unknown as FreezeAppInfo
      vm.freezeCreditList.push(...res.data.freezeCreditList)
      vm.flowNodeVo = res.data.flowNodeVo || {}
    }
  })
}

onMounted(() => {
  getFreezeAppInfo()
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}

.topCell {
  background-color: #fff;
  padding-top: 70rpx;
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
.special-audit {
  background: #f6f6f6;
  padding: 0;
  .history {
    margin-left: auto;
    font-size: 24rpx;
    color: $primary;
    font-weight: normal;
  }
  .button-fixed-bottom {
    .vteam-button {
      padding: 0 30rpx;
      color: $default-color;
      .vteam-button-text {
        font-weight: bold;
      }
    }
    .u-button--error {
      // width: 360rpx;
      background-color: #ef4142;
      border-color: #ef4142;
      // color: #fe0101;
    }
    .u-button--warning {
      width: 360rpx;
    }
  }
}
:deep(.accessModal) {
  .slot-content {
    .fieldBox {
      border: 1rpx solid #d5d5d5;
      background-color: rgb(252, 252, 252);
      text-align: right;
      padding-bottom: 10rpx;
      .u-textarea {
        text-align: left;
        padding: 20rpx;
        height: 280rpx;
        background: #fcfcfc;
        border: none;
        .u-textarea__field {
          height: auto !important;
        }
        .uni-textarea-placeholder {
          font-size: 28rpx;
          line-height: 38rpx;
          color: $remark-color;
          word-break: break-all;
        }
      }
    }
  }
}

.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
}
</style>
