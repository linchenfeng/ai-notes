<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-27 13:19:48
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-01 10:05:43
 * @Description  : 问答列表
-->
<template>
  <view v-if="vm.qaList.length" class="qa-list">
    <u-collapse ref="collapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="提问及回复信息" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">提问及回复信息</text>
          </view>
        </template>
        <view>
          <view v-for="(item, index) in vm.qaList" :key="index" class="qa-list-box">
            <view class="left-box">
              <text class="iconfont icon-yiwen"></text>
              <view v-if="index !== vm.qaList.length - 1" class="line"></view>
            </view>
            <view class="right-box">
              <view class="question-title">
                <text class="quiz">
                  <text class="name">{{ cutEnStr(item.questionUser) }}</text>
                  <text>提问：</text>
                </text>
                <text class="time">{{ dateFormat(item.questionTime, 2) }}</text>
              </view>
              <view class="question" @click="onAnswer(item)">
                <text>{{ item.questions }}</text>
                <text v-if="props.answerFlag" class="iconfont icon-bianji"></text>
              </view>
              <view
                v-for="(obj, i) in item.answerList"
                :key="i"
                class="answer-box"
                :class="index === vm.qaList.length - 1 && i === item.answerList.length - 1 ? 'lastAnswer' : ''"
              >
                <view class="answer-title">
                  <text class="iconfont icon-huifu"></text>
                  <text class="quiz text">
                    <text class="name">{{ cutEnStr(obj.answerUser) }}</text>
                    <text>回复：</text>
                  </text>
                  <text class="time">{{ dateFormat(obj.answerTime, 2) }}</text>
                </view>
                <view class="answersClass">
                  {{ obj.answers }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
  <!-- 回复弹出文本域 -->
  <ty-pop-text-area v-model:model-value="answers" :show-popup="showPopup" placeholder="回复：" @close="showPopup = false">
    <template #btn>
      <u-button type="primary" :loading="loading" @click="doReply()">发送</u-button>
    </template>
  </ty-pop-text-area>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import apiSpecialApprovalAudit from '@/api/member/project/audit/api.specialApprovalAudit'
import { showToast } from '@/utils/uniapp/toast'
import { QaListItem } from '@/interfaces/member/project/audit/specialApprovalAudit'
import { dateFormat } from '@/utils/format'
const loading = ref(false)
let showPopup = ref(false)
const collapseRef = ref()
const qaList: QaListItem[] = []
const opinionActive = ref(['1'])
let qusRefcode = 0 // 当前问题流水号
const answers = ref('')
let vm = reactive({
  qaList: qaList
})
const props = defineProps({
  refcode: {
    type: Number,
    default: -1
  },
  // 是否允许答复
  answerFlag: {
    type: Boolean,
    default: false
  }
})
const cutEnStr = str => {
  if (!str) {
    return
  }
  const regex = /\([^()]*?\)/g
  const result = str.replace(regex, '')
  return result
}
// 回复
const onAnswer = item => {
  if (props.answerFlag) {
    qusRefcode = item.refcode
    showPopup.value = true
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-27 13:38:03
 * @description: 获取问答列表
 */
const findQuizPage = () => {
  const data = {
    saaRefcode: props.refcode // 特批申请流水号
  }
  apiSpecialApprovalAudit.findQuizPage(data).then(res => {
    vm.qaList = res.data.qaList
    setTimeout(() => {
      if (collapseRef.value) {
        collapseRef.value.init()
      }
    }, 50)
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-27 15:30:05
 * @description: 回复问题
 */
const doReply = () => {
  if (!answers.value) {
    showToast('请输入回复内容')
    return
  }
  const data = {
    saaRefcode: props.refcode,
    qusRefcode: qusRefcode,
    answers: answers.value
  }
  loading.value = true
  apiSpecialApprovalAudit
    .doReply(data)
    .then(() => {
      loading.value = false
      showToast('回复成功')
      showPopup.value = false
      answers.value = ''
      findQuizPage()
    })
    .catch(() => {
      loading.value = false
    })
}

onMounted(() => {
  findQuizPage()
})
// onShow(() => {
//   findQuizPage()
// })
defineExpose({ findQuizPage })
</script>

<style lang="scss" scoped>
.qa-list {
  padding: 0;
  background-color: #f6f6f6;
  padding-top: 20rpx;
  :deep(.u-cell__left-icon-wrap) {
    margin-right: 0 !important;
  }
  :deep(.u-cell__body) {
    padding: 27rpx 30rpx !important;
  }
  :deep(.u-collapse-item) {
    background-color: #fff;
    box-shadow: none;
    margin-bottom: 0;
    .u-cell--clickable.u-cell {
      background-color: #fff;
    }
  }
  .qa-list-box {
    display: flex;
    align-items: stretch;
    .left-box {
      height: inherit;
      .iconfont {
        height: 32rpx;
        color: #e75934;
      }
      .line {
        width: 1rpx;
        height: calc(100% - 32rpx - 20rpx);
        border-left: 1rpx dashed #d2d2d2;
        margin: 8rpx 0 0 50%;
        transform: translateX(-50%);
      }
    }
    .right-box {
      width: calc(100% - 32rpx - 30rpx);
      // margin-bottom: 10rpx;
      margin-left: 20rpx;
      .quiz {
        color: $sub-color;
        .name {
          margin-right: 6rpx;
          font-weight: bold;
          color: $default-color;
        }
      }
      .time {
        color: $remark-color;
      }
      .question-title {
        font-size: 26rpx;
        margin-bottom: 18rpx;
        display: flex;
        justify-content: space-between;
      }
      .question {
        font-size: 28rpx;
        margin-bottom: 26rpx;
        line-height: 44rpx;
        color: $default-color;
        // line-height: 26rpx;
        .iconfont {
          display: inline-block;
          margin-left: 10rpx;
          vertical-align: middle;
          font-size: 28rpx;
          color: $sub-color;
          line-height: 44rpx;
          height: 44rpx;
        }
      }
      .answer-box {
        background-color: #f6f6f6;
        border-radius: 10rpx;
        padding: 20rpx;
        margin-bottom: 26rpx;
        .answer-title {
          display: flex;
          margin-bottom: 18rpx;
          font-size: 26rpx;
          // justify-content: space-between;
          .iconfont {
            // font-size: 36rpx;
            color: #1a98ff;
          }
          .text {
            margin-left: 20rpx;
          }
          .time {
            margin-left: auto;
          }
        }
        .answersClass {
          margin: 0 0 0 56rpx;
          color: $default-color;
          line-height: 44rpx;
          white-space: pre-wrap;
        }
        &.lastAnswer {
          margin-bottom: 34rpx;
        }
      }
    }
  }
}
</style>
