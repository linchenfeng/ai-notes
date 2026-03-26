# Day 08 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 2 周
- 主题：Pydantic 入门，让接口更规范
- 阶段：从“能跑接口”升级到“规范接口”

## 今日学习主题
使用 Pydantic `BaseModel` 定义请求体，替换 `dict` 接参方式，让 FastAPI 自动校验输入并生成更清晰的接口文档。

## 今日任务
- 创建 `schemas.py`，定义请求模型
- 新建 `day8_api.py`，把 Day 7 的 POST 接口改为模型接参
- 新增翻译与情感分析接口
- 更新 `services.py` 对应业务函数
- 验证默认值字段与必填字段校验行为

## 今日产出
- `llm-roadmap/schemas.py`
- `llm-roadmap/day8_api.py`
- `llm-roadmap/services.py`（新增函数）
- `llm-roadmap/notes/day8.md`

## 今日完成记录
- 完成时间：已完成（代码与运行验证完成）
- 实际投入：约 2.5-3 小时
- 遇到的问题：
  - 本地环境缺少 `fastapi` / `uvicorn`
  - 部分旧文件存在编码显示乱码
- 解决方式：
  - 安装依赖：`py -m pip install fastapi uvicorn`
  - 服务成功启动并验证接口可用

## 今日代码 / 笔记链接
- API 文件：`llm-roadmap/day8_api.py`
- 模型文件：`llm-roadmap/schemas.py`
- 业务函数：`llm-roadmap/services.py`
- 运行地址：`http://127.0.0.1:8000/docs`

## 关键练习结果
1. `/rewrite` 默认值测试通过
- 只传 `text` 时，`style` 自动使用默认值。

2. 必填字段校验验证
- `/summarize` 传 `{}` 时，FastAPI 自动返回 422 校验错误（缺少 `text`）。

3. 新增 `/translate`
- 请求模型：`TranslateRequest`
- 默认字段：`target_language = "English"`

4. 新增 `/sentiment`
- 请求模型：`SentimentRequest`
- 返回 `positive / negative / neutral`

## 复盘
- 今天学到了什么：
  - Pydantic 是给请求体“立规则”的方式
  - 必填字段与默认值字段的建模方法
  - 结构化输入可以减少手写校验逻辑
- 还不熟的点：
  - 响应模型（`response_model`）的系统化使用
  - 字段级校验器（如长度、范围、正则）
- 明天开始前要准备什么：
  - 补充响应模型练习
  - 继续推进接口返回结构规范化

## 与 90 天目标的关系
Day 8 的重点是“输入建模 + 自动校验”，这是后续做聊天接口、RAG 请求体、工具调用参数、结构化输出的基础能力。越早结构化输入，后续 AI 应用越稳定。
