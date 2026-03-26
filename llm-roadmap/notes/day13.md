# Day 13 学习记录

## 今天完成了什么
- 改为使用 Ollama 调用本地 Qwen
- 在 .env 中配置了 OLLAMA_BASE_URL 和 OLLAMA_MODEL
- 写了 app/services/llm_service.py
- 新增了 app/schemas/llm.py
- 新增了 app/routers/llm.py
- 在 /docs 中可测试真实 LLM 路由

## 我现在理解了什么
- 真正的 AI 后端是 FastAPI + service 层 + 外部模型服务
- 配置必须和业务代码分离
- 本地模型同样要做异常处理与可观测性
- prompt/instructions 的变化会明显影响输出结果
- router 层负责 HTTP 语义，service 层负责模型调用

## 我还不熟的点
- 
- 
- 

## 今天最容易混淆的地方
- router 层和 service 层的边界
- 503 和 502 在上游异常里的区别
- 模型名与本地已下载模型的匹配关系

## 明天准备做什么
- 增加多轮聊天接口
- 设计消息历史结构
- 为后续结构化输出做准备
