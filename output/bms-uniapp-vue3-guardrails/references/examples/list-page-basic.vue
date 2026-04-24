<!--
 * @Description  : 精简示例-基础列表页
 * @ExampleFrom  : member/project/apply/quota/index.vue
-->
<template>
  <view>
    <NavBar />
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
        <view class="head-tabs" :class="`selectTab${tabIndex}`">
          <view class="tabs-line"></view>
          <u-tabs
            :list="vm.tabsList"
            line-color="#138BEC"
            :active-style="{ color: '#138BEC', fontSize: '32rpx' }"
            :inactive-style="{ color: '#666666', fontSize: '28rpx' }"
            line-width="50"
            line-height="4"
            @click="selectTab"
          />
        </view>
      </up-sticky>

      <view class="content">
        <uni-list v-if="vm.list.length">
          <uni-list-item v-for="item in vm.list" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData" :border="false">
              <view class="header-row">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.title }}</view>
                  </u-col>
                  <u-col :span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.status}`">{{ getValueByKey(item.status, 'demoStatus') }}</view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请日期" :value="item.applyDate ? dateFormat(item.applyDate, 1) : ''" :border="false" />
              <u-cell :stop="false" title="客户名称" :value="item.title" :border="false" />
              <u-cell :stop="false" title="业务产品" :value="getProduceType(item.bizScene, item.productType)" :border="false" />
              <u-cell :stop="false" title="申请金额(元)" :value="moneyFormat(item.applyAmt)" :border="false" />
              <u-cell :stop="false" title="币种" :value="getValueByKey(item.ccyid, 'applyCcyid') ? getValueByKey(item.ccyid, 'applyCcyid') : item.ccyid" :border="false" />
            </u-cell-group>
            <view class="line"></view>
          </uni-list-item>
          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" text="暂无数据" :icon="empty" width="300" height="244" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import empty from '@/assets/empty/empty.png'
import { onReachBottom, onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { dateFormat, moneyFormat } from '@/utils/format'
import apiDemo from '@/api/demo/api.list'
import { DemoListItem, DemoSearch } from '@/interfaces/demo/list'

const router = useRouter()
const finished = ref(false)
const tabIndex = ref(0)
const totalCount = ref(0)

const search = reactive<DemoSearch>({
  data: {
    keyword: '',
    status: '0'
  },
  pageNum: 1,
  pageSize: 10
})

const vm = reactive({
  list: [] as DemoListItem[],
  tabsList: [{ name: '待处理' }, { name: '已处理' }]
})

const getListCount = () => {
  apiDemo.getListCount({ keyword: search.data.keyword }).then(res => {
    vm.tabsList = [{ name: `待处理(${res.data.waitCount})` }, { name: `已处理(${res.data.doneCount})` }]
  })
}

const findListPage = () => {
  apiDemo.findListPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.list?.length) {
      vm.list.push(...res.data.list)
    }
    if (totalCount.value === vm.list.length && totalCount.value > 0) {
      finished.value = true
    }
    getListCount()
  })
}

const searchProjectPage = () => {
  vm.list = []
  search.pageNum = 1
  finished.value = false
  findListPage()
}

const resetSearch = () => {
  search.data.keyword = ''
  searchProjectPage()
}

const selectTab = item => {
  tabIndex.value = item.index
  search.data.status = item.index === 0 ? '0' : '1'
  searchProjectPage()
}

const viewDetail = (refcode: number | string) => {
  router.push(`/demo/detail/${encodeBase64(refcode)}`)
}

const getProduceType = (bizScene: string, productType: string) => {
  const bizSceneName = getValueByKey(bizScene, 'intBizScene')
  return bizSceneName ? `${bizSceneName}-${productType}` : productType
}

onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findListPage()
  }
})

onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})

onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.page-list {
  .search-box {
    padding-bottom: 0;
  }

  :deep(.u-sticky) {
    top: 44px !important;
  }

  .head-tabs {
    margin-top: 10rpx;
    position: relative;

    .tabs-line {
      position: absolute;
      width: 100%;
      height: 1rpx;
      background-color: #dedede;
      bottom: 4rpx;
    }
  }

  .line {
    margin-top: 20rpx;
    width: 100%;
    height: 20rpx;
    background: #f6f6f6;
  }

  :deep(.listData) {
    .header-row {
      margin-bottom: 20rpx;

      .u-row {
        .text {
          font-size: 32rpx;
          font-weight: bold;
        }

        .status-box {
          display: flex;
          justify-content: flex-end;

          .status {
            border: 1rpx solid $warning;
            color: $warning;
            border-radius: 5rpx;
            padding: 10rpx 16rpx;
            text-align: center;
            font-size: 26rpx;

            &.status1 {
              border-color: $u-success;
              color: $u-success;
            }

            &.status2,
            &.status3 {
              border-color: $danger;
              color: $danger;
            }
          }
        }
      }
    }
  }
}
</style>
