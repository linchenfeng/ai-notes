# BMS 申请页生成规则

以下规则基于 `src/pages/member/project/apply/*` 这条业务线整理而成，重点参考了这些页面：

- `src/pages/member/project/apply/application/Apply.vue`
- `src/pages/member/project/apply/access/Apply.vue`
- `src/pages/member/project/apply/special/Apply.vue`
- `src/pages/member/project/apply/assist/Apply.vue`
- `src/pages/member/project/apply/loanApply/Apply.vue`

并结合对应的：

- `src/router/member/project/apply/*.ts`
- `src/api/member/project/apply/api.*.ts`
- `src/interfaces/member/project/apply/*.ts`

开始写申请页前，优先先看同业务目录下的 `index.vue`、`Apply.vue`、`Detail.vue`、`Success.vue`、`Failure.vue` 和 `components/`，不要把申请页简单理解成一个独立表单。

## 一、先理解申请页的工作流

### 1. 申请页不是单文件页面

这个项目里的申请页通常是一条工作流，而不是单页表单。常见组成包括：

- 列表页 `index.vue`
- 申请编辑页 `Apply.vue`
- 详情页 `Detail.vue`
- 子记录页，例如 `BuyerInfo.vue`、`BuyerInfoEdit.vue`
- 成功页 `Success.vue`
- 失败页 `Failure.vue`

有些业务还会继续拆：

- 选择页
- 子详情页
- 上传或补录页

新增申请功能时，不要只写一个 `Apply.vue` 就结束，优先先判断这一整条工作流需要补齐哪些页面。

### 2. 先找当前业务切片

优先按已有业务切片落点，例如：

- `apply/application`
- `apply/access`
- `apply/assist`
- `apply/loanApply`
- `apply/quota`
- `apply/special`
- `apply/siteDueDiligence`
- `apply/warning`

不要因为当前需求而新起一套新的申请目录结构。

## 二、必选规则

### 1. 页面与四层目录要一起判断

申请页通常至少会同时涉及：

- `src/pages/member/project/apply/<业务目录>`
- `src/router/member/project/apply/<业务目录>.ts`
- `src/api/member/project/apply/api.<业务>.ts`
- `src/interfaces/member/project/apply/<业务>.ts`

不要只改页面层，不同步检查路由、API、类型是否需要补齐。

### 2. 申请页的默认页面角色

一个标准申请业务切片里，优先先判断这些页面角色是否需要存在：

- `index.vue` 负责列表或入口
- `Apply.vue` 负责申请编辑、保存、提交、确认
- `Detail.vue` 负责只读详情或流程详情
- `Success.vue` 负责提交成功反馈
- `Failure.vue` 负责失败或失效反馈

如果业务里存在子对象，例如买方、门店、材料、标签，再按业务拆：

- `BuyerInfo.vue`
- `BuyerInfoEdit.vue`
- `ShopDetail.vue`
- `MaterialQuery.vue`

### 3. 申请页默认骨架

`Apply.vue` 优先按下面顺序组织：

`NavBar -> 顶部状态区(可选) -> 退回/驳回/暂缓原因区(可选) -> 顶部基础信息区 -> 分组表单区 -> 历史或流程区(可选) -> 底部操作区`

补充约束：

- 顶部状态区优先复用 `state-module`
- 顶部基础信息区通常先展示客户经理、业务主管等基础字段
- 表单主体优先按业务分组拆成多个 `ty-info-card`
- 如果申请页天然带历史过程，优先复用已有 `History` 模块
- 保存、提交、确认、退回等操作优先放到底部固定操作区

### 4. 申请页不是普通“自由表单页”

申请页里的输入区域通常是：

- `u-form`
- `u-form-item`
- `u-cell-group`
- `u-input`
- 现有插件组件

并且很多字段会混合：

- 只读展示
- 可编辑输入
- 字典选择
- 条件显隐
- 子记录跳转编辑

不要上来就套一份通用表单模板，也不要把所有字段都做成统一的一排输入框。

### 5. 顶部状态区与原因区规则

- 有申请状态时，优先显示 `state-module`
- 状态名称与状态颜色优先集中在 `stateName`、`stateColor` 映射里维护
- 退回原因、驳回原因、暂缓原因、确认备注优先放在状态区下方单独展示
- 不要把原因说明埋进普通表单项里

### 6. 主数据统一收口

申请页主数据优先统一收口到：

- `vm.submitInfo`
- `vm.self`
- 同业务目录已有的主对象命名

不要把申请主对象拆成大量长期并行的 `ref`。

常见模式：

```ts
let submitInfo: DemoApplyInfo = {
  buyerList: [],
  applyStatus: ''
}

let vm = reactive({
  submitInfo
})
```

如果有多个选择器数据源、字典列表、临时选择数据，可以并到同一个 `vm` 中，但要和主对象区分清楚。

### 7. 保存、提交、确认要拆职责

申请页里至少要区分这些职责：

- 初始化和查详情
- 保存草稿
- 提交申请
- 确认申请
- 删除或撤回
- 退回或驳回

不要把这些逻辑混成一个“大提交函数”。

常见命名方向：

- `doSave`
- `onSubmit`
- `doCheckApplication`
- `sendBack`
- `onDelete`

优先沿用兄弟申请页已有命名。

### 8. 申请页经常是“状态驱动页面”

申请页里的很多 UI 都受状态影响，例如：

- 顶部状态模块是否显示
- 原因区是否显示
- 字段是否可编辑
- 按钮显示哪一组
- 选择器是否可点击
- 是否显示成功/失败流程节点

因此：

- 优先按状态组织页面分支
- 把状态判断集中在少量 `computed`、布尔变量或映射里
- 不要在模板中散落大量重复状态判断

### 9. 分组表单区规则

申请页主体优先按业务分组，而不是所有字段平铺一屏。

常见分组包括：

- 业务产品
- 客户基本信息
- 买方及贸易信息
- 授信信息
- 开票信息
- 附件材料
- 风险或补充说明

每个分组优先使用：

- `ty-info-card`
- `u-form`
- `u-cell-group`

### 10. 子记录编辑规则

申请页里常见“子对象编辑”，例如：

- 买方信息
- 门店信息
- 标签信息
- 材料信息

这类子对象优先按下面方式处理：

- 列表型入口放在 `Apply.vue` 中
- 新增/编辑/查看跳到独立子页面
- 删除操作在父页面列表区处理
- 参数继续沿用 `encodeBase64` / `decodeBase64`

不要把复杂子对象的所有编辑字段都硬塞进主申请页。

### 11. 选择器与弹层规则

申请页里很多字段依赖：

- `u-picker`
- `u-popup`
- 项目内选择组件
- 搜索选择组件
- 国家选择组件

优先复用已有能力，例如：

- `SelectCountry`
- `SearchSelect`
- 本地 `OrgList`

不要临时再写一套新的选择弹层。

### 12. 底部操作区规则

申请页底部按钮优先沿用：

- `button-fixed-bottom`
- `placeholder`
- `fixed`

常见按钮组合包括：

- 保存 + 提交
- 退回 + 确认
- 删除 + 保存 + 提交

补充约束：

- 按钮显示要受当前状态控制
- 高风险操作优先有确认弹窗
- 提交前校验、确认后提交、提交成功跳转要分开处理

### 13. 弹窗与确认流程规则

申请页经常包含：

- 退回原因输入弹窗
- 删除确认弹窗
- 继续提交确认弹窗
- 声明确认弹窗

这类逻辑优先保留为独立状态变量和独立确认函数，不要把所有弹窗共用成难以理解的一套临时逻辑，除非相邻页面本来就这样组织。

### 14. 历史与流程模块规则

- 如果当前申请业务已有历史过程模块，优先直接复用
- 查询页、申请页、详情页之间共享的 `History` 模块不要重复造
- 历史模块优先放在分组信息区之后、底部操作区之前

### 15. 成功页与失败页规则

- 提交成功后优先跳到本业务已有 `Success.vue`
- 链接失效、数据已更新、异常流程中断时优先复用 `Failure.vue` 或现有异常页
- 不要把所有成功失败提示都压缩成一个 toast

### 16. 路由规则

申请业务的路由通常按页面角色拆得很细，例如：

- `/apply/<biz>`
- `/apply/<biz>/apply/...`
- `/apply/<biz>/detail/...`
- `/apply/<biz>/buyerInfo/...`
- `/apply/<biz>/success`

补充约束：

- 优先沿用同业务目录已有路径命名风格
- 继续使用 `__dynamicImportComponent__`
- 保持 `meta` 字段结构与兄弟路由一致
- 可选参数、分享参数、子页参数沿用相邻路由声明方式

### 17. API 与类型规则

- 申请页 API 优先继续使用同业务目录里的 `api.<business>.ts`
- 请求与响应类型优先继续放在对应的 `interfaces/<business>.ts`
- 申请主对象、子对象列表、分享参数、弹层数据结构优先复用已有类型
- 不要在 `Apply.vue` 里长期保留大块匿名对象类型

## 三、可选增强规则

### 1. 分享链路规则

部分申请页带分享、客户填写、外链确认这类能力。

遇到这类场景时：

- 优先沿用现有 `shareDataObj`、分享时间、操作人字段组织方式
- 不要临时重造另一套外链参数协议

### 2. 上传与图片生成规则

申请页如果带附件上传、图片生成、水印上传等能力：

- 优先复用现有 `Uploader`
- 优先复用现有上传数据结构
- 不要为了单页需求新建一套上传层

### 3. 编辑态与只读态共存规则

很多申请页会同时存在：

- 可编辑态
- 退回后重填态
- 只读确认态

这时优先按状态控制组件显隐或禁用，不要复制一整套“编辑版页面”和“只读版页面”。

## 四、生成申请页时的检查清单

- 是否先判断了这次需求需要补齐哪些页面角色，而不是只写 `Apply.vue`
- 是否先参考了同业务目录下的 `index.vue`、`Apply.vue`、`Detail.vue`、`Success.vue`
- 是否同步检查了 `pages / router / api / interfaces`
- 是否把主数据统一收口到了 `vm.submitInfo` 或同类主对象
- 是否把保存、提交、确认、退回、删除拆成独立职责
- 是否优先复用了 `state-module`、`ty-info-card`、`u-form`、`Uploader`、现有选择组件
- 是否把买方、门店、材料等复杂子对象拆成独立子页或子组件
- 是否把高风险操作放进确认弹窗
- 是否让按钮、输入态、原因区围绕申请状态统一组织
- 是否保持了同业务目录下路由、API、类型命名的一致性

## 五、优先参考的真实页面方向

- 申请书型申请页：
  `member/project/apply/application/Apply.vue`
- 准入型申请页：
  `member/project/apply/access/Apply.vue`
- 特批型申请页：
  `member/project/apply/special/Apply.vue`
- 辅助类申请页：
  `member/project/apply/assist/Apply.vue`
- 放款申请页：
  `member/project/apply/loanApply/Apply.vue`
