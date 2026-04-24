<template>
  <view class="next-list">
    <view class="next-search">
      <image class="next-search-img" :src="nextSearchImgSrc"></image>
      <input
        v-model="searchStr"
        class="next-input"
        placeholder="请输入搜索信息"
        maxlength="50"
        placeholder-class="next-placeholder"
        @input="search"
      />
    </view>
    <scroll-view class="next-scroll-left" scroll-y="true" :scroll-with-animation="true" :scroll-into-view="scrollIntoView" @scroll="scrollCallback">
      <view id="TOP"><slot></slot></view>
      <view v-for="(item, index) of scrollLeftObj" :id="index != '#' ? index : 'BOTTOM'" :key="index" class="left-list">
        <view v-if="item && item.length" :id="`item${index}`" :class="{ fixed: index === scrollIntoViewCopy }" class="left-item-title">
          {{ index }}
        </view>
        <view
          v-for="(mess, inx) in item"
          :key="inx"
          class="left-item-card"
          :class="{ isDisabled: mess.ctyFlag === '2' && isCheckWhiteList }"
          @click.stop="chooseItem(mess)"
        >
          <view v-if="showAvatar">
            <image
              v-if="mess[imgKey]"
              :style="'border-radius:' + radius"
              class="left-item-card-img img-info"
              :src="mess[imgKey]"
              @click.stop="preview(mess[imgKey])"
            ></image>
            <view v-else :style="'border-radius:' + radius" class="left-item-card-img">
              {{ (mess[nameKey] && mess[nameKey].slice(0, 1)) || '' }}
            </view>
          </view>
          <view class="left-item-card-info">
            <slot v-if="$slots.name" name="name" :data="mess"></slot>
            <view v-else class="left-item-card-name">{{ mess[nameKey] || '' }}</view>
            <view v-if="mess.conditionFlag === '1'" class="status">有条件准入</view>
          </view>
        </view>
      </view>
      <view v-if="!hasData" class="no-data">
        <image class="no-data-img" :src="noDataImgSrc"></image>
        <view class="no-data-name">暂无数据</view>
      </view>
    </scroll-view>
    <view v-if="hasData" class="next-scroll-right">
      <image class="next-scroll-right-top" :src="nextScrollRightTopSrc" @click.stop="scrollTop"></image>
      <view
        v-for="(item, index) in scrollRightList"
        :key="index"
        :class="{ 'next-scroll-right-name': true, 'next-scroll-right-select': item == scrollIntoViewCopy }"
        @click.stop="chooseType(item)"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
import nextSearchImgSrc from '../../static/search.png'
import noDataImgSrc from '../../static/noData.png'
import nextScrollRightTopSrc from '../../static/top.png'
import { pinyin } from 'pinyin-pro'
let position = {}

export default {
  props: {
    dataList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    //显示的主键key值
    idKey: {
      type: String,
      default: 'id'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    phoneKey: {
      type: String,
      default: 'phone'
    },
    imgKey: {
      type: String,
      default: 'img'
    },
    radius: {
      type: String,
      default: '6rpx'
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    isInterlock: {
      type: Boolean,
      default: true
    },
    isCheckWhiteList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchStr: '',
      scrollIntoView: '',
      scrollIntoViewCopy: '',
      scrollLeftObj: {},
      oldObj: {},
      scrollRightList: [],
      hasData: true,
      nextSearchImgSrc,
      noDataImgSrc,
      nextScrollRightTopSrc
    }
  },
  created() {
    this.$watch(
      () => this.dataList,
      newList => {
        if (newList && newList.length) {
          this.cleanData(newList)
        }
        if (this.isInterlock) {
          this.scrollTop()
          position = {}
          this.$nextTick(() => {
            let firsttop = 0
            Object.keys(this.scrollRightList).map(key => {
              const query = uni.createSelectorQuery().in(this).select(`#${this.scrollRightList[key]}`)
              query &&
                query
                  .boundingClientRect(res => {
                    const { top, bottom } = res
                    position[this.scrollRightList[key]] = bottom
                    if (key == 0) {
                      firsttop = top
                    }
                    position[this.scrollRightList[key]] = position[this.scrollRightList[key]] - firsttop
                  })
                  .exec()
            })
          })
        }
      },
      {
        immediate: true,
        deep: true
      }
    )
  },
  mounted() {
    setTimeout(() => {
      if (this.isInterlock) {
        this.$nextTick(() => {
          let firsttop = 0
          Object.keys(this.scrollRightList).map(key => {
            const query = uni.createSelectorQuery().in(this).select(`#${this.scrollRightList[key]}`)
            query &&
              query
                .boundingClientRect(res => {
                  const { top, bottom } = res
                  position[this.scrollRightList[key]] = bottom
                  if (key == 0) {
                    firsttop = top
                  }
                  position[this.scrollRightList[key]] = position[this.scrollRightList[key]] - firsttop
                })
                .exec()
          })
        })
      }
    }, 1000)
  },
  methods: {
    search() {
      if (this.searchStr) {
        let has = false
        this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
        for (let i in this.scrollLeftObj) {
          this.scrollLeftObj[i] = this.scrollLeftObj[i].filter(item => {
            return item[this.nameKey].indexOf(this.searchStr) != -1 || item[this.phoneKey].indexOf(this.searchStr) != -1
          })
          if (this.scrollLeftObj[i].length) {
            has = true
          }
        }
        if (has) {
          this.hasData = true
        } else {
          this.hasData = false
        }
      } else {
        this.hasData = true
        this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
      }
    },
    scrollCallback(e) {
      const { detail } = e
      const { scrollTop, scrollHeight } = detail
      if (this.scrollIntoView === 'TOP') {
        this.scrollIntoView = ''
      }

      if (this.isInterlock) {
        for (let key in position) {
          if (position[key] - scrollTop > 1 && position[key] - scrollTop <= scrollHeight) {
            this.scrollIntoViewCopy = key
            return
          }
        }
      }
    },
    scrollTop() {
      this.scrollIntoView = 'TOP'
    },
    convertChar(char) {
      if (/[a-zA-Z]/.test(char)) {
        return char.toUpperCase()
      }
      return char
    },
    cleanData(list) {
      this.scrollRightList = this.getLetter()
      let newList = []
      list.forEach(res => {
        // let initial = pinyinInstance.getCamelChars(res[this.nameKey].trim())
        let initial = pinyin(res[this.nameKey].trim(), { toneType: 'none' })
        let firsfirs = initial ? initial.substring(0, 1) : ''
        firsfirs = this.convertChar(firsfirs)
        if (!newList[firsfirs]) {
          newList[firsfirs] = []
        }
        newList[firsfirs].push({
          [this.idKey]: res[this.idKey] || '',
          [this.nameKey]: res[this.nameKey].trim() || '',
          [this.phoneKey]: res[this.phoneKey] || '',
          [this.imgKey]: res[this.imgKey] || '',
          ctyFlag: res.ctyFlag || '',
          ctyDesc: res.ctyDesc || '',
          conditionFlag: res.conditionFlag || '',
          creditUsers: res.creditUsers || ''
        })
      })
      this.scrollRightList.forEach(t => {
        if (newList[t]) {
          this.$set(this.scrollLeftObj, t, newList[t])
        } else {
          this.$set(this.scrollLeftObj, t, [])
        }
      })
      let surplusList = []
      for (var i in newList) {
        let han = this.scrollRightList.find(v => {
          return v == i
        })
        if (!han) {
          surplusList.push(newList[i])
        }
      }
      surplusList.forEach(item => {
        this.scrollLeftObj['#'] = this.scrollLeftObj['#'].concat(item)
      })
      this.oldObj = JSON.parse(JSON.stringify(this.scrollLeftObj))

      // 过滤不存在的关键索引
      const existList = Object.keys(this.scrollLeftObj).filter(key => {
        return this.scrollLeftObj[key].length
      })
      this.scrollRightList = this.scrollRightList.filter(key => {
        return existList.some(k => k === key)
      })
    },
    getLetter() {
      let list = []
      for (let i = 0; i < 26; i++) {
        list.push(String.fromCharCode(65 + i))
      }
      list.push('#')
      return list
    },
    chooseType(item) {
      if (item == '#') {
        item = 'BOTTOM'
      }
      this.scrollIntoView = item
      this.scrollIntoViewCopy = item
    },
    preview(img) {
      uni.previewImage({
        current: 0,
        urls: [img]
      })
    },
    chooseItem(item) {
      this.$emit('itemclick', item)
    }
  }
}
</script>
<style>
/deep/ ::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
</style>
<style lang="scss" scoped>
.next-list {
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
  box-sizing: border-box;
  padding-top: 1px;
  position: relative;
  .next-search {
    width: 100%;
    height: 106rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    .next-search-img {
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      left: 64rpx;
    }

    .next-input {
      width: calc(100% - 64rpx);
      height: 72rpx;
      background: #eeeeee;
      border-radius: 36rpx;
      padding: 0 32rpx 0 80rpx;
      box-sizing: border-box;
      color: #333333;
    }

    .next-placeholder {
      color: #777777;
    }
  }
  .next-scroll-left {
    height: 100%;
    padding-top: 106rpx;

    .left-list {
      height: auto;

      .left-item-title {
        width: calc(100% - 24rpx);
        height: 80rpx;
        padding-left: 24rpx;
        text-align: left;
        line-height: 80rpx;
        font-size: 30rpx;
        background: #fff;
        color: #000;
        border-bottom: solid #f4f4f4 2rpx;
      }

      .left-item-card {
        width: 100%;
        background-color: #ffffff;
        box-sizing: border-box;
        padding-left: 24rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .left-item-card-img {
          width: 80rpx;
          min-width: 80rpx;
          height: 80rpx;
          background-color: #cfcfcf;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36rpx;
          font-weight: bold;
          color: #ffffff;
        }

        .img-info {
          background: none;
          border: solid #f0f0f0 1rpx;
        }

        .left-item-card-info {
          width: 100%;
          margin-left: 32rpx;
          padding-top: 30rpx;
          padding-bottom: 30rpx;
          height: 100%;
          display: flex;
          align-items: center;
          .status {
            color: #00b050;
            border: 1rpx solid #00b050;
            border-radius: 5rpx;
            padding: 10rpx 16rpx;
            text-align: center;
            font-size: 26rpx;
            margin-right: 80rpx;
          }
          .left-item-card-name {
            flex: 1;
            font-size: 30rpx;
            color: #333333;
            padding-right: 20rpx;
          }

          .left-item-card-phone {
            margin-top: 14rpx;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #999999;
          }
        }
      }
    }

    .no-data {
      width: 100%;
      display: flex;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      margin-top: 25%;

      .no-data-img {
        width: 200rpx;
        height: 200rpx;
      }

      .no-data-name {
        margin-top: 20rpx;
        font-size: 28rpx;
        color: #666666;
      }
    }
  }

  .next-scroll-right {
    position: absolute;
    right: 0rpx;
    top: 20rpx;
    // transform: translateY(-47%);
    z-index: 999 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .next-scroll-right-top {
      width: 32rpx;
      height: 32rpx;
      margin-right: 14rpx;
      z-index: 999 !important;
    }

    .next-scroll-right-name {
      width: 32rpx;
      padding-right: 14rpx;
      height: 28rpx;
      font-size: 24rpx;
      color: #333333;
      line-height: 24rpx;
      margin-top: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .next-scroll-right-select {
      padding: 0;
      margin-right: 14rpx;
      width: 28rpx;
      height: 28rpx;
      border-radius: 50%;
      font-weight: bold;
      //background: #2991ff;
      color: #2991ff;
    }
  }
}
.fixed {
  position: sticky;
  z-index: 9;
  background-color: #ffffff; // 确保背景色与滚动区域背景色一致
  top: -1px;
}
.isDisabled {
  background: #f7f7f7 !important;
  .left-item-card-name {
    color: #999 !important;
  }
}
</style>
