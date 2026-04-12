# Day 39：相似度检索记录

## 今日目标

- 基于 Day38 的本地索引实现相似度检索
- 输入问题后，返回 top-k chunks

## 今日产出

- 检索脚本：[day39_retriever.py](/Volumes/学习资料/ai-notes/code/day39_retriever.py)

## 当前实现了什么

- 读取：
  - [index.json](/Volumes/学习资料/ai-notes/code/day36_local_index/index.json)
- 对用户问题执行本地向量化
- 计算 query 向量和每条索引记录向量的相似度
- 按分数排序并返回 top-k 结果
- 把结果写入：
  - [search_results.json](/Volumes/学习资料/ai-notes/code/day36_local_index/search_results.json)

## 实际验证结果

测试问题：

```text
什么是 RAG？
```

实际返回：

- 成功返回 top 3 结果
- `search_results.json` 已成功写入
- 当前结果包含：
  - 排名
  - 分数
  - chunk_id
  - 文档标题
  - 来源路径
  - chunk 正文

## 当前结果说明

这一步最重要的不是“现在检索质量已经完美”，而是：

`query -> query embedding -> 相似度比较 -> top-k 返回`

这条链路已经真正跑通了。

当前因为使用的是 Day37 的本地轻量 `local_hash_embedding_v1` 基线方案，所以检索结果会有明显局限：

- 能跑通流程
- 能返回结构正确的 top-k chunk
- 但语义匹配质量还不够稳定

这并不是 Day39 失败，而是当前 embedding 方案的预期边界。

## 这一步的意义

到 Day39 为止，RAG 的主链路已经推进到：

`文档 -> chunk -> 向量 -> 索引 -> 相似度检索`

这意味着 Day40 做最小 RAG 闭环时，已经可以直接把这些 top-k 结果塞给生成模型，让模型基于检索内容回答。

## 下一步衔接

- Day40：把检索结果交给生成模型，完成最小 RAG 闭环
