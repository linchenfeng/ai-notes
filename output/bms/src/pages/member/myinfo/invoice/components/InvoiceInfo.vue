<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-11 14:24:56
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-18 14:02:13
 * @Description  : 开票信息
-->
<template>
  <view class="basicInfo">
    <!-- 收款账户信息 -->
    <ty-info-card title="收款账户信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="收款企业名称" :value="props.fgaiAppVo.bankrollOrgName" />
          <u-cell title="缴费币种" :value="fbpaAcc.ccyidDesc" />
          <u-cell title="户名" :value="fbpaAcc.factoringMerchant" />
          <u-cell title="账号" :value="fbpaAcc.factoringAccountNo" />
          <u-cell title="开户行" :value="fbpaAcc.factoringBank" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="开票信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell v-if="fbpaAcc.invoiceType !== '1'" title="发票类型" :value="getValueByKey(props.fgaiAppVo.billType, 'billType')" />
          <u-cell title="开票类型" :value="getValueByKey(props.fgaiAppVo.generateType, 'generateType')" />
          <u-cell title="开票币种" :value="props.fgaiAppVo.ccyidDesc" />
          <u-cell :title="type === 'audit' ? '申请开票金额(元)' : '开票金额(元)'" :value="moneyFormat(props.fgaiAppVo.generateAmt)" />
          <u-cell title="开票企业名称" :value="props.fgaiAppVo.appOrgName" />
          <u-cell v-if="fbpaAcc.invoiceType !== '1'" title="开票企业税号" :value="props.fgaiAppVo.appCreditCode" />
          <u-cell title="开票企业邮箱" :value="props.fgaiAppVo.email" />
          <u-cell v-if="isNotEmpty(props.fgaiAppVo.appRemark)" title="备注说明" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ props.fgaiAppVo.appRemark }}</text>
            </template>
          </u-cell>
          <!-- 已开票才展示 -->
          <u-cell v-if="type === 'query' && props.fgaiAppVo.showStatus === '4'" title="已开发票" class="vertical-cell">
            <template #value>
              <view class="fileUuid">
                <view v-for="(item, index) in fileList" :key="item.fileUuid" class="fileList-box" :class="{ mgr: index % 4 !== 3 }">
                  <view :style="{ width: `130rpx`, height: `130rpx`, marginRight: '15rpx' }" class="fileList-image">
                    <ImageVue :file-uuid="item.fileUuid" image-type="small" :show-download="true"></ImageVue>
                  </view>
                </view>
              </view>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { FgaiAppVo, FactoringListFactoringList, QueryFbpaAccList } from '@/interfaces/member/myinfo/invoice'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import { isNotEmpty } from '@/utils/validate'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import type { PropType } from 'vue'
import ImageVue from '@/plugins/Image.vue'
const props = defineProps({
  fgaiAppVo: {
    type: Object as PropType<FgaiAppVo>,
    default: () => ({})
  },
  // query|开票申请 audit 开票审核
  type: {
    type: String,
    default: 'query'
  }
})
// 征信非账户信息查询条件
let queryFbpaAccList = reactive<QueryFbpaAccList>({
  bankrollAccRefcode: ''
})
// 征信费账户列表
let fbpaAccList = ref<FactoringListFactoringList[]>([])
// 当前选中征信费账户
let fbpaAcc = ref<FactoringListFactoringList>({} as FactoringListFactoringList)
// 已开票列表
type FileUuid = {
  fileUuid: string
}
let fileList = ref<FileUuid[]>([])

const getCreditAccountInfo = () => {
  queryFbpaAccList.bankrollAccRefcode = props.fgaiAppVo.bankrollAccRefcode as string
  apiInvoice.getCreditAccountInfo(queryFbpaAccList).then(res => {
    fbpaAccList.value = res.data.factoringList
    if (res.data.factoringList && res.data.factoringList.length === 1) {
      fbpaAcc.value = res.data.factoringList[0]
    }
  })
}
onMounted(() => {
  if (isNotEmpty(props.fgaiAppVo.bankrollAccRefcode)) {
    getCreditAccountInfo()
  }
  const fileUuids = props.fgaiAppVo.fileUuids
  let fileUuidsList = ref<string[]>()
  if (isNotEmpty(fileUuids)) {
    fileUuidsList.value = fileUuids?.split(',') as string[]
    for (let item of fileUuidsList.value) {
      fileList.value.push({
        fileUuid: item
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.otherCcyid {
  display: flex;
  align-items: center;
}
.appointCcyid {
  margin-right: 6rpx;
}
.inputValueClass {
  min-height: 160rpx;
  position: relative;
  top: -20rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    font-size: 28rpx;
  }
}
.tip-box {
  color: #e6a23c;
  font-size: 24rpx;
  line-height: 34rpx;
  margin-bottom: 10rpx;
}
.fileUuid {
  display: flex;
  flex-wrap: wrap;
  .fileList-box {
    display: flex;
    margin-bottom: 15rpx;
    .fileList-image {
      border: 2rpx dashed #d8d8d8;
      box-sizing: border-box;
      position: relative;
      border-radius: 10rpx;
    }
  }
}
.mgr {
  margin-right: 20rpx;
}
</style>
