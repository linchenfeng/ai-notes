# Day 03 学习笔记

- 日期：2026-03-27（周五）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 3 学习目标

今天结束时，你要做到这 6 件事：

- 知道什么是模块，能把代码拆文件
- 会用 `import`
- 会写 `try / except`
- 会读取文本文件
- 会写入文本文件和 JSON 文件
- 产出一个结构更像小项目的 Python 练习

今天的关键词只有 3 个：拆代码、抗报错、会存数据。

## Day 3 时间安排

约 3 小时。

## 第一阶段：先理解今天学什么

预计时间：15 分钟

到 Day 2 为止，你写的代码大概率还是全放在一个文件里。

这在练习阶段没问题，但真实开发里会很快变乱：

- 函数越来越多
- 逻辑越来越杂
- 一个报错就直接崩
- 数据不能保存，下次就没了

所以 Day 3 的重点是把代码从练习脚本往可维护的小项目推进一步。

今天你会学 3 件事：

1. 模块：把不同功能拆到不同文件里。
2. 异常处理：程序遇到问题时，不要直接崩掉。
3. 文件读写：让程序能读取外部内容，也能保存结果。

## 第二阶段：模块与 import

预计时间：50 分钟

### 1. 什么是模块

在 Python 里，一个 `.py` 文件就是一个模块。

例如：

```text
main.py
utils.py
```

你可以在 `main.py` 里导入 `utils.py` 的函数来使用。

这和前端里拆文件、本地 import 很像。

### 2. 先做一个最小例子

`utils.py`

```python
def introduce(name, role):
    return f"My name is {name}, and I am a {role}."


def square(num):
    return num * num
```

`main.py`

```python
from utils import introduce, square

print(introduce("charon", "frontend developer"))
print(square(5))
```

运行：

```bash
python main.py
```

你要理解的点：

- `from utils import ...`：从 `utils.py` 导入函数
- `main.py` 负责运行
- `utils.py` 负责放通用逻辑

### 3. 再做一个更像项目的拆分

今天建议你把目录调整成这样：

```text
llm-roadmap/
├── main.py
├── utils.py
├── day2_practice.py
├── data/
│   └── profile.txt
├── notes/
│   ├── day1.md
│   ├── day2.md
│   └── day3.md
├── README.md
└── .gitignore
```

等后面再进阶时，你会继续拆成：

```text
app/
utils/
services/
```

但今天先不用搞复杂。

### 4. Day 3 模块练习

练习 1：在 `utils.py` 中写 3 个函数：

```python
def introduce(name, role):
    ...


def square(num):
    ...


def is_adult(age):
    ...
```

练习 2：在 `main.py` 中导入它们并调用。

验收标准：

```text
My name is charon, and I am a frontend developer.
25
True
```

## 第三阶段：异常处理 try / except

预计时间：45 分钟

真实开发里，程序会经常报错。

比如：

- 用户输入了错误内容
- 文件不存在
- JSON 格式有问题
- API 调用失败

如果你不做处理，程序就会直接中断。

### 1. 最小例子

```python
num = int("abc")
print(num)
```

这会报错，因为 `"abc"` 不能转成数字。

### 2. 用异常处理改造

```python
try:
    num = int("abc")
    print(num)
except:
    print("发生错误，无法转换成数字。")
```

这样程序不会直接崩掉。

### 3. 更推荐的写法

```python
try:
    num = int("abc")
    print(num)
except ValueError:
    print("输入的内容不是数字。")
```

你先记住：

- `try`：先尝试执行
- `except`：如果出错，就执行这里

### 4. 再举一个更实用的例子

```python
def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "除数不能为 0"
```

调用：

```python
print(divide(10, 2))
print(divide(10, 0))
```

### 5. Day 3 异常处理练习

练习 3：写一个函数：

```python
def safe_int(value):
    ...
```

要求：

- 如果 `value` 能转成整数，就返回整数
- 不能转时，返回 `"请输入正确数字"`

示例：

```python
print(safe_int("123"))
print(safe_int("abc"))
```

练习 4：写一个函数：

```python
def safe_divide(a, b):
    ...
```

要求：

- 正常时返回结果
- 除数为 `0` 时返回 `"除数不能为 0"`

## 第四阶段：文件读写

预计时间：60 分钟

这部分非常重要。以后你做大模型开发，经常要：

- 读 prompt 模板
- 读本地文档
- 保存结果
- 输出日志
- 存 JSON 数据

所以今天一定要练。

### 1. 读取文本文件

先新建目录和文件：`data/profile.txt`

文件内容：

```text
My name is charon.
I am a frontend developer.
I want to become an LLM developer.
```

然后新建代码：

```python
with open("data/profile.txt", "r", encoding="utf-8") as file:
    content = file.read()

print(content)
```

你要理解：

- `"r"` 表示读取
- `encoding="utf-8"` 很常用
- `file.read()` 会读取整个文件
- `with open(...)` 会自动帮你关闭文件

### 2. 写入文本文件

```python
text = "Today I started learning Python file operations."

with open("data/output.txt", "w", encoding="utf-8") as file:
    file.write(text)

print("写入完成")
```

你要理解：

- `"w"` 表示写入
- 如果文件不存在，会创建
- 如果文件已存在，会覆盖原内容

### 3. 追加内容

```python
with open("data/output.txt", "a", encoding="utf-8") as file:
    file.write("\nI also learned try-except today.")
```

你要理解：

- `"a"` 表示追加
- 不会覆盖原有内容

### 4. 读取多行内容

```python
with open("data/profile.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

for line in lines:
    print(line.strip())
```

你要理解：

- `readlines()` 会返回列表
- `strip()` 可以去掉换行符

### 5. 写入 JSON 文件

```python
import json

user_info = {
    "name": "charon",
    "current_role": "frontend developer",
    "target_role": "llm developer"
}

with open("data/user.json", "w", encoding="utf-8") as file:
    json.dump(user_info, file, ensure_ascii=False, indent=2)

print("JSON 写入完成")
```

你要理解：

- `json.dump()`：把 Python 数据写进 JSON 文件
- `ensure_ascii=False`：中文不乱码
- `indent=2`：格式更好看

### 6. 读取 JSON 文件

```python
import json

with open("data/user.json", "r", encoding="utf-8") as file:
    data = json.load(file)

print(data)
print(data["name"])
```

## 第五阶段：Day 3 综合练习

预计时间：50 分钟

今天你要做一个综合版练习，建议文件名：`day3_practice.py`

目标：把模块、异常处理、文件读写串起来。

### 综合练习要求

第一步：在 `utils.py` 写这些函数

```python
def introduce(name, role):
    return f"My name is {name}, and I am a {role}."


def safe_int(value):
    try:
        return int(value)
    except ValueError:
        return "请输入正确数字"


def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "除数不能为 0"
```

第二步：在 `day3_practice.py` 中完成这些任务：

- 导入 `utils.py` 里的函数
- 读取 `data/profile.txt` 内容并打印
- 调用 `introduce()` 输出个人介绍
- 调用 `safe_int("123")` 和 `safe_int("abc")`
- 调用 `safe_divide(10, 2)` 和 `safe_divide(10, 0)`
- 把一份个人信息保存到 `data/user.json`

参考模板：

`day3_practice.py`

```python
import json
from utils import introduce, safe_int, safe_divide

with open("data/profile.txt", "r", encoding="utf-8") as file:
    content = file.read()

print("个人资料内容：")
print(content)

print(introduce("charon", "frontend developer"))

print(safe_int("123"))
print(safe_int("abc"))

print(safe_divide(10, 2))
print(safe_divide(10, 0))

user_info = {
    "name": "charon",
    "current_role": "frontend developer",
    "target_role": "llm developer"
}

with open("data/user.json", "w", encoding="utf-8") as file:
    json.dump(user_info, file, ensure_ascii=False, indent=2)

print("user.json 保存完成")
```

## 第六阶段：整理今天项目结构

预计时间：15 分钟

今天结束后，你的项目最好长这样：

```text
llm-roadmap/
├── .venv/
├── main.py
├── utils.py
├── day2_practice.py
├── day3_practice.py
├── data/
│   ├── profile.txt
│   ├── output.txt
│   └── user.json
├── notes/
│   ├── day1.md
│   ├── day2.md
│   └── day3.md
├── README.md
└── .gitignore
```

## notes/day3.md 模板

```md
# Day 3 学习记录

## 今天完成了什么
- 学了模块和 import
- 学了 try / except
- 学了文本文件读取和写入
- 学了 JSON 文件读写
- 完成了 day3_practice.py

## 我现在理解了什么
- 一个 .py 文件就是一个模块
- 可以用 import 复用其他文件里的函数
- try / except 可以避免程序因为报错直接崩掉
- 文件读写是后面做大模型项目的重要基础
- JSON 是后续处理结构化数据的重要格式

## 我还不熟的点
- 
- 
- 

## 今天遇到的问题
- 
- 

## 明天准备做什么
- 继续做 Python 基础强化
- 学列表、字典的更常见操作
- 学面向实际开发的代码组织方式
```

## Day 3 完成标准

今天结束时，你检查这 8 项：

- 知道模块是什么
- 会写 `from xxx import xxx`
- 会写 `try / except`
- 能读一个 `.txt` 文件
- 能写一个 `.txt` 文件
- 能把字典写入 `.json`
- 完成 `day3_practice.py`
- 写完 `notes/day3.md`

只要这 8 项完成，Day 3 就算合格。

## 今天不要纠结的点

今天先别纠结这些：

- 为什么模块机制这么设计
- 各种异常类型要不要全背
- JSON 和数据库到底啥区别
- 项目目录该不该一步到位拆得很复杂

今天重点是：先会用，再慢慢理解更深层的设计。

## 今天结束后的能力变化

完成 Day 3 后，你已经不只是会写基础语法了，而是开始具备：

- 把代码拆开写的能力
- 面对报错不慌的能力
- 处理外部数据的能力

## 完成记录

- 完成时间：
- 实际投入：
- 遇到的问题：
- 解决方式：

## 与 90 天目标的关系

这一天的任务会服务于你的最终作品集，目标是在 90 天结束时至少拿出下面 3 个项目中的 2～3 个：

- AI 文案/总结助手
- RAG 知识库助手
- 工具/数据库问答助手
