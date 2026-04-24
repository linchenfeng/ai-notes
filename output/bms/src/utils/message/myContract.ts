/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-10 13:17:00
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2024-07-11 17:10:48
 * @Description  : 微信公众号消息跳转，合同签约模块
 */
import apiSignInfo from '@/api/member/api.signInfo'
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
// import { showToast } from '../uniapp/toast'
import { redirectTo } from '../uniapp'
// import { logOut } from '@/utils/permissions'
import { errorToast } from './index'
// 签约信息收集补充/退回
export function signContractGather(makeRefcode: number): void {
  apiSignInfo.getMakingContractStatus(makeRefcode).then(res => {
    if (!['1', '3'].includes(res.data.contractInfoStatus)) {
      // showToast('当前业务状态已变更，请关注最新消息')
      errorToast('当前业务状态已变更，请关注最新消息')
      // logOut()
    } else {
      const messageInfo = {
        path: `/member/myinfo/contractCollect/collectInfo/${encodeBase64(makeRefcode)}`,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member`)
    }
  })
}
// 合同待签约/已签约
export function signContract(orgRefcode, queryType) {
  const messageInfo = {
    path: `/member/customer/signProcess/detail/${encodeBase64(orgRefcode)}/${encodeBase64(queryType)}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}
