import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
// 运营端有资料待上传，用户提交所有待办资料清单，检查退回
export function dataCheckNoticeList(routeParams: ChatRouteParams): void {
  const messageInfo = {
    path: `/member/customer/businessMaterial/detail/${encodeBase64(routeParams.orgRefcode)}/${encodeBase64(routeParams.crossBorderType)}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/customer`)
}
