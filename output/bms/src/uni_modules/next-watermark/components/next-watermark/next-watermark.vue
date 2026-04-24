<template>
  <view v-if="show">
    <view class="next-watermark-box" :style="[{ top: top + 'px' }, { opacity: opacity }]">
      <view class="next-watermark-getwh" ref="getwh" id="getwh" :style="[{ 'max-width': maxWidth + 'px' }]">
        <rich-text :nodes="watermark"></rich-text>
      </view>
      <view class="next-watermark-content">
        <view
          class="next-watermark-text"
          :style="[
            { color: color },
            { 'font-size': fontSize ? fontSize + 'px' : undefined },
            { 'max-width': maxWidth + 'px' },
            { transform: 'rotate(' + rotate + 'deg)' },
            getWatermarkPosition(index)
          ]"
          v-for="(item, index) in forLength"
          :key="index"
        >
          <rich-text :nodes="watermark"></rich-text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      top: 0,
      forLength: 0,
      itemWidth: 0,
      itemHeight: 0,
      colsPerRow: 0,
      screenWidth: 0,
      screenHeight: 0
    }
  },
  props: {
    maxWidth: {
      //单条水印最大宽度
      type: Number,
      default: 180
    },
    rotate: {
      //水印旋转角度
      type: Number,
      default: -21
    },
    margin: {
      //水印之间上下间距
      type: Number,
      default: 50
    },
    watermark: {
      //水印文字(支持html富文本)
      type: String,
      default: '水印文字'
    },
    color: {
      //水印文字默认颜色
      type: String,
      default: '#000000'
    },
    opacity: {
      //水印透明度
      type: Number,
      default: 0.2
    },
    show: {
      //是否显示水印
      type: Boolean,
      default: true
    },
    fontSize: {
      // 字体大小
      type: Number
    },
    customTop: {
      type: Number
    },
    staggered: {
      type: Boolean,
      default: true
    },
    staggeredOffset: {
      type: Number,
      default: 120
    }
  },
  mounted() {
    this.getstatusBarHeight()
  },
  methods: {
    getWatermarkPosition(index) {
      if (!this.itemWidth || !this.colsPerRow) return {}

      const row = Math.floor(index / this.colsPerRow)
      const col = index % this.colsPerRow

      // 计算基础位置 - 增加间距
      const horizontalGap = this.itemWidth * 0.5 // 水平间距为水印宽度的80%
      const verticalGap = this.itemHeight * 2 // 垂直间距为水印高度的1.5倍

      const baseLeft = col * (this.itemWidth + horizontalGap)
      const top = row * (this.itemHeight + verticalGap)

      // 错行效果：奇数行向右偏移
      let left = baseLeft
      if (this.staggered && row % 2 === 1) {
        left += this.staggeredOffset
      }

      return {
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        'margin-bottom': this.margin + 'px'
      }
    },
    getstatusBarHeight() {
      const SystemInfo = uni.getSystemInfoSync()
      this.top = typeof this.customTop === 'number' ? this.customTop : SystemInfo.safeArea.top + SystemInfo.windowTop
      this.screenWidth = SystemInfo.screenWidth
      this.screenHeight = SystemInfo.screenHeight
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#getwh')
        .boundingClientRect(data => {
          if (data) {
            this.itemWidth = data.width
            this.itemHeight = data.height

            // 精确计算每行可以显示的水印数量 - 减少密度
            const horizontalGap = this.itemWidth * 0.5 // 水平间距
            this.colsPerRow = Math.floor(this.screenWidth / (this.itemWidth + horizontalGap)) + 1

            // 计算需要的行数 - 减少行数
            const verticalGap = this.itemHeight * 1.2 // 垂直间距
            const rows = Math.ceil(this.screenHeight / (this.itemHeight + verticalGap))

            this.forLength = rows * this.colsPerRow
          }
        })
        .exec()
    }
  }
}
</script>

<style>
.next-watermark-box {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  position: fixed;
  z-index: 9999;
  left: 8px;
  top: 0;
}

.next-watermark-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.next-watermark-text {
  text-align: center;
  color: rgba(0, 0, 0, 0.05);
  max-width: 180px;
  font-size: 16px;
  word-break: break-all;
  line-height: 16px;
  pointer-events: none;
  /* 确保水印不会重叠 */
  box-sizing: border-box;
  white-space: nowrap;
  line-height: 16px;
}

.next-watermark-getwh {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  display: inline-block;
  max-width: 180px;
  font-size: 16px;
  word-break: break-all;
  line-height: 1;
}
</style>
