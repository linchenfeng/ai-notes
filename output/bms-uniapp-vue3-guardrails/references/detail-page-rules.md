# BMS 详情页生成规则

以下规则基于项目中多类真实详情页整理而成，重点参考了这些页面：

- `src/pages/member/project/query/application/Detail.vue`
- `src/pages/member/project/audit/quotation/Detail.vue`
- `src/pages/member/project/apply/access/Detail.vue`
- `src/pages/member/project/query/warning/Detail.vue`
- `src/pages/member/customer/detail/index.vue`
- `src/pages/member/myinfo/invoice/Detail.vue`

开始写详情页前，优先先看同业务目录下的兄弟 `Detail.vue`、`index.vue` 和 `components/`，不要直接套通用详情页模板。

## 一、必选规则

### 1. 先判断详情页类型

这个项目里的详情页至少分成三类：

- 纯信息详情页
- 流程型详情页
- 聚合型详情页

常见判断方式：

- 只是查看若干字段和分组信息，通常是纯信息详情页
- 既展示详情，又带状态、审批历史、驳回原因、底部操作，通常是流程型详情页
- 页面本身主要负责聚合多个子模块，而不是平铺字段，通常是聚合型详情页

不要一开始就假设所有详情页都长成同一种样子。

### 2. 默认页面骨架

详情页优先按下面顺序组织：

`NavBar -> 顶部状态区(可选) -> 驳回/退回/暂缓原因区(可选) -> 顶部基础信息区 -> 分组信息区 -> 底部操作区(可选)`

补充约束：

- `NavBar` 仍然是默认入口，不要自行替换导航骨架
- 顶部状态区优先放在 sticky 容器中
- 驳回原因、退回原因、暂缓原因优先放在状态区下方单独展示
- 基础信息区通常先于业务分组信息出现
- 底部操作只在明确业务状态下显示

### 3. 文件头与页面定位

- 保留文件头注释
- `@Description` 优先使用中文业务层级加实际路由
- 页面应能从注释中直接看出所属业务、详情类型和对应路径

示例风格：

- `项目-业务查询-申请书查询 /member/project/query/application/detail`
- `项目-我的-开票管理-发票详情 /member/myinfo/invoice/detail`

### 4. 路由参数与详情主数据统一收口

- 路由参数优先通过 `decodeBase64` 解码
- 详情主数据优先统一收口到一个主对象中，例如：
  `vm.self`
  `vm.detail`
  `vm.submitInfo`
- 不要把详情字段拆成大量长期存在的零散 `ref`
- 如果详情页还有附件、统计、子列表，也优先围绕主对象组织，而不是平铺一层层临时状态

推荐结构：

```ts
const self: DemoDetail = {} as DemoDetail

const vm = reactive({
  self
})
```

如果该详情页天然是复合对象，也可以使用：

```ts
const vm = reactive({
  detailInfo: {} as DemoDetail,
  apxList: [] as DemoFile[],
  historyList: [] as DemoHistory[]
})
```

### 5. 请求职责拆分

- 页面中至少拆出一个独立的 `getXxxDetail` 或 `getXxxInfo` 方法负责详情查询
- 如果还要查询历史、统计、附件、子模块数据，再分别拆独立方法
- 不要把“查详情”“查历史”“处理按钮点击”“路由跳转”写成一个大函数
- 如果当前业务已有详情接口命名习惯，优先沿用兄弟文件命名

常见模式：

```ts
const getInvoiceDetail = () => {
  apiInvoice.getInvoiceDetail(refcode).then(res => {
    vm.self = res.data.fgaiAppVo
  })
}
```

### 6. 生命周期接入方式

- 详情页默认优先使用 `onMounted`、`onBeforeMount` 或 uni-app 页面生命周期
- 如果页面每次进入都应刷新，可参考兄弟页面使用 `onShow`
- 不要为了风格统一而强行改掉相邻目录已经形成的生命周期入口

### 7. 顶部状态区规则

- 有业务状态时，优先复用 `state-module`
- 状态名称优先来自：
  字典映射
  状态对象映射
  现有业务函数
- 状态颜色优先集中在一个 `stateColor` 对象里维护
- 不要在模板中硬写大量状态判断和颜色逻辑

推荐模式：

```ts
const stateColor = {
  '0': 'error',
  '1': 'warning',
  '3': 'success'
}
```

### 8. 驳回、退回、暂缓等异常信息规则

- 驳回原因、退回原因、暂缓原因优先单独成块展示
- 该区域通常位于状态区下方、基础信息区上方
- 长文本允许换行，优先使用现有 `returnReason`、`reasonValue` 风格
- 不要把异常原因塞进普通 `u-cell` 中弱化掉

### 9. 顶部基础信息区规则

- 顶部基础信息通常使用 `u-cell-group + u-cell`
- 常见字段包括：
  客户经理
  业务主管
  申请编号
  申请日期
  业务产品
- 这部分通常不需要复杂卡片嵌套，优先保持简洁
- 如果相邻页面已有 `topCell` 容器，就继续沿用

### 10. 分组信息区规则

- 详情页默认不是自由排版页，优先按业务分组展示
- 分组优先使用 `ty-info-card`
- 分组内部优先使用 `u-cell-group + u-cell`
- 每个分组只承载一类清晰的业务语义，不要把不相关字段硬塞进同一块

常见分组包括：

- 基本信息
- 申请信息
- 买方信息
- 开票信息
- 报价信息
- 审批信息
- 历史记录
- 附件材料

### 11. 长文本与纵向字段规则

- 备注、说明、原因、摘要类字段优先使用纵向展示
- 如果相邻页面已使用 `vertical-cell` 或 `#value` 插槽，就继续沿用
- 不要把很长的说明文字放进普通右对齐短值布局中
- 复杂组合文案优先抽小函数，不要在模板里写很长表达式

### 12. 附件展示规则

- 详情页附件优先复用 `Uploader` 的只读模式
- 通过 `:editable="false"` 明确只读语义
- 附件分组按 `fileType`、业务类型或兄弟页面既有规则筛选
- 不要为只读附件再造一套新的预览组件

常见模式：

```vue
<Uploader
  :editable="false"
  :res-uuid-vo="{ fileList: vm.self.apxList }"
></Uploader>
```

### 13. 子组件拆分规则

- 如果某个信息块字段较多、结构稳定，优先拆到 `components/`
- 详情页中的 `BaseInfo.vue`、`InvoiceInfo.vue`、`BasicInfo.vue` 是优先参考的拆分方式
- 聚合型详情页优先组合多个现成模块，而不是把所有内容平铺在当前文件里
- 只有跨多个业务切片稳定复用时，才考虑把详情子块提升出当前页面目录

### 14. 聚合型详情页规则

像 `member/customer/detail/index.vue` 这种详情页，页面本身主要负责“组合模块”而不是“平铺字段”。

遇到这类页面时：

- 页面层只负责拉主数据、传递关键参数、控制底部动作
- 业务区块优先交给独立模块处理
- 不要把所有子模块内容回填进当前详情页

### 15. 底部操作区规则

- 底部操作区只在业务允许的状态下显示
- 优先沿用：
  `button-fixed-bottom`
  `placeholder`
  `fixed`
  这一套现有结构
- 多按钮操作优先与相邻页面保持顺序一致
- 删除、撤回、解除暂缓等高风险操作优先配确认弹窗
- 按钮点击逻辑、校验逻辑、接口调用逻辑应拆分，不要糅成一坨

### 16. 字典值、日期、金额与组合文案规则

- 日期优先使用 `dateFormat`
- 金额优先使用 `moneyFormat`
- 字典值优先使用 `getValueByKey`
- 状态值优先通过状态映射或字典转换
- 两个以上字段组合成展示文案时，优先抽小函数或 `computed`

不要这样做：

- 在模板里手写大量 if/else
- 在模板里手写金额格式化
- 在模板里拼过长业务表达式

## 二、可选增强规则

### 1. 审批历史与流程模块

- 如果当前业务详情页常带历史或审批过程，优先拆成独立 `History` 模块
- 查询页、审核页、申请页如果共享同一块历史展示，优先复用现有模块

### 2. 买方、门店、子记录详情跳转

- 如果详情页内部还有子记录入口，优先沿用“列表项 + 箭头 + 点击跳转”的现有写法
- 跳转参数优先继续使用 `encodeBase64`

### 3. 页面级样式策略

- 详情页容器常见背景色为浅灰，信息块区域保持白底卡片
- 状态区 sticky 样式、`topCell`、`returnReason`、底部固定按钮样式优先沿用兄弟页面
- 不要为单个详情页发明一整套新的视觉语言

## 三、生成详情页时的检查清单

- 是否先判断了当前是纯信息详情、流程型详情还是聚合型详情
- 是否优先参考了同业务目录下的兄弟详情页
- 是否保持了 `NavBar -> 状态区 -> 原因区 -> 基础信息 -> 分组信息 -> 底部操作` 的整体结构
- 是否把主数据统一收口到了 `vm.self`、`vm.detail` 或同类对象
- 是否拆出了独立的 `getXxxDetail` 方法
- 是否对状态、日期、金额、字典值复用了已有工具
- 是否优先使用 `ty-info-card`、`u-cell-group`、`Uploader`、`state-module`
- 是否在复杂信息块上优先拆了本地 `components/`
- 是否在有风险的底部操作上加了确认弹窗
- 是否保持了页面、API、类型、路由目录的业务平行对齐

## 四、优先参考的真实页面方向

- 流程型详情页：
  `member/project/query/application/Detail.vue`
  `member/project/apply/access/Detail.vue`
  `member/myinfo/invoice/Detail.vue`
- 纯信息详情页：
  `member/project/audit/quotation/Detail.vue`
  `member/project/query/warning/Detail.vue`
- 聚合型详情页：
  `member/customer/detail/index.vue`
