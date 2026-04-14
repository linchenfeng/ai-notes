<!--
 * @Description  : 详情页示例 /examples/detail-page-example
-->
<template>
  <vteam-container>
    <el-tabs v-if="baseInfo.dqscNo" v-model="activeName" type="card">
      <el-tab-pane name="0" :label="$t('基础信息')"></el-tab-pane>
      <el-tab-pane name="1" :label="$t('客户资料')"></el-tab-pane>
    </el-tabs>

    <div v-if="activeName === '0'">
      <el-descriptions border :title="$t('基础信息')" :column="3">
        <el-descriptions-item :label="$t('开票申请编号')">{{ baseInfo.appNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('申请书编号')">{{ baseInfo.applicationNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('申请开票企业名称')">{{ baseInfo.invoiceApplyOrgName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('开票主体名称')">{{ baseInfo.invoiceSubjectName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('币种')">{{ baseInfo.currencyName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('开票金额(元)')">{{ baseInfo.invoiceAmt | moneyFormat }}</el-descriptions-item>
        <el-descriptions-item :label="$t('开票日期')">{{ baseInfo.invoiceDate | myDateFormat(2) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('操作日期')">{{ baseInfo.operateDate | myDateFormat(1) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('状态')">{{ getValueByKey(baseInfo.confirmStatus, 'confirmStatus') || baseInfo.confirmStatus }}</el-descriptions-item>
      </el-descriptions>

      <review-info v-if="showHistory" :opinionList="opinionList" />
    </div>

    <div v-if="activeName === '1'">
      <client-info :dqscNo="baseInfo.dqscNo" />
    </div>
  </vteam-container>
</template>

<script>
import ReviewInfo from '@/pages/ecommerce/components/ReviewInfo.vue'
import ClientInfo from '@/pages/ecommerce/components/ClientInfo.vue'

export default {
  components: {
    ReviewInfo,
    ClientInfo
  },
  data() {
    return {
      activeName: '0',
      baseInfo: {
        appNo: '', // 开票申请编号
        applicationNo: '', // 申请书编号
        invoiceApplyOrgName: '', // 申请开票企业名称
        invoiceSubjectName: '', // 开票主体名称
        currencyName: '', // 币种
        invoiceAmt: '', // 开票金额
        invoiceDate: '', // 开票日期
        operateDate: '', // 操作日期
        confirmStatus: '', // 状态
        dqscNo: '' // 资料检查申请编号
      },
      opinionList: [],
      showHistory: false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-descriptions-item__content) {
  white-space: pre-wrap;
}
</style>
