<!--
 * @Description  : 精简示例-带顶部主操作的列表页
 * @ExampleFrom  : member/project/apply/access/index.vue
-->
<template>
  <view>
    <NavBar>
      <text class="action-entry" @click="startApply">发起申请</text>
    </NavBar>
    <view class="page-list">
      <view class="search-box">
        <up-search
          v-model="search.data.keyword"
          v-insert-clear:[search.data.keyword]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入关键字"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        />
      </view>
      <up-sticky bg-color="#fff">
        <view class="head-tabs">
          <view class="tabs-line"></view>
          <u-tabs :list="vm.tabsList" @click="selectTab" />
        </view>
      </up-sticky>
      <view class="content">
        <uni-list v-if="vm.list.length">
          <uni-list-item v-for="item in vm.list" :key="item.refcode" @tap="viewDetail(item.refcode, item.status)">
            <u-cell-group :border="false">
              <u-cell title="标题" :value="item.title" :border="false" />
            </u-cell-group>
          </uni-list-item>
        </uni-list>
        <u-empty v-else mode="data" text="暂无数据" :icon="empty" width="300" height="244" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { DemoSearch } from '@/interfaces/demo/list'

const router = useRouter()

const search = reactive<DemoSearch>({
  data: {
    keyword: '',
    status: '0'
  },
  pageNum: 1,
  pageSize: 10
})

const vm = reactive({
  list: [] as Array<{ refcode: number | string; title: string; status: string }>,
  tabsList: [{ name: '待提交' }, { name: '已提交' }]
})

const searchProjectPage = () => {}
const resetSearch = () => {}
const selectTab = () => {}

const startApply = () => {
  router.push('/demo/apply')
}

const viewDetail = (refcode: number | string, status: string) => {
  if (['0', '5', '10'].includes(status)) {
    router.push(`/demo/apply/${encodeBase64(refcode)}`)
  } else {
    router.push(`/demo/detail/${encodeBase64(refcode)}`)
  }
}
</script>
