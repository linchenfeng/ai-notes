<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:35:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-06-19 16:44:04
 * @Description  : 项目-业务查询-贷中查询 /member/project/query/lending
-->
<template>
  <NavBar bg-color="#0022bb" />
  <uni-list>
    <view class="member-project">
      <view class="topView">
        <cover-image class="topViewBg" src="@/assets/member/project/pbg.png"></cover-image>
        <view class="toppClass">
          <view>{{ '项目进度' }}</view>
          <text class="numClass">
            ({{ progressObj.financialAuditTotal + progressObj.financingTotal + progressObj.operationAuditTotal + progressObj.financialLoanTotal }})
          </text>
          <!-- <u-badge
            :absolute="true"
            :value="progressObj.financialAuditTotal + progressObj.financingTotal + progressObj.operationAuditTotal + progressObj.financialLoanTotal"
            :offset="[22, 550]"
            max="999"
          ></u-badge> -->
        </view>
        <view class="uRowClass">
          <u-row>
            <u-col class="alpttClass" span="2.25" @click="toDetail('1')">
              <view class="circleClass">
                <text>{{ progressObj.financingTotal <= 9999 ? progressObj.financingTotal : 9999 }}</text>
              </view>
              <view class="ttTitleClass">待运营受理</view>
            </u-col>
            <u-col class="alpttClass" span="1">
              <view class="imgContainClass">
                <cover-image class="ttimgClass" :src="imagUrl" />
              </view>
            </u-col>
            <u-col class="alpttClass" span="2.25" @click="toDetail('2')">
              <view class="circleClass">
                <text>{{ progressObj.operationAuditTotal <= 9999 ? progressObj.operationAuditTotal : 9999 }}</text>
              </view>
              <view class="ttTitleClass">待运营审核</view>
            </u-col>
            <u-col class="alpttClass" span="1">
              <view class="imgContainClass">
                <cover-image class="ttimgClass" :src="imagUrl" />
              </view>
            </u-col>
            <u-col class="alpttClass" span="2.25" @click="toDetail('3')">
              <view class="circleClass">
                <text>{{ progressObj.financialAuditTotal <= 9999 ? progressObj.financialAuditTotal : 9999 }}</text>
              </view>
              <view class="ttTitleClass">待财务审核</view>
            </u-col>
            <u-col class="alpttClass" span="1">
              <view class="imgContainClass">
                <cover-image class="ttimgClass" :src="imagUrl" />
              </view>
            </u-col>
            <u-col class="alpttClass" span="2.25" @click="toDetail('4')">
              <view class="circleClass">
                <text>{{ progressObj.financialLoanTotal <= 9999 ? progressObj.financialLoanTotal : 9999 }}</text>
              </view>
              <view class="ttTitleClass">财务已放款</view>
            </u-col>
          </u-row>
        </view>
      </view>
      <view v-if="array.length">
        <view class="top-title">
          <text class="span-title">项目情况</text>
          <cover-image :src="isShowList ? bolockRes : listRes" alt="切换" @click="isShowList = !isShowList" />
        </view>
        <view v-if="isShowList">
          <ProjectTable ref="projectTable" :project-list="array" />
        </view>
        <view v-else>
          <ProjectCardList ref="projectCardList" :project-list="array" />
        </view>
        <view v-if="finished" :class="isShowList ? 'show-card-finished' : 'show-list-finished'" class="list-is-finished">已经到底了</view>
      </view>
      <!-- <u-empty v-else :image="empty" :image-size="[164, 130]" description="暂无数据" /> -->
      <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
    </view>
  </uni-list>
  <!-- <Tabbar /> -->
</template>
<script lang="ts">
export default {
  name: 'Project',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
// import Tabbar from '@/layout/Tabbar.vue'
import NavBar from '@/layout/NavBar.vue'
import listRes from '@/assets/member/project/content-color.png'
import bolockRes from '@/assets/member/project//more-color.png'
import ProjectCardList from './components/ProjectCardList.vue'
import empty from '@/assets/empty/empty.png'
import ProjectTable from './components/ProjectTableList.vue'
import imagUrl from '@/assets/member/project/line.png'
import { Project } from '@/interfaces/member/project'
import dayjs from 'dayjs'
import apiProject from '@/api/member/api.project'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const projectTable = ref()
const projectCardList = ref()
let totalCount = 0 //总条数
let obj = {
  data: {},
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
}
let progressObj = reactive({
  financingTotal: 0,
  operationAuditTotal: 0,
  financialAuditTotal: 0,
  financialLoanTotal: 0
})

//展示列表还是选项夹，false为选项夹
let isShowList = ref(true)
let array: Array<Project> = reactive([])
let cuccrentYear = String(dayjs().year())

/**
 * @Author: ran.zhu
 * @Date: 2022-10-17 13:59:37
 * @param {*} void
 * @return {*}
 * @description: 获取项目详情列表接口
 */
const getListAPI = (): void => {
  apiProject.findProjectPage(obj).then(
    res => {
      totalCount = res.totalCount as number
      refreshing.value = false
      loading.value = false
      let list: Array<Project> = res.data.floaArpMVoList
      if (obj.pageNum === 1) {
        totalCount = Number(res.totalCount)
        array.length = 0
        // array = res.data.floaArpMVoList
      }
      for (let item of list) {
        let a = Object.assign(item, {
          year: item.dateList.length === 0 ? cuccrentYear : item.dateList[0].year,
          total: item.dateList.length === 0 ? 0 : item.dateList[0].countTotal
        })
        array.push(a)
      }
      if (totalCount === array.length && totalCount > 0) {
        finished.value = true
      }
      nextTick(() => {
        // 解决获取更多数据页面不刷新
        if (isShowList.value && projectTable.value) {
          projectTable.value.changeArray(list)
        } else if (projectCardList.value) {
          projectCardList.value.changeArray(list)
        }
      })
    },
    () => {
      refreshing.value = false
    }
  )
}
let router = useRouter()
/**
 * @Author: longcan.Yang
 * @Date: 2023-07-28 17:20:51
 * @param {*} approveStatus 审批进度
 * @description: 点击状态进入项目信息
 */
const toDetail = (approveStatus): void => {
  router.push(`/member/project/query/lending/detail/${encodeBase64('0')}/${encodeBase64('0')}/${encodeBase64('0')}/${encodeBase64(approveStatus)}`)
}
onReachBottom(() => {
  loading.value = true
  if (array.length < totalCount) {
    obj.pageNum++
    getListAPI()
  }
})
onPullDownRefresh(() => {
  obj.pageNum = 1
  getListAPI()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  apiProject.getProjectProgressInfo().then(res => {
    progressObj.financingTotal = res.data.financingTotal
    progressObj.operationAuditTotal = res.data.operationAuditTotal
    progressObj.financialAuditTotal = res.data.financialAuditTotal
    progressObj.financialLoanTotal = res.data.financialLoanTotal
  })
  getListAPI()
})
</script>
<style lang="scss" scoped>
.member-project {
  // .show-list-finished {
  //   margin-top: -30rpx;
  // }
  // .show-card-finished {
  //   margin-top: -14rpx;
  // }
  :deep(.u-badge) {
    color: $primary !important;
    font-weight: 100;
    background-color: #ffffff !important;
    padding: 4rpx 12rpx;
  }
  .top-title {
    position: relative;
    top: -20rpx;
    border-radius: 20rpx 20rpx 0 0;
    left: 0;
    right: 0;
    background: white;
    // padding: 20rpx 30rpx 0;

    padding: 42rpx 30rpx 22rpx 30rpx;
    display: flex;
    flex-direction: row;

    span {
      font-size: 28rpx;
      font-weight: bold;
      text-align: left;
      line-height: 28rpx;
      flex: 1;
    }
    cover-image {
      position: absolute;
      right: 30rpx;
      top: 50rpx;
      width: 28rpx;
      height: 28rpx;
    }
  }

  .topView {
    position: relative;
    .topViewBg {
      position: absolute;
      width: 100%;
      height: 320rpx;
      z-index: -5;
      left: 0;
      top: -2rpx;
    }
    // background: url(@/assets/member/project/pbg.png) #dbe8f4 no-repeat top center;
    // background-size: 100% 320rpx;
    min-height: 320rpx;
    height: 320rpx;
    text-align: center;
    padding: 0 30rpx;
    .toppClass {
      display: flex;
      color: white;
      font-size: 28rpx;
      line-height: 44rpx;
      padding: 35rpx 0rpx;
      text-align: left;
      font-weight: bold;
      .numClass {
        color: rgba(255, 255, 255, 0.8);
      }
      /* 添加这段样式后，Primary Button 会变成红色 */
      :root {
        --u-badge-color: red;
        --u-badge-background-color: var(--u-danger-color);
      }
    }
  }
  .uRowClass {
    :deep(.u-row) {
      height: 230rpx;
      align-items: inherit !important;
      .u-col {
        // height: 140rpx;
        overflow: visible;
        .imgContainClass {
          height: 130rpx;
          width: 100%;
          .ttimgClass {
            margin-top: 40rpx;
            width: 100%;
            height: 5rpx;
          }
        }

        .ttTitleClass {
          white-space: nowrap;
          font-size: 28rpx;
          width: 100rpx;
          height: 35rpx;
          color: white;
          margin-top: 20rpx;
          margin-left: -10rpx;
        }
        .circleClass {
          display: flex;
          align-items: center;
          justify-content: center;
          background: url(@/assets/member/project/circle.png) no-repeat top center;
          background-size: 100rpx 100rpx;
          min-height: 100rpx;
          p {
            color: $primary;
            font-size: 30rpx;
          }
        }
      }
    }
  }
}
</style>
