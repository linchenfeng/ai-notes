/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-04 17:19:11
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-11 11:40:02
 * @Description  : 微信公众号消息跳转
 */
// import { getHasPermissionsById } from '@/utils/permissions'
// import { showToast } from '../uniapp/toast'
import apiCustormer from '@/api/member/api.custormer'
import { ChatRouteParams } from '@/interfaces/message/chatMessage'
// import { logOut } from '@/utils/permissions'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
import { redirectTo } from '../uniapp'
import { setStorage } from '../storages'
import * as realAuth from './realAuth'
import * as baoya from './baoya'
import * as myContract from './myContract'
import * as domesticLoans from './domesticLoans'
import * as business from './business'
import * as application from './application'
import * as meetingResult from './meetingResult'
import * as specialApproval from './specialApproval'
import * as warningApproval from './warningApproval'
import * as freezeApproval from './freezeApproval'
import * as buyerQuota from './buyerQuota'
import * as quotation from './quotation'
import * as orgTaxAuth from './orgTaxAuth'
import * as dataCheckNoticeList from './dataCheckNoticeList'
import * as assist from './assist'
import * as dueDiligence from './dueDiligence'
import * as loanApply from './loanApply'
import * as invoice from './invoice'
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-11 17:20:56
 * @param {string} toastString 提示语
 * @description: 存在异常，如无权限、企业信息不匹配等，跳入页面后toast提示
 */
export function errorToast(toastString: string, path?: string) {
  const messageInfo = {
    path: path,
    isNotSkip: path ? true : false,
    toastString: toastString,
    showToastFlag: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}

/**
 * @Author: FangFang.Wu
 * @Date: 2023-07-25 17:24:45
 * @param {ChatRouteParams} routeParams userid 当前登录客户经理userid userName当前登录客户经理
 * @return {*}
 * @description: 路由跳转(根据公众号信息跳转到对应页面，参数为空则为正常登录)
 */
export function routeJump(routeParams: ChatRouteParams, userid: string, userName: string): void {
  if (routeParams && routeParams.moduleId) {
    // 判断权限
    // if (!getHasPermissionsById(routeParams.funid)) {
    //   const toastString = `当前账号暂无【${routeParams.moduleName}】业务权限，请向管理员确认`
    //   errorToast(toastString)
    //   return
    // }
    // 校验发送公众号消息的客户经理是否当前登录的客户经理
    if (routeParams.wxUserid && routeParams.wxUserid !== userid) {
      errorToast('当前账号与业务所属企业信息不匹配，请确认账号信息')
      return
    }
    const search = reactive({
      data: {
        orgname: '' // 企业名称
      }
    })
    // 判断消息跳转的企业是否是当前客户经理的客户，防止客户经理变更
    if (routeParams.orgRefcode && !['contractMake', 'contractReturn'].includes(routeParams.moduleId)) {
      apiCustormer.findCustomInfoPage(search).then(res => {
        if (res.data.fbpaOrgMVoList && res.data.fbpaOrgMVoList.length) {
          const isExist = res.data.fbpaOrgMVoList.some(item => item.refcode === Number(routeParams.orgRefcode))
          if (isExist) {
            switch (routeParams.moduleId) {
              // 专项融资
              case 'baoyaFinancingApply': // 一般企业发起专项融资申请
              case 'baoyaFinancingReview': // 资金方放款审批拒绝/资金方放款成功
              case 'baoyaFinancingRemind': // 专项融资到期前7天，提醒客户
                baoya.baoyaFinancingDetail(routeParams)
                break
              // 合同签约
              case 'contractSign':
                myContract.signContract(routeParams.orgRefcode, routeParams.queryType)
                break
              case 'authReview': // 客户企业认证成功
              case 'certificateSendOut': // 证书已寄出
              case 'ukeyExpireRemind': // UKEY过期提醒(客户经理)
                realAuth.authReview(routeParams.orgRefcode)
                break
              // 宝亚通过融资额度到期提醒
              case 'clDueRemind':
                baoya.baoyaClDueRemind(routeParams.orgRefcode)
                break
              // 税票授权成功
              case 'orgTaxAuth':
                orgTaxAuth.orgTaxAuthDetail(routeParams)
                break
              // 税票授权失败
              case 'orgTaxAuthFail':
                orgTaxAuth.orgTaxAuthFail(routeParams)
                break
              // 运营端有资料待上传，用户提交所有待办资料清单，检查退回
              case 'dataCheckNoticeList':
                dataCheckNoticeList.dataCheckNoticeList(routeParams)
                break
              default:
                redirectTo(`/member`)
              // logOut()
            }
          } else {
            // 找不到当前客户企业表明客户经理变更
            // showToast(`当前账号与业务所属企业信息不匹配，请确认账号信息`)
            errorToast('当前账号与业务所属企业信息不匹配，请确认账号信息')
            // logOut()
          }
        } else {
          // 无数据表示客户经理变更
          // showToast(`当前账号与业务所属企业信息不匹配，请确认账号信息`)
          errorToast('当前账号与业务所属企业信息不匹配，请确认账号信息')
          // logOut()
          return
        }
      })
    } else {
      // 无须检验企业是否为当前客户经理的客户，直接跳转
      switch (routeParams.moduleId) {
        // 国内贷后
        case 'paymentInfoFeedback':
          if (['1', '2', '3', '4', '5', '6'].includes(routeParams.remindTpye)) {
            domesticLoans.homePage()
            return
          } else if (['7', '8', '9', '10', '11', '12', '13'].includes(routeParams.remindTpye)) {
            domesticLoans.paymentInfoFeedbackPage()
            return
          }
          break
        // 签约信息/补充退回
        case 'contractMake':
        case 'contractReturn':
          // makeRefcode=合同流水号
          myContract.signContractGather(routeParams.makeRefcode)
          break
        case 'intApplyAccess': // 用户提交了业务申请，通知审核人审核
        case 'intAccessReply': // 客户经理回复了问题，通知审核人查看
          business.intApplyAccess(routeParams)
          break
        case 'intApproveReminder': // 审核超时提醒
          business.intApproveReminder(routeParams)
          break
        case 'intAccessQuizSubmitted': // 准入提问通知历史审批人
          business.intAccessQuizSubmitted(routeParams)
          break
        case 'intApplyQuery': // 用户提交了业务申请，通知主管查询
        case 'intAccessQuery': // 审批人审批了业务申请，通知客户经理、主管查看
        case 'intAccessQuiz': // 审批人有新提问，通知客户经理处理问题
        case 'intReplyQuery': // 审批人回复了问题，通知主管查看
        case 'intReplyReminder': // 答复超时提醒
          business.intApplyQuery(routeParams)
          break
        case 'intAccessQueryAccess': //准入通过/拒绝/有条件通过通知历史审批人
        case 'intApplyQueryAccess': //暂缓通知历史审批人
          business.intAccessQueryAccess(routeParams)
          break
        case 'intApplyOverseasBusiness': // 客户经理解除暂缓发送消息给最后一级审批人和公众号消息接收人
          business.intApplyOverseasBusiness()
          break
        case 'projectHome': // 解除暂缓
          business.projectHome()
          break
        case 'intApplyAccept':
          business.intApplyAccept(routeParams.refcode)
          break
        case 'intApplyDelete': //业务查询列表页面
          business.internationQuery()
          break
        case 'intOrgVerify': //核查申请
          business.intOrgVerify(routeParams)
          break
        case 'intAccessWithVerify': // 核查人员填写完成核查企业信息提交成功后，公众号通知有权审批人
          business.intAccessWithVerify(routeParams)
          break
        case 'checkOrgVerified': // 核查人员填写完成核查企业信息提交成功后，公众号通知有权审批人
          business.checkOrgVerified(routeParams)
          break
        case 'intApplicationCustomerSubmit': // 客户提交，通知客户经理处理申请
          application.applicationCustomerSubmit(routeParams)
          break
        case 'intApplicationAudit': // 运营端审核成功，通知客户经理查看
          application.applicationAudit(routeParams)
          break
        case 'applicationConfirmQuery': // 客户提交，通知客户经理查看
          application.applicationConfirmQuery(routeParams, userName)
          break
        case 'applicationReturnQuery': // 运营端申请书审核退回
          application.applicationReturnQuery(routeParams)
          break
        case 'applicationQuery': // 客户经理提交了申请书||到账确认通过后||客户经理在BMS提交申请书财务到账确认时审核退回||运营端申请书审核通过||运营端申请书审核拒绝
          application.applicationQuery(routeParams)
          break
        case 'meetingReview': // 上会结果复核||审查委员意见反馈跳入上会结果复核详情
          meetingResult.meetingReview(routeParams.refcode)
          break
        case 'meetingApproval': // 上会结果审批跳入上会结果审批详情
          meetingResult.meetingApproval(routeParams.refcode)
          break
        case 'meetingQuery': // 上会结果查询
        case 'meetingRevokeQuery': // 上会撤销查询
          meetingResult.meetingQuery(routeParams)
          break
        case 'meetingCollectAdit': // 上会汇整复核
          meetingResult.meetingCollectAdit(routeParams.refcode)
          break
        case 'saaApply': // 同步授信通过(跳转申请页面)
          specialApproval.toSpecialApply()
          break
        case 'saaApprove': //客户经理提交、 特批审批通过(通知下一级)、审批超时提醒(定时任务)
        case 'saaModify': // 中间审批人退回补充(发送给上一级审批修改)
          specialApproval.specialAudit(routeParams)
          break
        case 'saaReturnApply': // 第一级审批人退回补充(退回至特批申请，跳入特批申请页面)
          specialApproval.specialApply(routeParams)
          break
        case 'saaQuery': // 提交通知、审批拒绝、审批退回、审批通过
          specialApproval.specialQuery(routeParams)
          break
        case 'warningApprove': //客户经理提交、 预警审批通过(通知下一级)、审批超时提醒(定时任务)
        case 'warningModify': // 中间审批人退回补充(发送给上一级审批修改)
          warningApproval.warningAudit(routeParams)
          break
        case 'warningReturnApply': // 第一级审批人退回补充(退回至预警解除申请申请，跳入预警申请页面)
          warningApproval.warningApply(routeParams)
          break
        case 'warningQuery': // 提交通知、审批拒绝、审批退回、审批通过
          warningApproval.warningQuery(routeParams)
          break
        case 'warningTrigger': // 风控系统触发预警，跳转进入预警解除列表页
          warningApproval.warningTrigger()
          break
        case 'freezeQuery':
        case 'freezeApprove':
        case 'freezeModify':
        case 'freezeReturnApply':
          freezeApproval.freezeAudit(routeParams) // 提交通知、审批拒绝、审批退回、审批通过
          break
        case 'freezeTrigger':
          freezeApproval.freezeTrigger() // 冻结/解冻，跳转进入冻结/解冻列表页
          break
        case 'toAppClReview': // 运营端额度受理通过或买方额度申请已有历史额度，跳转进入额度审核详情页
          buyerQuota.toAppClReview(routeParams)
          break
        case 'appClQuery': // 运营端买方额度申请外部不可开立||买方额度审核选择已开立||运营端审批单复核通过，跳转进入项目-贷前查询-已开买方额度详情页
          buyerQuota.appClQuery(routeParams)
          break
        case 'toAppQuotation': // 买方额度审核选择已开立，跳转到业务报价审核页
          quotation.toAppQuotation(routeParams)
          break
        case 'appClQuotationQuery': // 业务报价提交，跳转到贷前查询-申请书详情页
          quotation.appClQuotationQuery(routeParams)
          break
        case 'assistSubmit': // 客户经理申请征信，协销主管接收跳转到指派申请页
          assist.assistSubmit(routeParams)
          break
        case 'assistSupervisorSubmit': // 客户经理申请征信，主管，李梦柯条线跳转到申请征信详情页
          assist.assistSupervisorSubmit(routeParams)
          break
        case 'appointSubmit': // 协销主管提交，通知征信主管申请
        case 'creditAssignNotice': //运营端，协销资料检查通过且没有补充资料，若征信主管还没有指派征信人员，则再次公众号通知征信主管指派征信人员|BMS-资料复核通过，若征信主管还没有指派征信人员，则再次公众号通知征信主管指派征信人员
          assist.appointSubmit(routeParams)
          break
        case 'appointAssistSubmit': // 协销主管或征信主管提交，通知主管，客户经理，李梦珂条线查看
        case 'appointAssistSameSubmit': // 协销主管或征信主管提交，通知协销人员，征信人员查看
        case 'appointAssistNotSameSubmitNoticeToAssist': // 征信人员和协销人员不是同一个人发送协销人员
        case 'appointAssistNotSameSubmitNoticeToCredit': // 征信人员和协销人员不是同一个人发送征信人员查看
          assist.appointAssistSubmit(routeParams)
          break
        case 'dueDiligence': // 尽调人员跳转进入开始尽调页面
          dueDiligence.dueDiligence(routeParams)
          break
        case 'dueDiligenceAssign': // 协销主管跳入指派协销页面
          dueDiligence.dueDiligenceAssign(routeParams)
          break
        case 'loanToApply': // 审核人退回给客户经理重新填写
          loanApply.loanToApply(routeParams)
          break
        case 'loanApplyApproval': // 客户经理提交给下一级审核人审核
          loanApply.loanApplyApproval(routeParams)
          break
        case 'loanApplyQuery': // 贷前查询融资申请查询
          loanApply.loanApplyQuery(routeParams)
          break
        case 'invoiceAudit': // 跳转开票审核
          invoice.invoiceAudit(routeParams)
          break
        case 'invoiceQuery': // 跳转开票管理查询详情页
          invoice.invoiceQuery(routeParams)
          break
        case 'invoiceReturnQuery': // 跳转开票管理退回重新提交详情页
          invoice.invoiceReturnQuery(routeParams)
          break
        default:
          redirectTo(`/member`)
          break
      }
    }
  }
}
