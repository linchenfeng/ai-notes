<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:48:54
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-28 17:21:59
 * @Description  : 项目-业务审核-额度审核-审核 /member/project/audit/quotaAudit/audit/:refcode
-->

<template>
  <NavBar />
  <view class="main">
    <view class="topCell">
      <u-cell-group :border="false" :stop="true">
        <view class="item-title">
          <u-cell title="申请编号" :value="vm.self.applyNo" :border="false" />
        </view>
        <view class="item-title">
          <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" :border="false" />
        </view>
      </u-cell-group>
    </view>
    <view class="special-audit">
      <!-- 额度基本信息 -->
      <base-info :self="vm.self" />
      <!-- 额度开立结果 -->
      <ty-info-card title="额度开立结果">
        <u-form>
          <view class="radio-group">
            <template v-for="obj in getConstant('intClFinalStatus')" :key="obj.key">
              <u-button
                v-if="obj.key !== '0'"
                class="check-button"
                :class="applyStatus === obj.key ? 'active' : ''"
                round
                size="mini"
                @click="applyStatusChange(obj.key)"
              >
                {{ obj.value }}
              </u-button>
            </template>
          </view>
          <!--  国际业务已开立才显示核准金额 -->
          <u-form-item v-if="applyStatus === '99' && vm.self.bizScene === '2'" label="额度核准金额(万元)" label-width="50%" required>
            <view class="ccyid">
              <text>{{ vm.self.applyCcyid }}</text>
            </view>
            <InputNumber ref="checkAmtRef" v-model:number="checkAmt" placeholder="请输入额度核准金额" maxlength="11"></InputNumber>
          </u-form-item>

          <u-form-item label="备注说明" label-width="55%"></u-form-item>
          <view class="content pre-wrap">
            <u-textarea
              v-model="conditionRemark"
              :confirm-type="null"
              auto-height
              maxlength="300"
              count
              class="inputValueClass"
              placeholder="若有其他说明请备注"
            ></u-textarea>
          </view>
        </u-form>
      </ty-info-card>
      <view v-if="getHasPermissionsById('member:project:audit:quotaAudit:submit')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="getQuotaInfo('submit')">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getHasPermissionsById } from '@/utils/permissions'
import NavBar from '@/layout/NavBar.vue'
import { QuotaInfo, QuotaSubmit } from '@/interfaces/member/project/audit/quotaAudit'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiQuotaAudit from '@/api/member/project/audit/api.quotaAudit'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
import { getConstant } from '@/utils/constant'
import BaseInfo from './components/BaseInfo.vue'
import { isEmpty } from '@/utils/validate'
import InputNumber from '@/plugins/InputNumber.vue'

const router = useRouter()
let loading = ref(false)
let conditionRemark = ref('') // 审批意见
let applyStatus = ref('') // 开立结果
let checkAmt = ref('') //额度审核金额
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode))
const self: QuotaInfo = {
  applyStatus: '',
  applyNo: '',
  applyCcyid: '',
  applyDate: '',
  buyerOrgname: '',
  companyRegistrationNo: '',
  ctyDesc: '',
  refcode: -1,
  applyAmt: 0,
  checkAmt: 0,
  bizScene: ''
}
// 业务申请信息
let vm = reactive({
  self: self
})
const toSubmit = () => {
  if (isEmpty(applyStatus.value)) {
    showToast('请选择额度开立结果')
    return
  }
  if (isEmpty(checkAmt.value) && applyStatus.value === '99' && vm.self.bizScene === '2') {
    showToast('请输入额度核准金额')
    return
  }
  if (applyStatus.value === '99' && vm.self.bizScene === '2' && Number(checkAmt.value) <= 0) {
    showToast('额度核准金额需大于0')
    return
  }
  // 提交的数据
  const submitData: QuotaSubmit = {
    refcode: Number(decodeBase64(route.value.params.refcode)),
    applyStatus: applyStatus.value,
    reviewRemark: conditionRemark.value,
    checkAmt: checkAmt.value
  }
  loading.value = true
  apiQuotaAudit.doSubmitReview(submitData).then(
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
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取额度审核详情 type submit提交||query查询
 */
const getQuotaInfo = (type: string) => {
  apiQuotaAudit.getQuotaInfo(refcode).then(res => {
    if (res.data.fintAppClVo.applyStatus !== '21') {
      showToast('当前额度申请已审核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //提交时先校验当前状态
    if (type === 'submit') {
      toSubmit()
    } else {
      vm.self = res.data.fintAppClVo
    }
  })
}
const applyStatusChange = (status: string) => {
  applyStatus.value = status
  checkAmt.value = ''
}
onMounted(() => {
  getQuotaInfo('query')
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
.topCell {
  background-color: #fff;
}
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
.special-audit {
  background: #f6f6f6;
  padding: 0;
  .button-fixed-bottom {
    .vteam-button {
      padding: 0 30rpx;
      color: $default-color;
      .vteam-button-text {
        font-weight: bold;
      }
    }
  }
  .radio-group {
    justify-content: flex-start !important;
    margin-bottom: 30rpx;
  }
  .radio-group .check-button:first-child {
    margin-left: 0 !important;
  }
}

.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
}
.detail-group {
  :deep(.u-cell-group) {
    padding-top: 0;
    margin: 0;
    .u-cell__body {
      align-items: self-start;
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
.ccyid {
  text-align: right;
  font-size: 28rpx;
}
</style>
