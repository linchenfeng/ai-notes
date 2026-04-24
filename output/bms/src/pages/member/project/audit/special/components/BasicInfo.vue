<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-09-04 17:49:42
 * @Description  : 特批申请信息
-->
<template>
  <view class="basicInfo">
    <view v-if="props.examineType !== 'F'">
      <ty-info-card class="frist-card">
        <view class="detail-group">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="客户经理" :value="props.self.userName" :border="false" />
              <u-cell title="业务主管" :value="props.self.superiorName" :border="false" />
              <u-cell title="申请日期" :value="props.self.applyDate ? dateFormat(props.self.applyDate, 1) : ''" :border="false" />
            </view>
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card>
        <view class="detail-group">
          <u-cell-group :border="false" :stop="true">
            <view class="item-title">
              <u-cell title="业务产品" :value="getProduceType" :border="false" />
              <u-cell title="申请类型" :value="getDesc(props.self)" :border="false" />
            </view>
          </u-cell-group>
        </view>
      </ty-info-card>
      <ty-info-card title="客户基本信息">
        <view class="detail-group">
          <u-cell-group :border="false" :stop="true">
            <u-cell title="卖方名称" :value="props.self.orgname" :border="false" />
            <u-cell v-if="props.self.legalPerson" title="法定代表人" :value="props.self.legalPerson" :border="false" />
            <u-cell v-if="props.self.jointBorrower" title="共借人" :value="props.self.jointBorrower" :border="false" />
            <u-cell v-if="props.self.guarantor" title="担保人" :value="props.self.guarantor" :border="false" />
            <u-cell title="授权平台" :value="getValueByKey(props.self.creditPlatform, 'creditPlatform')" :border="false" />
            <u-cell
              v-if="props.self.applyType && ['31', '35'].includes(props.self.applyType)"
              title="授信产品"
              :value="getValueByKey(props.self.creditApplyProduct, 'creditProduct')"
              :border="false"
            />
            <u-cell v-if="props.self.buyerName" title="买方名称" :border="false" class="buyername-box">
              <template #value>
                <view v-if="!props.self.buyerName.includes(',')" class="name-item">{{ props.self.buyerName }}</view>
                <view v-else>
                  <view v-for="(item, index) in getNameList(props.self.buyerName)" :key="index" class="name-item">
                    {{ `买方${index + 1}：${item}` }}
                  </view>
                </view>
              </template>
            </u-cell>
          </u-cell-group>
        </view>
      </ty-info-card>
    </view>
    <ty-info-card v-if="props.examineType === 'F'" title="基本信息">
      <view class="detail-group">
        <u-cell-group :border="false" :stop="true">
          <u-cell title="卖方名称" :value="props.self.orgname" :border="false" />
          <u-cell v-if="props.self.buyerName" title="买方名称" :border="false" class="buyername-box">
            <template #value>
              <view v-if="!props.self.buyerName.includes(',')" class="name-item">{{ props.self.buyerName }}</view>
              <view v-else>
                <view v-for="(item, index) in getNameList(props.self.buyerName)" :key="index" class="name-item">
                  {{ `买方${index + 1}：${item}` }}
                </view>
              </view>
            </template>
          </u-cell>
          <u-cell title="申请编号" :value="props.self.financingNo" :border="false" />
          <u-cell title="业务大类" :value="getValueByKey(props.self.bizScene, 'intBizScene')" :border="false" />
          <u-cell title="业务类型" :value="getApplyDesc(props.self)" :border="false" />
          <u-cell
            v-if="!['31', '35'].includes(props.self.applyType)"
            title="申请条件"
            :value="getValueByKey(props.self.orgLocList[0].loanType, 'loanType')"
            :border="false"
          />
          <u-cell title="客户经理" :value="props.self.userName" :border="false" />
          <u-cell title="业务主管" :value="props.self.superiorName" :border="false" />
          <u-cell title="申请日期" :value="props.self.applyDate ? dateFormat(props.self.applyDate, 1) : ''" :border="false" />
          <u-cell title="申请类型" :value="props.self.applyTypeDesc" :border="false" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <!-- 客户授权信息 -->
    <CusAuthInfo
      v-if="
        props.self.orgLocList &&
        props.self.orgLocList.length &&
        ((props.examineType !== 'F' && !['31', '35', ''].includes(props.self.applyType)) ||
          (props.examineType === 'F' && ['32', '33', '36'].includes(props.self.applyType)))
      "
      :self="props.self"
    ></CusAuthInfo>
    <ty-info-card
      v-if="['33', '34'].includes(props.self.applyType)"
      :title="props.self.applyType === '33' ? '本次申请的特批额度' : '本次申请开启的区间额度'"
    >
      <view class="detail-group">
        <u-cell-group :border="false" :stop="true">
          <u-cell title="额度币种" :value="`${getValueByKey(props.self.applyCcyid, 'ccyid')}`" :border="false" />
          <u-cell
            v-if="props.self.applyType === '33'"
            title="特批额度(万元)"
            :value="`${props.self.applyCcyid} ${moneyFormat(props.self.applySpecialAmt as number)}`"
            :border="false"
          />
          <u-cell
            v-else
            title="区间额度(万元)"
            :value="`${props.self.applyCcyid} ${moneyFormat(props.self.applyTemporaryAmt as number)}` "
            :border="false"
          />
          <u-cell
            title="额度生效日"
            :value="
              props.self.applyValidType === '1'
                ? getValueByKey(props.self.applyValidType, 'applyValidType')
                : dateFormat(props.self.applyValidStartDate)
            "
            :border="false"
          />
          <u-cell title="额度有效期(天)" :value="props.self.applyValidPeriod" :border="false" />
          <u-cell v-if="props.self.applyType === '33'" title="是否循环" :value="getValueByKey(props.self.cycleFlag, 'yesNo')" :border="false" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <!-- 准入店铺信息 -->
    <AccessStore
      v-if="['32', '36'].includes(props.self.applyType)"
      ref="accessStoreRef"
      :identity="props.identity"
      :self="props.self"
      :examine-type="props.examineType"
    ></AccessStore>
    <ty-info-card title="申请理由">
      <view class="content pre-wrap">{{ props.self.applyRemark }}</view>
    </ty-info-card>
    <ty-info-card v-if="props.self.apxList.length > 0" title="附件">
      <Uploader :editable="false" :res-uuid-vo="{ fileList: props.self.apxList as unknown  as FileItem[]}"></Uploader>
    </ty-info-card>
    <ty-info-card v-if="props.self.handleSummary && props.examineType !== 'B'" title="概要说明">
      <view class="content pre-wrap">{{ props.self.handleSummary }}</view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { getValueByKey } from '@/utils/constant'
import { dateFormat, moneyFormat } from '@/utils/format'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { SaveSpecialVo } from '@/interfaces/member/project/apply/specialApproval'
import type { PropType } from 'vue'
import CusAuthInfo from './CusAuthInfo.vue'
import AccessStore from '@/pages/member/project/apply/special/components/AccessStore.vue'
const accessStoreRef = ref()
interface FileItem {
  [key: string]: string | number
}
const props = defineProps({
  self: {
    type: Object as PropType<SaveSpecialVo>,
    default: () => ({})
  },
  // 【apply=申请/audit=审批/query=查询】
  identity: {
    type: String,
    default: ''
  },
  // 审批类型【A=审批/B=批注/C=确认】
  examineType: {
    type: String,
    default: ''
  }
})

const getProduceType = computed(() => {
  const bizScene = getValueByKey(props.self.bizScene, 'intBizScene')
  return bizScene ? `${bizScene}-${props.self.productType}` : props.self.productType
})
// 获取业务类型描述
const getDesc = (item: SaveSpecialVo) => {
  if (item.bizScene === '1') {
    return getValueByKey(item.applyType, 'saaApplyTypeEf')
  } else if (item.bizScene === '2') {
    return getValueByKey(item.applyType, 'saaApplyTypeIf')
  } else if (item.bizScene === '3') {
    return getValueByKey(item.applyType, 'saaApplyTypeCbe')
  }
}
// 获取申请类型描述
const getApplyDesc = (item: SaveSpecialVo) => {
  if (['31', '35'].includes(item.applyType)) {
    return getValueByKey(item.creditApplyProduct, 'creditApplyProduct')
  }
  return getValueByKey(props.self.orgLocList[0].creditApplyProduct, 'creditApplyProduct')
}
const getShopList = () => {
  if (accessStoreRef.value) {
    return accessStoreRef.value.getShopList()
  }
}
defineExpose({ getShopList })

const getNameList = (val: string) => {
  if (val) {
    return val.split(',')
  }
}
</script>

<style lang="scss" scoped>
:deep(.upload-file) {
  margin-bottom: 30rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 30rpx;
}

.basicInfo {
  .frist-card {
    padding-top: 60rpx;
    :deep(.border) {
      background-color: #fff !important;
    }
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
}
.buyername-box {
  :deep(.u-cell__body) {
    display: flex;
    justify-content: space-between;
    .u-cell__body__content {
      margin-right: 27px;
    }
    .name-item {
      font-size: 15px;
      min-height: 24px;
      line-height: 24px;
      color: #333333;
    }
  }
}
</style>
