<template>
  <view class="next-slide" :class="{ 'next-slide-disabled': disabled }" @tap="slideClick($event)">
    <view v-if="left < 0" class="mask-layer" @touchstart.stop="reset"></view>
    <view
      class="next-slide-left"
      :style="'position: relative;left:' + left + 'rpx'"
      @touchstart="ontouchstart"
      @touchmove="ontouchmove"
      @touchend="ontouchend"
    >
      <slot></slot>
    </view>
    <view class="next-slide-right">
      <slot name="slide-right" />
      <view v-if="btnGroup.length">
        <view v-for="(item, iindex) in btnGroup" :key="iindex" class="next-btn-item" :style="getStyle(item)" @click.stop="btnClick(item)">
          <view v-if="item.icon" :style="{ marginBottom: '10rpx' }">
            <i :class="item.icon" class="iconfont" :style="{ fontSize: '40rpx' }"></i>
          </view>
          {{ item.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const defBtnStyle = {
  width: '180rpx',
  bgColor: '#f6f6f6',
  color: '#FFFFFF',
  fontSize: '28rpx',
  fontWeight: 300
}

export default {
  name: 'NextSwipeAction',
  props: {
    btnGroup: {
      type: Array,
      default: () => {
        return []
      }
    },
    //当前列索引
    index: {
      type: Number,
      require: true,
      default: 0
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否按钮点击后自定重置
    btnClickAutoReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      x: 0,
      left: 0,
      operation: 0,
      height: 0,
      screenWidth: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      const systemInfo = uni.getSystemInfoSync()
      this.screenWidth = systemInfo.screenWidth
      this.getBtnWidth()
      this.getListHeight()
    })
  },
  methods: {
    getStyle(item) {
      const style = item.style || {}
      const styleStr =
        'width:' +
        (style.width || defBtnStyle.width) +
        ';height:' +
        this.height +
        'rpx;background-color:' +
        (style.bgColor || defBtnStyle.bgColor) +
        ';color:' +
        (style.color || defBtnStyle.color) +
        ';font-size:' +
        (style.fontSize || defBtnStyle.fontSize) +
        'font-weight:' +
        (style.fontWeight || defBtnStyle.fontWeight)
      return styleStr
    },
    btnClick(item) {
      const it = Object.assign({}, item)
      delete it.style
      this.$emit('btnClick', {
        index: this.index,
        name: it.name
      })
      if (this.btnClickAutoReset) {
        this.reset()
      }
    },
    //重置方法
    reset() {
      this.left = 0
    },
    getBtnWidth() {
      const element = uni.createSelectorQuery().in(this).select('.next-slide-right')
      element
        .boundingClientRect(rect => {
          this.operation = this.px2rpx(rect.width, this.screenWidth)
        })
        .exec()
    },
    getListHeight() {
      const element = uni.createSelectorQuery().in(this).select('.next-slide-left')
      element
        .boundingClientRect(rect => {
          this.height = this.px2rpx(rect.height, this.screenWidth)
        })
        .exec()
    },
    px2rpx(px, screenWidth) {
      let rpx = px / (screenWidth / 750)
      return rpx
    },
    ontouchstart(e) {
      if (this.disabled) {
        return
      }
      this.x = this.px2rpx(e.touches[0].clientX, this.screenWidth)
    },
    ontouchmove(e) {
      if (this.disabled) {
        return
      }
      e.preventDefault()
      let clientX = this.x - this.px2rpx(e.touches[0].clientX, this.screenWidth)

      if (clientX <= 0) {
        this.left = 0
      } else if (this.operation <= clientX) {
        this.left = this.operation * -1
      } else {
        this.left = clientX * -1
      }
    },
    ontouchend(e) {
      if (this.disabled) {
        return
      }
      let clientX = this.x - this.px2rpx(e.changedTouches[0].clientX, this.screenWidth)
      this.left = clientX > this.operation / 2 ? this.operation * -1 : this.left
    },
    getLeft() {
      return this.left
    },
    slideClick(event) {
      if (this.left < 0) {
        this.left = 0
        event.stopPropagation()
      }
    }
  }
}
</script>

<style scoped>
.next-slide {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f6f6f6;
}
.next-slide-left {
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  transition: left 0.2s ease-in-out;
  z-index: 9;
}

.next-slide-right {
  position: absolute;
  top: 0rpx;
  right: 0;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.next-btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .icon {
    margin-bottom: 50rpx;
  }
}
.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8; /* 在滑动层下方 */
  background: transparent;
}
</style>
