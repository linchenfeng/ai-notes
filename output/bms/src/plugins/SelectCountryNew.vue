<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-29 13:46:38
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:58:47
 * @Description  : 选择国家，支持双向联动
-->
<template>
  <view class="select-country-class">
    <view class="select-navbar">
      <u-navbar placeholder bg-color="#395Fee">
        <template #left>
          <view class="u-nav-slot" @click="back">
            <u-icon name="arrow-left" color="#fff" size="36"></u-icon>
          </view>
        </template>
        <template #center>
          <text class="nav-bar-title">{{ props.title }}</text>
        </template>
        <template v-if="props.isCheckWhiteList" #right>
          <view class="u-nav-slot" @click="changeShowWhiteList">
            <text class="iconfont" :class="showWhiteList ? 'icon-baimingdantongji' : 'icon-classquanbufenlei'"></text>
            <text class="change-name">{{ showWhiteList ? '白名单' : '全部' }}</text>
          </view>
        </template>
      </u-navbar>
      <view>
        <view class="search-box">
          <u-search
            v-model="searchValue"
            v-insert-clear:[searchValue]="clearSearch"
            :clearabled="false"
            :search-icon-size="0"
            placeholder="请输入搜索关键词"
            :action-style="{ color: '#395fee' }"
            @search="search"
            @custom="search"
          ></u-search>
        </view>
      </view>
      <view v-if="selectCountryList.data.length">
        <next-indexed-xlist
          :is-check-white-list="props.isCheckWhiteList"
          :data-list="selectCountryList.data"
          :name-key="'text'"
          :show-avatar="false"
          :id-key="'code'"
          @itemclick="clickItem"
        ></next-indexed-xlist>
      </view>
      <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
    </view>
    <ty-bubble-popup v-if="showSearchModal">
      <view v-for="(obj, index) in searchList" :key="index" class="item" @click="queryBytype(obj.key)">
        <view class="item-icon">
          <i :class="obj.icon" class="iconfont"></i>
        </view>
        <view class="item-name">{{ obj.name }}</view>
      </view>
    </ty-bubble-popup>
  </view>
</template>

<script setup lang="ts">
import { showToast } from '@/utils/uniapp/toast'
import empty from '@/assets/empty/empty.png'
const emits = defineEmits(['back', 'click-fun'])
const searchValue = ref('') // 搜索值
let showSearchModal = ref(false)
type ListType = {
  [key: string]: string | number
}
type PropsType = {
  /**
   * 	标题
   */
  title?: string
  /**
   * 	数据集合
   */
  data: Array<ListType> | object
  /**
   * 是否校验白名单
   */
  isCheckWhiteList?: boolean
  // eslint-disable-next-line no-unused-vars
  searchFun: (val: string, isCheckWhiteList: boolean) => Promise<Array<ListType>>
}
const props = withDefaults(defineProps<PropsType>(), {
  title: '标题',
  data: () => [],
  isCheckWhiteList: false
})
const searchList = [
  { name: '全部', icon: 'icon-classquanbufenlei', key: false },
  { name: '白名单', icon: 'icon-baimingdantongji', key: true }
]
let selectCountryList = reactive({
  data: Array<ListType>()
})
let showWhiteList = ref(false)
const clickItem = (val: ListType) => {
  if (val.ctyFlag === '2' && props.isCheckWhiteList) {
    showToast('该国家/地区暂不可选择')
    return
  }
  emits('click-fun', val)
}
const back = () => {
  emits('back')
}

const search = (val: string) => {
  props.searchFun(val, showWhiteList.value).then((data: Array<ListType>) => {
    selectCountryList.data = [...data]
  })
}
// 清空
const clearSearch = () => {
  searchValue.value = ''
  search('')
}
const changeShowWhiteList = () => {
  showSearchModal.value = !showSearchModal.value
}
const queryBytype = (key: boolean) => {
  showWhiteList.value = key
  searchValue.value = ''
  showSearchModal.value = false
  let dom = document.querySelector('.search-box .uni-input-input') as HTMLTextAreaElement
  if (dom) {
    dom.focus()
  }
  props.searchFun(searchValue.value, showWhiteList.value).then((data: Array<ListType>) => {
    selectCountryList.data = [...data]
  })
}
const handlePopState = (event: PopStateEvent) => {
  // 阻止默认返回行为
  event.preventDefault()
  emits('back')
}
onUnmounted(() => {
  if (window.history) {
    window.removeEventListener('popstate', handlePopState)
    // 检查当前状态是否是我们插入的记录
    if (history.state?.isCountrySelect) {
      history.go(-1) // 移除插入的历史记录
    }
  }
})
onMounted(() => {
  selectCountryList.data = props.data as Array<ListType>
  // 添加浏览器历史记录监听
  if (window.history) {
    // 插入一条新历史记录并标记
    history.pushState({ isCountrySelect: true }, '')
    // 监听浏览器返回事件
    window.addEventListener('popstate', handlePopState)
  }
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
        background-color: #0022bb;
      }
      .u-nav-slot {
        display: flex;
        //  color: #138bec;
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
  .search-box {
    border-bottom: 1rpx solid $border-color;
    position: relative;
    :deep(.u-search__content__close) {
      display: none !important;
    }
    .iconfont-box {
      position: absolute;
      top: 42rpx;
      right: 45rpx;
      .iconfont {
        color: #c6c7cb;
        font-size: 32rpx;
      }
    }
  }
  :deep(.next-search) {
    display: none !important;
  }
  :deep(.next-scroll-left) {
    padding-top: 0;
  }
  :deep(.next-list) {
    height: calc(100vh - 206rpx);
  }
  :deep(.left-item-title) {
    padding-left: 30rpx !important;
  }
  :deep(.next-scroll-right-name) {
    margin-top: 10rpx !important;
  }
  :deep(.left-item-card) {
    border-bottom: 1px solid #f4f4f4;
    padding-left: 30rpx;
    .left-item-card-info {
      margin-left: 0 !important;
    }
  }
}
.iconfont {
  font-size: 16px;
  color: #fff;
}
.change-name {
  margin-left: 8rpx;
  color: #fff;
}
.nav-bar-title {
  color: #fff;
}
</style>
