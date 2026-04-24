<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-05 10:24:37
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-26 16:17:16
 * @Description  : 项目-业务申请-资料复核 /member/project/audit/documentReview/audit
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <!-- 申请协销/征信基础信息 -->
      <base-info :assist-info="vm.documentReviewInfo" :refcode="refcode" />
      <ty-info-card
        v-if="
          (vm.documentReviewInfo.peplenishFileListx && vm.documentReviewInfo.peplenishFileListx.length) ||
          (vm.documentReviewInfo.docFileUuidList && vm.documentReviewInfo.docFileUuidList.length)
        "
        title="协销人员补充资料"
      >
        <peplenishFileList
          :file-list="vm.documentReviewInfo.peplenishFileListx"
          :doc-file-uuid-list="vm.documentReviewInfo.docFileUuidList"
        ></peplenishFileList>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.documentReviewInfo.examineOpinion)" title="备注(资料检查)">
        <view class="content pre-wrap summaryRemark">{{ vm.documentReviewInfo.examineOpinion }}</view>
      </ty-info-card>
      <ty-info-card title="复核意见">
        <template #subtitle>
          <view class="history" @click="toHistory">审核历程</view>
        </template>
        <u-textarea
          v-model="submitData.reviewOpinion"
          :confirm-type="null"
          maxlength="300"
          placeholder-style="font-size: 28rpx;"
          class="inputValueClass"
          count
          :focus="focusFlag"
          auto-height
          placeholder="请输入复核意见"
        ></u-textarea>
      </ty-info-card>
      <view v-if="getHasPermissionsById('member:project:audit:documentReview:submit')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="error" native-type="submit" @click="doSubmit('13')">退回</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="doSubmit('19')">通过</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { DocumentReviewInfo, DocumentReviewSubmitData } from '@/interfaces/member/project/audit/documentReview'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty } from '@/utils/validate'
import apiDocumentReview from '@/api/member/project/audit/api.documentReview'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import BaseInfo from './components/BaseInfo.vue'
import peplenishFileList from './components/peplenishFileList.vue'

const router = useRouter()
const route = useRoute()
let loading = ref(false)
let refcode: number | string = '' // 业务准入流水号
const focusFlag = ref(false)

let documentReviewInfo: DocumentReviewInfo = {
  /**
   * 复核日期
   */
  reviewDate: '',
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene: '',
  /**
   * 证照列表
   */
  certList: [],
  /**
   * 申请编号
   */
  dqscNo: '',
  /**
   * 资料检查状态，[1=收集中/2=审核中/3=已退回/8=已拒绝/9=已通过]
   */
  dqscStatus: '',
  /**
   * 内审状态，[
   * 12=待复核/13=复核退回/19=复核通过/
   * 22=待审查/23=审查退回/28=审查拒绝/29=审查通过]
   */
  examineStatus: '',
  /**
   * 卖方国家描述
   */
  orgctyDesc: '',
  /**
   * 卖方所在国
   */
  orgctyid: '',
  /**
   * 卖方名称
   */
  orgname: '',
  /**
   * 核贷书信息
   */
  docFileUuidList: [],
  /**
   * 补充资料信息
   */
  peplenishFileListx: [],
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 资料检查审批意见
   */
  examineOpinion: '',
  /**
   * 流水号
   */
  refcode: '',
  /**
   * 资料复核审批意见
   */
  reviewOpinion: '',
  /**
   * 申请人主管名称
   */
  assistSuperiorUsers: '',
  /**
   * 财税列表
   */
  taxList: [],
  /**
   * 交易历史记录
   */
  tradeHisList: [],
  /**
   * 客户经理
   */
  superiorUserid: ''
}
// 提交数据
let submitData = reactive<DocumentReviewSubmitData>({
  reviewOpinion: '',
  examineStatus: '',
  refcode: refcode //
})
// 申请详情
let vm = reactive({
  documentReviewInfo: documentReviewInfo // 提交信息
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const doSubmit = (type: string) => {
  focusFlag.value = false

  submitData.examineStatus = type

  if (type === '13' && isEmpty(submitData.reviewOpinion)) {
    showToast('请输入复核意见')
    focusFlag.value = true
    return
  }
  if (type === '19' && vm.documentReviewInfo.dqscStatus !== '9') {
    showToast('资料检查未审核，暂时无法审查')
    return
  }
  loading.value = true
  apiDocumentReview.doSubmitDocumentReview(submitData).then(
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

const getDocumentReviewInfo = () => {
  apiDocumentReview.getDocumentReviewInfo(refcode).then(res => {
    if (res) {
      vm.documentReviewInfo = res.data
    }
  })
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    if (!isEmpty(refcode)) {
      submitData.refcode = refcode
      getDocumentReviewInfo()
    }
  }
})

/**
 * @Author: ran.zhu
 * @Date: 2025-09-17 15:24:46
 * @return {*}
 * @description: 审核历程
 */
const toHistory = () => {
  router.push(`/member/project/audit/documentReview/history/${encodeBase64(vm.documentReviewInfo.dqscNo)}`)
}
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

.history {
  font-size: 26rpx;
  color: $primary;
  font-weight: normal;
  flex: 1;
  text-align: right;
}
</style>
