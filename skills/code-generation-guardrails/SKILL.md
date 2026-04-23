---
name: code-generation-guardrails
description: 用于约束现有前端项目中的代码生成与代码修改。适用于 Codex 需要在已有仓库中新增页面、修改模块、补充接口、调整路由或重构局部逻辑等场景。执行时先分析项目现有结构与相邻代码模式，遵循仓库既有的目录分层、命名方式、组件复用方式和低风险改动策略，避免擅自引入新架构、新依赖、新分层或无关重构。
---

# 代码生成规范

先读 [references/project-conventions.md](references/project-conventions.md)，再按下面顺序执行。
按需读取参考，不必每次回原工程查找：

- 列表页查询区：读 [references/examples/list-page-query-example.vue](references/examples/list-page-query-example.vue)
- 列表页表格与页签：读 [references/examples/list-page-table-example.vue](references/examples/list-page-table-example.vue)
- 操作列权限控制：读 [references/examples/operation-permission-example.vue](references/examples/operation-permission-example.vue)
- 详情页：读 [references/examples/detail-page-example.vue](references/examples/detail-page-example.vue)
- 路由与接口：读 [references/examples/router-api-example.js](references/examples/router-api-example.js)
- 需要确认 `ty-query-form` 能力时，读 [references/component-source/query-form.vue](references/component-source/query-form.vue)
- 需要确认 `ty-table`、`ty-table-column` 能力时，读 [references/component-source/table.vue](references/component-source/table.vue)
- 需要确认 `ty-table` 列筛选栏与列显隐实现时，读 [references/component-source/table-filter-bar.vue](references/component-source/table-filter-bar.vue)

## 1. 工作方式

- 先查看目标模块与相邻文件，再开始改代码。
- 先确认业务路径、页面类型、复用边界，再决定落点和拆分方式。
- 优先复用已有工具函数、公共组件、请求封装、格式化方法、消息提示方法。
- 优先用最小改动完成需求，不顺手做无关重构。

## 2. 路径与命名

- 保持 `router/modules/<业务路径>`、`pages/<业务路径>`、`api/<业务路径>` 三层对应。
- 菜单功能尽量收敛在同一个页面目录下维护。
- 先看当前目录现有模式，再决定使用 `index.vue / Edit.vue / Detail.vue`，还是业务前缀命名。
- 菜单内复用组件放在 `components/`。
- 普通复杂度的弹窗、选择器、局部交互组件优先直接放在 `components/`。
- 只有弹窗内容明显复杂、数量较多，或目录本身已有 `dialog/` 结构时，才使用 `dialog/`。
- 页面文件、路由模块文件保留统一顶部注释，`@Description` 使用“中文业务层级说明 + 功能目录路径”。

## 3. 列表页规则

### 查询区

- 优先使用 `ty-query-form`，不要重复手写零散的 `el-form` 查询头。
- 查询参数统一收敛在 `search` 对象中，并包含 `pageNum`、`pageSize`。
- 在 `search` 对象中新增加查询字段时，优先补充中文行尾注释，格式统一为 `// 注释内容`。
- 查询项统一通过 `formItems` 配置驱动生成。
- 字典型下拉优先使用 `constantKey`。
- 接口型下拉优先使用 `dataList`，需要联动时通过 `updateFormItem(...)` 更新。
- 下拉查询项如果需求没有明确说明支持多选，默认不加 `multiple: true`。
- 日期区间优先使用 `modelStart / modelEnd`。
- 金额区间优先使用 `input-number-group`，普通数值优先使用 `input-number`。
- 查询、重置、校验、字段显隐、字段联动优先复用 `ty-query-form` 内置能力。

### 表格区

- 优先使用 `ty-table` 与 `ty-table-column`。
- 普通字段列直接使用 `prop`。
- 复杂列优先使用插槽并复用现有展示组件。
- 用户没有明确指出字段类型时，先按字段语义推断；列表页没有说明时，再优先参考同菜单已存在写法。
- 字典项或枚举项优先生成常量列。
- 状态字段优先使用 `type="status"`。
- 没有明确给出 `constantKey` 时，优先用字段 `prop` 作为默认 `constantKey`。
- 列对齐按字段语义处理：不定长文本居左，金额和天数类数值居右，字典项和状态类字段居中。
- 列表页时间精度按中文语义处理：`xx日期` 用 `type="date"` + `dateType="2"`，`xx时间` 用 `type="date"` + `dateType="1"`。
- 操作列优先固定在右侧。
- 除操作列固定在右侧外，其他列如果需求没有明确说明需要固定，默认不加 `fixed`。
- 操作列按钮统一使用 `getPermissionsByCode('业务路径:操作类型')` 控制权限。
- 权限码前半段取当前菜单业务路径，后半段优先沿用已有动作词，如 `query`、`del`、`insert`、`update`、`deal`、`revoke`、`finalRevoke`。
- 查询类只读按钮默认使用 `:query`，删除类按钮默认使用 `:del`。
- 操作列按钮显示通常同时满足权限条件与业务条件。
- 列表页跳转到详情页、编辑页时，路由参数优先使用 `encodeBase64` 编码后再传递。

## 4. 详情页规则

- 详情页外层优先使用 `vteam-container`。
- 详情内容优先按信息块组织，通常使用多个 `el-descriptions` 分区展示。
- 主体详情数据统一收敛在 `baseInfo` 这类对象中，附加列表与展示开关单独维护。
- 在 `baseInfo` 对象中新增加详情字段时，优先补充中文行尾注释，格式统一为 `// 注释内容`。
- 详情页字段类型如果用户没有明确指定，优先参考同菜单列表页已有字段写法；如果列表页也没有，再根据字段中文语义自行判断。
- 字典项、状态、枚举值优先使用 `getValueByKey` 转换后再展示。
- 普通文本字段默认直接展示，不默认包 `formatText`，也不默认补 `|| '-'`。
- 详情字段中的金额类字段优先使用 `xx | moneyFormat`。
- 详情字段中的日期类字段优先使用 `xx | myDateFormat(2)`。
- 详情字段中的时间类字段优先使用 `xx | myDateFormat(1)`。
- 详情字段中的利率类型字段优先使用 `xx | rateFormat`。
- 详情页字段默认不额外使用 `ty-show-tooltip`；只有用户明确要求，或字段确实存在长文本展示需求时，才使用现有展示组件处理。
- 审核历史、客户资料、附件预览等能力优先复用现有公共组件。
- 详情页是否使用 `el-tabs` 取决于内容是否天然分块，不作为默认模板。
- 详情页、编辑页接收路由参数时，优先使用 `decodeBase64` 解析，不直接使用原始 `params` 值。

### 详情页内嵌列表区块

- 详情页中如果存在“附属列表信息”展示需求，优先沿用 `references/examples/detail-page-example.vue` 中的结构。
- 结构顺序固定为：外层 `v-if` 区块 -> `detail-information` 标题表头 -> `detail-table-wrap` -> `ty-table`。
- 这类区块适用于“店铺列表 / 明细列表 / 关联记录列表”这类只读展示，不要为了简单附属列表单独切一个新页面。
- 如果列表显示依赖业务类型，优先直接写在区块外层 `v-if`，例如 `['32', '36'].includes(saaQueryInfo.applyType)`。
- 表格默认保持轻量：优先使用 `type="index"` 序号列加若干 `prop` 列，不默认增加查询区、分页器和复杂操作列，除非需求明确要求。
- 表格数据源单独放在类似 `saaQueryInfo.shopList` 的附属对象中，不与 `baseInfo` 混放。
- 标题文案、列文案统一使用 `$t(...)` 包装。

## 5. 代码风格

- 保持 import 顺序、引号风格、对象排版、Vue 选项顺序与周边代码一致。
- 命名优先沿用项目现有业务词汇。
- 注释保持克制，只在逻辑确实不直观时补充必要说明。
- 除非用户明确要求，否则不主动引入新的架构、依赖、目录结构或抽象层。

## 6. 自检

- 检查 `api`、`router/modules`、`pages` 是否保持在同一业务路径下。
- 检查文件头注释中的 `@Description` 是否正确反映中文业务层级与当前目录路径。
- 检查列表页是否统一基于 `ty-query-form + search + formItems`、`ty-table + ty-table-column` 组织。
- 检查详情页是否按信息块组织，且优先复用现有详情组件、历史组件、附件组件。
- 检查页面文案、loading、校验提示、消息反馈是否延续项目既有行为。
- 如果过程里做了合理假设，在最终回复中简要说明。
