<!--
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 09:58:59
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:58:10
 * @Description  : 签约详情 /member/customer/signProcess/detail
-->
<template>
  <NavBar />
  <view class="box">
    <view class="search-box">
      <u-search
        v-model="search.data.secOrgnames"
        shape="round"
        :search-icon-size="0"
        :show-action="false"
        placeholder-color="#999"
        clearable
        placeholder="请输入签署方名称"
        :action-style="{ color: '#395fee' }"
        @search="onSearch"
        @custom="onSearch"
      />
    </view>
    <view class="head-container">
      <view class="title">{{ detail.orgname }}</view>
      <view class="signInfo">
        <view>
          <text class="schedule">签约进度：</text>
          <text class="scheduleValue">{{ queryType === 'A' ? '待签约' : '已签约' }}</text>
        </view>
        <view>
          <text class="number">{{ totalCount }}</text>
          <text class="danWei">笔</text>
        </view>
      </view>
    </view>
    <uni-list>
      <uni-list-item v-for="item in detail.vtsignFcnMVoList" :key="item.refcode">
        <view @click="preview(item.contFileUuid)">
          <u-cell-group inset>
            <view class="subtitle">
              <u-cell :title="item.contName" :stop="false" :required="true" />
            </view>
            <view class="item-title">
              <u-cell title="日期" :value="queryType === 'A' ? dateFormat(item.contStartTime) : dateFormat(item.contEndTime)" />
            </view>
            <view class="item-title">
              <u-cell title="签署方" :stop="false">
                <template #value>
                  <view class="u-cell__value">
                    <view v-for="(name, i) in item.secOrgnamesList" :key="i">{{ name }}</view>
                  </view>
                </template>
              </u-cell>
            </view>
          </u-cell-group>
        </view>
      </uni-list-item>
    </uni-list>
    <FilePreviewVue v-if="showPreview" :file-uuid="previewUuid" @close-dialog="showPreview = false"></FilePreviewVue>
  </view>
</template>
<script lang="ts">
export default {
  name: 'SignDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import apiCustormer from '@/api/member/api.custormer'
// import noSignPic from '@/assets/member/customer/noSign.png'
// import signedPic from '@/assets/member/customer/signed.png'
import { SignDetail, SignListItem } from '@/interfaces/member/customer/signProcess'
import { decodeBase64 } from '@/utils/crypto'
import { dateFormat } from '@/utils/format'
import FilePreviewVue from '@/plugins/filePreview/index.vue'
import { useRoute } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
let detail: SignDetail = reactive({ orgname: '', vtsignFcnMVoList: [] })
/**
 * 合同file-uuid
 */
const previewUuid = ref('')
/**
 * 文件预览标识
 */
const showPreview = ref(false)
/**
 * @Author: may.ruan
 * @Date: 2023-03-30 18:23:50
 * @param {*} fileUuid 合同uuid
 * @description: 合同预览
 */
const preview = (fileUuid: string): void => {
  // 防止没有uuid导致showPreview状态异常
  if (!fileUuid) {
    return
  }
  previewUuid.value = fileUuid
  showPreview.value = true
}
/**
 *加载状态
 */
const loading = ref(false)
let totalCount = ref(0)
/**
 *所有据全部加载完全
 */
const finished = ref(false)
let route = useRoute()
let refcode = Number(decodeBase64(String(route.value.params.refcode)))
/**
 **查询类型[A=待签约/B=完成签约]
 */
let queryType = String(decodeBase64(String(route.value.params.queryType)))

let search = reactive({
  data: {
    secOrgnames: '' // 企业名称
  }
})

let postData = {
  data: {
    refcode: refcode,
    queryType: queryType,
    secOrgnames: ''
  },
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
}

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 09:45:27
 * @param {*} val
 * @return {*}
 * @description: 输入企业名称搜索
 */
const onSearch = val => {
  postData.data.secOrgnames = search.data.secOrgnames
  postData.pageNum = 1 // 搜索时初始化页码
  finished.value = false
  detail.vtsignFcnMVoList = []
  loadData()
}

/**
 * @Author: jacky.cai
 * @Date: 2022-10-17 12:16:45
 * @return {*}
 * @description: 加载数据
 */

const loadData = () => {
  apiCustormer.findCustomSignDetailsPage(postData).then(
    res => {
      loading.value = false
      let list: Array<SignListItem> = res.data.vtsignFcnMVoList
      list.forEach(item => {
        if (item.secOrgnames) {
          item.secOrgnamesList = item.secOrgnames.split(',')
        }
      })
      detail.orgname = res.data.orgname
      if (postData.pageNum === 1) {
        totalCount.value = Number(res.totalCount)
        detail.vtsignFcnMVoList = list
      } else {
        for (let item of list) {
          detail.vtsignFcnMVoList.push(item)
        }
      }
      if (detail.vtsignFcnMVoList.length === totalCount.value && totalCount.value > 0) {
        finished.value = true
      }
    },
    () => {
      loading.value = false
    }
  )
}

onMounted(() => {
  loadData()
})

/**
 * @Author: jacky.cai
 * @Date: 2022-10-17 09:43:40
 * @param {*} void
 * @return {*}
 * @description: 上滑加载更多数据
 */
onReachBottom(() => {
  if (detail.vtsignFcnMVoList.length < totalCount.value) {
    postData.pageNum++
    loading.value = true
    loadData()
  }
})
</script>
<style lang="scss" scoped>
.box {
  .search-box {
    border-bottom: 1rpx solid $border-color;
  }
  .head-container {
    padding: $spaced;
    border-bottom: 2rpx solid #dedede;
    .title {
      font-size: 32rpx;
      text-align: left;
      margin-bottom: 20rpx;
    }
    .signInfo {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 28rpx;
      .schedule,
      .danWei {
        color: $remark-color;
      }
      .scheduleValue {
        color: #1a89f2;
      }
      .number {
        font-size: 48rpx;
        padding: 5rpx;
      }
    }
  }
  :deep(.u-cell-group) {
    border-bottom: 1px solid #ebedf0;
    .subtitle .u-cell__body__content {
      width: 90%;
    }
    .item-title .u-cell__body__content {
      width: 30%;
    }
  }
}
</style>
