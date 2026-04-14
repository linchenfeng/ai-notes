# 项目约定

本仓库是一个基于 `qiankun` 的微前端项目，包含 `main` 主应用，以及位于 `subApp/` 下的多个子应用。以下内容用于约束本项目中的代码生成方式。

## 1. 项目定位

- 将本项目视为已有成熟模式的 `Vue 2` 后台项目。
- 优先沿用当前工程结构，不主动引入新的分层模型。
- 新增页面或功能前，先查看同一子应用、同一业务目录下的相邻模块，再决定代码组织方式。

## 2. 基础风格

规则来源：`main/.eslintrc.js`、`main/.prettierrc`

- 使用单引号。
- 非必要不加分号，除非当前文件本身明显统一使用分号。
- 缩进使用 2 个空格。
- 保持代码可读，不为格式统一而大面积改动稳定代码。
- 遵循仓库现有的 Vue 与 standard 风格 lint 规则。

## 3. 目录与命名

### 3.1 目录映射

本项目先按业务路径分层，再在 `pages`、`router/modules`、`api` 三层中保持对应关系。

- `router/modules/<业务路径>` 对应 `pages/<业务路径>` 和 `api/<业务路径>`。
- 目录路径是最核心的约束，业务域与子业务域在三层中应尽量保持一致。
- `router` 通常使用模块文件，例如 `router/modules/business/match/project.js`。
- `pages` 通常使用同名功能目录，例如 `pages/business/match/project/`。
- `api` 放在相同业务路径下，但按接口职责拆分为 `api.xxx.js`。

典型示例：

- `subApp/platform/src/router/modules/business/match/project.js`
- `subApp/platform/src/pages/business/match/project/`
- `subApp/platform/src/api/business/match/api.projectReview.js`

### 3.2 菜单页面组织

一个菜单功能通常使用“一个目录承载一个菜单模块”的组织方式，目录内再按页面职责拆文件。

常见结构：

- `index.vue`：菜单入口页，通常承担列表页职责
- `Edit.vue` 或 `xxxEdit.vue`：编辑页
- `Detail.vue` 或 `xxxDetail.vue`：详情页
- `components/`：当前菜单内部复用组件
- `dialog/`：仅在弹窗内容明显复杂、数量较多，或当前模块已形成固定习惯时使用
- `index.js`：当前菜单模块的页面导出入口，部分目录会存在

生成代码时遵循：

- 优先查看当前业务目录的现有命名模式，再决定使用通用命名还是业务前缀命名。
- 当前目录已经采用通用命名时，继续沿用通用命名。
- 当前目录已经采用业务前缀命名时，继续沿用业务前缀命名，不要混用。
- 菜单内部复用组件统一放在 `components/`。
- 对普通复杂度的弹窗或局部交互组件，直接放在 `components/`，不要为了拆分而额外新建 `dialog/`。
- 只有在弹窗内容复杂、弹窗数量多，或当前目录已经存在 `dialog/` 结构时，才继续使用 `dialog/`。
- 不要把属于某个菜单的私有组件散落到无关公共目录。

### 3.3 文件头注释

页面文件、路由模块文件通常保留统一的文件头注释，且 `@Description` 与业务层级、功能目录路径存在稳定对应关系。

常见形式：

- `保理业务-上会管理-上会结果查询 ecommerce/meeting/meetingQuery`
- `保理业务-上会管理-上会结果查询详情 ecommerce/meeting/meeting/detail`
- `保理业务-上会管理-上会结果录入-列表 /ecommerce/meeting/meeting`

可归纳为以下规则：

- `@Description` 由两部分组成：中文业务说明 + 功能目录路径。
- 中文业务说明用于表达菜单层级与页面职责，例如列表、详情、录入、审核、编辑、查询。
- 路径部分用于表达当前文件所属的真实业务目录，应与所在模块路径保持一致。
- 页面文件与对应路由模块文件的 `@Description` 应尽量在语义上保持一致。
- 路径部分是否带前导 `/`，优先沿用当前业务目录下相邻文件已有风格，不在同一目录中混用。

## 4. 列表页规则

### 4.1 查询区

组件源码位置：`subApp/platform/src/plugin/element-ui/queryForm/index.vue`

典型写法：

```vue
<ty-query-form
  ref="queryForm"
  :searchModel="search"
  :formItems="formItems"
  @search="findPage"
/>
```

生成列表页时遵循以下规则：

- 查询参数统一放在 `search` 对象中。
- `search` 中除了筛选字段，还应统一包含 `pageNum`、`pageSize`。
- 在 `search` 对象里新增查询字段时，优先补充中文注释，格式统一为 `// 注释内容`，例如 `businessNo: '', // 业务申请编号`。
- 查询项统一通过 `formItems` 配置项声明。
- 普通输入使用 `type: 'input'`。
- 下拉优先使用 `type: 'select'`。
- 字典下拉优先使用 `constantKey`。
- 自定义下拉优先使用 `dataList`、`customLabel`、`customValue`。
- 多选下拉使用 `multiple: true`。
- 日期区间使用 `type: 'date-picker'`，并通过 `modelStart`、`modelEnd` 维护真实字段。
- 金额区间使用 `type: 'input-number-group'`。
- 普通数值输入使用 `type: 'input-number'`。
- 字段较多时优先使用 `showCount` 做折叠展开。
- 查询项联动、选项更新、动态显隐优先通过 `updateFormItem` 实现。
- 非必要不要绕过 `ty-query-form` 重新手写查询区域。

### 4.2 表格区

组件源码位置：`subApp/platform/src/plugin/element-ui/table/index.vue`

从组件实现可以确认的默认约定：

- `border` 默认开启
- `stripe` 默认开启
- 空数据文案统一为“暂无数据”
- 默认支持列筛选栏 `showFilterBar`
- 支持固定表头 `fixedHeader`
- 支持固定列数量 `fixedCount`

生成列表页时遵循以下规则：

- 表格主体优先使用 `ty-table`。
- 表格列优先使用 `ty-table-column`。
- 普通字段列优先直接使用 `prop`。
- 长文本、状态、格式化、脱敏、按钮操作等复杂列优先使用插槽。
- 如果用户没有明确指出字段类型，优先根据字段语义推断列类型。
- 字段语义明显属于字典项或枚举项时，优先使用常量列。
- 字段语义属于状态时，优先使用 `type="status"`。
- 如果需要使用常量列但没有明确给出 `constantKey`，优先使用字段 `prop` 作为默认的 `constantKey` 名称。
- 列对齐按字段语义处理：
  - 不定长文本字段优先居左。
  - 金额、金额区间、天数等数值字段优先居右。
  - 字典项、状态值、枚举值等离散展示字段优先居中。
- 时间展示列按中文语义区分精度：
  - `xx日期` 优先使用 `type="date"` 且 `dateType="2"`，表示精确到天。
  - `xx时间` 优先使用 `type="date"` 且 `dateType="1"`，表示精确到秒。
- 操作列通常固定在右侧。

### 4.3 权限与跳转

- 操作列按钮统一使用 `getPermissionsByCode(...)` 控制权限。
- 权限码遵循“业务路径 + 操作类型”的拼接规则。
- 常见操作类型优先沿用现有动作词：`query`、`del`、`insert`、`update`、`deal`、`revoke`、`finalRevoke`。
- 查询类只读按钮默认使用 `query`，不要在同一业务目录里混用 `view`、`detail`。
- 删除类按钮默认使用 `del`，不要改写成 `delete`。
- 操作列按钮展示通常同时受两类条件控制：
  - 权限条件：`getPermissionsByCode('业务路径:操作类型')`
  - 业务条件：状态、来源、类型等字段判断
- 生成操作列时，优先保持“权限条件 + 业务条件”并存的写法，不只保留其中一种。
- 列表页跳转到详情页、编辑页时，路由参数优先使用 `encodeBase64` 编码后再传递。
- 目标详情页、编辑页优先使用 `decodeBase64` 解析路由参数。

## 5. 详情页规则

参考文件：`subApp/platform/src/pages/ecommerce/meeting/meetingQuery/Detail.vue`

- 详情页外层优先使用 `vteam-container`。
- 详情内容优先拆成多个信息块，通常使用多个 `el-descriptions` 展示。
- 每个信息块应有明确标题，例如基础信息、概要说明、意见汇整、审核意见。
- 主体详情数据统一收敛在 `baseInfo` 这类对象中。
- 在 `baseInfo` 对象里新增详情字段时，优先补充中文注释，格式统一为 `// 注释内容`。
- 审核历史、资料区、附加列表、展示开关等状态单独维护，不要混塞进 `baseInfo`。
- 详情字段类型如果用户没有明确指定，优先参考同菜单列表页对应字段的展示写法；如果列表页也没有，再根据字段中文语义判断是文本、字典项、状态、金额、日期、时间还是利率。
- 字典项、状态、枚举值优先使用 `getValueByKey` 转换后再展示。
- 普通文本字段优先直接展示字段值，不要默认额外包一层 `formatText`，也不要默认补 `|| '-'`；只有用户明确要求兜底，或当前相邻页面已经采用该模式时才沿用。
- 金额类字段优先使用 `字段值 | moneyFormat`。
- 日期类字段优先使用 `字段值 | myDateFormat(2)`。
- 时间类字段优先使用 `字段值 | myDateFormat(1)`。
- 利率类型字段优先使用 `字段值 | rateFormat`。
- 详情页字段默认直接展示，不额外使用 `ty-show-tooltip`；只有用户明确要求，或字段确实存在长文本展示需求时，才使用现有展示组件处理。
- 附件、影像、文件预览优先复用现有组件，例如 `ty-image`。
- 审核历史、客户资料等复用区块优先使用已有公共组件，例如 `ReviewInfo`、`ClientInfo`。
- 详情页是否使用 `el-tabs` 取决于内容是否天然拆成多个独立板块，不作为默认模板。
- 路由入参、编码解码、动态标题切换、查询态脱敏等行为优先沿用当前业务目录现有模式。
- 详情页、编辑页的路由参数优先沿用“列表页 `encodeBase64`，目标页 `decodeBase64`”的模式。
- 详情页样式保持克制，只补必要的展示兼容样式，例如多行换行、局部对齐、列表行高。

## 6. UI 与通用工作规则

- 上传、数字输入、文件预览等能力优先复用项目现有组件或插件。
- 消息提示优先使用公共工具中已经封装的方法，不直接零散书写通知逻辑。
- 列表页优先沿用现有搜索区、操作区、分页区的组织方式。
- 弹窗内容较重时，优先将内部内容拆成独立组件，并沿用项目中更稳妥的 dialog 参数写法。
- 涉及 scoped 样式穿透时，优先使用 `:deep()`。
- 新增功能前，先搜索同类页面，不直接从零起模板。
- 优先复制最近似模块的组织方式，再替换业务字段。
- 保持接口字段名和后端契约不变。
- 除非用户明确要求迁移，否则不要主动引入 TypeScript、Composition API、Pinia、新 UI 库或新的状态管理模式。
- 除非已经存在至少两个明确复用场景，或用户明确要求抽象，否则不要贸然新增“通用组件”。
