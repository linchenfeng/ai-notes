<!--
 * @Description  : 运营端VCC卡详情页参考实现 /pages/logistics/vccCard/Detail
-->
<template>
  <vteam-container>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane name="0" :label="$t('VCC卡信息')"></el-tab-pane>
      <el-tab-pane name="1" :label="$t('VCC交易明细')"></el-tab-pane>
    </el-tabs>

    <div v-if="activeName === '0'">
      <el-descriptions border :title="$t('基础信息')" :column="3">
        <el-descriptions-item :label="$t('企业名称')">{{
          baseInfo.enterpriseName
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('持卡人')">{{
          baseInfo.holderName
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('承运商')">{{
          baseInfo.carrierName
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('银联VCC卡(后四位数字)')">{{
          baseInfo.cardLastFourNo
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('卡状态')">{{
          getValueByKey(baseInfo.cardStatus, "vccCardStatus") ||
          baseInfo.cardStatus
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('申请状态')">{{
          getValueByKey(baseInfo.applyStatus, "vccApplyStatus") ||
          baseInfo.applyStatus
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('VCC授信额度(元)')">{{
          baseInfo.creditAmt | moneyFormat
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('可分配VCC卡额度(元)')">{{
          baseInfo.availableCreditAmt | moneyFormat
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('总卡额度(元)')">{{
          baseInfo.totalCardAmt | moneyFormat
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('总卡余额(元)')">{{
          baseInfo.totalBalanceAmt | moneyFormat
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('卡币种')">{{
          baseInfo.cardCurrency
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('创建时间')">{{
          baseInfo.createTime | myDateFormat(1)
        }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div v-if="activeName === '1'" class="dont-crowd-me">
      <table class="detail-information" width="100%">
        <thead>
          <tr>
            <th class="detail-information-head-title" colspan="2">
              <label>{{ $t("VCC交易明细") }}</label>
            </th>
          </tr>
        </thead>
      </table>

      <div class="detail-table-wrap">
        <ty-table class="detail-table" :data="tradeList" stripe>
          <ty-table-column
            :label="$t('序号')"
            type="index"
            width="50"
          ></ty-table-column>
          <ty-table-column
            :label="$t('交易时间')"
            prop="tradeTime"
            type="date"
            dateType="1"
            min-width="160"
          ></ty-table-column>
          <ty-table-column
            :label="$t('VCC卡消费名称')"
            prop="tradeName"
            min-width="180"
          ></ty-table-column>
          <ty-table-column
            :label="$t('VCC卡币种')"
            prop="currency"
            align="center"
            min-width="120"
          ></ty-table-column>
          <ty-table-column
            :label="$t('交易类型')"
            prop="tradeType"
            type="status"
            constantKey="vccTradeType"
            min-width="120"
          ></ty-table-column>
          <ty-table-column
            :label="$t('交易金额')"
            prop="tradeAmt"
            type="money"
            min-width="140"
          ></ty-table-column>
          <ty-table-column
            :label="$t('交易状态')"
            prop="tradeStatus"
            type="status"
            constantKey="vccTradeStatus"
            min-width="120"
          ></ty-table-column>
        </ty-table>
      </div>
    </div>
  </vteam-container>
</template>

<script>
import vccCardApi from "@/api/logistics/vccCard";
import { decodeBase64 } from "@/utils/tool";

export default {
  data() {
    return {
      activeName: "0",
      baseInfo: {
        enterpriseName: "", // 企业名称
        holderName: "", // 持卡人
        carrierName: "", // 承运商
        cardLastFourNo: "", // 卡号后四位
        cardStatus: "", // 卡状态
        applyStatus: "", // 申请状态
        creditAmt: "", // VCC授信额度
        availableCreditAmt: "", // 可分配VCC卡额度
        totalCardAmt: "", // 总卡额度
        totalBalanceAmt: "", // 总卡余额
        cardCurrency: "", // 卡币种
        createTime: "", // 创建时间
      },
      tradeList: [],
      refcode: "",
    };
  },
  mounted() {
    this.refcode = decodeBase64(this.$route.params.refcode);
    this.findDetail();
    this.findTradePage();
  },
  methods: {
    findDetail() {
      vccCardApi.getVccCardDetail(this.refcode).then((res) => {
        this.baseInfo = (res && res.data) || {};
      });
    },
    findTradePage() {
      vccCardApi
        .findVccTradePage({
          refcode: this.refcode,
          pageNum: 1,
          pageSize: 999,
        })
        .then((res) => {
          const page = (res && res.data) || {};
          this.tradeList = page.list || [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-descriptions-item__content) {
  white-space: pre-wrap;
}
</style>
