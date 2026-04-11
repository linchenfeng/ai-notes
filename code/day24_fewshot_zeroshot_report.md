# Day 24 实验记录：few-shot vs zero-shot

## 实验目标
对比同一任务在 zero-shot 与 few-shot 下的输出差异。

## 实验任务
情感分类（positive / neutral / negative），并输出 JSON。

## 使用模型
qwen2.5:0.5b

## 实验结果

### 样本 1
- 输入文本：这个功能太好用了，界面也很顺手，我愿意推荐给同事。

#### zero-shot
- valid_json: True
- label: positive
- reason: 用户对功能表示满意，并且认为界面和推荐性建议是积极的。
- confidence: 1.0
- error: 

#### few-shot
- valid_json: True
- label: positive
- reason: 明确表达满意与正向评价
- confidence: 0.95
- error: 

### 样本 2
- 输入文本：还可以吧，能用，但是速度一般，没有特别惊喜。

#### zero-shot
- valid_json: True
- label: neutral
- reason: 无情感标签。
- confidence: 0.85
- error: 

#### few-shot
- valid_json: True
- label: neutral
- reason: 评价中性，既有可用性也有保留
- confidence: 0.72
- error: 

### 样本 3
- 输入文本：这次更新之后经常报错，操作还卡顿，体验很差。

#### zero-shot
- valid_json: True
- label: negative
- reason: 用户体验差，频繁报错和卡顿。
- confidence: 0.95
- error: 

#### few-shot
- valid_json: True
- label: negative
- reason: 明确表达强烈负面体验
- confidence: 0.96
- error: 

## 观察结论（模板）
- few-shot 通常更容易遵守固定输出格式（JSON 字段更完整）。
- few-shot 通常在标签判断标准上更稳定，输出波动更小。
- zero-shot 更快上手，但在格式约束严格的任务里更容易偏离要求。

## 一句话总结
当任务需要稳定格式和一致判断标准时，few-shot 往往比 zero-shot 更可靠。