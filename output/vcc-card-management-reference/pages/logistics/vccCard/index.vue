<!--
 * @Description  : 运营端VCC卡管理列表页参考实现 /pages/logistics/vccCard
-->
<template>
  <vteam-container>
    <ty-query-form
      ref="queryForm"
      :searchModel="search"
      :formItems="formItems"
      @search="findPage"
    ></ty-query-form>

    <ty-table :data="self.list" :fixedHeader="true" stripe>
      <ty-table-column
        :label="$t('企业名称')"
        prop="enterpriseName"
        min-width="180"
      ></ty-table-column>
      <ty-table-column
        :label="$t('持卡人')"
        prop="holderName"
        min-width="140"
      ></ty-table-column>
      <ty-table-column
        :label="$t('卡号后四位')"
        prop="cardLastFourNo"
        align="center"
        min-width="120"
      ></ty-table-column>
      <ty-table-column
        :label="$t('卡状态')"
        prop="cardStatus"
        type="status"
        constantKey="vccCardStatus"
        min-width="120"
      ></ty-table-column>
      <ty-table-column
        :label="$t('申请状态')"
        prop="applyStatus"
        type="status"
        constantKey="vccApplyStatus"
        min-width="120"
      ></ty-table-column>
      <ty-table-column
        :label="$t('VCC授信额度(元)')"
        prop="creditAmt"
        type="money"
        min-width="140"
      ></ty-table-column>
      <ty-table-column
        :label="$t('可分配VCC卡额度(元)')"
        prop="availableCreditAmt"
        type="money"
        min-width="160"
      ></ty-table-column>
      <ty-table-column
        :label="$t('总卡额度(元)')"
        prop="totalCardAmt"
        type="money"
        min-width="140"
      ></ty-table-column>
      <ty-table-column
        :label="$t('总卡余额(元)')"
        prop="totalBalanceAmt"
        type="money"
        min-width="140"
      ></ty-table-column>
      <ty-table-column
        :label="$t('创建时间')"
        prop="createTime"
        type="date"
        dateType="1"
        min-width="160"
      ></ty-table-column>
      <ty-table-column
        :label="$t('操作')"
        align="center"
        min-width="160"
        fixed="right"
      >
        <template #scope="scope">
          <el-button
            v-if="getPermissionsByCode('logistics:vccCard:query')"
            type="text"
            v-debounce
            @click="viewData(scope.row.refcode)"
          >
            {{ $t("查询") }}
          </el-button>
          <el-button
            v-if="getPermissionsByCode('logistics:vccCard:update')"
            type="text"
            v-debounce
            @click="refreshCredit(scope.row)"
          >
            {{ $t("刷新额度") }}
          </el-button>
        </template>
      </ty-table-column>
    </ty-table>

    <template slot="footer">
      <ty-pagination
        :total="self.total"
        :pageNum="search.pageNum"
        :pageSize="search.pageSize"
        @pagination="pagination"
      ></ty-pagination>
    </template>
  </vteam-container>
</template>

<script>
import vccCardApi from "@/api/logistics/vccCard";
import { encodeBase64 } from "@/utils/tool";

export default {
  data() {
    return {
      search: {
        enterpriseName: "", // 企业名称
        holderName: "", // 持卡人
        applyStatus: [], // 申请状态
        cardStatus: [], // 卡状态
        pageNum: 1,
        pageSize: this.$store.getters.defaultPageSize,
      },
      self: {
        list: [],
        total: 0,
      },
    };
  },
  computed: {
    formItems() {
      return [
        { label: this.$t("企业名称"), type: "input", model: "enterpriseName" },
        { label: this.$t("持卡人"), type: "input", model: "holderName" },
        {
          label: this.$t("申请状态"),
          type: "select",
          model: "applyStatus",
          constantKey: "vccApplyStatus",
        },
        {
          label: this.$t("卡状态"),
          type: "select",
          model: "cardStatus",
          constantKey: "vccCardStatus",
        },
      ];
    },
  },
  mounted() {
    this.findPage();
  },
  methods: {
    findPage() {
      vccCardApi.findVccCardPage(this.search).then((res) => {
        const page = (res && res.data) || {};
        this.self.list = page.list || [];
        this.self.total = page.total || 0;
      });
    },
    pagination({ pageNum, pageSize }) {
      this.search.pageNum = pageNum;
      this.search.pageSize = pageSize;
      this.findPage();
    },
    viewData(refcode) {
      this.$router.push({
        name: "logistics-vcc-card-detail",
        params: {
          refcode: encodeBase64(refcode),
        },
      });
    },
    refreshCredit(row) {
      vccCardApi.refreshVccCredit(row.refcode).then(() => {
        this.$message.success(this.$t("刷新成功"));
        this.findPage();
      });
    },
  },
};
</script>
