# BMS 列表页生成规则

以下规则基于 `src/pages/member/project/apply/quota/index.vue`，并结合 `src/pages/member/project/apply/access/index.vue`、`src/pages/member/project/query/application/index.vue` 的共同模式整理而成。

开始写列表页前，优先阅读本目录下的精简示例，而不是回源码里逐个查找：

- [examples/list-page-basic.vue](examples/list-page-basic.vue)
- [examples/list-page-action.vue](examples/list-page-action.vue)
- [examples/list-page-advanced-filter.vue](examples/list-page-advanced-filter.vue)
- [examples/list-page-route.ts](examples/list-page-route.ts)
- [examples/list-page-api.ts](examples/list-page-api.ts)
- [examples/list-page-types.ts](examples/list-page-types.ts)

## 一、必选规则

### 1. 页面骨架

- 列表页默认采用以下顺序：
  `NavBar -> 搜索区 -> 吸顶 tabs -> 列表区 -> 空态`
- 不要一开始就使用 PC 后台表格思维。该项目列表页以移动端卡片列表为主，通常使用：
  `uni-list`
  `uni-list-item`
  `u-cell-group`
  `u-cell`
- 如果页面需要顶部动作入口，优先放进 `NavBar` 插槽，而不是额外悬浮按钮。

### 2. 文件头与页面定位

- 保留文件头注释。
- `@Description` 使用中文业务层级加页面路由，例如：
  `项目-业务申请-申请买方额度 /member/project/apply/quota`
- 页面要能从注释中直接看出所属业务、页面类型和实际路由。

### 3. 查询状态统一收口

- 查询参数统一放在 `search` 对象中，不要拆成多个无关联的 `ref`。
- `search` 优先显式定义类型，不要长期保留匿名结构。
- `search` 默认结构保持为：
  `data`
  `pageNum`
  `pageSize`
- 查询字段放在 `search.data` 下，分页参数放在外层。
- 搜索、tab、刷新、翻页都围绕同一个 `search` 对象工作。

推荐结构：

```ts
const search = reactive<DemoSearch>({
  data: {
    keyword: '',
    status: ''
  },
  pageNum: 1,
  pageSize: 10
})
```

对应类型建议放在同业务的 `interfaces` 文件中，例如：

```ts
export interface DemoSearchData {
  keyword: string
  status: string
}

export interface DemoSearch {
  data: DemoSearchData
  pageNum: number
  pageSize: number
}
```

补充约束：

- 即使查询条件很少，也优先定义 `SearchData` 和 `Search` 这类类型。
- 简单列表页、带顶部操作的列表页、带高级筛选的列表页，查询对象都遵循同一规则。
- 不要在 `index.vue` 中长期保留 `const search = reactive({ ... })` 这种无类型匿名写法，除非只是临时草稿且后续会补齐。

### 4. 列表状态三件套

- 列表页默认维护以下状态：
  列表数组
  `totalCount`
  `finished`
- 翻页时向列表数组追加，不要整页覆盖。
- 发起新查询时要先：
  清空列表
  重置 `pageNum`
  重置 `finished`

常见模式：

```ts
const searchProjectPage = () => {
  vm.list = []
  search.pageNum = 1
  finished.value = false
  findPage()
}
```

### 5. 请求职责拆分

- 页面中至少拆出一个独立的 `findXxxPage` 方法承接列表查询。
- 如果 tabs 上有数量统计，再拆一个独立的 `getXxxCount` 或 `getXxxStatisticsCount` 方法。
- 不要把“查列表”“查统计”“重置查询”“切换 tab”写成一个大函数。
- 搜索、tab 切换、触底加载、下拉刷新应复用同一套列表查询方法。

### 6. 生命周期接入方式

- 列表页优先使用 uni-app 页面生命周期：
  `onShow`
  `onReachBottom`
  `onPullDownRefresh`
- `onShow` 一般用于每次进入页面刷新列表。
- `onReachBottom` 用于分页加载更多。
- `onPullDownRefresh` 用于下拉刷新，并在适当时机调用 `uni.stopPullDownRefresh()`。

### 7. 路由联动规则

- 只要列表页有下拉刷新或触底加载，路由里通常要开启：
  `enablePullDownRefresh: true`
  `onReachBottomDistance: 100`
- 列表页生成时，不要只写页面文件。优先同时检查 `pages / router / api / interfaces` 这四层是否已经齐全，并保证层级一一对应。
- 页面、路由、API、类型目录要严格平行对齐。优先按“当前业务层级 + 当前功能目录”推导，不要死记某个固定路径。例如申请类列表页常见映射为：
  `src/pages/member/project/apply/xx/index.vue`
  `src/router/member/project/apply/xx.ts`
  `src/api/member/project/apply/api.xx.ts`
  `src/interfaces/member/project/apply/xx.ts`

### 8. 列表项展示规则

- 列表项优先使用“卡片头 + 字段列表”的移动端展示方式。
- 第一行通常展示：
  主要识别信息
  状态标签
- 下面多行使用 `u-cell` 展示关键字段，不要堆砌大段自由排版。
- 长文本默认做省略处理，常见方式是：
  `ellipsis`
  `text-overflow: ellipsis`
  `white-space: nowrap`

### 9. 字典值与业务文案

- 状态、业务类型、枚举值优先通过现有工具转换，不要直接在模板里硬编码。
- 优先复用：
  `getValueByKey`
  `dateFormat`
  现有格式化函数
- 状态标签不仅要显示字典值，通常还要保留 `:class="\`status${item.xxxStatus}\`"` 这一类动态 class，用于按状态切换颜色。
- 如果一个字段需要业务拼接，例如“业务大类-产品类型”，优先抽一个小函数处理，不要在模板里写复杂表达式。

### 9.1 列表字段类型常见写法

以下是列表页中最常见的字段值写法，优先按字段语义选用，不要每次临时发挥。

- 普通文本：
  `:value="item.orgname"`
- 编号类：
  `:value="item.applyNo"`
  `:value="item.businessNo"`
- 数量类：
  `:value="item.counterpartyCount"`
  `:value="item.buyerCount"`
- 日期类（日期）：
  `:value="item.applyDate ? dateFormat(item.applyDate, 1) : ''"`
  适用于申请日期、上会日期、完成日期等列表展示
- 日期类（默认日期格式）：
  `:value="dateFormat(item.applyDate)"`
  当同类页面已经统一使用默认格式时可沿用
- 日期时间类：
  `:value="item.uploadDate ? dateFormat(item.uploadDate, 2) : ''"`
  适用于精确到时分秒或完整时间点的字段
- 字典/枚举类：
  `:value="getValueByKey(item.warningLevel, 'warningLevel')"`
  `:value="getValueByKey(item.creditProducts, 'fintCreditPro')"`
- 状态类：
  文案使用 `getValueByKey(...)`
  颜色使用 `:class="\`status${item.status}\`"` 这类动态 class
- 金额类：
  `:value="moneyFormat(item.applyAmt)"`
  适用于金额、余额、费用、开票金额等字段
- 利率/费率类：
  `:value="item.quotaRate"`
  如果项目后续已有统一格式化函数，优先切到统一函数；当前列表页里常见直接展示原值并在标题上补 `%`
- 业务拼接类：
  `:value="getProduceType(item.bizScene, item.productType)"`
  适用于“业务大类 + 产品类型”这类组合文案
- 带兜底的字典类：
  `:value="getValueByKey(item.ccyid, 'applyCcyid') ? getValueByKey(item.ccyid, 'applyCcyid') : item.ccyid"`
  适用于字典可能缺失但仍需展示原始值的字段

补充约束：

- 日期字段如果接口可能为空，优先使用三元表达式兜底为空字符串。
- 金额字段优先走 `moneyFormat`，不要在模板里自己拼千分位。
- 字典字段优先走 `getValueByKey`，不要在模板里堆 if/else。
- 业务组合字段优先抽函数，不要在 `:value` 里写过长表达式。
- 普通文本字段默认直接展示，不额外补 `|| '--'`，除非同类页面已经统一这么做。

### 10. 空态与结束态

- 无数据时统一使用 `u-empty`，并优先复用项目已有空图资源。
- 分页全部加载完时，列表底部统一显示“已经到底了”。
- 不要把“暂无数据”和“已经到底了”混成同一套提示逻辑。

### 11. 跳转参数规则

- 列表项点击通常跳详情页、编辑页或申请页。
- 路由参数优先使用 `encodeBase64` 编码后再传递。
- 如果目标路由支持可选参数，路径拼接方式要与现有路由声明保持一致。

## 二、可选增强规则

### 1. 搜索增强

- 默认先用一个 `up-search` 完成轻量搜索。
- 如果筛选项较多，不要把查询区无限拉长。
- 优先参考“基础搜索 + 顶部入口 + 弹层筛选”的组合方式，例如 `query/application/index.vue`。

### 2. tabs 组件选择

- 简单 tabs 可以沿用 `u-tabs`。
- 如果同类页面已经统一使用封装组件，例如 `ty-tabs`，则优先复用，不要重复造一版 tabs UI。

### 3. 顶部操作入口

- 如果列表页需要“发起申请”“新增”“高级筛选”等动作，优先放在 `NavBar` 插槽区域。
- 只有附近页面已经存在其他固定模式时，才跟随本地实现。

### 4. 状态样式细分

- 状态标签默认使用项目中的语义色变量，例如：
  `$warning`
  `$u-success`
  `$danger`
- 如果不同状态需要不同颜色，优先通过状态 class 扩展，而不是在模板中内联大量样式。
- 精简示例也要保留这种模式，避免因为示例过度简化而丢失真实项目里的动态着色约束。

## 三、生成列表页时的检查清单

- 是否先找到了同业务、同层级的兄弟列表页作为参照。
- 是否保持了 `NavBar -> 搜索区 -> tabs -> 列表区 -> 空态` 的整体结构。
- 是否把查询参数统一收口到 `search.data + pageNum + pageSize`。
- 是否拆分出了列表接口方法和统计接口方法。
- 是否实现了 `onShow`、`onReachBottom`、`onPullDownRefresh`。
- 是否在路由中补齐了下拉刷新和触底加载配置。
- 是否使用了 `u-empty` 和项目内空图。
- 是否对状态、日期、业务枚举使用了现有工具函数。
- 是否在跳转时使用了 `encodeBase64`。
- 是否保持了页面、路由、API、类型目录平行对齐。

## 四、优先参考的精简样例

- 基础列表页：
  `examples/list-page-basic.vue`
- 含主操作按钮的列表页：
  `examples/list-page-action.vue`
- 含高级筛选弹层的列表页：
  `examples/list-page-advanced-filter.vue`
- 对应路由：
  `examples/list-page-route.ts`
- 对应 API：
  `examples/list-page-api.ts`
- 对应类型：
  `examples/list-page-types.ts`

## 五、精简样例的参考来源

下面这些来源仅用于说明“精简样例是从哪些真实业务页面提炼出来的”，方便理解样例背景。

这些来源不是固定模板路径，也不是唯一落位规则。实际开发时，始终应以“当前业务层级 + 当前功能目录”的四层平行映射为准。

- `examples/list-page-basic.vue`
  参考来源：`apply` 类业务中的一个基础列表页样例
- `examples/list-page-action.vue`
  参考来源：`apply` 类业务中的一个带顶部主操作入口的列表页样例
- `examples/list-page-advanced-filter.vue`
  参考来源：`query` 类业务中的一个带高级筛选弹层的列表页样例
- `examples/list-page-route.ts`
  参考来源：一个开启了下拉刷新与触底加载的列表页路由样例
- `examples/list-page-api.ts`
  参考来源：一个列表页对应的 API 封装样例
- `examples/list-page-types.ts`
  参考来源：一个列表页对应的查询参数与列表项类型样例
