# Day 40：最小 RAG 闭环记录

## 今日目标

- 把 Day39 检索出来的 top-k chunks 真正交给模型生成答案
- 完成一个可运行、可保存结果的最小知识库问答闭环

## 今日产出

- 脚本：[day40_rag_qa.py](/E:/前端/ai-notes/code/day40_rag_qa.py)

## 当前实现了什么

- 读取：
  - [index.json](/E:/前端/ai-notes/code/day36_local_index/index.json)
- 复用 Day39 的检索逻辑拿到 top-k chunks
- 把检索结果整理成“知识库上下文”
- 构造一个最小 RAG 提示词，要求模型只基于上下文回答
- 调用：
  - [tool.py](/E:/前端/ai-notes/code/tool.py) 里的 `get_completion`
- 把问答结果写入：
  - [rag_answer.json](/E:/前端/ai-notes/code/day36_local_index/rag_answer.json)

## 这一步的意义

到 Day40 为止，RAG 的主链路已经第一次完整闭环：

`文档 -> chunk -> vector -> index -> retrieval -> answer`

前面的 Day33 到 Day39 更像是在准备“知识库能不能被查到”。
Day40 才是第一次把“查到的内容”真正喂给模型，让模型基于这些结果生成最终回答。

## 当前版本的边界

- 现在已经能形成最小闭环，但还没有做引用格式优化
- 现在的回答质量仍然受 Day37 本地轻量 embedding 方案限制
- 现在的提示词还是最小版，后面还可以继续增强“拒答”和“来源引用”

## 验证方式

可以先跑不调用模型的检查：

```bash
python code/day40_rag_qa.py --query "什么是 RAG？" --dry-run
```

如果本地 Ollama 已启动，也可以直接跑完整问答：

```bash
python code/day40_rag_qa.py --query "什么是 RAG？"
```

查看完整上下文和最终保存内容：

```bash
python code/day40_rag_qa.py --query "为什么要做 chunking？" --show-context
```

## 下一步衔接

- Day41：给答案增加来源引用
- Day43：加入“证据不足就拒答”的稳定机制
