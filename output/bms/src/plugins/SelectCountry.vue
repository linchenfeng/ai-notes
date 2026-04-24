<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-24 16:29:43
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:59:35
 * @Description  : 选择国家
-->
<template>
  <view class="select-country-class">
    <view class="select-navbar">
      <u-navbar bg-color="#fff" placeholder>
        <template #left>
          <view class="u-nav-slot" @click="back">
            <u-icon name="arrow-left" color="#138bec" size="36"></u-icon>
            <text>返回</text>
          </view>
        </template>
        <template #center>
          <text class="nav-bar-title">{{ props.title }}</text>
        </template>
      </u-navbar>
    </view>

    <view class="content">
      <view class="search-box">
        <u-search
          v-model="searchValue"
          :search-icon-size="0"
          placeholder="请输入搜索关键词"
          :action-style="{ color: '#395fee' }"
          @search="search"
          @custom="search"
          @focus="showMask = true"
        ></u-search>
      </view>
      <view v-if="currentType === 'list'">
        <scroll-view v-if="listData.data.length" class="list-wrap" scroll-y="true" scroll-with-animation="true">
          <view v-for="item in listData.data" :key="new Date().getTime() + (item.code as string)" class="list-item" @click="clickItem(item)">
            {{ item.text }}
          </view>
          <view class="list-item list-is-finished">已经到底了</view>
        </scroll-view>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
      <view v-if="showMask" class="mask" @click="showMask = false"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import empty from '@/assets/empty/empty.png'
// import { useRouter } from '@/uni-simple-router'
// eslint-disable-next-line no-undef
const emits = defineEmits(['back', 'click-fun'])
// const router = useRouter()
const showMask = ref(false) // 搜索蒙版标识
const searchValue = ref('') // 搜索值
type ListType = {
  [key: string]: string | number
}
type PropsType = {
  /**
   * 	展示类型  list | indexBar
   */
  type?: string
  /**
   * 是否允许创建条目
   */
  allowCreate?: boolean
  /**
   * 	标题
   */
  title?: string
  /**
   * 	数据集合
   */
  data: Array<ListType> | object
  /**
   * 	查询方法
   */
  // eslint-disable-next-line no-unused-vars
  searchFun: (val: string) => Promise<Array<ListType>>
}
const props = withDefaults(defineProps<PropsType>(), {
  type: 'indexBar',
  title: '标题',
  allowCreate: false,
  data: () => []
})
const currentType = ref(props.type)
let listData = reactive({
  data: Array<ListType>()
})
const search = (val: string) => {
  props.searchFun(val).then((data: Array<ListType>) => {
    currentType.value = 'list'

    // 创建条目
    let tempList: Array<ListType> = []
    if (props.allowCreate) {
      const temp = data.find(item => item.text === val)
      if (!temp) {
        tempList.push({
          cnapsCode: '',
          code: -1,
          text: val
        })
      }
    }

    listData.data = [...tempList, ...data]
    showMask.value = false
  })
}
const back = () => {
  emits('back')

  // return false
}
const clickItem = (val: string | ListType) => {
  emits('click-fun', val)
  // router.back(-1)
  // router.go(-1)
}
onMounted(() => {
  // if (props.type === 'indexBar') {
  //   indexBarData = props.data as IndexBarType
  //   indexList.value = Object.keys(props.data as object)
  // } else
  if (props.type === 'list') {
    listData.data = props.data as Array<ListType>
  }

  // if (window.history) {
  //   history.pushState(null, '分类选择', document.URL)
  //   window.addEventListener('popstate', back, false)
  // }
})
</script>

<style lang="scss" scoped>
.select-country-class {
  width: 100vw;
  height: 100vh;
  .select-navbar {
    :deep(.u-navbar) {
      .u-navbar__placeholder {
        height: 44px !important;
        // background-color: #0022bb;
      }
      .u-nav-slot {
        display: flex;
        color: #138bec;
        align-items: center;
        font-size: 28rpx;
        line-height: 36rpx;
      }
      .u-status-bar {
        display: none;
      }
      .u-navbar__content__right .u-icon__icon {
        font-size: 36rpx !important;
      }
    }
  }
  .content :deep() {
    .search-box {
      border-bottom: 1rpx solid $border-color;
    }
    // .u-search {
    //   padding: 20rpx 0 20rpx 24rpx;
    //   .u-search__content {
    //     height: 68rpx;
    //     border-radius: 10rpx !important;
    //     background-color: #eee !important;
    //     .u-search__content__input {
    //       line-height: 48rpx;
    //     }
    //     .u-search__content__input {
    //       background-color: #eee !important;
    //     }
    //     .uicon-search {
    //       font-size: 32rpx !important;
    //     }
    //   }
    //   .u-search__action {
    //     display: none;
    //   }
    // }

    .u-cell {
      .u-cell__body {
        padding: 11rpx 30rpx;
      }
      // border-bottom: 1rpx solid rgba(50, 50, 51, 0.1);

      .u-cell__title-text {
        font-size: 28rpx;
        color: $sub-color;
      }
    }
  }

  .content {
    // height: calc(100vh - 88rpx);
    overflow: hidden;
    .indexBar-wrap,
    .list-wrap {
      height: calc(100vh - 200rpx);
      // overflow: auto;
    }
    .list-item {
      padding: 0 30rpx;
      height: 68rpx;
      line-height: 68rpx;
      font-size: 28rpx;
      color: $sub-color;
      border-bottom: 1rpx solid rgba(50, 50, 51, 0.1);
      &.list-is-finished {
        font-size: 24rpx;
        border: none;
        color: $remark-color;
      }
    }
    .search-wrap {
      position: relative;
      width: 100vw;
      height: 110rpx;
      background-color: #fff;
      z-index: 2101;
      display: flex;
      align-items: center;
      .link {
        font-size: 28rpx;
        color: #138bec;
        margin: 0 10rpx;
      }
    }

    .mask {
      position: absolute;
      top: 208rpx;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
:deep(.u-empty) {
  height: auto;
}
</style>
