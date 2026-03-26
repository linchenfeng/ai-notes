# Day 15 学习笔记

- 日期：2026-03-26（周四）
- 周次：第 3 周
- 主题：Prompt 基础（让本地 Qwen 输出更稳定）
- 阶段：从“能调用模型”升级到“可控输出”

## 今日学习主题
通过 Prompt 模板化与 system/user 分层，让同一个本地模型在总结、改写、提取任务上输出更稳定。

## 今日任务
- 新增总结/改写/关键词提取 Prompt 模板
- 升级 llm_service：统一走 `/api/chat` + messages
- 新增 `/llm/task` 任务接口
- 完成 summarize/rewrite/keywords 三类任务测试
- 做坏 Prompt 与好 Prompt 对比

## 今日产出
- `llm-roadmap/app/services/llm_service.py`
- `llm-roadmap/app/schemas/llm.py`
- `llm-roadmap/app/routers/llm.py`
- `llm-roadmap/notes/day15.md`

## 完成记录
- 完成时间：已完成代码与接口验证
- 实际投入：约 2.5~3 小时
- 遇到的问题：
  - 输出风格和长度在弱 Prompt 下不稳定
- 解决方式：
  - 提示词模板化，增加明确约束和输出格式说明

## 今日代码 / 笔记链接
- LLM 服务：`llm-roadmap/app/services/llm_service.py`
- LLM 路由：`llm-roadmap/app/routers/llm.py`
- 文档地址：`http://127.0.0.1:8000/docs`

## 复盘
- 今天学到了什么：
  - Prompt 是任务说明书，不是随口提问
  - system 和 user 分工明确能提升稳定性
  - 模板化 Prompt 更利于维护和实验
- 还没弄懂什么：
  - 不同模型对同一模板的迁移一致性
  - 约束密度与生成创造性的平衡点
- 明天开始前要准备什么：
  - 进入结构化输出（JSON）
  - 设计可校验的输出格式

## 与 90 天目标的关系
Day 15 让模型调用从“可用”走向“可控”，为后续结构化提取、前端稳定消费、RAG 输出规范打下关键基础。
