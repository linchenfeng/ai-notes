# Day 01 学习笔记

- 日期：2026-03-25（周三）
- 周次：第 1 周
- 本周主题：Python + HTTP + FastAPI 最小必备
- 阶段：第 1 阶段：先跑通最小闭环
- 阶段目标：先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。

## Day 1 学习目标

今天结束时，你要做到 5 件事：

- 装好 Python
- 装好 VS Code
- 装好 Git
- 创建第一个 Python 虚拟环境
- 建好你的第一个项目目录并成功运行一个 Python 文件

只要完成这 5 件事，Day 1 就合格。
今天不追求学很多知识，只追求环境跑通。

## Day 1 时间安排

约 3 小时。

## 第一阶段：理解今天要做什么

预计时间：15 分钟

### 任务

先搞清楚这几个东西分别是干嘛的：

- Python：你之后写后端、调模型 API、做 RAG 都会用
- VS Code：主要开发工具
- Git：代码版本管理
- 虚拟环境 `venv`：隔离项目依赖，避免包冲突
- 项目目录：后面 90 天都会在这个目录基础上迭代

### 你要记住的一句话

今天是在搭工地，不是在盖大楼。

## 第二阶段：安装开发环境

预计时间：60～80 分钟

### 1. 安装 Python

预计时间：20 分钟

建议安装 Python 3.11 或 3.12。

安装完成后，打开终端，输入：

```bash
python --version
```

如果不行，再试：

```bash
python3 --version
```

#### 验收标准

能看到类似：

```bash
Python 3.11.9
```

#### 常见坑

- 装完后命令不生效，一般是环境变量没配置好
- Windows 上有时需要重新开终端
- 有些机器 `python` 命令不可用，要用 `python3`

### 2. 安装 VS Code

预计时间：10 分钟

安装后，顺手装这几个扩展：

- Python
- Pylance
- GitLens（可选）
- Error Lens（可选）

#### 验收标准

你能用 VS Code 打开一个文件夹。

### 3. 安装 Git

预计时间：15 分钟

终端输入：

```bash
git --version
```

#### 验收标准

能看到类似：

```bash
git version 2.x.x
```

顺手配置用户名和邮箱：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

再检查：

```bash
git config --global --list
```

### 4. 注册 GitHub 并准备仓库

预计时间：15～20 分钟

今天先不用发很多代码，只要有账号。

#### 任务

- 注册 GitHub
- 新建一个仓库，名字建议叫 `llm-roadmap`
- 或者使用 `llm-dev-journey`

#### 验收标准

你已经有一个空仓库，后面几天会把代码传上去。

## 第三阶段：创建你的第一个项目

预计时间：45 分钟

### 1. 新建项目目录

终端进入你准备存放学习项目的位置，然后执行：

```bash
mkdir llm-roadmap
cd llm-roadmap
```

#### 目录命名建议

统一用英文、小写、短横线，后面省很多麻烦。

### 2. 用 VS Code 打开项目

在项目目录里执行：

```bash
code .
```

如果 `code` 命令不生效，也没关系，手动打开 VS Code 并选择该文件夹。

### 3. 创建虚拟环境

在项目根目录执行：

```bash
python -m venv .venv
```

如果你的机器要用 `python3`：

```bash
python3 -m venv .venv
```

激活虚拟环境：

macOS / Linux

```bash
source .venv/bin/activate
```

Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

Windows CMD

```bat
.venv\Scripts\activate
```

激活后，终端前面通常会出现：

```bash
(.venv)
```

#### 验收标准

你已经进入虚拟环境。

### 4. 创建第一个 Python 文件

新建文件：`main.py`

写入内容：

```python
print("Hello, LLM Dev!")
```

然后运行：

```bash
python main.py
```

#### 验收标准

终端成功输出：

```bash
Hello, LLM Dev!
```

## 第四阶段：建立基础项目结构

预计时间：30 分钟

今天先建一个最简单但规范的结构。

### 建议目录

```text
llm-roadmap/
├── .venv/
├── main.py
├── README.md
├── .gitignore
└── notes/
```

### 你要做的事

#### 1. 创建 README.md

写上：

```md
# LLM Roadmap

这是我从前端转向大模型开发的学习仓库。

## Day 1
- 安装 Python
- 安装 VS Code
- 安装 Git
- 创建虚拟环境
- 跑通第一个 Python 文件
```

#### 2. 创建 .gitignore

写入：

```gitignore
.venv/
__pycache__/
.vscode/
*.pyc
.DS_Store
```

#### 3. 创建 notes 文件夹

里面新建：`day1.md`

写下今天遇到的问题和解决方法。

## 第五阶段：做一次完整提交

预计时间：20 分钟

初始化 Git，在项目根目录执行：

```bash
git init
git add .
git commit -m "init day1 project"
```

#### 验收标准

提交成功，没有报错。

今天先达到这个程度就够。

今天不要求你一定推到 GitHub，但如果状态好，可以继续执行：

```bash
git branch -M main
git remote add origin 你的仓库地址
git push -u origin main
```

## Day 1 学习笔记模板

你的 `notes/day1.md` 可以直接写这个：

```md
# Day 1 学习记录

## 今天完成了什么
- 安装了 Python
- 安装了 VS Code
- 安装了 Git
- 创建了项目 llm-roadmap
- 创建并激活了虚拟环境
- 成功运行 main.py

## 我理解了什么
- Python 是后续大模型开发的主要语言
- 虚拟环境是为了隔离依赖
- Git 用来管理代码版本
- README 用来记录项目说明

## 遇到的问题
- 问题 1：
- 解决方式：

## 明天准备做什么
- 复习 Python 基础
- 写一些简单练习
```

## Day 1 完成标准

今天结束前，你只检查这 6 项：

- `python --version` 能运行
- `git --version` 能运行
- VS Code 能打开项目
- `.venv` 创建成功
- `python main.py` 能输出内容
- 项目里有 `README.md` 和 `.gitignore`

只要这 6 项都完成，Day 1 就是成功的。

## 今天不要做的事

今天刻意不要碰这些：

- 不用急着学 Transformer
- 不用急着学 Prompt 工程
- 不用急着接模型 API
- 不用装一堆复杂框架
- 不用研究 LangChain、RAG、Agent

今天最重要的是：把开发环境和项目骨架搭稳。

## 给你的 Day 1 结果目标

今天结束后，你应该拥有一个这样的最小项目：

```text
llm-roadmap/
├── .venv/
├── main.py
├── README.md
├── .gitignore
└── notes/
    └── day1.md
```

并且你知道：

- 怎么打开项目
- 怎么进入虚拟环境
- 怎么运行 Python 文件
- 怎么保存学习记录

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
