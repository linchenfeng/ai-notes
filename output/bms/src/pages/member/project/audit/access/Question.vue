<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-27 13:46:53
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2024-12-16 09:43:37
 * @Description  : 项目-业务审核-业务准入提问 /member/project/audit/access/audit/question
-->
<template>
  <NavBar />
  <view class="question">
    <u-textarea v-model="questions" :confirm-type="null" maxlength="300" count placeholder="请输入提问的内容"></u-textarea>
    <u-button type="primary" :loading="loading" @click="submit">提交</u-button>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { showToast } from '@/utils/uniapp/toast'
import apiBusinessAccess from '@/api/member/project/audit/api.businessAccess'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import { setStorage } from '@/utils/storages'
const questions = ref('')
const route = useRoute()
const router = useRouter()
let loading = ref(false)
const submit = () => {
  if (!questions.value) {
    showToast('请输入提问的内容')
    return
  }
  // 提问
  const data = {
    aplRefcode: Number(decodeBase64(route.value.params.refcode)),
    questions: questions.value
  }
  loading.value = true
  apiBusinessAccess.doQuiz(data).then(
    () => {
      // showToast('提问成功')
      setStorage('businessQuestions', true)
      router.back(1)
      // setTimeout(() => {
      //   router.back(1)
      //   loading.value = false
      // }, 500)
    },
    () => {
      loading.value = false
    }
  )
}
</script>

<style lang="scss" scoped>
.question {
  padding: 40rpx 30rpx;
  :deep(.u-textarea) {
    text-align: left;
    padding: 20rpx;
    height: 280rpx;
    background: #f9f9f9;
    border: 1rpx solid #e1e1e1;
    border-radius: 15rpx;
    .u-textarea__count {
      background-color: #f9f9f9 !important;
    }
    .u-textarea__field {
      height: auto !important;
    }
    .uni-textarea-placeholder {
      font-size: 28rpx;
      line-height: 38rpx;
      color: $remark-color;
      word-break: break-all;
    }
  }
  .u-button {
    margin-top: 60rpx;
  }
}
</style>
