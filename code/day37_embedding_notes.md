# Day 37：Embedding 实现记录

## 今日目标

- 把 Day34 切出来的 chunk 真正转成向量
- 把向量结果写入 Day36 的本地索引环境

## 今日产出

- 脚本：[day37_embed_docs.py](/Volumes/学习资料/ai-notes/code/day37_embed_docs.py)

## 当前实现了什么

- 复用 Day33 的文档读取逻辑
- 复用 Day34 的切分逻辑
- 使用本地轻量 `local_hash_embedding_v1` 方案生成向量
- 把 chunk 元信息写入：
  - [chunks.json](/Volumes/学习资料/ai-notes/code/day36_local_index/chunks.json)
- 把 embedding 结果写入：
  - [embeddings.json](/Volumes/学习资料/ai-notes/code/day36_local_index/embeddings.json)
- 自动更新：
  - [index_config.json](/Volumes/学习资料/ai-notes/code/day36_local_index/index_config.json)

## 实际验证结果

- 成功加载 21 篇文档
- 成功切分得到 24 个 chunk
- 成功生成 24 条向量结果
- 当前 embedding 维度：64
- 当前 embedding 方案名：`local_hash_embedding_v1`

## 为什么今天先用这个方案

今天的重点是先把：

`chunk -> vector`

这条链路真正跑通，而不是一开始就引入更重的外部 embedding 服务或复杂依赖。

当前这个本地方案的价值是：

- 可以直接运行
- 结果稳定可复现
- 没有额外环境负担
- 足够支撑后面 Day38、Day39 的最小索引与检索实验

## 当前版本的边界

- 这不是高质量生产级 embedding 模型
- 当前更像“本地可运行的学习基线”
- 后面如果要提升检索效果，可以替换成真实 embedding 模型

## 这一步的意义

到 Day37 为止，RAG 上游链路已经推进到：

`文档目录 -> 读取文档 -> 切分 chunk -> 生成向量 -> 写入本地索引`

这意味着 Day38 建索引时，不再是抽象概念，而是已经有真实的 chunk 和真实的向量结果可以接了。

## 下一步衔接

- Day38：实现索引构建
- Day39：基于这些向量做相似度检索
