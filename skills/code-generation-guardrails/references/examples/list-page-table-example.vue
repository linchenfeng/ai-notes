<!--
 * @Description  : 列表页表格区与页签示例 /examples/list-page-table-example
-->
<template>
  <vteam-container>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('待确认')" name="waitConfirm"></el-tab-pane>
      <el-tab-pane :label="$t('进度查询')" name="progressQuery"></el-tab-pane>
    </el-tabs>

    <ty-table :key="`${$route.name}-${activeName}`" :data="self.list" :fixedHeader="true">
      <ty-table-column :label="$t('开票申请编号')" prop="appNo" fixed="left" min-width="160"></ty-table-column>
      <ty-table-column :label="$t('申请书编号')" prop="applicationNo" min-width="160"></ty-table-column>
      <ty-table-column :label="$t('申请开票企业名称')" prop="invoiceApplyOrgName" min-width="180"></ty-table-column>
      <ty-table-column :label="$t('开票主体名称')" prop="invoiceSubjectName" min-width="180"></ty-table-column>
      <ty-table-column :label="$t('币种')" prop="currencyName" align="center" min-width="100"></ty-table-column>
      <ty-table-column :label="$t('开票金额(元)')" prop="invoiceAmt" type="money" min-width="140"></ty-table-column>
      <ty-table-column :label="$t('开票日期')" prop="invoiceDate" type="date" dateType="2" min-width="120"></ty-table-column>
      <ty-table-column :label="$t('操作日期')" prop="operateDate" type="date" dateType="2" min-width="120"></ty-table-column>
      <ty-table-column
        :label="$t('状态')"
        prop="confirmStatus"
        type="status"
        constantKey="confirmStatus"
        :statusConfig="{ warning: '1,2,4', danger: '3', success: '9', blue: '0' }"
        min-width="120"
      ></ty-table-column>
      <ty-table-column :label="$t('操作')" align="center" min-width="120" fixed="right">
        <template #scope="scope">
          <el-button type="text" v-debounce @click="viewData(scope.row.refcode)">
            {{ $t('查询') }}
          </el-button>
        </template>
      </ty-table-column>
    </ty-table>

    <template slot="footer">
      <ty-pagination
        :total="self.total"
        :pageNum="currentSearch.pageNum"
        :pageSize="currentSearch.pageSize"
        @pagination="pagination"
      ></ty-pagination>
    </template>
  </vteam-container>
</template>
