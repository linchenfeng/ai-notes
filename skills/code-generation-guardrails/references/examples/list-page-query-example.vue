<!--
 * @Description  : 列表页查询区示例 /examples/list-page-query-example
-->
<template>
  <ty-query-form
    ref="queryForm"
    :searchModel="search"
    :formItems="currentFormItems"
    @search="findPage"
  ></ty-query-form>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'waitConfirm',
      searchWait: {
        appNo: '', // 开票申请编号
        applicationNo: '', // 申请书编号
        invoiceApplyOrgName: '', // 申请开票企业名称
        invoiceSubjectName: '', // 开票主体名称
        appDate: '', // 申请日期
        queryType: 'waitConfirm', // 查询类型
        pageNum: 1,
        pageSize: this.$store.getters.defaultPageSize
      },
      searchProgress: {
        appNo: '', // 开票申请编号
        applicationNo: '', // 申请书编号
        invoiceApplyOrgName: '', // 申请开票企业名称
        invoiceSubjectName: '', // 开票主体名称
        appDate: '', // 申请日期
        confirmStatusRange: [], // 状态
        queryType: 'progressQuery', // 查询类型
        pageNum: 1,
        pageSize: this.$store.getters.defaultPageSize
      }
    }
  },
  computed: {
    baseFormItems() {
      return [
        { label: this.$t('开票申请编号'), type: 'input', model: 'appNo' },
        { label: this.$t('申请书编号'), type: 'input', model: 'applicationNo' },
        { label: this.$t('申请开票企业名称'), type: 'input', model: 'invoiceApplyOrgName' },
        { label: this.$t('开票主体名称'), type: 'input', model: 'invoiceSubjectName' },
        { label: this.$t('申请日期'), type: 'input', model: 'appDate' }
      ]
    },
    currentFormItems() {
      if (this.activeName === 'progressQuery') {
        return [
          ...this.baseFormItems,
          {
            label: this.$t('状态'),
            type: 'select',
            model: 'confirmStatusRange',
            constantKey: 'confirmStatus',
            multiple: true,
            excludeValue: ['1', '4', '0']
          }
        ]
      }
      return this.baseFormItems
    },
    currentSearch() {
      return this.activeName === 'progressQuery' ? this.searchProgress : this.searchWait
    }
  }
}
</script>
