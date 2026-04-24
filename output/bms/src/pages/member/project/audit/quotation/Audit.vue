<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:53:45
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 11:22:30
 * @Description  :  项目-业务审核-业务报价-报价审核 /project/audit/quotation/audit/:refcode
-->
<template>
  <NavBar />
  <view class="main">
    <view class="topCell">
      <u-cell-group :border="false" :stop="true">
        <view class="item-title">
          <u-cell title="客户经理" :value="vm.self.userName" :border="false" />
        </view>
        <view class="item-title">
          <u-cell title="业务主管" :value="vm.self.superiorName" :border="false" />
        </view>
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
      <ty-info-card title="报价信息">
        <u-form label-width="43%">
          <u-form-item label="手续费率(%)" required label-width="35%">
            <view class="input-number">
              <InputNumber
                ref="quotaRate"
                v-model:number="submitData.quotaRate"
                :point="4"
                :format-flag="false"
                :max="100"
                placeholder="请输入手续费率"
                maxlength="15"
              ></InputNumber>
            </view>
          </u-form-item>
          <u-form-item label="备注说明" label-width="55%"></u-form-item>
          <view class="content pre-wrap">
            <u-textarea
              v-model="submitData.quotaRemark"
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
      <view v-if="getHasPermissionsById('member:project:audit:quotation:submit')" class="button-fixed-bottom">
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
import { QuotaInfo, QuotationSubmit } from '@/interfaces/member/project/audit/quotation'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiQuotation from '@/api/member/project/audit/api.quotation'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
import InputNumber from '@/plugins/InputNumber.vue'
import BaseInfo from './components/BaseInfo.vue'
import { isEmpty } from '@/utils/validate'
const router = useRouter()
let loading = ref(false)
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode))
const self: QuotaInfo = {
  address: '',
  applyCcyid: '',
  applyAmt: '',
  applyNo: '',
  applyStatus: '',
  applyDate: '',
  buyerCtyDesc: '',
  buyerOrgname: '',
  ctyDesc: '',
  orgname: '',
  quotaStatus: '',
  superiorName: '',
  userName: '',
  refcode: -1,
  tenor: '',
  quotaRemark: '',
  quotaRate: '',
  checkAmt: '',
  checkCcyid: ''
}
// 业务申请信息
let vm = reactive({
  self: self
})
let submitData: QuotationSubmit = reactive({
  quotaRate: '', //手续费率
  quotaRemark: '', //审批意见
  refcode: Number(decodeBase64(route.value.params.refcode))
})
const toSubmit = () => {
  if (isEmpty(submitData.quotaRate)) {
    showToast('请输入手续费率')
    return
  }
  loading.value = true
  apiQuotation.doSubmitQuotation(submitData).then(
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
  apiQuotation.getQuotaInfo(refcode).then(res => {
    if (res.data.quotaInfo.quotaStatus !== '1') {
      showToast('当前报价申请已提交')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //提交时先校验当前状态
    if (type === 'submit') {
      toSubmit()
    } else {
      vm.self = res.data.quotaInfo
    }
  })
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
  .input-number {
    width: 100%;
  }
}

.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
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
</style>
