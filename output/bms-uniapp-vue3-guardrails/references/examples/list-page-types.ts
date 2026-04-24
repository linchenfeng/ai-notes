/*
 * @Description  : 精简示例-列表页类型
 * @ExampleFrom  : interfaces/member/project/apply/quota.ts
 */
export interface DemoCount {
  waitCount: number
  doneCount: number
}

export interface DemoSearchData {
  keyword: string
  status: string
}

export interface DemoSearch {
  data: DemoSearchData
  pageNum: number
  pageSize: number
}

export interface DemoListItem {
  refcode: number | string
  title: string
  status: string
  applyDate: string
  bizScene: string
  productType: string
  applyAmt: number | string
  ccyid: string
}
