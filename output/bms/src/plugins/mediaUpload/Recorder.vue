<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-08-06 16:36:02
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-28 17:10:51
 * @Description  : 录音
-->
<template>
  <up-popup :show="showPopup" mode="center" :round="10" close-on-click-overlay="false">
    <view class="record-popup">
      <view class="title">录音</view>
      <view v-show="recordType !== '3'" class="time-box">
        <view class="time-text">{{ recordingTime }}</view>
      </view>
      <view v-show="recordType !== '3'" style="text-align: center">
        <!-- 波形绘制区域 -->
        <view style="border: 1px solid #ccc; display: inline-block; vertical-align: bottom">
          <view ref="recwave" class="ctrlProcessWave" style="height: 240rpx; width: 560rpx"></view>
        </view>
      </view>
      <view v-show="recordType === '3'" class="audioClass"></view>
      <view class="controls-box">
        <view class="controls">
          <view @click="closeDialog">取消</view>
          <view v-if="recordType !== '3'" class="start-box" @click="operateRec">
            <view class="start-icon">
              <view v-if="recordType === '0'" class="start"></view>
              <view v-if="recordType === '1'" class="recording">
                <view class="line"></view>
                <view class="line"></view>
              </view>
              <view v-if="recordType === '2'" class="pause">继续</view>
            </view>
          </view>
          <view v-if="['1', '2'].includes(recordType)" @click="recStop">结束</view>
          <view v-if="recordType === '0'" class="zhanwei"></view>
          <view v-if="recordType === '3'" @click="recordAgain">重新录音</view>
          <view v-if="recordType === '3'" @click="uploadRec">上传</view>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { showToast } from '@/utils/uniapp/toast'
import Recorder from 'recorder-core'
// //引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
// import 'recorder-core/src/engine/mp3'
// import 'recorder-core/src/engine/mp3-engine'
//录制wav格式
import 'recorder-core/src/engine/wav'
//可选的插件支持项，这个是波形可视化插件
import 'recorder-core/src/extensions/waveview'
const recordType = ref('0') // 录制状态【0=初始状态/1=录制中/2=暂停/3=录制完成】
const emit = defineEmits(['close-dialog', 'record-success'])
const recordingTime = ref('00:00:00')
// 定义全局变量存储定时器和录制开始时间
let timer: ReturnType<typeof setInterval> | null = null
const recordingStartTime = ref<number | null>(null)
const isPaused = ref(false)
const totalRecordTime = ref(0)
let rec: any = ''
let wave: any = ''
let historyStateAdded = false // 标记是否已添加历史记录
let recordBlob: any = ''
let recordDuration = -1 // 录音时长
const showPopup = ref(true)
const recwave = ref()
let audio: HTMLAudioElement | null = null // 用于存储 audio 对象的引用
// 打开录音,请求权限
const recOpen = () => {
  return new Promise((resolve, reject) => {
    //创建录音对象
    rec = Recorder({
      type: 'wav', //录音格式，可以换成wav等其他格式
      sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
      bitRate: 16, //录音的比特率，越大音质越好
      onProcess: (buffers: any, powerLevel: any, bufferDuration: any, bufferSampleRate: any) => {
        //录音实时回调，大约1秒调用12次本回调
        //可实时绘制波形，实时上传（发送）数据
        if (wave) {
          wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate)
        }
      }
    })
    if (!rec) {
      showToast('当前浏览器不支持录音功能')
      reject(new Error('无法打开录音'))
      return
    }
    //打开录音，获得权限
    rec.open(
      () => {
        if (recwave.value) {
          //创建音频可视化图形绘制对象
          wave = Recorder.WaveView({ elem: '.ctrlProcessWave' })
          resolve(true)
        }
      },
      (msg: any, isUserNotAllow: any) => {
        //用户拒绝了录音权限，或者浏览器不支持录音
        // console.error((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
        showToast((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
        reject(new Error('无法录音:' + msg))
      }
    )
  })
}
// 辅助方法：格式化时间为 `hh:mm:ss`
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  // eslint-disable-next-line no-extra-parens
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
const getTime = () => {
  recordingStartTime.value = Date.now() // 记录当前周期开始时间
  isPaused.value = false

  // 启动定时器，实时更新录制时间
  timer = setInterval(() => {
    // 实时计算录制时间
    if (recordingStartTime.value && !isPaused.value) {
      // 当前周期时间 + 累计时间
      const currentPeriodTime = Date.now() - recordingStartTime.value
      const totalTime = totalRecordTime.value + currentPeriodTime
      recordingTime.value = formatTime(totalTime)
    }
  }, 1000)
}
const recordAgain = () => {
  // 移除已存在的 audio 元素
  const audioElement = document.querySelector('.audioClass')
  if (audioElement && audio) {
    audioElement.removeChild(audio)
    audio = null
  }
  recordType.value = '0'
  // 重置时间相关变量
  totalRecordTime.value = 0
  recordingTime.value = '00:00:00'
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isPaused.value = false
  recordingStartTime.value = null
}
// 开始录音
const startRec = () => {
  if (!rec) {
    return
  }
  recordType.value = '1'
  rec.start()
  // 重置累计时间
  totalRecordTime.value = 0
  getTime()
}
// 结束录音
const recStop = () => {
  if (!rec) {
    showToast('还未开始录音')
    return
  }
  rec.stop((blob: any, duration: number) => {
    recordDuration = duration
    //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
    const localUrl = (window.URL || window.webkitURL).createObjectURL(blob)
    audio = document.createElement('audio')
    audio.controls = true
    const audioElement = document.querySelector('.audioClass')
    //本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
    if (audioElement) {
      audioElement.appendChild(audio)
    }
    audio.src = localUrl
    recordBlob = new File([blob], 'recording.wav', { type: blob.type })
    recordType.value = '3'
    // 清除定时器
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isPaused.value = false
    recordingStartTime.value = null
    // 设置最终的录音时长
    recordingTime.value = formatTime(totalRecordTime.value)
  })
}
// 监听浏览器返回，禁用默认事件
const handlePopstate = event => {
  if (historyStateAdded) {
    event.preventDefault()
    // 关闭弹窗
    // eslint-disable-next-line no-use-before-define
    removeState('pop')
    // eslint-disable-next-line no-use-before-define
    closeDialog()
  }
}
// 移除监听状态
const removeState = (type?: string) => {
  if (historyStateAdded) {
    historyStateAdded = false
    if (type !== 'pop') {
      // 取消关闭的弹窗，删除新增的空白记录
      window.history.back()
    }
  }
}
// 点击取消关闭弹出
const closeDialog = () => {
  removeState()
  emit('close-dialog')
}
// 上传录音
const uploadRec = () => {
  removeState()
  emit('record-success', recordBlob, recordDuration)
}
// 暂停录音
const pauseRecording = () => {
  if (rec) {
    rec.pause()
  }
  recordType.value = '2'
  // 暂停计时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isPaused.value = true
  // 记录暂停时更新累计录制时间
  if (recordingStartTime.value) {
    const currentPeriodTime = Date.now() - recordingStartTime.value
    totalRecordTime.value += currentPeriodTime
    recordingStartTime.value = null
  }
}
// 继续录音
const resumeRecording = () => {
  if (rec) {
    rec.resume()
  }
  recordType.value = '1'
  // // 直接重启计时器，从暂停时的累计时间继续计时
  getTime()
}
// 开始||结束录音
const operateRec = () => {
  if (recordType.value === '0') {
    // 开始录音
    startRec()
  } else if (recordType.value === '1') {
    // 暂停录音
    pauseRecording()
  } else if (recordType.value === '2') {
    // 继续录音
    resumeRecording()
  }
}
// 刷新页面之前移除添加的空记录
const handleBeforeUnload = () => {
  window.history.back()
}
onMounted(() => {
  if (window.history && window.history.pushState) {
    // 添加一条历史记录
    window.history.pushState(null, '', document.URL)
    historyStateAdded = true
    // 添加事件监听器（确保只添加一次）
    window.addEventListener('popstate', handlePopstate)
  }
  // 添加 beforeunload 事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload)
  recOpen()
})

onBeforeUnmount(() => {
  //revokeObjectURL，避免霸占内存
  if (rec) {
    rec.close()
  }
  if (audio && audio.src) {
    URL.revokeObjectURL(audio.src)
  }
  if (historyStateAdded) {
    window.removeEventListener('popstate', handlePopstate)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style lang="scss" scoped>
.audioClass {
  height: 300rpx;
  text-align: center;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 20rpx;
  // :deep(audio) {
  //   width: 560rpx !important;
  //   margin: 20rpx 0;
  // }
}
.record-popup {
  // width: 90%;
  width: 600rpx;
  .title {
    text-align: center;
    padding: 20rpx;
    font-size: 32rpx;
  }
  .time-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60rpx;
    // padding-top: 40rpx;
    box-sizing: border-box;
    .time-text {
      color: #333;
    }
  }
}
.controls-box {
  width: 100%;
  height: 200rpx;
  display: flex;
  align-self: center;
  .controls {
    // padding-top: 40rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #333;
    .zhanwei {
      width: 64rpx;
    }
    .start-box {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      background-color: #999;
      display: flex;
      justify-content: center;
      align-items: center;
      .start-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .start {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          background-color: red;
        }
        .recording {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10rpx;
          .line {
            width: 10rpx;
            height: 40rpx;
            background-color: red;
          }
        }
        .pause {
          color: red;
        }
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>
