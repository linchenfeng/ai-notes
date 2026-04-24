<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-01 13:06:45
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-07 14:39:49
 * @Description  : 项目-业务申请-特批申请-店铺信息(申请、确认选择店铺) /member/project/apply/special/shopSelect/:orgname/:identity/:refcode
-->
<template>
  <NavBar />
  <view v-if="vm.shopList && vm.shopList.length" class="title">待准入店铺</view>
  <template v-if="vm.shopList && vm.shopList.length">
    <ty-info-card v-for="(item, i) in vm.shopList" :key="item.sellingPartnerId" :show-line="i !== 0">
      <view class="item-box">
        <view class="left-box">
          <up-checkbox-group v-model="item.checked" size="30" @change="changeChecked(item, i, 'parent')">
            <up-checkbox name="1" shape="circle"></up-checkbox>
          </up-checkbox-group>
        </view>
        <view class="right-box">
          <view class="line-item">
            <view class="line-title" @click="clickChecked(item, i, 'parent')">店铺名称</view>
            <view class="line-content">{{ item.shopName }}</view>
          </view>
          <view class="line-item">
            <view class="line-title">店铺ID</view>
            <view class="line-content">{{ item.sellingPartnerId }}</view>
          </view>
          <view class="child-box">
            <view v-for="(subItem, j) in item.floaShopSubMList" :key="j" class="child-item">
              <view class="child-left-box">
                <up-checkbox-group v-model="subItem.checked" size="30" @change="changeChecked(item, j, 'child')">
                  <up-checkbox name="1" shape="circle"></up-checkbox>
                </up-checkbox-group>
              </view>
              <view class="child-right-box">
                <view class="line-item">
                  <view class="line-title child-title" @click="clickChecked(item, j, 'child', subItem)">店铺所在国家</view>
                  <view class="line-content">{{ subItem.shopCountry }}</view>
                </view>
                <view class="line-item">
                  <view class="line-title child-title">不准入原因</view>
                  <view class="line-content">
                    <!-- {{ subItem.notRatifyRemark }} -->
                    <view v-for="(remark, index) in subItem.notRatifyRemarkList" :key="index">
                      <view v-if="remark" class="remark">{{ `${index + 1}.` + remark }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </ty-info-card>
  </template>
  <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  <view v-if="vm.shopList && vm.shopList.length" class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <up-checkbox-group v-model="vm.isCheckedAll" size="30" @change="checkAll()">
        <up-checkbox name="1" shape="circle" label="全选" label-size="14px" label-color="#333"></up-checkbox>
      </up-checkbox-group>
      <view class="count-box">
        <view>
          <text>已选中</text>
          <text class="error">{{ selectCount }}</text>
          <text>笔</text>
        </view>
        <view>
          <text>共计</text>
          <text class="error">{{ allCount }}</text>
          <text>笔</text>
        </view>
      </view>
      <u-button block type="primary" native-type="submit" @click="onSubmit">确定</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { showToast } from '@/utils/uniapp/toast'
import { setStorage, getStorage } from '@/utils/storages'
import { useRouter, useRoute } from '@/uni-simple-router'
import apiSpecialApproval from '@/api/member/project/apply/api.specialApproval'
import { decodeBase64 } from '@/utils/crypto'
import { ShopList } from '@/interfaces/member/project/apply/specialApproval'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import empty from '@/assets/empty/empty.png'
const router = useRouter()
const route = useRoute()
let refcode = '' // 流水号
let identity = '' // 身份【apply=申请/audit=审批】
let orgname = '' // 客户名称
let isCheckedAll: Array<string> = []
let allCount = ref(0) // 总条数
let selectCount = ref(0) // 已选中条数
let shopList: ShopList[] = []
let selectList: ShopList[] = []
let vm = reactive({
  isCheckedAll: isCheckedAll,
  shopList: shopList,
  selectList: selectList
})

// 计算选中的笔数
const countNumber = () => {
  selectCount.value = 0
  vm.shopList.forEach(item => {
    if (item.floaShopSubMList) {
      item.floaShopSubMList.forEach(subItem => {
        if (subItem.checked?.length) {
          selectCount.value++
        }
      })
    }
  })
}

// 选择店铺、站点
const changeChecked = (item: ShopList, index, type) => {
  nextTick(() => {
    if (type === 'parent') {
      const isChecked = item.checked?.length
      // 勾选/取消勾选所有站点
      item.floaShopSubMList.forEach(countryItem => {
        countryItem.checked = isChecked ? ['1'] : []
      })
    } else if (type === 'child') {
      const childChecked = item.floaShopSubMList[index].checked?.length
      if (childChecked && !item.checked?.length) {
        // 勾选子级时自动勾选父级
        item.checked = ['1']
      } else {
        // 取消勾选父级如果所有子级都未被勾选
        const hasAnyChildChecked = item.floaShopSubMList.some(countryItem => countryItem.checked?.length)
        if (!hasAnyChildChecked) {
          item.checked = []
        }
      }
    }
    let hasEmptyChecked = false // 是否存在未选中站点
    for (const obj of vm.shopList) {
      if (obj.checked?.length === 0) {
        hasEmptyChecked = true
        break
      }

      if (obj.floaShopSubMList) {
        for (const countryItem of obj.floaShopSubMList) {
          if (countryItem.checked?.length === 0) {
            hasEmptyChecked = true
            break
          }
        }
        if (hasEmptyChecked) {
          break
        }
      }
    }
    vm.isCheckedAll = hasEmptyChecked ? [] : ['1']
    countNumber()
  })
}
// 点击店铺、站点
const clickChecked = (item: ShopList, index, type, subItem?) => {
  if (type === 'parent') {
    item.checked = item.checked && item.checked.length ? [] : ['1']
  } else {
    subItem.checked = subItem.checked && subItem.checked.length ? [] : ['1']
  }
  changeChecked(item, index, type)
}
// 确定
const onSubmit = () => {
  vm.selectList = []
  vm.shopList.forEach(item => {
    if (item.checked?.length) {
      // 存在选中
      let selectVo: ShopList = { shopName: item.shopName, sellingPartnerId: item.sellingPartnerId, floaShopSubMList: [] }
      if (item.floaShopSubMList) {
        item.floaShopSubMList.forEach(subItem => {
          if (subItem.checked?.length) {
            selectVo.floaShopSubMList.push({ shopCountry: subItem.shopCountry, notRatifyRemark: subItem.notRatifyRemark })
          }
        })
      }
      vm.selectList.push(selectVo)
    }
  })
  if (!vm.selectList.length) {
    showToast('请选择待准入的店铺')
    return
  }
  setStorage('shop-select-list', JSON.stringify(vm.selectList))
  router.back(1)
}
// 全选/全取消
const checkAll = () => {
  nextTick(() => {
    vm.shopList.forEach(item => {
      item.checked = vm.isCheckedAll.length ? ['1'] : []
      if (item.floaShopSubMList) {
        item.floaShopSubMList.forEach(countryItem => {
          countryItem.checked = vm.isCheckedAll.length ? ['1'] : []
        })
      }
    })
    // 全选赋值allCount/全取消赋0
    selectCount.value = vm.isCheckedAll.length ? allCount.value : 0
  })
}
// 初始化回显勾选店铺
const invertSelect = () => {
  if (!vm.shopList.length) {
    return
  }
  selectCount.value = 0
  // 构建已选中的店铺国家对
  const selectedMap = new Map()
  vm.selectList.forEach(selectItem => {
    if (selectItem.floaShopSubMList) {
      selectItem.floaShopSubMList.forEach(selectCountryItem => {
        const key = `${selectItem.sellingPartnerId}-${selectCountryItem.shopCountry}`
        selectedMap.set(key, true)
      })
    }
  })
  let totalCount = 0
  let hasEmptyChecked = false // 是否存在空选
  vm.shopList.forEach(item => {
    let hasChildChecked = false
    if (item.floaShopSubMList) {
      totalCount += item.floaShopSubMList.length
      item.floaShopSubMList.forEach(countryItem => {
        const key = `${item.sellingPartnerId}-${countryItem.shopCountry}`
        const isSelected = selectedMap.has(key)
        countryItem.checked = isSelected ? ['1'] : []
        if (isSelected) {
          hasChildChecked = true
          selectCount.value = selectCount.value + 1
        } else {
          hasEmptyChecked = true
        }
        if (countryItem.notRatifyRemark) {
          countryItem.notRatifyRemarkList = countryItem.notRatifyRemark.split(';')
        }
      })
    }
    if (hasChildChecked) {
      // 站点有一个选中则勾选店铺
      item.checked = ['1']
    }
  })
  vm.isCheckedAll = hasEmptyChecked ? [] : ['1']
  allCount.value = totalCount
}
// 获取总店铺信息
const listShopInfo = () => {
  const data = {
    orgname
  }
  apiSpecialApproval.listShopInfo(data).then(res => {
    vm.shopList = res.data.shopList || []
    invertSelect()
  })
}
// 获取客户经理勾选的店铺信息
const getSpecialAppInfo = () => {
  const data = {
    refcode
  }
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    vm.shopList = res.data.saaVo.shopList
    invertSelect()
  })
}

onMounted(() => {
  const storageData = getStorage('shop-select-list')
  if (storageData) {
    // 确保 storageData 是字符串再解析
    const parsedData = JSON.parse(storageData as string) as ShopList[]
    vm.selectList = parsedData
  }
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) // 流水号
    identity = decodeBase64(route.value.params.identity) // 身份
    orgname = decodeBase64(route.value.params.orgname) // 客户名称
    if (identity === 'apply') {
      // 客户经理申请、获取跨境总池子
      listShopInfo()
    } else {
      // 审批确认，获取客户经理选中的池子
      getSpecialAppInfo()
    }
  }
})
</script>

<style lang="scss" scoped>
.title {
  padding: 46rpx 0 16rpx 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}
.item-box {
  display: flex;
  .right-box {
    width: 100%;
    padding-bottom: 10rpx;
    .line-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 34rpx;
      line-height: 44rpx;
      .line-title {
        color: #666;
        flex: none;
        margin-right: 16rpx;
      }
      .line-content {
        word-break: break-all;
        .remark {
          margin-bottom: 6rpx;
        }
      }
    }
    .child-box {
      background: #f6fafd;
      border-radius: 5rpx;
      padding: 30rpx 20rpx 0;
      .child-item {
        display: flex;
        margin-bottom: 30rpx;
        border-bottom: 1rpx solid #e6e6e6;
        &:last-of-type {
          border-bottom: none;
        }
        .child-right-box {
          width: 100%;
          .line-item {
            justify-content: start;
            .child-title {
              width: 180rpx;
              margin-right: 10rpx;
              flex: none;
            }
          }
        }
      }
    }
  }
}
:deep(.u-checkbox-group) {
  flex-flow: row;
  .u-checkbox {
    margin: 0;
    .u-icon__icon {
      font-size: 24rpx !important;
    }
    .u-checkbox__icon-wrap {
      margin: 6rpx 14rpx 0 0;
    }
  }
}

.button-fixed-bottom {
  .count-box {
    flex: none;
    font-size: 28rpx;
    min-width: 180rpx;
    color: #999;
    .error {
      color: $u-error;
      margin: 0 2rpx;
    }
  }
  :deep(.u-checkbox-group) {
    .u-checkbox .u-checkbox__icon-wrap {
      margin-top: -4rpx;
    }
  }
}
</style>
