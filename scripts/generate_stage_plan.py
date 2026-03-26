from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class DayPlan:
    day: int
    title: str
    task: str
    deliverable: str


STAGES = [
    {"slug": "stage1", "title": "第 1 阶段：先跑通最小闭环", "days": (1, 14), "goal": "先会 Python 最小开发、会用 Ollama 调本地 Qwen、会做一个最简单的 AI 工具。"},
    {"slug": "stage2", "title": "第 2 阶段：先做出第一个全栈小项目", "days": (15, 28), "goal": "尽快把你的前端优势接进来，做一个有界面的 AI 应用。"},
    {"slug": "stage3", "title": "第 3 阶段：进入最重要的能力——RAG", "days": (29, 49), "goal": "学会做知识库问答，这是初学者最值得投入的主线。"},
    {"slug": "stage4", "title": "第 4 阶段：评测与优化", "days": (50, 63), "goal": "从“能跑”升级到“更准、更稳”。"},
    {"slug": "stage5", "title": "第 5 阶段：工具调用和数据库接入", "days": (64, 77), "goal": "让模型不只是“会说”，还会“调用工具”。"},
    {"slug": "stage6", "title": "第 6 阶段：Agent、流程编排、部署", "days": (78, 87), "goal": "在已有能力上做复杂一点，但不追求“很炫”，追求“稳定”。"},
    {"slug": "stage7", "title": "第 7 阶段：作品集和面试准备", "days": (88, 90), "goal": "把“学过”变成“可展示、可面试、可投递”。"},
]

DAILY_RHYTHM = [
    "学新知识 40～60 分钟",
    "写代码 60～90 分钟",
    "复盘记录 15～20 分钟",
]

PROJECTS = [
    "AI 文案/总结助手：体现本地模型调用、Prompt、结构化输出、前后端联调",
    "RAG 知识库助手：体现 Embedding、检索、引用、评测、优化",
    "工具/数据库问答助手：体现 tool calling、SQL、业务系统接入、工程能力",
]

PLANS = [
    DayPlan(1, "安装 Python、VS Code、Git、创建虚拟环境。", "创建你的第一个项目 llm-roadmap。", "项目目录、README、虚拟环境跑通。"),
    DayPlan(2, "复习 Python 基础：变量、列表、字典、函数。", "把 3 个你熟悉的 JS 小逻辑改写成 Python。", "basic_practice.py。"),
    DayPlan(3, "学习 Python 文件结构、模块导入、异常处理。", "拆分 Day 2 代码成多个模块。", "utils/ 目录。"),
    DayPlan(4, "学习 JSON、文件读写、日志 logging。", "写一个脚本读取 JSON 文件并格式化输出。", "read_json.py。"),
    DayPlan(5, "学习 HTTP 请求、状态码、GET/POST、超时。", "用 requests 或 httpx 调一个公开 API。", "http_demo.py。"),
    DayPlan(6, "学习 FastAPI：路由、请求参数、返回 JSON。", "做一个 /ping 和 /echo 接口。", "可运行的本地服务。"),
    DayPlan(7, "复盘。", "写《我作为前端，为什么要先学 Python/FastAPI》。", "1 篇 Markdown 笔记。"),
    DayPlan(8, "安装并配置 Ollama，拉取本地 Qwen 模型。", "跑通第一次本地模型调用。", "hello_qwen.py。"),
    DayPlan(9, "学习 Ollama 聊天消息格式、system prompt、user prompt。", "做一个“文本润色器”。", "CLI 版小工具。"),
    DayPlan(10, "学习 temperature、max tokens、基本参数。", "测试同一任务不同参数的效果差异。", "参数实验记录。"),
    DayPlan(11, "学习结构化输出的概念。", "让模型把文本转成固定 JSON。", "extract_to_json.py。"),
    DayPlan(12, "学习 Prompt 的基本写法：角色、目标、限制、输出格式。", "给“文章总结”写 3 版 prompt。", "prompt_compare.md。"),
    DayPlan(13, "学习对话历史管理。", "做一个带 3 轮上下文的聊天脚本。", "chat_memory_demo.py。"),
    DayPlan(14, "阶段复盘。", "把 Day 8～13 的代码整理成一个“本地 AI 文本助手”。", "你第一个可运行的本地 AI 小工具。"),
    DayPlan(15, "确定项目题目。", "从 AI 文案助手、AI 总结助手、AI 翻译润色助手中选 1 个；写需求清单。", "项目说明文档。"),
    DayPlan(16, "设计前后端结构：前端 React/Next.js，后端 FastAPI。", "画简单架构图。", "项目目录设计。"),
    DayPlan(17, "搭建前端页面：输入框、按钮、结果区。", "先用 mock 数据打通界面。", "前端初版页面。"),
    DayPlan(18, "后端接入本地 Qwen 接口。", "做一个 /generate 接口。", "后端初版。"),
    DayPlan(19, "前后端联调。", "页面输入内容后能拿到模型输出。", "第一个 AI Web 应用可用。"),
    DayPlan(20, "优化输出体验：loading、错误提示、复制按钮。", "做基础 UX 优化。", "更完整的界面。"),
    DayPlan(21, "复盘。", "写项目 README，截图保存。", "项目 v1。"),
    DayPlan(22, "学习 token、上下文窗口。", "解释为什么长文本不能无脑全塞给模型。", "术语笔记。"),
    DayPlan(23, "学习 Transformer 的直觉版理解，不追数学。", "画出“输入 → 编码 → 注意力 → 输出”的简图。", "一张图。"),
    DayPlan(24, "学习 few-shot、zero-shot。", "对比同一任务下两种 prompt 的效果。", "实验记录。"),
    DayPlan(25, "学习 prompt 防歧义、格式约束。", "改造你的项目 prompt，让输出更稳定。", "项目 v2 prompt。"),
    DayPlan(26, "学习错误处理、重试、日志。", "给你的后端加异常捕获和日志。", "更稳的接口。"),
    DayPlan(27, "学习简单成本意识。", "记录一次请求的输入长度、输出长度。", "成本意识表。"),
    DayPlan(28, "阶段复盘。", "总结“我已经真正掌握了哪些 LLM 基础”。", "阶段总结 1。"),
    DayPlan(29, "学习 RAG 总流程：读文档、切分、向量化、检索、生成。", "画 RAG 流程图。", "rag_flow.md。"),
    DayPlan(30, "学习什么是 Embedding。", "用自己的话写清楚“生成模型”和“向量表示”的区别。", "解释文档。"),
    DayPlan(31, "学习 chunking。", "拿一篇长文，按 3 种方式切分。", "切分实验。"),
    DayPlan(32, "准备文档集。", "选一个主题，准备 20～30 篇资料。推荐：前端、数据库、AI 学习资料都可以。", "docs/ 资料库。"),
    DayPlan(33, "写文档读取脚本。", "先支持 txt/md。", "load_docs.py。"),
    DayPlan(34, "写切分脚本。", "把文档切成多个 chunk。", "split_docs.py。"),
    DayPlan(35, "复盘。", "检查切分结果是否合理。", "切分样本。"),
    DayPlan(36, "学习向量数据库的基本概念。", "选一个轻量方案先上手。", "本地索引环境。"),
    DayPlan(37, "实现 Embedding。", "把文档 chunks 转成向量。", "embed_docs.py。"),
    DayPlan(38, "实现向量入库。", "写索引构建脚本。", "build_index.py。"),
    DayPlan(39, "实现相似度检索。", "输入问题，返回 top-k chunks。", "retriever.py。"),
    DayPlan(40, "把检索结果塞给模型生成回答。", "完成最小 RAG 闭环。", "命令行版知识库问答。"),
    DayPlan(41, "给答案加“引用来源”。", "输出文档标题或 chunk 来源。", "带引用的回答。"),
    DayPlan(42, "做简单前端界面。", "把 RAG 接到网页上。", "RAG Web Demo。"),
    DayPlan(43, "学习“有证据再回答，没证据就拒答”。", "加一个拒答机制。", "更稳的 RAG v2。"),
    DayPlan(44, "学习 metadata。", "给文档加标题、标签、来源。", "结构化索引数据。"),
    DayPlan(45, "优化 retrieval 的 prompt。", "让模型更依赖检索内容回答。", "更稳的生成模板。"),
    DayPlan(46, "做 15～20 个测试问题。", "人工测试正确率。", "测试题集。"),
    DayPlan(47, "记录 bad case。", "整理至少 8 个错误示例。", "rag_badcases.md。"),
    DayPlan(48, "调参数：chunk size、top-k。", "比较不同参数的效果。", "实验记录表。"),
    DayPlan(49, "阶段复盘。", "整理出你第一个完整 RAG 项目仓库。", "项目 v1 可展示版。"),
    DayPlan(50, "学习什么叫评测：正确性、相关性、幻觉、引用准确。", "写一份你的项目评测标准。", "eval_criteria.md。"),
    DayPlan(51, "构建测试集。", "准备 20～30 个标准问题。", "eval_dataset.json。"),
    DayPlan(52, "写批量测试脚本。", "让程序自动跑一批问题。", "run_eval.py。"),
    DayPlan(53, "记录结果。", "保存问题、检索片段、回答、耗时。", "日志文件。"),
    DayPlan(54, "做第一次评测。", "统计正确率和失败样例。", "评测报告 v1。"),
    DayPlan(55, "根据评测优化。", "修改 prompt 或检索策略。", "RAG v2。"),
    DayPlan(56, "重新跑评测。", "对比优化前后差异。", "评测报告 v2。"),
    DayPlan(57, "学习向量相似度、top-k 的意义。", "用自己的语言讲清楚检索是怎么工作的。", "概念笔记。"),
    DayPlan(58, "学习关键词检索 vs 向量检索。", "用同一问题做对比实验。", "对比结果表。"),
    DayPlan(59, "学习混合检索的思路。", "设计一个“关键词 + 向量”的方案。", "方案草稿。"),
    DayPlan(60, "学习 query rewrite。", "把用户问题改写成更适合检索的形式。", "rewrite demo。"),
    DayPlan(61, "学习 rerank 是干什么的。", "做一个最简单的二次排序实验。", "实验记录。"),
    DayPlan(62, "回头看 Embedding 理论。", "补一篇“为什么向量可以表达语义接近”。", "原理理解文档。"),
    DayPlan(63, "阶段复盘。", "给 RAG 项目做一次整体整理。", "RAG 项目可投简历版。"),
    DayPlan(64, "理解工具调用本质。", "写 5 个判断例子。", "tool_use_rules.md。"),
    DayPlan(65, "写第一个工具：计算器。", "模型识别算术问题并调用计算函数。", "calc_tool_demo.py。"),
    DayPlan(66, "再写一个工具：天气/搜索/mock 查询。", "增加第二个工具。", "双工具 demo。"),
    DayPlan(67, "设计工具参数 schema。", "规范输入输出。", "工具定义文档。"),
    DayPlan(68, "实现“模型决定是否调用工具”。", "做一个问答 + 工具混合助手。", "tool calling v1。"),
    DayPlan(69, "处理失败情况。", "给工具加异常处理、空结果处理。", "更稳的 tool demo。"),
    DayPlan(70, "复盘。", "记录 5 个调用失败案例。", "失败案例表。"),
    DayPlan(71, "复习 SQL 基础。", "练 15～20 条常见查询。", "sql_practice.sql。"),
    DayPlan(72, "Python 连接数据库。", "做一个简单只读查询接口。", "db_demo.py。"),
    DayPlan(73, "学习自然语言转 SQL 的基本思路。", "让模型根据问题生成 SQL。", "text-to-SQL v1。"),
    DayPlan(74, "加安全约束。", "白名单表、限制只读、限制字段。", "安全版 SQL 助手。"),
    DayPlan(75, "做一个“小型业务数据问答助手”。", "查表后把结果解释成人话。", "数据库问答 demo。"),
    DayPlan(76, "给它加前端页面。", "展示查询结果和解释文本。", "Web 版 demo。"),
    DayPlan(77, "阶段复盘。", "总结“LLM 接数据库最容易踩的坑”。", "经验笔记。"),
    DayPlan(78, "理解 Agent 和普通工具调用的区别。", "写出“单步工具”与“多步任务”的差异。", "概念对比表。"),
    DayPlan(79, "实现一个简单多步流程。", "先分析问题 → 再调工具 → 再总结结果。", "简易 Agent v1。"),
    DayPlan(80, "给 Agent 加步骤日志。", "显示每一步做了什么。", "可观察版 Agent。"),
    DayPlan(81, "学习超时、重试、fallback。", "让 Agent 失败时不直接崩。", "健壮版 Agent。"),
    DayPlan(82, "看一个 Agent 框架，但只做轻量了解。", "对比你手写版和框架版的区别。", "框架对比笔记。"),
    DayPlan(83, "了解 MCP 概念。", "知道它是干什么的即可，不要求深入。", "MCP 入门笔记。"),
    DayPlan(84, "部署一个项目上线。", "把你的 AI 应用或 RAG 项目部署到线上。", "在线地址。"),
    DayPlan(85, "加环境变量、日志、错误上报。", "补齐工程化细节。", "可上线项目 v2。"),
    DayPlan(86, "做一次简单压力测试。", "模拟多次请求，记录耗时。", "性能记录表。"),
    DayPlan(87, "阶段复盘。", "确定最终要保留的 2～3 个项目。", "作品集清单。"),
    DayPlan(88, "整理 GitHub。", "每个项目补 README、架构图、运行说明、截图。", "规范项目仓库。"),
    DayPlan(89, "整理简历项目描述。", "每个项目写清楚项目背景、技术栈、你的职责、遇到的问题、如何优化。", "简历项目文案。"),
    DayPlan(90, "模拟面试。", "准备并口述这些问题：什么是 RAG、Embedding 有什么作用、如何减少幻觉、工具调用怎么设计、你项目里做过哪些优化。", "面试题答案 + 90 天总结。"),
]


def get_stage(day: int) -> dict:
    for stage in STAGES:
        start, end = stage["days"]
        if start <= day <= end:
            return stage
    raise ValueError(day)


def build_learning_purpose(plan: DayPlan, stage: dict) -> str:
    return f"今天这一步是在为“{stage['goal']}”打地基，重点不是一次学完，而是把「{plan.title.rstrip('。')}」真正落到代码和可见结果上。"


def build_day_goals(plan: DayPlan) -> list[str]:
    return [
        f"理解今天的核心主题：{plan.title.rstrip('。')}",
        f"完成原始大纲里的主任务：{plan.task.rstrip('。')}",
        f"做出今天要求的产出：{plan.deliverable.rstrip('。')}",
        "能用一句话说清楚今天这一步会在后面的哪个项目里派上用场",
    ]


def build_goal_explanations(plan: DayPlan, stage: dict) -> list[str]:
    return [
        f"第一层目标：先真正看懂“{plan.title.rstrip('。')}”在当前阶段里的作用，不是死记概念，而是知道它为什么会出现在“{stage['goal']}”这条主线上。",
        f"第二层目标：把今天的大纲任务“{plan.task.rstrip('。')}”落到实际动作上，也就是你今天结束前必须亲手完成，而不是只停留在阅读或理解。",
        f"第三层目标：把结果沉淀成“{plan.deliverable.rstrip('。')}”这样的可见产出，这样你后面回看时能明确知道自己当时做到了哪一步。",
        "第四层目标：建立项目视角。你不仅要知道今天做了什么，还要知道它以后会接到哪个更大的模块、项目或作品集里。",
    ]


def build_action_steps(plan: DayPlan, stage: dict) -> list[str]:
    return [
        f"先花 10～15 分钟明确今天只做一件核心事：{plan.title.rstrip('。')}。",
        f"按照原始大纲完成主任务：{plan.task.rstrip('。')}。",
        f"把结果落成一个明确产出：{plan.deliverable.rstrip('。')}，不要只停留在“看懂”。",
        f"最后回到阶段目标，检查今天这一步是否真的在推进：{stage['goal']}",
    ]


def build_time_blocks(plan: DayPlan, stage: dict) -> list[tuple[str, str, list[str]]]:
    return [
        (
            "第一阶段：理解今天要做什么",
            "15～20 分钟",
            [
                f"重新读一遍今天的主题：{plan.title.rstrip('。')}",
                f"确认今天真正要交付的东西是：{plan.deliverable.rstrip('。')}",
                f"把今天和阶段目标连起来：{stage['goal']}",
            ],
        ),
        (
            "第二阶段：完成核心任务",
            "90～120 分钟",
            [
                f"直接动手做主任务：{plan.task.rstrip('。')}",
                "遇到卡点优先查文档、报错信息或最小示例，不要长时间停在抽象理解上",
                "优先先做出能运行、能展示、能保存的最小结果",
            ],
        ),
        (
            "第三阶段：整理产出",
            "30～40 分钟",
            [
                f"把今天的结果固定成明确产出：{plan.deliverable.rstrip('。')}",
                "补必要的说明、注释、截图或实验记录，方便后面回看",
                "确认别人看到你的产出时，能明白你今天做了什么",
            ],
        ),
        (
            "第四阶段：复盘和收尾",
            "15～20 分钟",
            [
                "写下今天最关键的收获和最卡的地方",
                "写一句“我今天学这个，是为了后面做什么”",
                "给明天留一个最具体的起手点",
            ],
        ),
    ]


def build_done_criteria(plan: DayPlan) -> list[str]:
    return [
        f"你已经动手完成了任务里要求的核心动作：{plan.task.rstrip('。')}。",
        f"今天对应的产出物已经实际出现：{plan.deliverable.rstrip('。')}。",
        "你能用一句话解释今天的内容之后会在哪个更大的项目里用到。",
        "你留下了可复盘的记录，比如代码、截图、实验结论或 Markdown 笔记。",
    ]


def build_risks(plan: DayPlan) -> list[str]:
    return [
        "不要只看教程不动手，今天必须留下代码或文档结果。",
        "不要为了追求完美而偏离原始任务，先把最小闭环做出来。",
        f"如果时间不够，优先保证今天的产出物完成：{plan.deliverable.rstrip('。')}。",
    ]


def build_reflection_prompts(plan: DayPlan) -> list[str]:
    return [
        f"今天最卡的一步是不是出现在「{plan.task.rstrip('。')}」这里？为什么？",
        f"今天的产出「{plan.deliverable.rstrip('。')}」是否已经达到可运行、可展示或可复用的最低标准？",
        "如果明天继续，你最想先优化哪一个点？",
    ]


def build_examples(plan: DayPlan) -> list[str]:
    deliverable = plan.deliverable.lower()
    title = plan.title.lower()
    task = plan.task.lower()

    if "ollama" in title or "qwen" in title or "ollama" in task or "qwen" in task:
        return [
            "本地模型调用示例：最低标准应该是你已经在本机启动了 Ollama，且能通过 Python 成功请求一次本地 Qwen，而不是只完成安装截图。",
            "例如：先跑通一个最小脚本，向 `http://localhost:11434/api/chat` 或 `http://localhost:11434/api/generate` 发请求，确认能拿到模型返回内容。",
        ]

    if deliverable.endswith(".py。") or deliverable.endswith(".py"):
        filename = plan.deliverable.rstrip("。")
        return [
            f"代码类示例：如果今天产出是 `{filename}`，那最低标准应该是文件已经创建好、能运行，里面至少包含能体现今天主题的核心逻辑。",
            f"例如：围绕“{plan.task.rstrip('。')}”，你可以先写一个最小可运行版本，再逐步补充输入、输出、异常处理或注释。",
        ]

    if deliverable.endswith(".md。") or deliverable.endswith(".md"):
        filename = plan.deliverable.rstrip("。")
        return [
            f"文档类示例：如果今天产出是 `{filename}`，那它至少应该包含背景、过程、结论 3 部分，而不是只写几句零散笔记。",
            f"例如：你可以先写“今天研究了什么”，再写“我得出的结论是什么”，最后补“这会如何影响后面的实现”。",
        ]

    if deliverable.endswith(".json。") or deliverable.endswith(".json"):
        filename = plan.deliverable.rstrip("。")
        return [
            f"结构化数据示例：如果今天产出是 `{filename}`，那最低标准应该是字段结构明确、可以被程序继续读取，而不是随便拼一段文本。",
            f"例如：先定义最小字段，再验证这些字段是否真的能支持后续评测、抽取或接口调用。",
        ]

    if "接口" in plan.deliverable or "服务" in plan.deliverable:
        return [
            "接口类示例：最低标准应该是服务能启动、至少有一个接口能请求成功，并且返回结构是稳定可读的 JSON。",
            "例如：如果今天在做后端接口，不要一开始追求复杂业务，先让一个最小接口真正跑通，再补参数、错误处理和返回结构。",
        ]

    if "页面" in plan.deliverable or "界面" in plan.deliverable or "demo" in deliverable:
        return [
            "界面类示例：最低标准应该是页面能打开、核心交互路径可走通，而不是只画出静态样子。",
            "例如：先确保输入、点击、展示结果这一条主流程能走通，再去补样式、loading 和错误提示。",
        ]

    if "项目" in plan.deliverable or "仓库" in plan.deliverable or "v1" in deliverable:
        return [
            "项目类示例：最低标准应该是核心能力已经可演示，比如能运行、能截图、能说明用途，而不是只有一个空目录。",
            "例如：至少准备 README、核心代码入口和一条能证明项目成立的演示路径。",
        ]

    if "图" in plan.deliverable or "架构" in plan.task or "流程图" in plan.task:
        return [
            "图示类示例：最低标准应该是图里真的表达了流程、模块关系或输入输出，而不是只写几个概念词。",
            "例如：你可以用“输入 → 处理 → 输出”这样的主线把概念串起来，这样后面回看时最有帮助。",
        ]

    return [
        f"最小示例：围绕今天的任务“{plan.task.rstrip('。')}”，先做出一个可见结果，再继续细化，不要一开始就把范围做大。",
        f"例如：今天结束前，至少要让“{plan.deliverable.rstrip('。')}”处于可展示、可说明、可复盘的状态。",
    ]


def build_example_snippet(plan: DayPlan) -> str:
    deliverable = plan.deliverable.rstrip("。")
    lower_deliverable = deliverable.lower()
    lower_title = plan.title.lower()
    lower_task = plan.task.lower()

    if "ollama" in lower_title or "qwen" in lower_title or "ollama" in lower_task or "qwen" in lower_task:
        return """```python
import requests


def main():
    payload = {
        "model": "qwen2.5:7b",
        "messages": [
            {"role": "system", "content": "你是一个简洁的中文助手。"},
            {"role": "user", "content": "请用一句话介绍 Python。"},
        ],
        "stream": False,
    }

    response = requests.post(
        "http://localhost:11434/api/chat",
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    print(data["message"]["content"])


if __name__ == "__main__":
    main()
```"""

    if deliverable.endswith(".py"):
        if "api" in lower_title or "fastapi" in lower_title or "接口" in plan.task:
            return """```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def ping():
    return {"status": "ok"}
```"""

        if "json" in lower_title or "json" in lower_task:
            return """```python
import json

with open("data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

print(data)
```"""

        if "rag" in lower_title or "检索" in lower_title or "embedding" in lower_title:
            return """```python
def main():
    question = "什么是 RAG？"
    chunks = ["RAG 是检索增强生成。"]
    answer = f"基于检索内容回答：{chunks[0]}"
    print(answer)


if __name__ == "__main__":
    main()
```"""

        if "sql" in lower_deliverable or "tool" in lower_deliverable:
            return """```python
def main():
    result = {"status": "ok", "message": "minimum runnable demo"}
    print(result)


if __name__ == "__main__":
    main()
```"""

        return """```python
def main():
    print("minimum runnable result")


if __name__ == "__main__":
    main()
```"""

    if deliverable.endswith(".md"):
        return """```md
# 标题

## 背景
- 今天在解决什么问题

## 过程
- 我做了什么

## 结论
- 我最后得到了什么结果
```"""

    if deliverable.endswith(".json"):
        return """```json
{
  "name": "example",
  "status": "ok",
  "items": []
}
```"""

    if deliverable.endswith(".sql"):
        return """```sql
SELECT id, name
FROM users
WHERE id <= 10;
```"""

    if "目录" in deliverable or "资料库" in deliverable or "docs/" in deliverable:
        return """```text
project/
├── docs/
│   ├── doc1.md
│   └── doc2.md
└── README.md
```"""

    if "界面" in deliverable or "页面" in deliverable or "demo" in lower_deliverable:
        return """```text
输入框 -> 点击按钮 -> 显示结果
```"""

    if "接口" in deliverable or "服务" in deliverable:
        return """```json
{
  "success": true,
  "result": "example response"
}
```"""

    if "图" in deliverable:
        return """```text
输入 -> 处理 -> 输出
```"""

    return """```text
minimum visible result
```"""


def build_one_line_summary(plan: DayPlan, stage: dict) -> str:
    return f"我今天完成了「{plan.title.rstrip('。')}」这一步，它是在为“{stage['goal']}”做准备。"


def day_markdown(plan: DayPlan) -> str:
    stage = get_stage(plan.day)
    goals = "\n".join(f"- {item}" for item in build_day_goals(plan))
    goal_explanations = "\n".join(f"- {item}" for item in build_goal_explanations(plan, stage))
    action_steps = "\n".join(f"- {item}" for item in build_action_steps(plan, stage))
    time_blocks = []
    for title, duration, steps in build_time_blocks(plan, stage):
        block = [f"## {title}", "", f"建议时间：{duration}", ""]
        block.extend(f"- {step}" for step in steps)
        time_blocks.append("\n".join(block))
    time_blocks_md = "\n\n".join(time_blocks)
    done_criteria = "\n".join(f"- {item}" for item in build_done_criteria(plan))
    risks = "\n".join(f"- {item}" for item in build_risks(plan))
    reflections = "\n".join(f"- {item}" for item in build_reflection_prompts(plan))
    examples = "\n".join(f"- {item}" for item in build_examples(plan))
    example_snippet = build_example_snippet(plan)
    rhythm = "\n".join(f"- {item}" for item in DAILY_RHYTHM)
    return f"""# Day {plan.day:02d}

- 阶段：{stage["title"]}
- 阶段目标：{stage["goal"]}

## 今日主题
{plan.title}

## 今日任务
{plan.task}

## 今日产出
{plan.deliverable}

## Day {plan.day:02d} 学习目标
{goals}

## 学习目标详细说明
{goal_explanations}

## 今天为什么学这个
{build_learning_purpose(plan, stage)}

## 今日时间安排

约 3 小时。

## 每天固定节奏建议
{rhythm}

## 建议执行步骤
{action_steps}

{time_blocks_md}

## 今天完成标准
{done_criteria}

## 示例参考
{examples}

### 示例片段
{example_snippet}

## 今天不要偏离的点
{risks}

## 今日记录
- 今天有没有真正写代码：
- 今天有没有产出一个可见结果：
- 今天能不能用一句话说清楚“我学这个是为了什么”：
- 学到的重点：
- 遇到的问题：
- 明天的衔接点：

## 复盘提示
{reflections}

## 一句话复盘
{build_one_line_summary(plan, stage)}
"""


def stage_readme(stage: dict, plans: list[DayPlan]) -> str:
    lines = [
        f"# {stage['title']}",
        "",
        f"- Day 范围：{stage['days'][0]:02d}～{stage['days'][1]:02d}",
        f"- 阶段目标：{stage['goal']}",
        "",
        "## 阶段日程",
    ]
    for plan in plans:
        lines.append(f"- [Day {plan.day:02d}](day{plan.day:02d}.md)：{plan.title}")
        lines.append(f"  任务：{plan.task}")
        lines.append(f"  产出：{plan.deliverable}")
    lines.append("")
    return "\n".join(lines)


def root_readme() -> str:
    lines = [
        "# 90 天 AI 学习计划",
        "",
        "这是一版更适合初学者的 90 天学习路线，核心顺序是：先会调用本地模型 → 先做小应用 → 再理解理论 → 再做 RAG → 再做工具和 Agent → 最后做部署和作品集。",
        "",
        "## 学习假设",
        "",
        "- 学习周期：90 天",
        "- 每天投入：2～3 小时",
        "- 每天都学，不留空白天",
        "- 目标：3 个月后能独立做 2～3 个 LLM 项目，具备初级 LLM 应用开发能力",
        "",
        "## 每天固定节奏建议",
        "",
    ]
    lines.extend(f"- {item}" for item in DAILY_RHYTHM)
    lines.extend(
        [
            "",
            "## 这版为什么更适合初学者",
            "",
            "- 把“理论前置”改成“实践先行”",
            "- 把第一个项目提前，尽快获得可见反馈",
            "- 把 RAG 提前到中段主线",
            "- 把 Agent / MCP 后置，等基础稳定后再学复杂编排",
            "",
            "## 推荐最终作品集",
            "",
        ]
    )
    lines.extend(f"- {item}" for item in PROJECTS)
    lines.extend(["", "## 阶段目录"])
    for stage in STAGES:
        lines.append(f"- [{stage['slug']}/]({stage['slug']}/README.md)：{stage['title']}")
    lines.extend(
        [
            "",
            "## 你每天执行时的判断标准",
            "",
            "- 今天有没有真正写代码",
            "- 今天有没有产出一个可见结果",
            "- 今天能不能用一句话说清楚“我学这个是为了什么”",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    scripts_dir = ROOT / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)

    for stage in STAGES:
        stage_dir = ROOT / stage["slug"]
        if stage_dir.exists():
            shutil.rmtree(stage_dir)
        stage_dir.mkdir(parents=True, exist_ok=True)

        stage_plans = [plan for plan in PLANS if stage["days"][0] <= plan.day <= stage["days"][1]]
        (stage_dir / "README.md").write_text(stage_readme(stage, stage_plans), encoding="utf-8")

        for plan in stage_plans:
            (stage_dir / f"day{plan.day:02d}.md").write_text(day_markdown(plan), encoding="utf-8")

    (ROOT / "README.md").write_text(root_readme(), encoding="utf-8")


if __name__ == "__main__":
    main()
