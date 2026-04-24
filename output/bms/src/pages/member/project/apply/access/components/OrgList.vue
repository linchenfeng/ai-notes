<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-29 13:46:38
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-25 15:16:07
 * @Description  : 选择买方
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
      </u-navbar>
      <view>
        <view class="search-box">
          <u-search
            v-model="searchValue"
            v-insert-clear:[searchValue]="clearSearch"
            :clearabled="false"
            :search-icon-size="0"
            :placeholder="props.placeholder"
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
          :name-key="props.nameKey"
          :show-avatar="false"
          :id-key="props.idKey"
          @itemclick="clickItem"
        ></next-indexed-xlist>
      </view>
      <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
    </view>
  </view>
</template>
<script setup lang="ts">
import empty from '@/assets/empty/empty.png'
const emits = defineEmits(['back', 'click-fun'])
const searchValue = ref('') // 搜索值
type OrgListType = {
  orgname: string
  ctyDesc?: string
  orgctyid?: string
}
type PropsType = {
  nameKey?: string
  idKey?: string
  /**
   * 	标题
   */
  title?: string
  /**
   * 	数据集合
   */
  data: Array<OrgListType> | object
  /**
   * 是否校验白名单
   */
  isCheckWhiteList?: boolean
  // eslint-disable-next-line no-unused-vars
  searchFun: (val: string) => Promise<Array<OrgListType>>
  /**
   * 输入框占位符
   */
  placeholder: string
}
const props = withDefaults(defineProps<PropsType>(), {
  title: '标题',
  data: () => [],
  isCheckWhiteList: false,
  nameKey: 'text',
  idKey: 'code',
  placeholder: '请输入卖方企业名称'
})

let selectCountryList = reactive({
  data: Array<OrgListType>()
})
const clickItem = (val: OrgListType) => {
  emits('click-fun', val)
}
const back = () => {
  emits('back')
}

const search = (val: string) => {
  props.searchFun(val).then((data: Array<OrgListType>) => {
    selectCountryList.data = data
  })
}
// 清空
const clearSearch = () => {
  searchValue.value = ''
  search('')
}
onMounted(() => {
  selectCountryList.data = props.data as Array<OrgListType>
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
