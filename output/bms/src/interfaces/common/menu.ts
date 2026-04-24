export interface ChildFun {
  /**
   * 子菜单，同上
   */
  childFuns?: { [key: string]: any }[]
  /**
   * 功能描述
   */
  funDesc?: string
  /**
   * 功能代号
   */
  funid?: string
  /**
   * 功能路径
   */
  funPath?: string
  /**
   * 资源类型[0=菜单/1=按钮]
   */
  funType?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 当前层
   */
  layid?: string
  /**
   * 父功能代号
   */
  parentid?: string
  /**
   * 流水号
   */
  refcode?: number
  /**
   * 序号
   */
  seqno?: string
  /**
   * 资源类型[11=BMS]
   */
  systemType?: string
  /**
   * 代办数量
   */
  badgeValue: number
}

export interface MenuItem {
  /**
   * 子菜单，循环嵌套，直至最后一层菜单
   */
  childFuns: MenuItem[]
  /**
   * 功能描述
   */
  funDesc: string
  /**
   * 功能代号
   */
  funid: string
  /**
   * 功能路径
   */
  funPath: string
  /**
   * 资源类型[0=菜单/1=按钮]
   */
  funType: string
  /**
   * 图标
   */
  icon: string
  /**
   * 当前层
   */
  layid: string
  /**
   * 代办
   */
  badgeValue: number
  /**
   * 父功能代号
   */
  parentid: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 序号
   */
  seqno: string
  /**
   * 资源类型[11=BMS]
   */
  systemType: string
}

export interface MenuList {
  /**
   * 菜单列表
   */
  menuList: MenuItem[]
}
export interface TodoData {
  [key: string]: number
}
