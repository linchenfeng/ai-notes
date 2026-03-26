# Day 10 参数实验记录

## 测试任务
请用中文写一段适合放在项目 README 里的自我介绍，控制在 80 字以内。

## 实验结果

### 实验 1：低随机性 + 较短输出
- temperature: 0.2
- num_predict: 80
- 输出结果：

欢迎加入我们的团队！我们致力于为用户提供高质量的产品和服务。如果您有任何问题或需要帮助，请随时联系我们。

### 实验 2：中等随机性 + 中等输出
- temperature: 0.7
- num_predict: 120
- 输出结果：

好的，以下是我为您准备的项目简介：

我是XXX, 你面前的XX，我将带你进入全新的世界。在这里，我们将一起探索未知的世界，学习如何解决问题。让我们一起，迎接挑战和机遇！欢迎来到我的世界。

### 实验 3：高随机性 + 更长输出
- temperature: 1.0
- num_predict: 180
- 输出结果：

# My Self Introduction

Hello! I am [Your Name], a [Professional Title] with a strong background in [Your Field]. With a passion for [Your Specialty or Experience], I have developed a successful career in the field. Currently, my expertise includes [List of Expertise or Skills]. Feel free to let me know how I can help you!

## 我的观察
- 低 temperature 的输出通常更稳，更接近常规答案。
- 高 temperature 的输出通常更活跃，但也更容易发散。
- num_predict 越大，模型通常越容易生成更长内容。