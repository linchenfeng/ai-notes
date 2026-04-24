<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-22 11:17:37
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-24 18:45:57
 * @Description  : 填写申请书，编辑模块
-->
<template>
  <view>
    <view class="application-application-apply">
      <u-form label-width="35%">
        <u-cell-group v-if="vm.submitInfo.fintAppM.operator !== '2'" :border="false" :stop="true">
          <view class="item-title">
            <u-cell title="业务产品" :value="getProduceType(vm.submitInfo.fintAppM.bizScene, vm.submitInfo.fintAppM.productType)" :border="false" />
          </view>
        </u-cell-group>
        <ty-info-card
          v-if="vm.submitInfo.conditionBuyerList && vm.submitInfo.conditionBuyerList.length && vm.submitInfo.fintAppM.operator !== '2'"
          title="有条件通过"
          :show-line="vm.submitInfo.fintAppM.operator !== '2' ? true : false"
        >
          <view class="condition">
            <view v-for="(item, index) in vm.submitInfo.conditionBuyerList" :key="index" class="condition-item">
              <span>
                <span class="condition-orgname">{{ item.orgname || item.aplOrgname }}：</span>
                <span class="condition-remark">{{ item.conditionRemark }}</span>
              </span>
            </view>
          </view>
        </ty-info-card>
        <ty-info-card title="申请人(卖方)信息" :show-line="vm.submitInfo.fintAppM.operator !== '2' ? true : false">
          <template #subtitle>
            <view
              v-if="vm.submitInfo.fintAppM.operator !== '2' && vm.submitInfo.fintAppM.applyStatus !== '2'"
              class="inviteWrite"
              @click.stop="inviteWrite"
            >
              <text class="iconfont invite icon-yaoqing"></text>
              <text class="name">邀请申请人填写</text>
            </view>
          </template>

          <view class="internation-info-group">
            <u-cell-group :border="false" :stop="true">
              <u-form-item label="申请人全称(卖方)" label-width="45%" required>
                <u-input
                  v-model="vm.submitInfo.fintAppM.orgname"
                  :readonly="true"
                  maxlength="90"
                  placeholder="请输入申请人全称"
                  @change="changeOrgname"
                />
              </u-form-item>
              <u-form-item
                label="统一社会信用代码
(境外企业可填写Company Registration No.或相关登记号)"
                label-width="52%"
                required
              >
                <u-input v-model="vm.submitInfo.fintAppM.companyCreditCode" maxlength="35" placeholder="请输入统一社会信用代码" />
              </u-form-item>
              <u-form-item label="卖方所在国" required>
                <view class="unFocus">
                  <u-input v-model="vm.submitInfo.fintAppM.ctyDesc" placeholder="请选择卖方所在国" />
                </view>
                <!-- <template #right>
                  <up-icon name="arrow-right" @click="showSelectCty()"></up-icon>
                </template> -->
              </u-form-item>
              <u-form-item label="经营地址" required>
                <u-input v-model="vm.submitInfo.fintAppM.operateAddress" maxlength="200" placeholder="请输入经营地址" />
              </u-form-item>
              <u-form-item label="成立时间" label-width="45%" required>
                <view class="unFocus" @click="showSelectRegDate">
                  <u-input v-model="vm.submitInfo.fintAppM.regDate" placeholder="请选择成立时间" />
                </view>
                <template #right>
                  <up-icon name="arrow-down" @click="showSelectRegDate"></up-icon>
                </template>
              </u-form-item>
              <u-form-item label="主要经营范围" required>
                <u-input v-model="vm.submitInfo.fintAppM.businessScope" maxlength="2000" placeholder="请输入主要经营范围" />
              </u-form-item>
              <u-form-item label="法人" required>
                <u-input v-model="vm.submitInfo.fintAppM.legalPerson" maxlength="30" placeholder="请输入法人" />
              </u-form-item>
              <u-form-item label="法人联系电话" label-width="45%" required>
                <u-input v-model="vm.submitInfo.fintAppM.legalPhone" maxlength="30" placeholder="请输入法人联系电话" />
              </u-form-item>
              <u-form-item label="法人通讯工具号" label-width="45%">
                <u-input v-model="vm.submitInfo.fintAppM.legalCommNo" maxlength="30" placeholder="请输入法人通讯工具号" />
              </u-form-item>
              <u-form-item label="联系人姓名" label-width="45%" required>
                <u-input v-model="vm.submitInfo.fintAppM.legalLinkman" maxlength="30" placeholder="请输入联系人姓名" />
              </u-form-item>
              <u-form-item label="联系人电话" label-width="45%" required>
                <u-input v-model="vm.submitInfo.fintAppM.legalLinkmanPhone" maxlength="30" placeholder="请输入联系人电话" />
              </u-form-item>
              <u-form-item label="联系人通讯工具号" label-width="45%">
                <u-input v-model="vm.submitInfo.fintAppM.legalLinkmanCommNo" maxlength="30" placeholder="请输入联系人通讯工具号" />
              </u-form-item>
            </u-cell-group>
          </view>
        </ty-info-card>
        <ty-info-card title="买方信息">
          <template v-if="vm.submitInfo.fintAppM.operator !== '2'" #subtitle>
            <view class="inviteWrite" @click.stop="addBuyer">
              <text class="iconfont invite icon-plustianjia"></text>
              <text class="name">添加</text>
            </view>
          </template>
          <view v-for="(item, i) in vm.submitInfo.buyerList" :key="i" class="buyer-swipe" @click="addBuyerInfo(item, i)">
            <ty-swipe-action :index="i" :disabled="vm.submitInfo.fintAppM.operator === '2'">
              <template #slide-right>
                <view class="slide-right" @click="onDeleteBuyer(item, $event)">
                  <text class="iconfont del icon-shanchu"></text>
                  <view>删除</view>
                </view>
              </template>
              <view class="buyerList-item">
                <view class="orgname">{{ item.orgname || item.aplOrgname }}</view>
                <view :class="`supplementStatus` + item.supplementStatus">
                  {{ getValueByKey(item.supplementStatus, 'supplementStatus') }}
                </view>
                <up-icon name="arrow-right" color="#999999"></up-icon>
              </view>
            </ty-swipe-action>
          </view>
        </ty-info-card>
        <ty-info-card
          v-if="
            !(
              vm.submitInfo.fintAppM.operator === '2' &&
              ['9'].includes(vm.submitInfo.fintAppM.payCreditType || '') &&
              vm.submitInfo.fintAppM.creditPaymentType === '1'
            )
          "
          :title="vm.submitInfo.fintAppM.operator === '1' ? '缴纳征信费' : ''"
        >
          <u-form-item v-if="vm.submitInfo.fintAppM.operator === '1'" label="缴纳征信费" label-width="45%" required>
            <!-- 客户经理展示 -->
            <view class="unFocus" @click="showSelectType('0')">
              <u-input v-model="vm.submitInfo.fintAppM.payCreditTypeDesc" placeholder="请选择缴纳征信费" />
            </view>
            <template #right>
              <up-icon name="arrow-down" @click="showSelectType('0')"></up-icon>
            </template>
          </u-form-item>
          <u-form-item
            v-if="vm.submitInfo.fintAppM.operator === '1' && vm.submitInfo.fintAppM.payCreditType === '3'"
            label="征信费折扣"
            label-width="45%"
            required
          >
            <view class="unFocus" @click="showSelectType('2')">
              <u-input v-model="vm.submitInfo.fintAppM.discountDesc" placeholder="请选择征信费折扣" />
            </view>
            <template #right>
              <up-icon name="arrow-down" @click="showSelectType('2')"></up-icon>
            </template>
          </u-form-item>
          <u-form-item
            v-if="vm.submitInfo.fintAppM.operator === '1' && ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType)"
            label="付款方式"
            label-width="45%"
            required
          >
            <view class="unFocus" @click="showSelectType('1')">
              <u-input v-model="vm.submitInfo.fintAppM.creditPaymentTypeDesc" placeholder="请选择付款方式" />
            </view>
            <template #right>
              <up-icon name="arrow-down" @click="showSelectType('1')"></up-icon>
            </template>
          </u-form-item>
          <!--  常规/低折扣/标准折扣 & 先付  -->
          <view
            v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'"
            class="accountTitle"
          >
            收款账户信息
          </view>
          <view
            v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'"
            class="tip-box"
          >
            <view class="text2">若境外付款人打款，建议选择VTEAM FINANCIAL SERVICE LIMITED</view>
          </view>
          <view v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'">
            <u-form-item label="收款企业名称" label-width="30%" required>
              <view class="input-box unFocus" @click="showSelectType('3')">
                <u-input
                  v-model="vm.submitInfo.fintAppM.factoringName"
                  :disabled="vm.submitInfo.fintAppM.operator === '2'"
                  placeholder="请选择收款企业名称"
                />
              </view>
              <template #right>
                <up-icon name="arrow-down" :disabled="vm.submitInfo.fintAppM.operator === '2'" @click="showSelectType('3')"></up-icon>
              </template>
            </u-form-item>
            <u-form-item v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType)" label="缴费币种" label-width="45%" required>
              <view class="unFocus" @click="showSelectType('4')">
                <u-input
                  v-model="vm.submitInfo.fintAppM.ccyidDesc"
                  :disabled="vm.submitInfo.fintAppM.operator === '2'"
                  placeholder="请选择缴费币种"
                />
              </view>
              <template #right>
                <up-icon name="arrow-down" :disabled="vm.submitInfo.fintAppM.operator === '2'" @click="showSelectType('4')"></up-icon>
              </template>
            </u-form-item>
            <view>
              <view v-if="vm.submitInfo.fintAppM.invoiceType === '0'">
                <u-form-item label-width="30%" label="户名">
                  <div class="form-readonly">{{ vm.submitInfo.fintAppM.factoringMerchant }}</div>
                </u-form-item>
                <u-form-item label-width="30%" label="账号">
                  <div class="form-readonly">{{ vm.submitInfo.fintAppM.factoringAccountNo }}</div>
                </u-form-item>
                <u-form-item label="开户行">
                  <div class="form-readonly">{{ vm.submitInfo.fintAppM.factoringBank }}</div>
                </u-form-item>
              </view>
              <view v-else-if="vm.submitInfo.fintAppM.invoiceType === '1'">
                <view class="internation-info-group">
                  <u-cell-group :border="false" :stop="true">
                    <view class="item-title">
                      <u-cell title="户名" :value="vm.submitInfo.fintAppM.factoringMerchant" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="开户行(中文)" :value="vm.submitInfo.fintAppM.factoringBank" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="开户行(英文)" :value="vm.submitInfo.fintAppM.factoringBankEn" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="银行地址" :value="vm.submitInfo.fintAppM.factoringBankAddress" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="银行SWIFT CODE" :value="vm.submitInfo.fintAppM.factoringSwiftCode" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="行号(RTGS代码)" :value="vm.submitInfo.fintAppM.bankRtgsCode" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="分行号" :value="vm.submitInfo.fintAppM.bankBranchCode" :border="false" />
                    </view>
                    <view class="item-title">
                      <u-cell title="账号" :value="vm.submitInfo.fintAppM.factoringAccountNo" :border="false" />
                    </view>
                  </u-cell-group>
                </view>
              </view>
            </view>
          </view>

          <!-- 常规/低折扣/标准折扣 & 先付 || 客户(非必填) -->
          <u-form-item
            v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'"
            label="征信费银行回单"
            label-width="45%"
            class="fiel-form-item"
            :required="true"
          >
            <view>
              <Uploader
                key="1"
                ref="receiptRef"
                accept=".jpg,.jpeg,.png,.pdf,.gif"
                :max-size="10"
                file-key="receipt"
                :max-count="Infinity"
                remark-text="文件支持图片、PDF格式，大小不超过10MB"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '1') }"
                @upload-success="uploadSuccess"
                @upload-remove="uploadRemove"
              ></Uploader>
            </view>
          </u-form-item>
          <!-- 客户经理 & (低折扣 || 豁免 || 后付) -->
          <u-form-item
            v-if="
              vm.submitInfo.fintAppM.operator === '1' &&
              (['2', '9'].includes(vm.submitInfo.fintAppM.payCreditType || '') || vm.submitInfo.fintAppM.creditPaymentType === '2')
            "
            label="主管审批证明"
            class="fiel-form-item"
            required
          >
            <view>
              <Uploader
                key="2"
                ref="certificateRef"
                accept=".jpg,.jpeg,.png,.pdf,.gif"
                :max-size="10"
                file-key="certificate"
                :max-count="Infinity"
                remark-text="文件格式支持图片、PDF格式，大小不超过10MB"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '2') }"
                @upload-success="uploadSuccess"
                @upload-remove="uploadRemove"
              ></Uploader>
            </view>
          </u-form-item>
          <view
            v-if="
              vm.submitInfo.fintAppM.operator === '2' &&
              ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') &&
              vm.submitInfo.fintAppM.creditPaymentType === '1'
            "
            class="agreement-text"
          >
            申请人确认如贵我双方最终未实际开展保理业务，贵司无须退还申请人已缴纳的额度设立费及/或征信费用。
          </view>
        </ty-info-card>
        <ty-info-card
          v-if="
            (vm.submitInfo.fintAppM.operator === '1' &&
              ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType) &&
              vm.submitInfo.fintAppM.creditPaymentType === '1') ||
            (vm.submitInfo.fintAppM.operator === '2' && vm.submitInfo.fintAppM.billFlag !== '0')
          "
          ref="billingInfoRef"
          class="billing-info-card"
          title="开票信息"
        >
          <view>
            <u-form-item v-if="vm.submitInfo.fintAppM.operator === '1'" label="开票方式" label-width="30%" required>
              <view class="radio-group">
                <u-button
                  v-for="obj in getConstant('billFlag')"
                  :key="obj.key"
                  class="check-button"
                  :class="{ active: vm.submitInfo.fintAppM.billFlag === obj.key }"
                  round
                  size="mini"
                  @click="handlezzAction(obj.key, '1')"
                >
                  {{ obj.value }}
                </u-button>
              </view>
            </u-form-item>
          </view>
          <!-- 后开票 -->
          <view v-if="vm.submitInfo.fintAppM.billFlag === '1'">
            <u-form-item v-if="vm.submitInfo.fintAppM.invoiceType !== '1'" label="开票类型" label-width="45%" required>
              <view class="radio-group">
                <u-button
                  v-for="obj in getConstant('billType')"
                  :key="obj.key"
                  class="check-button"
                  :class="{ active: vm.submitInfo.fintAppM.billType === obj.key }"
                  round
                  size="mini"
                  @click="handlezzAction(obj.key, '2')"
                >
                  {{ obj.value }}
                </u-button>
              </view>
            </u-form-item>
            <u-form-item label="开票企业名称" required label-width="35%">
              <u-input v-model="vm.submitInfo.fintAppM.billOrgname" maxlength="90" placeholder="请输入开票企业名称" />
            </u-form-item>
            <u-form-item v-if="vm.submitInfo.fintAppM.invoiceType !== '1'" label="开票企业税号" required label-width="35%">
              <u-input v-model="vm.submitInfo.fintAppM.billDutyParagraph" maxlength="30" placeholder="请输入开票企业税号" />
            </u-form-item>
            <u-form-item label="开票企业邮箱" required label-width="35%">
              <u-input v-model="vm.submitInfo.fintAppM.billEmail" maxlength="120" placeholder="请输入开票企业邮箱" />
            </u-form-item>
          </view>
          <!-- 先开票 -->
          <view v-if="vm.submitInfo.fintAppM.billFlag === '2'">
            <view v-if="vm.submitInfo.fintAppM.operator === '1'" class="select-invoice" @tap="selectInvoice">
              <i class="iconfont icon-tianjia1" />
              <text class="name">选择已开发票</text>
            </view>
            <view class="unFocus">
              <u-form-item label="开票申请编号" label-width="35%" class="form-item-appNo">
                <view v-if="fgaiAppVo.appNo" class="view-appNo">{{ fgaiAppVo.appNo }}</view>
                <u-input v-else v-model="fgaiAppVo.appNo" maxlength="90" placeholder="请输入开票申请编号" />
              </u-form-item>
            </view>
            <view class="unFocus">
              <u-form-item label="开票金额(元)" label-width="35%">
                <view v-if="fgaiAppVo.ccyid && fgaiAppVo.generateAmt" class="apply-amt">
                  <text class="ccyid">{{ fgaiAppVo.ccyid }}</text>
                  <text>{{ moneyFormat(fgaiAppVo.generateAmt) }}</text>
                </view>
                <u-input v-else v-model="fgaiAppVo.generateAmt" maxlength="90" placeholder="请输入开票金额" />
              </u-form-item>
            </view>
            <view class="unFocus">
              <u-form-item label="开票企业名称" label-width="35%">
                <u-input v-model="fgaiAppVo.appOrgName" maxlength="90" placeholder="请输入开票企业名称" />
              </u-form-item>
            </view>
            <view v-if="vm.submitInfo.fintAppM.invoiceType !== '1'" class="unFocus">
              <u-form-item label="开票企业税号" label-width="35%">
                <u-input v-model="fgaiAppVo.appCreditCode" maxlength="90" placeholder="请输入开票企业税号" />
              </u-form-item>
            </view>
            <view class="unFocus">
              <u-form-item label="开票企业邮箱" label-width="35%" class="form-item-appNo">
                <view v-if="fgaiAppVo.email" class="view-appNo">{{ fgaiAppVo.email }}</view>
                <u-input v-else v-model="fgaiAppVo.email" maxlength="90" placeholder="请输入开票企业邮箱" />
              </u-form-item>
            </view>
          </view>
          <u-form-item
            v-if="
              (vm.submitInfo.fintAppM.billFlag === '1' && payeeAcctName !== vm.submitInfo.fintAppM.billOrgname) ||
              (vm.submitInfo.fintAppM.billFlag === '2' && payeeAcctName !== fgaiAppVo.appOrgName)
            "
            label-width="45%"
            class="fiel-form-item"
          >
            <template #label>
              <view class="download-template">
                <text class="download-text">付款委托书</text>
                <view class="download-button" @click="doDownloadTemplate">
                  <view class="download-button-icon">
                    <text class="iconfont icon-xiazai"></text>
                    <view class="download-button-text">下载模板</view>
                  </view>
                </view>
              </view>
            </template>
            <view class="tip-box">
              <view class="text2">付款人名称与开票企业名称不一致时，请上传</view>
            </view>
            <view>
              <Uploader
                key="1"
                ref="receiptRef"
                accept=".jpg,.jpeg,.png,.pdf,.gif"
                :max-size="10"
                file-key="payment"
                :max-count="1"
                remark-text="文件支持图片、PDF格式，大小不超过10MB"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '3') }"
                @upload-success="uploadSuccess"
                @upload-remove="uploadRemove"
              ></Uploader>
            </view>
          </u-form-item>
          <u-textarea
            v-if="['1', '2'].includes(vm.submitInfo.fintAppM.billFlag)"
            v-model="vm.submitInfo.fintAppM.remark"
            :confirm-type="null"
            auto-height
            maxlength="300"
            count
            class="inputValueClass"
            placeholder="若有其他说明请备注"
          ></u-textarea>
        </ty-info-card>
      </u-form>
      <u-picker
        v-if="showPicker"
        :show="showPicker"
        :columns="vm.columns"
        item-height="88"
        key-name="value"
        :default-index="defaultIndex"
        @confirm="doConfirm"
        @cancel="showPicker = false"
      />
    </view>
  </view>
  <u-datetime-picker
    ref="datePicker"
    v-model="temApplyDate"
    :show="showDatePicker"
    mode="date"
    item-height="88"
    title="成立时间"
    :min-date="date.minDate"
    :max-date="date.maxDate"
    @cancel="showDatePicker = false"
    @confirm="doDateConfirm"
  />
  <u-popup :show="showSelectCountry" mode="center">
    <SelectCountry
      type="list"
      title="国家地区信息"
      :data="selectCountryList.data"
      :search-fun="getCountryList"
      @back="close"
      @click-fun="clickFun"
    ></SelectCountry>
  </u-popup>
  <view v-if="isGuideFlag" class="guide-group">
    <cover-image class="guide-arrows" src="@/assets/member/myinfo/collect/guide-arrows.png" alt="指引" />
    <cover-image class="guide-tip" src="@/assets/member/myinfo/collect/guide-tip.png" alt="提示" />
    <cover-image class="guide-know" src="@/assets/member/myinfo/collect/guide-know.png" alt="知道了" @click="isGuideFlag = false" />
  </view>
  <u-overlay :show="isGuideFlag" @click="isGuideFlag = false"></u-overlay>
  <FilePreviewVue v-if="showPreview" :resource-uuid="previewUuid" @close-dialog="showPreview = false"></FilePreviewVue>
</template>

<script setup lang="ts">
import { ApplicationInfo } from '@/interfaces/member/project/apply/fillingApplication'
import { setStorage } from '@/utils/storages'
import { PropType } from 'vue'
import { ConstantArray, Constant } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
import { showToast } from '@/utils/uniapp/toast'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
import { onLoad } from '@dcloudio/uni-app'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { getInareaByCode } from '@/utils/constant'
import apiCommon from '@/api/common/api.common'
import SelectCountry from '@/plugins/SelectCountryNew.vue'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
import FilePreviewVue from '@/plugins/filePreview/index.vue'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { FactoringList, FgaiAppVo, FactoringListFactoringList } from '@/interfaces/member/myinfo/invoice'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { moneyFormat } from '@/utils/format'
let defaultIndex = ref([0])
const router = useRouter()
const props = defineProps({
  submitInfo: {
    type: Object as PropType<ApplicationInfo>,
    default: () => ({})
  },
  checkApplicationBuyer: {
    type: Function,
    default: () => {
      return false
    }
  }
})
const emit = defineEmits(['doSubmitApplicationTemp', 'doSave', 'onDeleteBuyer'])
let isGuideFlag = ref(false)
const showPicker = ref(false)
const showPreview = ref(false)
const previewUuid = ref('')
const receiptRef = ref()
const certificateRef = ref()
let showType = ''
let temApplyDate = ref('') // 时间选择器返回的数据，格式化后展示
let showDatePicker = ref(false) // 是否弹出日期选择器
const datePicker = ref()
let holdName = ref('')
let payeeAcctName = ref('') // 征信费银行回单识别的收款人名称
let payeeBankName = ref('') // 回单银行名称
let payeeAcctNo = ref('') // 回单银行账户

const date = {
  // 日期选择区间，仅供1900至今的数据
  minDate: new Date(1900, 0, 1),
  maxDate: new Date()
}
const billingInfoRef = ref()
type ListType = {
  code: string
  text: string
}
let selectCountryList = reactive({
  data: Array<ListType>()
})
let showSelectCountry = ref(false) // 是否展示选择国家弹窗
let submitInfo: ApplicationInfo = {
  buyerList: [],
  conditionBuyerList: [],
  fintAppM: {
    operator: '',
    applyStatus: '',
    applyOrgStatus: '',
    regDate: '',
    billFlag: '',
    billType: '',
    payCreditType: '',
    examineRemark: '',
    examineDate: '',
    discount: '',
    creditPaymentType: '',
    creditPaymentTypeDesc: '',
    discountDesc: '',
    invoiceType: '',
    billCcyid: '',
    factoringUsdAccountNo: '',
    factoringBankEn: '',
    factoringBankAddress: '',
    factoringSwiftCode: '',
    bankRtgsCode: '',
    bankBranchCode: '',
    ctyid: '',
    ctyDesc: '',
    superiorName: '',
    userName: '',
    applyDate: '',
    factoringHkdAccountNo: '',
    productType: '',
    bizScene: '',
    paymentCcyid: '',
    ccyidDesc: ''
  },
  userName: '',
  fintApxList: [],
  totalBuyerCount: 0
}
const columns: ConstantArray = [getConstant('payCreditType')]
const factoringList: FactoringList[] = []
const factoringCcyidList: FactoringListFactoringList[] = [] // 保理商币种列表
const factoringCcyidItem: FactoringListFactoringList = {} as FactoringListFactoringList
let vm = reactive({
  factoringList: factoringList, // 保理商集合
  submitInfo: submitInfo, // 提交信息
  columns: columns, //
  factoringCcyidList: factoringCcyidList, // 保理商币种列表
  factoringCcyidItem: factoringCcyidItem // 保理商币种项
})
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-15 10:07:01
 * @description: 弹出日期选择器
 */
const showSelectRegDate = () => {
  showDatePicker.value = true
  if (datePicker.value) {
    datePicker.value.innerValue = new Date('2020-06-06')
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-15 10:18:12
 * @param {*} value
 * @description: 选择日期
 */
const doDateConfirm = value => {
  vm.submitInfo.fintAppM.regDate = dateFormat(value.value)
  showDatePicker.value = false
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-14 09:45:03
 * @description:展示选择框【0=缴纳征信费/1=征信费付款方式/2=征信费折扣标准/3=选择保理商/4=缴费币种】
 */
const showSelectType = (type: string) => {
  if (type === '0') {
    let temList = getConstant('payCreditType')
    if (vm.submitInfo.totalBuyerCount < 3) {
      temList = temList.filter(item => item.key !== '3')
    }
    vm.columns = [temList]
    let index = temList.findIndex(item => item.key === vm.submitInfo.fintAppM.payCreditType)
    index = index === -1 ? 0 : index
    defaultIndex.value = [index]
  } else if (type === '1') {
    const temList = getConstant('creditPaymentType')
    vm.columns = [temList]
    let index = temList.findIndex(item => item.key === vm.submitInfo.fintAppM.creditPaymentType)
    index = index === -1 ? 0 : index
    defaultIndex.value = [index]
  } else if (type === '2') {
    let temList: Constant[] = []
    if (vm.submitInfo.totalBuyerCount >= 10) {
      let item = { key: '6', value: '6折' }
      temList.push(item)
    }
    if (vm.submitInfo.totalBuyerCount >= 5) {
      let item = { key: '7', value: '7折' }
      temList.push(item)
    }
    if (vm.submitInfo.totalBuyerCount >= 3) {
      let item = { key: '8', value: '8折' }
      temList.push(item)
    }
    vm.columns = [temList]
    let index = temList.findIndex(item => item.key === vm.submitInfo.fintAppM.discount)
    index = index === -1 ? 0 : index
    defaultIndex.value = [index]
  } else if (type === '3') {
    // 客户禁止修改
    if (vm.submitInfo.fintAppM.operator === '2') {
      return
    }
    let temList: Constant[] = []
    vm.factoringList.forEach(item => {
      let obj = { key: item.factoringName, value: item.factoringName }
      temList.push(obj)
    })
    vm.columns = [temList]
    let index = temList.findIndex(item => item.key === vm.submitInfo.fintAppM.factoringName)
    index = index === -1 ? 0 : index
    defaultIndex.value = [index]
  } else if (type === '4') {
    // 客户禁止修改
    if (vm.submitInfo.fintAppM.operator === '2') {
      return
    }
    // 缴费币种
    const colums = vm.factoringCcyidList.map(item => {
      return { key: item.billCcyid, value: item.ccyidDesc }
    })
    vm.columns = [colums]
  }
  showType = type
  showPicker.value = true
}
let fgaiAppVo = ref<FgaiAppVo>({
  appNo: '',
  appOrgName: '',
  appCreditCode: '',
  email: '',
  generateAmt: '',
  appDate: '',
  applyOrgname: '',
  appStatus: '',
  bankrollOrgName: '',
  billType: '',
  ccyid: '',
  ccyidDesc: '',
  confirmStatus: '',
  generateType: '',
  refcode: '',
  operatorType: '',
  showStatus: ''
})

const getBusinessInvoiceApp = () => {
  const data = {
    applyNo: vm.submitInfo.fintAppM.applyNo
  }
  apiInvoice.getBusinessInvoiceApp(data, vm.submitInfo.fintAppM.operator === '1').then(res => {
    if (res.data.fgaiAppVo) {
      fgaiAppVo.value = res.data.fgaiAppVo
      // 先开票且付款人名称存在时校验
      if (vm.submitInfo.fintAppM.billFlag === '2' && isNotEmpty(payeeAcctName.value)) {
        if (fgaiAppVo.value.appOrgName !== payeeAcctName.value) {
          showToast('付款人名称与开票企业名称不一致，请上传付款委托书')
        }
      }
    } else {
      fgaiAppVo.value.appNo = ''
      fgaiAppVo.value.appOrgName = ''
      fgaiAppVo.value.appCreditCode = ''
      fgaiAppVo.value.email = ''
      fgaiAppVo.value.generateAmt = ''
    }
  })
}
// 切换收款企业名称时，清掉已选择发票
const doBindBusinessApp = () => {
  if (!vm.submitInfo.fintAppM.refcode) {
    return
  }
  const submitData = {
    applyNo: vm.submitInfo.fintAppM.applyNo as string,
    fgaiAppList: []
  }
  apiInvoice.doBindBusinessApp(submitData, vm.submitInfo.fintAppM.operator === '1').then(() => {
    getBusinessInvoiceApp()
  })
}
// 选择器确定 【0=缴纳征信费/1=征信费付款方式/2=征信费折扣标准/3=选择保理商/4=缴费币种】
const doConfirm = value => {
  if (showType === '0') {
    vm.submitInfo.fintAppM.payCreditTypeDesc = value.value[0].value
    vm.submitInfo.fintAppM.payCreditType = value.value[0].key
  } else if (showType === '1') {
    vm.submitInfo.fintAppM.creditPaymentTypeDesc = value.value[0].value
    vm.submitInfo.fintAppM.creditPaymentType = value.value[0].key
  } else if (showType === '2') {
    vm.submitInfo.fintAppM.discountDesc = value.value[0].value
    vm.submitInfo.fintAppM.discount = value.value[0].key
    emit('doSave', 'auto')
  } else if (showType === '3') {
    vm.factoringList.forEach(item => {
      if (String(item.factoringName) === value.value[0].key) {
        vm.submitInfo.fintAppM.factoringName = item.factoringName
      }
    })
    vm.factoringCcyidList = vm.factoringList.find(item => item.factoringName === value.value[0].value)?.factoringList || []
    if (vm.factoringCcyidList && vm.factoringCcyidList.length === 1) {
      const factoringItem = vm.factoringCcyidList[0]
      vm.factoringCcyidItem = factoringItem
      vm.submitInfo.fintAppM.paymentCcyid = factoringItem.billCcyid
      vm.submitInfo.fintAppM.ccyidDesc = factoringItem.ccyidDesc
      vm.submitInfo.fintAppM.factoringName = factoringItem.factoringName
      vm.submitInfo.fintAppM.factoringMerchant = factoringItem.factoringMerchant
      vm.submitInfo.fintAppM.factoringAccountNo = factoringItem.factoringAccountNo
      vm.submitInfo.fintAppM.factoringBank = factoringItem.factoringBank
      vm.submitInfo.fintAppM.factoringBankEn = factoringItem.factoringBankEn || ''
      vm.submitInfo.fintAppM.invoiceType = factoringItem.invoiceType
      vm.submitInfo.fintAppM.factoringBankAddress = factoringItem.factoringBankAddress || ''
      vm.submitInfo.fintAppM.factoringSwiftCode = factoringItem.factoringSwiftCode || ''
      vm.submitInfo.fintAppM.bankRtgsCode = factoringItem.bankRtgsCode || ''
      vm.submitInfo.fintAppM.bankBranchCode = factoringItem.bankBranchCode || ''
      vm.submitInfo.fintAppM.factoringRefcode = factoringItem.refcode || ''
    } else {
      vm.factoringCcyidItem = {} as FactoringListFactoringList
      vm.submitInfo.fintAppM.paymentCcyid = ''
      vm.submitInfo.fintAppM.ccyidDesc = ''
      vm.submitInfo.fintAppM.factoringMerchant = ''
      vm.submitInfo.fintAppM.factoringAccountNo = ''
      vm.submitInfo.fintAppM.factoringBank = ''
      vm.submitInfo.fintAppM.factoringBankEn = ''
      vm.submitInfo.fintAppM.invoiceType = ''
      vm.submitInfo.fintAppM.factoringBankAddress = ''
      vm.submitInfo.fintAppM.factoringSwiftCode = ''
      vm.submitInfo.fintAppM.bankRtgsCode = ''
      vm.submitInfo.fintAppM.bankBranchCode = ''
      vm.submitInfo.fintAppM.factoringRefcode = ''
    }
    // 如果开票类型为先开票，清掉已选择发票
    if (vm.submitInfo.fintAppM.billFlag === '2') {
      doBindBusinessApp()
    }
    // 当买方信息已填写时，自动保存并放开分享权限
    /* if (vm.submitInfo.buyerList && vm.submitInfo.buyerList.length > 0) {
      emit('doSubmitApplicationTemp', 'select')
    } */
  } else if (showType === '4') {
    vm.submitInfo.fintAppM.ccyidDesc = value.value[0].value
    vm.submitInfo.fintAppM.paymentCcyid = value.value[0].key
    const factoringItem = vm.factoringCcyidList.find(item => item.billCcyid === value.value[0].key)
    if (factoringItem) {
      vm.factoringCcyidItem = factoringItem
      vm.submitInfo.fintAppM.paymentCcyid = factoringItem.billCcyid
      vm.submitInfo.fintAppM.ccyidDesc = factoringItem.ccyidDesc
      vm.submitInfo.fintAppM.factoringName = factoringItem.factoringName
      vm.submitInfo.fintAppM.factoringMerchant = factoringItem.factoringMerchant
      vm.submitInfo.fintAppM.factoringAccountNo = factoringItem.factoringAccountNo
      vm.submitInfo.fintAppM.factoringBank = factoringItem.factoringBank
      vm.submitInfo.fintAppM.factoringBankEn = factoringItem.factoringBankEn || ''
      vm.submitInfo.fintAppM.invoiceType = factoringItem.invoiceType
      vm.submitInfo.fintAppM.factoringBankAddress = factoringItem.factoringBankAddress || ''
      vm.submitInfo.fintAppM.factoringSwiftCode = factoringItem.factoringSwiftCode || ''
      vm.submitInfo.fintAppM.bankRtgsCode = factoringItem.bankRtgsCode || ''
      vm.submitInfo.fintAppM.bankBranchCode = factoringItem.bankBranchCode || ''
      vm.submitInfo.fintAppM.factoringRefcode = factoringItem.refcode || ''
    }
    if (vm.submitInfo.fintAppM.billFlag === '2') {
      doBindBusinessApp()
    }
  }
  showPicker.value = false
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-16 10:44:12
 * @description: 邀请填写展示分享指引
 */
const inviteWrite = () => {
  if (vm.submitInfo.buyerList && vm.submitInfo.buyerList.length === 0) {
    showToast('请至少添加一个买方信息')
    return
  }
  if (!vm.submitInfo.fintAppM.payCreditType) {
    showToast('请选择缴纳征信费方式')
    return
  }
  if (isEmpty(vm.submitInfo.fintAppM.billFlag)) {
    showToast('请选择开票方式')
    return
  }
  if (vm.submitInfo.fintAppM.billFlag === '2' && isEmpty(fgaiAppVo.value.appNo)) {
    showToast('请选择已开发票')
    return
  }
  emit('doSave', 'auto')
  isGuideFlag.value = true
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-09-25 16:40:39
 * @description: 返回底部
 */
const scrollBottom = () => {
  nextTick(() => {
    window.scrollTo({ top: 9999, behavior: 'smooth' })
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-14 14:30:49
 * @param {*} key
 * @param {*} type 【1=开票方式/2=开票类型】
 * @description:选择按钮
 */
const handlezzAction = (key: string, type: string) => {
  if (type === '1') {
    if (vm.submitInfo.fintAppM.billFlag !== key) {
      // 开票方式改变时，开票信息需要重置
      vm.submitInfo.fintAppM.billDutyParagraph = ''
      vm.submitInfo.fintAppM.billEmail = ''
      vm.submitInfo.fintAppM.billOrgname = ''
      vm.submitInfo.fintAppM.billType = ''
    }
    vm.submitInfo.fintAppM.billFlag = key
  } else {
    vm.submitInfo.fintAppM.billType = key
  }
  nextTick(() => {
    if (billingInfoRef.value) {
      if (type === '1') {
        scrollBottom()
      }
    }
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-15 09:17:57
 * @description: 改变企业名称必须重新调用eci
 */
const changeOrgname = () => {
  vm.submitInfo.fintAppM.applyOrgStatus = '0'
}
// 获取保理商集合
/* const getFactoringInfo = () => {
  apiFillingApplication.getFactoringInfo(vm.submitInfo.fintAppM.operator === '2' ? false : true).then(res => {
    vm.factoringList = res.data.factoringList
  })
} */
const getFactoringInfo = () => {
  apiInvoice.getFactoringInfo(vm.submitInfo.fintAppM.operator === '2' ? false : true).then(res => {
    vm.factoringList = res.data.factoringList
    if (isNotEmpty(vm.submitInfo.fintAppM.factoringName)) {
      const factoringItem = vm.factoringList.find(item => item.factoringName === vm.submitInfo.fintAppM.factoringName)
      if (factoringItem) {
        vm.factoringCcyidList = factoringItem.factoringList || []
      }
    }
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 16:47:36
 * @description: 获取企业信息
 */
const getApplyOrgInfo = () => {
  if (!vm.submitInfo.fintAppM.orgname) {
    showToast('请输入申请人全称')
    return
  }
  apiFillingApplication.getApplyOrgInfo(vm.submitInfo.fintAppM.orgname, '2').then(
    res => {
      vm.submitInfo.fintAppM.applyOrgStatus = '1'
      vm.submitInfo.fintAppM.companyCreditCode = res.data.companyCreditCode
      const address = res.data.address || ''
      if (res.data.companyCreditCode) {
        vm.submitInfo.fintAppM.applyOrgSource = '1'
      }
      if (res.data.inarea) {
        const inarea = getInareaByCode(res.data.inarea)
        if (inarea) {
          //优先取省市区编码表数据
          vm.submitInfo.fintAppM.operateAddress = getInareaByCode(res.data.inarea) + address
        } else {
          apiCommon.getCountryInfo(res.data.inarea).then(ress => {
            vm.submitInfo.fintAppM.operateAddress = ress.data.ctyDesc + address
          })
        }
      }
      vm.submitInfo.fintAppM.regDate = dateFormat(res.data.regDate || '')
      vm.submitInfo.fintAppM.businessScope = res.data.businessScope
      vm.submitInfo.fintAppM.legalPerson = res.data.legalPerson
      if (vm.submitInfo.fintAppM.orgname === vm.submitInfo.fintAppM.billOrgname && !vm.submitInfo.fintAppM.billDutyParagraph) {
        vm.submitInfo.fintAppM.billDutyParagraph = res.data.companyCreditCode
      }
    },
    () => {
      vm.submitInfo.fintAppM.applyOrgStatus = '1'
      vm.submitInfo.fintAppM.applyOrgSource = '0'
    }
  )
}
// 添加买方信息
const addBuyer = () => {
  // 添加买方之前先校验推送状态
  if (vm.submitInfo.fintAppM.refcode && vm.submitInfo.fintAppM.applyStatus !== '2') {
    apiFillingApplication.doCheckApplication({ refcode: vm.submitInfo.fintAppM.refcode }).then(res => {
      if (res.data.pushReadStatus === '1') {
        showToast('申请书分享后无法修改')
        setTimeout(() => {
          router.back(1)
        }, 1500)
      } else {
        setStorage('bizScene', vm.submitInfo.fintAppM.bizScene)
        setStorage('productType', vm.submitInfo.fintAppM.productType)
        setStorage('application-buyerInfo', vm.submitInfo.buyerList)
        if (vm.submitInfo.fintAppM.operator === '1') {
          const path = `/member/project/apply/application/buyerInfo/${encodeBase64(-1)}/${encodeBase64(vm.submitInfo.fintAppM.orgname as string)}`
          router.push(path)
        }
      }
    })
  } else {
    setStorage('bizScene', vm.submitInfo.fintAppM.bizScene)
    setStorage('productType', vm.submitInfo.fintAppM.productType)
    setStorage('application-buyerInfo', vm.submitInfo.buyerList)
    if (vm.submitInfo.fintAppM.operator === '1') {
      const path = `/member/project/apply/application/buyerInfo/${encodeBase64(-1)}/${encodeBase64(vm.submitInfo.fintAppM.orgname as string)}`
      router.push(path)
    }
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 17:33:20
 * @description: 补充买方信息
 */
const addBuyerInfo = (item, index) => {
  setStorage('application-buyerInfo', vm.submitInfo.buyerList)
  setStorage('bizScene', vm.submitInfo.fintAppM.bizScene)
  setStorage('productType', vm.submitInfo.fintAppM.productType)
  if (vm.submitInfo.fintAppM.operator === '1') {
    // 客户经理
    router.push(`/member/project/apply/application/buyerInfo/${encodeBase64(index)}/${encodeBase64(vm.submitInfo.fintAppM.orgname as string)}`)
  } else {
    // 客户进入校验买方数量
    props.checkApplicationBuyer().then(res => {
      if (res) {
        router.push(`/clientApplication/buyerInfo/${encodeBase64(index)}`)
      }
    })
  }
}

// 下载模板
const doDownloadTemplate = () => {
  apiFillingApplication.doDownloadTemplate(vm.submitInfo.fintAppM.refcode, payeeAcctName.value, payeeBankName.value, payeeAcctNo.value)
}

const doOcrReceipt = (resourceUuid: string) => {
  apiFillingApplication.doOcrReceipt(resourceUuid).then(res => {
    if (vm.submitInfo.fintAppM.billOrgname !== res.data.payeeAcctName) {
      vm.submitInfo.fintAppM.billDutyParagraph = ''
    }
    vm.submitInfo.fintAppM.billOrgname = res.data.payeeAcctName || ''
    setStorage('payeeAcctName', res.data.payeeAcctName)
    payeeAcctName.value = res.data.payeeAcctName || ''
    payeeBankName.value = res.data.payeeBankName || ''
    payeeAcctNo.value = res.data.payeeAcctNo || ''
    // 先开票且开票企业名称存在时校验
    if (vm.submitInfo.fintAppM.billFlag === '2' && isNotEmpty(fgaiAppVo.value.appOrgName)) {
      if (fgaiAppVo.value.appOrgName !== res.data.payeeAcctName) {
        showToast('付款人名称与开票企业名称不一致，请上传付款委托书')
      }
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 16:50:01
 * @return {*}
 * @description: 上传文件成功
 */
const uploadSuccess = data => {
  if (!data.fileKey) {
    return
  }
  // fileType【1=征信费银行回单/ 2=主管审批证明/3=付款委托书】
  let fileType = '1'
  if (data.fileKey === 'certificate') {
    fileType = '2'
  }
  if (data.fileKey === 'payment') {
    fileType = '3'
  }
  let item = {
    refcode: data.refcode,
    fileName: data.fileName,
    remark: data.remark || '',
    fileUuid: data.fileUuid,
    resourceUuid: data.resourceUuid,
    suffixalType: data.fileType,
    fileType: fileType
  }
  vm.submitInfo.fintApxList.push(item)
  // 征信费银行回单进行ocr识别
  if (fileType === '1') {
    doOcrReceipt(item.resourceUuid)
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-03-05 10:00:42
 * @description: 删除文件
 */
const uploadRemove = (fileList, fileKey, data) => {
  vm.submitInfo.fintApxList.forEach((item, i) => {
    if (item.resourceUuid === data.resourceUuid) {
      vm.submitInfo.fintApxList.splice(i, 1)
      if (item.fileType === '1') {
        // 清掉银行回单后,清掉开票企业名称和税号
        vm.submitInfo.fintAppM.billOrgname = ''
        vm.submitInfo.fintAppM.billDutyParagraph = ''
      }
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:09
 * @param {*} val
 * @description: 分类选择组件查询方法
 */
const getCountryList = (val: string) => {
  holdName.value = val
  return new Promise<Array<ListType>>((resolve, reject) => {
    selectCountryList.data = []
    apiCommon.getCountryList('-', val).then(
      res => {
        if (res.data.countryList && res.data.countryList.length) {
          res.data.countryList.forEach(item => {
            selectCountryList.data.push({
              code: item.ctyid,
              text: item.ctyDesc
            })
          })
        } else {
          selectCountryList.data = []
        }
        resolve(selectCountryList.data)
      },
      () => {
        reject(false)
      }
    )
  })
}
const getCtyDesc = async () => {
  await getCountryList('') // 获取国家列表
  let obj = selectCountryList.data.find(item => item.code === vm.submitInfo.fintAppM.ctyid)
  if (obj) {
    vm.submitInfo.fintAppM.ctyDesc = obj.text
  } else {
    vm.submitInfo.fintAppM.ctyDesc = ''
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 14:40:27
 * @description: 选择国家
 */
/* const showSelectCty = () => {
  if (holdName.value) {
    // 若存在holdName 则说明搜索过国家，此处获取所有国家
    getCountryList('')
  }
  showSelectCountry.value = true
} */
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:50
 * @param {*} data
 * @description: 选择国籍确定
 */
const clickFun = (data: ListType) => {
  vm.submitInfo.fintAppM.ctyDesc = data.text
  vm.submitInfo.fintAppM.ctyid = data.code
  showSelectCountry.value = false
}
const close = () => {
  showSelectCountry.value = false
}
// 客户经理删除买方
const onDeleteBuyer = (buyerItem, event: MouseEvent) => {
  event.stopPropagation()
  emit('onDeleteBuyer', buyerItem)
}
const getProduceType = (bizScene, productType) => {
  const bizSceneName = getValueByKey(bizScene, 'intBizScene')
  return bizSceneName ? `${bizSceneName}-${productType}` : productType
}
const selectInvoice = () => {
  if (isEmpty(vm.submitInfo.fintAppM.factoringName)) {
    showToast('请选择收款企业名称')
    return
  }
  if (isEmpty(vm.submitInfo.fintAppM.paymentCcyid)) {
    showToast('请选择缴费币种')
    return
  }
  emit('doSave', 'invoice')
}

onLoad(() => {
  vm.submitInfo = props.submitInfo
  getCtyDesc() // 获取国家列表
  getFactoringInfo()
  //客户经理且卖方所属国为中国首次进入
  if (vm.submitInfo.fintAppM.operator === '1' && !vm.submitInfo.fintAppM.refcode && vm.submitInfo.fintAppM.ctyid === 'CHN') {
    getApplyOrgInfo()
  }
  // 先开票时查询关联发票
  if (vm.submitInfo.fintAppM.billFlag === '2') {
    getBusinessInvoiceApp()
  }
})
const getInvoiceInfo = () => {
  return fgaiAppVo.value
}
// 获取开票信息卡片距离顶部的位置
const getBillingInfoTop = () => {
  const dom = document.querySelector('.billing-info-card')
  return dom ? dom.getBoundingClientRect().top + window.scrollY : 0
}
defineExpose({
  inviteWrite,
  getInvoiceInfo,
  getBillingInfoTop
})
</script>

<style lang="scss" scoped>
.input-box {
  width: 100%;
}
.application-application-apply {
  :deep(.u-icon__icon) {
    color: $remark-color !important;
  }
  .internation-info-group {
    :deep(.u-cell-group) {
      padding-top: 0;
      margin: 0;
      .iconfont,
      .u-icon__icon {
        color: $remark-color !important;
      }
      .u-form-item__body__right__content__slot {
        justify-content: flex-end;
      }
      .u-cell__title-text {
        padding-left: 14rpx;
      }
      .u-cell__body {
        align-items: flex-start;

        .u-cell__value {
          overflow: hidden;
          white-space: pre-wrap;
          color: $remark-color;
        }
      }
    }
  }
  .collapse-item-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 24rpx;
  }
  .getOrgInfo {
    padding: 12rpx;
    text-align: center;
    margin: 0 0 28rpx 0;
    background: #e4f2fd;
    border: 1rpx solid #e8f0fd;
    border-radius: 5rpx;
    color: #138bec;
    #icon-sousuo2 {
      color: #138bec !important;
    }
    .text {
      font-size: 26rpx;
    }
    .btn-name {
      padding-left: 10rpx;
    }
  }
  .buyer-swipe:last-child {
    margin-bottom: 20rpx;
  }
  .buyer-swipe {
    height: 100rpx;
    display: flex;
    align-items: center;
    .slide-right {
      width: 140rpx;
      height: 100rpx;
      background: $u-error;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .del {
        padding-bottom: 5rpx;
      }
    }
  }
  .buyerList-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    .orgname {
      width: 470rpx;
      color: $default-color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .supplementStatus0 {
      color: $u-warning;
    }
    .supplementStatus1 {
      color: $u-success;
    }
  }
  .agreement-text {
    color: red;
    font-size: 24rpx;
    margin-bottom: 20rpx;
  }
  .accountTitle {
    font-weight: bold;
    color: $default-color;
    margin-bottom: 34rpx;
    font-size: 28rpx;
  }
  :deep(.fiel-form-item) {
    .download-template {
      display: flex;
      .download-text {
        color: $sub-color;
        font-size: 28rpx;
        margin-right: 20rpx;
        line-height: 48rpx;
      }
      .download-button {
        .download-button-icon {
          display: flex;
          align-items: center;
          color: $primary;
          .download-button-text {
            font-size: 28rpx;
          }
        }
      }
    }
    .u-form-item__body {
      display: block;
    }
    .u-form-item__body__right {
      margin-top: 20rpx;
      .u-form-item__body__right__content__slot {
        display: block;
      }

      .upload-tips {
        font-size: 24rpx;
        color: $sub-color;
      }
    }
  }
  :deep(.form-item-appNo) {
    .u-form-item__body__right {
      .u-form-item__body__right__content__slot {
        justify-content: end;
      }
    }
  }
  .view-appNo {
    text-align: right;
    line-height: 48rpx;
    font-size: 28rpx;
  }
  .apply-amt {
    line-height: 48rpx;
    font-size: 28rpx;
    display: flex;
    width: 100%;
    justify-content: flex-end;
    .ccyid {
      margin-right: 7rpx;
    }
  }
}
.vteam-button {
  padding: 0 30rpx;
  color: $default-color;
  .vteam-button-text {
    font-weight: bold;
  }
}
.guide-group {
  z-index: 10072;
  .guide-arrows {
    position: fixed;
    z-index: 10072;
    width: 117rpx;
    height: 101rpx;
    top: 8rpx;
    right: 66rpx;
  }
  .guide-tip {
    position: fixed;
    z-index: 10072;
    width: 382rpx;
    height: 70rpx;
    top: 86rpx;
    right: 43rpx;
  }
  .guide-know {
    position: fixed;
    z-index: 10072;
    width: 194rpx;
    height: 78rpx;
    top: 600rpx;
    right: 290rpx;
  }
}
.condition {
  margin-bottom: 30rpx;
  line-height: 40rpx;
  .condition-item {
    span {
      word-break: break-all !important;
    }
  }
  .condition-orgname {
    color: #666666;
  }
}
.tip-box {
  color: #e6a23c;
  font-size: 24rpx;
  line-height: 34rpx;
  margin-bottom: 10rpx;
}
.select-invoice {
  background-color: #e4f2fd;
  border-color: #e4f2fd;
  color: #138bec;
  padding: 15rpx;
  border-radius: 6rpx;
  font-weight: normal;
  text-align: center;
  margin-bottom: 20rpx;
  .name {
    margin-left: 5rpx;
  }
}
.inputValueClass {
  min-height: 160rpx;
  position: relative;
  top: -20rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
</style>
