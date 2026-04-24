<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-19 09:46:11
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-29 11:14:22
 * @Description  : 媒体预览组件,平铺缩略图
-->
<template>
  <view class="media-preview-box">
    <view
      v-for="(item, index) in mediaList"
      :key="item.resourceUuid"
      class="successImg"
      :style="{ width: `${props.width}rpx`, height: `${props.height}rpx`, marginRight: (index + 1) % props.rowCount === 0 ? '0rpx' : '34rpx' }"
      @click="previewMedia(item)"
    >
      <view v-if="props.isDelete" class="icon-box">
        <text class="iconfont icon-guanbi" @click.stop="deleteMedia(item.resourceUuid)"></text>
      </view>
      <!-- 照片，此处预览缩略图 -->
      <view
        v-if="item.fileType === '1'"
        class="img-box"
        :style="{ backgroundImage: 'url(' + apiCenterFiles.filecenterPreview(item.resourceUuid, '03') + ')', width: '100%', height: '100%' }"
      ></view>
      <!-- 视频,此处预览第一帧 -->
      <view
        v-else-if="item.fileType === '2'"
        class="img-box"
        :style="{ backgroundImage: 'url(' + apiCenterFiles.filecenterPreview(item.resourceUuid, '04') + ')' }"
      >
        <img class="play" src="./images/video.png" alt="" />
      </view>
      <!-- 录音 -->
      <view v-else-if="item.fileType === '3'" class="img-box audio">
        <view class="play-box">
          <img class="play" src="./images/audio.png" alt="" />
          <view class="duration">{{ formatDuration(item.fileDuration as number) }}</view>
        </view>
      </view>
      <up-checkbox-group v-if="props.isSelect" v-model="item.checked" size="24" @change="changeChecked(item)">
        <up-checkbox name="1" shape="circle"></up-checkbox>
      </up-checkbox-group>
    </view>
  </view>
  <text v-if="dialogVisible && currentMediaInfo.fileType !== '1'" class="iconfont icon-guanbi2 close-icon" @click="dialogVisible = false"></text>
  <Preview v-if="dialogVisible" :media-info="currentMediaInfo" @close-dialog="dialogVisible = false"></Preview>
</template>

<script setup lang="ts">
import { MediaInfo } from '@/interfaces/common/media'
// import { PREVIEW_RESOURCE_UUID } from '@/config/file'
import apiCenterFiles from '@/api/fileCenter/api.files'
import Preview from './Preview.vue'
const mediaList = ref<MediaInfo[]>([])
const dialogVisible = ref(false) // 预览弹窗
const currentMediaInfo = ref<MediaInfo>({ resourceUuid: '' })
const props = defineProps({
  // 是否展示删除按钮
  isDelete: {
    type: Boolean,
    default: false
  },
  // 是否展示选择按钮
  isSelect: {
    type: Boolean,
    default: false
  },
  // 上传框宽
  width: {
    type: Number,
    default: 110,
    required: false
  },
  // 上传框高
  height: {
    type: Number,
    default: 110,
    required: false
  },
  // 每行展示数量
  rowCount: {
    type: Number,
    default: 5,
    required: false
  },
  // 单个文件
  mediaInfo: {
    type: Object as () => MediaInfo,
    default: () => {
      return { resourceUuid: '' }
    }
  },
  // 文件list
  mediaList: {
    type: Array as () => MediaInfo[],
    default: () => []
  }
})
const emit = defineEmits(['delete', 'changeChecked'])
// 删除当前媒体文件
const deleteMedia = (resourceUuid: string) => {
  mediaList.value = mediaList.value.filter(item => item.resourceUuid !== resourceUuid)
  emit('delete', resourceUuid)
}
// 更改勾选文件
const changeChecked = item => {
  nextTick(() => {
    emit('changeChecked', item)
  })
}
const checkAll = () => {
  mediaList.value.forEach(item => {
    if (!item.checked || !item.checked.length) {
      item.checked = ['1']
      emit('changeChecked', item)
    }
  })
}
// 清空
const clearAll = () => {
  mediaList.value.forEach(item => {
    if (item.checked && item.checked.length) {
      item.checked = []
      emit('changeChecked', item)
    }
  })
}
// 初始化渲染数组
const initMediaData = (initMediaList: MediaInfo[]) => {
  mediaList.value = initMediaList
}

// 预览当前媒体文件
const previewMedia = (item: MediaInfo) => {
  if (props.isSelect) {
    if (item.checked && item.checked.length) {
      // 取消勾选
      item.checked = []
    } else {
      // 勾选
      item.checked = ['1']
    }
    emit('changeChecked', item)
    return
  }
  currentMediaInfo.value = item
  dialogVisible.value = true
}
// 时间格式化函数
const formatDuration = (milliseconds: number | string): string => {
  const totalSeconds = Math.floor(Number(milliseconds) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  // eslint-disable-next-line no-extra-parens
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  // 补零处理
  const pad = (num: number): string => num.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}
watch(
  () => props.mediaInfo,
  newMediaInfo => {
    if (newMediaInfo && newMediaInfo.resourceUuid) {
      mediaList.value = [newMediaInfo]
    }
  },
  { deep: true }
)
watch(
  () => props.mediaList,
  newMediaInfo => {
    mediaList.value = newMediaInfo
  },
  { deep: true }
)
onBeforeMount(() => {
  if (props.mediaList && props.mediaList.length) {
    // 展示数组
    mediaList.value = props.mediaList
  } else if (props.mediaInfo && props.mediaInfo.resourceUuid) {
    // 展示单文件
    mediaList.value = [props.mediaInfo]
  }
})
// 在组件卸载前关闭预览
onBeforeUnmount(() => {
  if (currentMediaInfo.value.fileType === '1') {
    uni.closePreviewImage()
  }
})
defineExpose({
  checkAll,
  clearAll,
  initMediaData
})
</script>

<style lang="scss" scoped>
.close-icon {
  position: fixed;
  top: 30rpx;
  right: 30rpx;
  font-size: 44rpx;
  color: #fff;
  z-index: 99999;
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
.media-preview-box {
  display: flex;
  flex-wrap: wrap;
  .successImg {
    position: relative;
    // border: 2rpx dashed #d8d8d8;
    box-sizing: border-box;
    position: relative;
    margin-right: 20rpx;
    margin-bottom: 30rpx;
    border-radius: 10rpx;
    .u-checkbox {
      position: absolute;
      :deep(.u-checkbox__icon-wrap) {
        margin: 0;
      }
      top: -10rpx;
      right: -30rpx;
      margin: 0;
    }
    .icon-box {
      position: absolute;
      right: -10rpx;
      top: -12rpx;
      display: inline-block;
      // background-color: #fff;
      line-height: 26rpx;
      z-index: 9;
    }
    .img-box {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      &.audio {
        background: linear-gradient(0deg, #45b6bd 1%, #cbe1ab 100%), #ffffff;
        border: 1px solid #d8d8d8;
        border-radius: 10rpx;
      }
      .play {
        width: 48rpx;
        height: 48rpx;
      }
      .play-box {
        width: 100%;
        text-align: center;
        .duration {
          margin-top: 6rpx;
          color: #fff;
          font-size: 24rpx;
        }
      }
    }
    .icon-guanbi {
      font-size: 26rpx;
    }
  }
}
</style>
