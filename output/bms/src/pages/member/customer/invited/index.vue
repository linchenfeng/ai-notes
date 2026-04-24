<!--
 * @Author       : FangFang.Wu
 * @Date         : 2023-04-27 11:19:47
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-30 14:46:13
 * @Description  : 我的客户-客户详情-邀请入驻页面 /member/customer/invited/:refcode
-->
<template>
  <NavBar />
  <view class="customer-invited">
    <u-form>
      <u-cell-group inset>
        <u-cell title="客户名称" :value="invitedInfo.data.orgname" />
        <u-cell :value="invitedInfo.data.orgDesc" title="描述" readonly />
        <u-cell :value="invitedInfo.data.managementScale" title="规模" readonly />
        <u-cell :value="invitedInfo.data.oaIndustry" title="行业" readonly />
        <u-cell :value="invitedInfo.data.oaAddress" title="地址" readonly />
        <u-cell :value="invitedInfo.data.oaLinkman" title="联系人姓名" readonly />
        <u-cell :value="invitedInfo.data.oaLinkmanphone" title="联系人电话" readonly />
        <u-form label-width="50%">
          <u-form-item label="电子邮箱" required>
            <u-input v-model="invitedInfo.data.entryInvitationEmail" placeholder="请输入电子邮箱"></u-input>
          </u-form-item>
        </u-form>
        <!-- <u-input v-model="invitedInfo.data.entryInvitationEmail" label="电子邮箱" placeholder="请输入电子邮箱" maxlength="120" required /> -->
        <view class="btn-wrap"></view>
        <view class="button-fixed-bottom">
          <view class="placeholder"></view>
          <view class="fixed">
            <u-button block type="primary" :loading="loading" @click="doSubmit">提交</u-button>
          </view>
        </view>
      </u-cell-group>
    </u-form>
  </view>
</template>

<script lang="ts">
export default {
  name: 'CustomerInvited'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import apiCustomer from '@/api/member/api.custormer'
import { Detail } from '@/interfaces/member/customer/identificationProcess'
import { decodeBase64 } from '@/utils/crypto'
import { checkEmail } from '@/utils/validate'
import { showToast } from '@/utils/uniapp/toast'
import { reLaunch } from '@/utils/uniapp'
import { useRoute } from '@/uni-simple-router'
const route = useRoute()
const refcode = ref(0)

let invitedInfo = reactive({
  data: {} as Detail
})
const loading = ref(false)
/**
 * @Author: FangFang.Wu
 * @Date: 2023-04-27 13:39:03
 * @return {*}
 * @description: 获取客户信息
 */
const getCustomAuthInfo = () => {
  apiCustomer.getCustomAuthInfo(refcode.value).then(res => {
    invitedInfo.data = res.data.fbpaOrgMVo as Detail
  })
}

/**
 * @Author: FangFang.Wu
 * @Date: 2023-04-28 09:51:52
 * @return {*}
 * @description: 数据校验
 */
const validate = () => {
  if (!invitedInfo.data.entryInvitationEmail) {
    showToast('请输入电子邮箱')
    return false
  }
  if (!checkEmail(invitedInfo.data.entryInvitationEmail)) {
    showToast('请输入正确的电子邮箱')
    return false
  }
  return true
}

/**
 * @Author: FangFang.Wu
 * @Date: 2023-04-27 13:39:22
 * @return {*}
 * @description: 提交
 */
const doSubmit = () => {
  if (!validate()) {
    return
  }
  loading.value = true
  apiCustomer
    .doSubmitEntryInvitationInfo({
      refcode: refcode.value,
      entryInvitationEmail: invitedInfo.data.entryInvitationEmail,
      oaLinkmanphone: invitedInfo.data.oaLinkmanphone
    })
    .then(res => {
      loading.value = false

      const fromType = route.value.params.fromType as string

      showToast('提交成功')
      setTimeout(() => {
        if (fromType === '2') {
          reLaunch('/member/project/query/access')
        } else {
          reLaunch('/member/customer')
        }
      }, 100)
    })
    .catch(() => {
      loading.value = false
    })
}
onBeforeMount(() => {
  refcode.value = Number(decodeBase64(route.value.params.refcode as string))
  getCustomAuthInfo()
})
</script>

<style lang="scss" scoped>
.customer-invited {
  &:deep() {
    .u-cell__title {
      flex: 26% 0 1;
    }

    .u-input__control {
      text-align: right;
    }

    // 特殊处理联系人电话，避免样式错位
    .phone {
      .u-input__label::before {
        content: '';
      }
    }
  }
  .btn-wrap {
    margin: 120rpx 0 40rpx 0;
  }
}
</style>
