import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { setStorage, getStorage } from '@/utils/storages'
import { MenuItem } from '@/interfaces/common/menu'
interface MenuGuideUser {
  userName: string
  flag: string
}
interface FoundItem {
  refcode: number | string
  index: number | string // 记录当前项在同级数组中的索引
  funid: string
}
const guideVo = {
  'member:project:apply:assist': 'applyassist', //申请征信协销
  'member:project:audit:documentReview': 'documentreview', //资料复核
  'member:project:audit:assistAppoint': 'appointassist', //指派征信,
  'member:project:query:dataInsight': 'datainsight', //数据洞察
  'member:project:apply:siteDueDiligence': 'applySiteDueDiligence', // 现场尽调
  'member:project:audit:assignDueDiligence': 'auditAssignDueDiligence', // 指派尽调
  'member:project:audit:check': 'check', // 核查企业
  'member:project:apply:loanApply': 'loanApply', // 融资申请
  'member:project:audit:loanApply': 'loanAudit', // 融资审批
  'member:project:query:business': 'business', // 业务洞察
  'member:project:query:business:performance': 'performance', // 业绩过程
  'member:project:query:business:loan': 'loan', // 放宽信息
  'member:project:query:business:customer': 'customer', // 客户盘点
  'member:project:query:business:overdue': 'overdue', // 逾期信息
  'member:project:audit:invoice': 'auditInvoice', // 开票审核
  'member:myinfo:invoice': 'myinfoInvoice' // 我的-发票管理
}
const contentVo = {
  'member:project:query:dataInsight': '通过此功能可以<br>查询跨境电商的业务看板数据' //数据洞察
}
export function useDriverGuide() {
  const driver = ref<Driver | null>(null)
  const userName = getStorage('userName') as string
  // 存储首页传入的「状态更新回调」
  // eslint-disable-next-line no-extra-parens
  const guideCloseCallback = ref<(() => void) | null>(null)
  const setGuideCloseCallback = (callback: () => void) => {
    guideCloseCallback.value = callback
  }
  /**
   * 递归检查菜单列表中是否包含目标funid
   * @param menuList 菜单列表
   * @param targetList 目标funid列表
   * @returns 包含的funid集合
   */
  const checkMenuHasTargetFunids = (menuList: MenuItem[], targetList: string[]) => {
    const foundFunids: FoundItem[] = [] // 改为存储包含索引的对象数组
    // 递归遍历函数，新增参数记录当前项在父数组中的索引
    const traverseMenu = (items: MenuItem[]) => {
      items.forEach((item, index) => {
        // index 为当前项在同级数组中的索引
        // 检查当前项是否在目标列表中且未被记录
        if (targetList.includes(item.funid) && !foundFunids.some(i => i.refcode === item.refcode)) {
          foundFunids.push({
            funid: item.funid,
            refcode: item.refcode,
            index: index % 4 // 保存当前项的同级索引
          })
        }
        // 递归检查子菜单
        if (item.childFuns && item.childFuns.length > 0) {
          traverseMenu(item.childFuns)
        }
      })
    }

    traverseMenu(menuList)
    return foundFunids
  }
  // 阻止点击事件的辅助函数
  const preventClick = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()
  }
  driver.value = new Driver({
    className: 'scoped-class',
    padding: 3,
    opacity: 0.78,
    keyboardControl: false, // 是否启用键盘导航（箭头键、ESC）
    allowClose: false, // 是否显示关闭按钮（右上角 ×）
    overlayClickNext: false, // 点击遮罩层是否跳到下一步
    showButtons: false // 是否显示上一步 / 下一步按钮
  })
  // 关闭新手指引
  const closeGuide = guideKey => {
    let userList = getStorage(guideKey) as MenuGuideUser[]
    userList = userList || []
    const userItem = { userName, flag: '1' }
    userList.push(userItem)
    setStorage(guideKey, userList)
    //调用回调，通知首页关闭指引（修改 showGuide）
    if (guideCloseCallback.value) {
      guideCloseCallback.value()
    }
  }
  // 初始化新手指引
  const initDriver = (refcodeList: FoundItem[], guideKey: string, type = 'project') => {
    // 遍历refcode数组，生成多步骤配置
    const stepList = refcodeList.map((item, sindex) => ({
      element: `.driver${item.refcode}`, // 每个步骤对应不同的refcode元素
      popover: {
        title: '业务申请',
        position: 'bottom',
        className: `popover-class${item.index} popover-class-${type}`,
        // 描述内容可根据步骤索引自定义（如不同步骤显示不同文案）
        description: `<view class="step-item-content">
                 <view class="${guideVo[item.funid]}">${contentVo[item.funid] ? contentVo[item.funid] : ''}</view>
          <view class="${sindex === refcodeList.length - 1 ? 'iknow' : 'next-button'}"></view>
        </view>`
      },
      onHighlightStarted: (element: { node: HTMLElement | null }) => {
        if (element.node) {
          // 阻止当前步骤元素的点击/触摸事件
          element.node.addEventListener('click', preventClick, true)
          element.node.addEventListener('touchstart', preventClick, true)
          element.node.addEventListener('touchend', preventClick, true)
        }
        // 高亮后绑定下一步按钮事件
        setTimeout(() => {
          const nextBtn = document.querySelector(`.next-button`)
          const iKnow = document.querySelector(`.iknow`)
          const operateBtn = nextBtn || iKnow
          if (operateBtn) {
            // 点击按钮：非最后一步跳下一步，最后一步可触发关闭（可选）
            const handleNext = () => {
              if (driver.value) {
                if (sindex < refcodeList.length - 1) {
                  // 非最后一步：移动到下一个指引步骤
                  driver.value.moveNext()
                } else {
                  // 最后一步：可手动关闭指引（根据需求调整，如调用closeGuide）
                  driver.value.moveNext()
                  closeGuide(guideKey) // 若需要最后一步点击完成后记录状态，可解开注释
                }
              }
              // 移除按钮事件监听，避免重复绑定
              operateBtn.removeEventListener('click', handleNext)
            }
            operateBtn.addEventListener('click', handleNext)
          }
        }, 500)
      },
      onDeselected: (element: { node: HTMLElement | null }) => {
        // 步骤结束后，移除当前元素的事件阻止
        if (element.node) {
          element.node.removeEventListener('click', preventClick, true)
          element.node.removeEventListener('touchstart', preventClick, true)
          element.node.removeEventListener('touchend', preventClick, true)
        }
      }
    }))

    // 若步骤列表为空，直接返回
    if (stepList.length === 0) {
      return
    }

    // 初始化并启动指引
    if (driver.value) {
      driver.value.defineSteps(stepList) // 传入多步骤配置
      driver.value.start() // 从第一步开始指引
    }
  }

  return {
    driver,
    initDriver,
    checkMenuHasTargetFunids,
    setGuideCloseCallback
  }
}
