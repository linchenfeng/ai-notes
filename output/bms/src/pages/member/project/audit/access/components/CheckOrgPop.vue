<template>
  <up-popup :show="showPopup" @close="cancel">
    <view class="operate">
      <view class="cancel" @tap="cancel">取消</view>
      <!-- <view class="submit" @tap="confirmCheck">确定核查</view> -->
    </view>
    <scroll-view class="list-wrap" scroll-y="true" scroll-with-animation="true">
      <view class="pop-content">
        <ty-info-card title="核查信息" :show-line="false">
          <view class="card-cell-group">
            <u-cell-group>
              <u-cell title="企业名称" :value="props.orgname" />
              <view class="remark">
                <u-textarea
                  v-model="submitData.applyRemark"
                  placeholder-style="font-size: 28rpx;"
                  :confirm-type="null"
                  auto-height
                  count
                  maxlength="1000"
                  placeholder="请输入备注说明"
                ></u-textarea>
              </view>
            </u-cell-group>
          </view>
        </ty-info-card>
        <ty-info-card title="核查人员" :show-line="false">
          <template v-if="usernameList && usernameList.length === 1">
            <view class="check-content">
              <view v-for="(item, index) in usernameList" :key="index" class="check-user">{{ item }}</view>
            </view>
          </template>
          <template v-else-if="usernameList && usernameList.length > 1">
            <view class="check-content">
              <u-checkbox-group v-model="checkUserList" placement="column">
                <u-checkbox v-for="(item, index) in usernameList" :key="index" :label="item" :name="item"></u-checkbox>
              </u-checkbox-group>
            </view>
          </template>
        </ty-info-card>
      </view>
    </scroll-view>
    <view class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="confirmCheck()">确定核查</u-button>
      </view>
    </view>
  </up-popup>
</template>
<script setup lang="ts">
import { CheckSubmit } from '@/interfaces/member/project/audit/check'
import apiCheck from '@/api/member/project/audit/api.check'
import { showToast } from '@/utils/uniapp/toast'
const emit = defineEmits(['cancel', 'confirm'])
const props = defineProps({
  // 准入流水号
  refcode: {
    type: [String, Number],
    default: ''
  },
  // 买方流水号
  dtcRefcode: {
    type: [String, Number],
    default: ''
  },
  // 买方名称
  orgname: {
    type: String,
    default: ''
  }
})
let usernameList = ref<string[]>([]) // 核查人员(接口返回)
let checkUserList = ref<string[]>([]) // 核查人员(页面选中)
const showPopup = ref(true) // 企业核查情况弹窗
let loading = ref(false)
// 提交数据
let submitData = reactive<CheckSubmit>({
  aplRefcode: props.refcode,
  dtcRefcode: props.dtcRefcode,
  checkUsers: '',
  applyRemark: '',
  checkSuperior: ''
})
const cancel = () => {
  showPopup.value = false
  emit('cancel')
}
// 获取核查人员
const getVerifyUserInfo = () => {
  apiCheck.getVerifyUserInfo(props.refcode).then(res => {
    usernameList.value = res.data.verifyUsers
    submitData.checkSuperior = res.data.verifySuperior && res.data.verifySuperior.length ? res.data.verifySuperior.join(',') : ''
    //  submitData.applyRemark = res.data.lastApplyRemark || ''
  })
}
const confirmCheck = () => {
  //当只有一个核查人员时默认赋值
  if (usernameList.value && usernameList.value.length === 1) {
    checkUserList.value = usernameList.value
  }
  if (checkUserList.value.length === 0) {
    showToast('请选择核查人员')
    return
  }
  submitData.checkUsers = checkUserList.value.join(',')
  loading.value = true
  apiCheck.doSubmitVerifyApply(submitData).then(
    () => {
      showToast('操作成功')
      loading.value = false
      showPopup.value = false
      emit('confirm')
    },
    () => {
      loading.value = false
    }
  )
}
onMounted(() => {
  getVerifyUserInfo()
})
</script>
<style lang="scss" scoped>
.operate {
  padding: 20rpx 30rpx 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  .cancel {
    color: #909193;
  }
  .submit {
    color: #3c9cff;
  }
}
.remark {
  min-height: 160rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.pop-content {
  max-height: 60vh;
  .check-content {
    margin-bottom: 30rpx;
    :deep(.u-checkbox__icon-wrap) {
      margin-right: 10rpx;
      width: 36rpx !important;
      height: 36rpx !important;
    }
    :deep(.u-checkbox-group) {
      width: 100%;
      .u-checkbox {
        margin: 0;
        align-items: center;
        height: 72rpx;
        line-height: 72rpx;
        .u-icon__icon {
          font-size: 24rpx !important;
        }
        .uicon-checkbox-mark {
          span {
            color: #fff;
          }
        }
        span {
          font-size: 28rpx;
          color: $sub-color;
        }
      }
    }
    .check-user {
      font-size: 28rpx;
      line-height: 46rpx;
      color: $sub-color;
    }
  }
}
</style>
