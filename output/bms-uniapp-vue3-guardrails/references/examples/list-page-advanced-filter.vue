<!--
 * @Description  : 精简示例-带高级筛选弹层的列表页
 * @ExampleFrom  : member/project/query/application/index.vue
-->
<template>
  <view>
    <NavBar>
      <span @click="changeSearchType">
        <i class="iconfont search-icon icon-gaojisousuo"></i>
      </span>
    </NavBar>

    <view class="page-list">
      <view class="search-box">
        <up-search
          v-model="search.data.keyword"
          v-insert-clear:[search.data.keyword]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入综合搜索条件"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        />
      </view>

      <up-sticky bg-color="#fff">
        <view class="head-tabs">
          <view class="tabs-line"></view>
          <ty-tabs :tabs="vm.tabsList" :current="tabIndex" @change="selectTab"></ty-tabs>
        </view>
      </up-sticky>

      <view class="content">
        <uni-list v-if="vm.list.length">
          <uni-list-item v-for="item in vm.list" :key="item.refcode" @tap="viewDetail(item.refcode)">
            <u-cell-group :border="false">
              <u-cell title="编号" :value="item.no" :border="false" />
            </u-cell-group>
          </uni-list-item>
        </uni-list>
        <u-empty v-else mode="data" text="暂无数据" :icon="empty" width="300" height="244" />
      </view>

      <ty-bubble-popup v-if="showSearchModal">
        <view class="search-list">
          <custom-checkbox
            v-for="item in searchList"
            :key="item.key || item.name"
            v-model="selectedSearch"
            :value="item.key"
            :label="item.name"
            :show-check="item.showCheck"
            :is-group="true"
          />
          <view class="operate">
            <view class="cancel" @tap="showSearchModal = false">取消</view>
            <view class="confirm" @tap="confirmQuery">确定</view>
          </view>
        </view>
      </ty-bubble-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'

const router = useRouter()
const tabIndex = ref(0)
const showSearchModal = ref(false)
const selectedSearch = ref(['11', '12'])

interface DemoAdvancedSearchData {
  keyword: string
  status: string
  queryTypeList: string[]
}

interface DemoAdvancedSearch {
  data: DemoAdvancedSearchData
  pageNum: number
  pageSize: number
}

const searchList = [
  { name: '客户经理及主管', showCheck: false },
  { name: '查自己', key: '11' },
  { name: '查下级', key: '12' }
]

const search = reactive<DemoAdvancedSearch>({
  data: {
    keyword: '',
    status: '',
    queryTypeList: ['11', '12'] as string[]
  },
  pageNum: 1,
  pageSize: 10
})

const vm = reactive({
  list: [] as Array<{ refcode: number | string; no: string }>,
  tabsList: [
    { name: '全部', value: 0 },
    { name: '已申请', value: 0 }
  ]
})

const searchProjectPage = () => {}
const resetSearch = () => {}

const selectTab = item => {
  tabIndex.value = item.index
  searchProjectPage()
}

const changeSearchType = () => {
  showSearchModal.value = !showSearchModal.value
}

const confirmQuery = () => {
  search.data.queryTypeList = selectedSearch.value
  showSearchModal.value = false
  searchProjectPage()
}

const viewDetail = (refcode: number | string) => {
  router.push(`/demo/detail/${encodeBase64(refcode)}`)
}
</script>
