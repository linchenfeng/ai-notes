<!--
 * @Description  : 操作列权限示例 /examples/operation-permission-example
-->
<template>
  <ty-table-column :label="$t('操作')" align="center" min-width="180" fixed="right">
    <template #scope="scope">
      <el-button
        v-if="getPermissionsByCode('ecommerce:meeting:meetingQuery:query')"
        type="text"
        v-debounce
        @click="viewData(scope.row.refcode)"
      >
        {{ $t('查询') }}
      </el-button>

      <template v-if="['8'].includes(scope.row.metStatus) && scope.row.source !== '2'">
        <el-button
          v-if="getPermissionsByCode('ecommerce:meeting:meetingQuery:finalRevoke')"
          type="text"
          v-debounce
          @click="finalRevokeData(scope.row)"
        >
          {{ $t('撤回') }}
        </el-button>
      </template>

      <template v-if="['1', '3'].includes(scope.row.metStatus) && scope.row.source !== '2'">
        <el-button
          v-if="getPermissionsByCode('ecommerce:meeting:meetingQuery:revoke')"
          type="text"
          v-debounce
          @click="revokeData(scope.row)"
        >
          {{ $t('强制撤回') }}
        </el-button>
        <el-button
          v-if="getPermissionsByCode('ecommerce:meeting:meetingQuery:del')"
          type="text"
          v-debounce
          @click="delData(scope.row)"
        >
          {{ $t('删除') }}
        </el-button>
      </template>
    </template>
  </ty-table-column>
</template>
