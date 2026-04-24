<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-12-18 10:24:13
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-27 10:03:32
 * @Description  : 上会结果基本信息
-->
<template>
  <div class="BasicInfo">
    <view class="detail-cell-group">
      <ty-info-card title="基本信息" :show-line="false">
        <u-cell-group>
          <u-cell title="卖方名称" :border="false">
            <template #value>
              <view class="name-list" :class="getName(props.meetingInfo, 'sellerOrgName').length > 1 ? 'mul-row' : ''">
                <view v-for="(item, index) in getName(props.meetingInfo, 'sellerOrgName')" :key="index">
                  {{ item }}
                </view>
              </view>
            </template>
          </u-cell>
          <u-cell title="买方名称" :border="false">
            <template #value>
              <view class="name-list" :class="getName(props.meetingInfo, 'counterpartyOrgname').length > 1 ? 'mul-row' : ''">
                <view v-for="(item, index) in getName(props.meetingInfo, 'counterpartyOrgname')" :key="index">
                  {{ item }}
                </view>
              </view>
            </template>
          </u-cell>
          <u-cell title="业务申请编号" :value="props.meetingInfo.businessNo" :border="false" />
          <u-cell
            title="业务大类"
            :value="
              getValueByKey(
                isEmpty(props.meetingInfo.factoringType)
                  ? props.meetingInfo.bizScene
                  : props.meetingInfo.bizScene + '-' + props.meetingInfo.factoringType,
                'intBizScene'
              )
            "
            :border="false"
          />
          <u-cell title="业务类型" :value="props.meetingInfo.bizTypeDesc" :border="false" />
          <u-cell title="申请条件" :value="props.meetingInfo.applyConditionDesc" :border="false" />
          <u-cell title="客户经理" :value="props.meetingInfo.userName" :border="false" />
          <u-cell title="业务主管" :value="props.meetingInfo.managerUserName" :border="false" />
          <u-cell title="上会日期" :value="dateFormat(props.meetingInfo.metDate)" :border="false" />
          <!-- 贷前查询——上会结果查询不展示核贷书 -->
          <u-cell v-if="props.type !== 'search'" title="核贷书" :border="false" />
          <view v-if="props.type !== 'search'" class="icon-box" @click="preview">
            <cover-image src="@/assets/member/project/meeting/heDaiShu.png" alt="核贷书" />
          </view>
        </u-cell-group>
      </ty-info-card>
    </view>
  </div>
  <FilePreviewVue
    v-if="showPreview"
    :resource-uuid="
      props.type === 'search' && props.meetingInfo.metStatus !== '8'
        ? props.meetingInfo.fullPdfUuid
        : ['review', 'share'].includes(props.type)
        ? props.meetingInfo.fullPdfUuid
        : props.meetingInfo.partPdfUuid
    "
    @close-dialog="showPreview = false"
  ></FilePreviewVue>
</template>

<script setup lang="ts">
import { dateFormat } from '@/utils/format'
import { PropType } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import FilePreviewVue from '@/plugins/filePreview/index.vue'
import apiFile from '@/api/common/api.file'
import { getValueByKey } from '@/utils/constant'
import { isEmpty, splitByKeywords } from '@/utils/validate'
const showPreview = ref(false)
type TemMeetingInfo = {
  /**
   * 卖方名称
   */
  sellerOrgName: string
  /**
   * 业务类型
   */
  bizType: string
  /**
   * 客户经理
   */
  userName: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 上会日期
   */
  metDate: string
  /**
   * 概要说明
   */
  summaryRemark: string
  /**
   * 核贷书UUID(完整)
   */
  fullPdfUuid?: string
  /**
   * 核贷书UUID(截取)
   */
  partPdfUuid?: string
  /**
   * 业务类型描述
   */
  bizTypeDesc: string
  /**
   * 是否操作人查询，1=是/0=否
   */
  isOperator?: string
  /**
   * 加密PDF
   */
  encryptUuid?: string
  /**
   * 申请条件
   */
  applyConditionDesc: string
  /**
   * 交易对手名称
   */
  counterpartyOrgname: string
  /**
   * 业务大类，1=国内/2=国际/3=跨境
   */
  bizScene: string
  /**
   * 保理类型，1=正向/2=方向
   */
  factoringType: string
  /**
   * 业务申请编号
   */
  businessNo: string
  /**
   * 上会状态【1=待复核/2=复核待补充/3=待审核/4=审核待补充/5=审核通过】
   */
  metStatus: string
}
const props = defineProps({
  type: {
    type: String,
    default: 'review' // review=上会结果复核/approval=上会结果审批/share=分享委员填写/search=上会结果查询
  },
  meetingInfo: {
    type: Object as PropType<TemMeetingInfo>,
    default: () => ({})
  }
})
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 10:54:15
 * @description: 预览PDF
 */
const preview = () => {
  // 复核/分享/查询展示完整pdf
  if (['review', 'share', 'search'].includes(props.type) && !props.meetingInfo.fullPdfUuid) {
    showToast('暂无核贷书')
    return
  }
  // 审批展示截取的pdf
  if (['approval'].includes(props.type) && !props.meetingInfo.partPdfUuid) {
    showToast('暂无核贷书')
    return
  }
  //上会审批查询过会前的数据是预览核贷书且带信用分析报告/已过会后的，是下载加密版核贷书，且不带信用分析报告
  if (props.type === 'search' && props.meetingInfo.metStatus === '8' && props.meetingInfo.encryptUuid) {
    apiFile.getFileByResourceUuid(props.meetingInfo.encryptUuid)
  } else {
    showPreview.value = true
  }
}
const getName = (baseInfo, type: string): string[] => {
  let originalNameList: string[] = []
  let originalName = ''
  // factoringType 1正向业务|2反向业务
  // sellerOrgName 卖方名称
  // counterpartyOrgname 交易对手
  // 反向业务时，卖方取交易对手，买方取卖方名称;正向业务则相反取值
  if (type === 'sellerOrgName') {
    originalName = baseInfo.factoringType === '2' ? baseInfo.counterpartyOrgname : baseInfo.sellerOrgName
  } else {
    originalName = baseInfo.factoringType === '2' ? baseInfo.sellerOrgName : baseInfo.counterpartyOrgname
  }
  originalNameList = originalName ? splitByKeywords(originalName) : []
  if (originalNameList.length > 1) {
    originalNameList = originalNameList.map((item, index) => `${type === 'sellerOrgName' ? '卖方' : '买方'}${index + 1}：${item}`)
  }
  return originalNameList
}
</script>

<style lang="scss" scoped>
@import '../../meetingReview/style/meeting.scss';
</style>
