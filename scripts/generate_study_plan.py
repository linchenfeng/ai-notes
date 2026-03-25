from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "study-plan"
START_DATE = date(2026, 3, 25)


@dataclass(frozen=True)
class DayPlan:
    day: int
    title: str
    task: str
    deliverable: str


DAILY_RHYTHM = [
    "学新知识 40～60 分钟",
    "写代码 60～90 分钟",
    "复盘记录 15～20 分钟",
]

PHASES = [
    {
        "start": 1,
        "end": 14,
        "title": "第 1 阶段：先跑通最小闭环",
        "goal": "先会 Python 最小开发、会调模型 API、会做一个最简单的 AI 工具。",
    },
    {
        "start": 15,
        "end": 28,
        "title": "第 2 阶段：先做出第一个全栈小项目",
        "goal": "尽快把你的前端优势接进来，做一个有界面的 AI 应用。",
    },
    {
        "start": 29,
        "end": 49,
        "title": "第 3 阶段：进入最重要的能力 RAG",
        "goal": "学会做知识库问答，这是初学者最值得投入的主线。",
    },
    {
        "start": 50,
        "end": 63,
        "title": "第 4 阶段：评测与优化",
        "goal": "从能跑升级到更准、更稳。",
    },
    {
        "start": 64,
        "end": 77,
        "title": "第 5 阶段：工具调用和数据库接入",
        "goal": "让模型不只是会说，还会调用工具。",
    },
    {
        "start": 78,
        "end": 87,
        "title": "第 6 阶段：Agent、流程编排、部署",
        "goal": "在已有能力上做复杂一点，但不追求很炫，追求稳定。",
    },
    {
        "start": 88,
        "end": 90,
        "title": "第 7 阶段：作品集和面试准备",
        "goal": "把学过变成可展示、可面试、可投递。",
    },
]

WEEKS = {
    1: {"slug": "week-01-python-http-fastapi", "theme": "Python + HTTP + FastAPI 最小必备"},
    2: {"slug": "week-02-llm-prompt-basics", "theme": "先调通 LLM，再补 Prompt"},
    3: {"slug": "week-03-ai-web-app", "theme": "做一个简单 AI Web 应用"},
    4: {"slug": "week-04-llm-theory-basics", "theme": "补理论，但只补你已经用到的理论"},
    5: {"slug": "week-05-rag-foundation", "theme": "理解 RAG，不急着优化"},
    6: {"slug": "week-06-rag-demo", "theme": "做出第一个 RAG Demo"},
    7: {"slug": "week-07-rag-productization", "theme": "把 RAG 做得更像产品"},
    8: {"slug": "week-08-evaluation", "theme": "建立评测意识"},
    9: {"slug": "week-09-retrieval-theory", "theme": "补检索和向量这块的理论"},
    10: {"slug": "week-10-tool-calling", "theme": "先学单工具调用"},
    11: {"slug": "week-11-db-query", "theme": "数据库和业务查询"},
    12: {"slug": "week-12-agent-deploy", "theme": "多步流程和部署"},
    13: {"slug": "week-13-portfolio-interview", "theme": "作品集和面试准备"},
}

PLANS = [
    DayPlan(1, "安装 Python、VS Code、Git、创建虚拟环境", "创建你的第一个项目 llm-roadmap。", "项目目录、README、虚拟环境跑通。"),
    DayPlan(2, "复习 Python 基础：变量、列表、字典、函数", "把 3 个你熟悉的 JS 小逻辑改写成 Python。", "basic_practice.py。"),
    DayPlan(3, "学习 Python 文件结构、模块导入、异常处理", "拆分 Day 2 代码成多个模块。", "utils/ 目录。"),
    DayPlan(4, "学习 JSON、文件读写、日志 logging", "写一个脚本读取 JSON 文件并格式化输出。", "read_json.py。"),
    DayPlan(5, "学习 HTTP 请求、状态码、GET/POST、超时", "用 requests 或 httpx 调一个公开 API。", "http_demo.py。"),
    DayPlan(6, "学习 FastAPI：路由、请求参数、返回 JSON", "做一个 /ping 和 /echo 接口。", "可运行的本地服务。"),
    DayPlan(7, "复盘", "写《我作为前端，为什么要先学 Python/FastAPI》。", "1 篇 Markdown 笔记。"),
    DayPlan(8, "注册并配置一个模型 API 平台", "拿到 Key，写第一次调用。", "hello_llm.py。"),
    DayPlan(9, "学习消息格式、system prompt、user prompt", "做一个文本润色器。", "CLI 版小工具。"),
    DayPlan(10, "学习 temperature、max tokens、基本参数", "测试同一任务不同参数的效果差异。", "参数实验记录。"),
    DayPlan(11, "学习结构化输出的概念", "让模型把文本转成固定 JSON。", "extract_to_json.py。"),
    DayPlan(12, "学习 Prompt 的基本写法：角色、目标、限制、输出格式", "给文章总结写 3 版 prompt。", "prompt_compare.md。"),
    DayPlan(13, "学习对话历史管理", "做一个带 3 轮上下文的聊天脚本。", "chat_memory_demo.py。"),
    DayPlan(14, "阶段复盘", "把 Day 8～13 的代码整理成一个 AI 文本助手。", "第一个可运行的 AI 小工具。"),
    DayPlan(15, "确定项目题目", "从 AI 文案助手、AI 总结助手、AI 翻译润色助手中选 1 个，写需求清单。", "项目说明文档。"),
    DayPlan(16, "设计前后端结构：前端 React/Next.js，后端 FastAPI", "画简单架构图。", "项目目录设计。"),
    DayPlan(17, "搭建前端页面：输入框、按钮、结果区", "先用 mock 数据打通界面。", "前端初版页面。"),
    DayPlan(18, "后端接入真实 LLM 接口", "做一个 /generate 接口。", "后端初版。"),
    DayPlan(19, "前后端联调", "页面输入内容后能拿到模型输出。", "第一个 AI Web 应用可用。"),
    DayPlan(20, "优化输出体验：loading、错误提示、复制按钮", "做基础 UX 优化。", "更完整的界面。"),
    DayPlan(21, "复盘", "写项目 README，截图保存。", "项目 v1。"),
    DayPlan(22, "学习 token、上下文窗口", "解释为什么长文本不能无脑全塞给模型。", "术语笔记。"),
    DayPlan(23, "学习 Transformer 的直觉版理解，不追数学", "画出输入 → 编码 → 注意力 → 输出的简图。", "一张图。"),
    DayPlan(24, "学习 few-shot、zero-shot", "对比同一任务下两种 prompt 的效果。", "实验记录。"),
    DayPlan(25, "学习 prompt 防歧义、格式约束", "改造你的项目 prompt，让输出更稳定。", "项目 v2 prompt。"),
    DayPlan(26, "学习错误处理、重试、日志", "给你的后端加异常捕获和日志。", "更稳的接口。"),
    DayPlan(27, "学习简单成本意识", "记录一次请求的输入长度、输出长度。", "成本意识表。"),
    DayPlan(28, "阶段复盘", "总结我已经真正掌握了哪些 LLM 基础。", "阶段总结 1。"),
    DayPlan(29, "学习 RAG 总流程：读文档、切分、向量化、检索、生成", "画 RAG 流程图。", "rag_flow.md。"),
    DayPlan(30, "学习什么是 Embedding", "用自己的话写清楚生成模型和向量表示的区别。", "解释文档。"),
    DayPlan(31, "学习 chunking", "拿一篇长文，按 3 种方式切分。", "切分实验。"),
    DayPlan(32, "准备文档集", "选一个主题，准备 20～30 篇资料。", "docs/ 资料库。"),
    DayPlan(33, "写文档读取脚本", "先支持 txt/md。", "load_docs.py。"),
    DayPlan(34, "写切分脚本", "把文档切成多个 chunk。", "split_docs.py。"),
    DayPlan(35, "复盘", "检查切分结果是否合理。", "切分样本。"),
    DayPlan(36, "学习向量数据库的基本概念", "选一个轻量方案先上手。", "本地索引环境。"),
    DayPlan(37, "实现 Embedding", "把文档 chunks 转成向量。", "embed_docs.py。"),
    DayPlan(38, "实现向量入库", "写索引构建脚本。", "build_index.py。"),
    DayPlan(39, "实现相似度检索", "输入问题，返回 top-k chunks。", "retriever.py。"),
    DayPlan(40, "把检索结果塞给模型生成回答", "完成最小 RAG 闭环。", "命令行版知识库问答。"),
    DayPlan(41, "给答案加引用来源", "输出文档标题或 chunk 来源。", "带引用的回答。"),
    DayPlan(42, "做简单前端界面", "把 RAG 接到网页上。", "RAG Web Demo。"),
    DayPlan(43, "学习有证据再回答，没证据就拒答", "给系统加一个拒答机制。", "更稳的 RAG v2。"),
    DayPlan(44, "学习 metadata", "给文档加标题、标签、来源。", "结构化索引数据。"),
    DayPlan(45, "优化 retrieval 的 prompt", "让模型更依赖检索内容回答。", "更稳的生成模板。"),
    DayPlan(46, "做 15～20 个测试问题", "人工测试正确率。", "测试题集。"),
    DayPlan(47, "记录 bad case", "整理至少 8 个错误示例。", "rag_badcases.md。"),
    DayPlan(48, "调参数：chunk size、top-k", "比较不同参数的效果。", "实验记录表。"),
    DayPlan(49, "阶段复盘", "整理出你第一个完整 RAG 项目仓库。", "项目 v1 可展示版。"),
    DayPlan(50, "学习什么叫评测：正确性、相关性、幻觉、引用准确", "写一份你的项目评测标准。", "eval_criteria.md。"),
    DayPlan(51, "构建测试集", "准备 20～30 个标准问题。", "eval_dataset.json。"),
    DayPlan(52, "写批量测试脚本", "让程序自动跑一批问题。", "run_eval.py。"),
    DayPlan(53, "记录结果", "保存问题、检索片段、回答、耗时。", "日志文件。"),
    DayPlan(54, "做第一次评测", "统计正确率和失败样例。", "评测报告 v1。"),
    DayPlan(55, "根据评测优化", "修改 prompt 或检索策略。", "RAG v2。"),
    DayPlan(56, "重新跑评测", "对比优化前后差异。", "评测报告 v2。"),
    DayPlan(57, "学习向量相似度、top-k 的意义", "用自己的语言讲清楚检索是怎么工作的。", "概念笔记。"),
    DayPlan(58, "学习关键词检索 vs 向量检索", "用同一问题做对比实验。", "对比结果表。"),
    DayPlan(59, "学习混合检索的思路", "设计一个关键词 + 向量方案。", "方案草稿。"),
    DayPlan(60, "学习 query rewrite", "把用户问题改写成更适合检索的形式。", "rewrite demo。"),
    DayPlan(61, "学习 rerank 是干什么的", "做一个最简单的二次排序实验。", "实验记录。"),
    DayPlan(62, "回头看 Embedding 理论", "补一篇为什么向量可以表达语义接近。", "原理理解文档。"),
    DayPlan(63, "阶段复盘", "给 RAG 项目做一次整体整理。", "RAG 项目可投简历版。"),
    DayPlan(64, "理解工具调用本质", "写 5 个判断例子，区分什么时候该让模型回答，什么时候该调工具。", "tool_use_rules.md。"),
    DayPlan(65, "写第一个工具：计算器", "模型识别算术问题并调用计算函数。", "calc_tool_demo.py。"),
    DayPlan(66, "再写一个工具：天气/搜索/mock 查询", "增加第二个工具。", "双工具 demo。"),
    DayPlan(67, "设计工具参数 schema", "规范输入输出。", "工具定义文档。"),
    DayPlan(68, "实现模型决定是否调用工具", "做一个问答 + 工具混合助手。", "tool calling v1。"),
    DayPlan(69, "处理失败情况", "给工具加异常处理、空结果处理。", "更稳的 tool demo。"),
    DayPlan(70, "复盘", "记录 5 个调用失败案例。", "失败案例表。"),
    DayPlan(71, "复习 SQL 基础", "练 15～20 条常见查询。", "sql_practice.sql。"),
    DayPlan(72, "Python 连接数据库", "做一个简单只读查询接口。", "db_demo.py。"),
    DayPlan(73, "学习自然语言转 SQL 的基本思路", "让模型根据问题生成 SQL。", "text-to-SQL v1。"),
    DayPlan(74, "加安全约束", "白名单表、限制只读、限制字段。", "安全版 SQL 助手。"),
    DayPlan(75, "做一个小型业务数据问答助手", "查表后把结果解释成人话。", "数据库问答 demo。"),
    DayPlan(76, "给它加前端页面", "展示查询结果和解释文本。", "Web 版 demo。"),
    DayPlan(77, "阶段复盘", "总结 LLM 接数据库最容易踩的坑。", "经验笔记。"),
    DayPlan(78, "理解 Agent 和普通工具调用的区别", "写出单步工具与多步任务的差异。", "概念对比表。"),
    DayPlan(79, "实现一个简单多步流程", "先分析问题，再调工具，再总结结果。", "简易 Agent v1。"),
    DayPlan(80, "给 Agent 加步骤日志", "显示每一步做了什么。", "可观察版 Agent。"),
    DayPlan(81, "学习超时、重试、fallback", "让 Agent 失败时不直接崩。", "健壮版 Agent。"),
    DayPlan(82, "看一个 Agent 框架，但只做轻量了解", "对比你手写版和框架版的区别。", "框架对比笔记。"),
    DayPlan(83, "了解 MCP 概念", "知道它是干什么的即可，不要求深入。", "MCP 入门笔记。"),
    DayPlan(84, "部署一个项目上线", "把你的 AI 应用或 RAG 项目部署到线上。", "在线地址。"),
    DayPlan(85, "加环境变量、日志、错误上报", "补齐工程化细节。", "可上线项目 v2。"),
    DayPlan(86, "做一次简单压力测试", "模拟多次请求，记录耗时。", "性能记录表。"),
    DayPlan(87, "阶段复盘", "确定最终要保留的 2～3 个项目。", "作品集清单。"),
    DayPlan(88, "整理 GitHub", "给每个项目补 README、架构图、运行说明、截图。", "规范项目仓库。"),
    DayPlan(89, "整理简历项目描述", "为每个项目写清楚背景、技术栈、职责、问题与优化。", "简历项目文案。"),
    DayPlan(90, "模拟面试", "准备并口述 RAG、Embedding、减少幻觉、工具调用设计和项目优化等问题。", "面试题答案 + 90 天总结。"),
]


def get_phase(day: int) -> dict[str, str]:
    for phase in PHASES:
        if phase["start"] <= day <= phase["end"]:
            return phase
    raise ValueError(f"Unknown phase for day {day}")


def cn_weekday(value: date) -> str:
    labels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    return labels[value.weekday()]


def day_markdown(plan: DayPlan) -> str:
    current_date = START_DATE + timedelta(days=plan.day - 1)
    week_number = ((plan.day - 1) // 7) + 1
    week_info = WEEKS[week_number]
    phase = get_phase(plan.day)
    projects = [
        "AI 文案/总结助手",
        "RAG 知识库助手",
        "工具/数据库问答助手",
    ]
    rhythm = "\n".join(f"- {item}" for item in DAILY_RHYTHM)
    return f"""# Day {plan.day:02d} 学习笔记

- 日期：{current_date.isoformat()}（{cn_weekday(current_date)}）
- 周次：第 {week_number} 周
- 本周主题：{week_info["theme"]}
- 阶段：{phase["title"]}
- 阶段目标：{phase["goal"]}

## 今日学习主题
{plan.title}

## 今日任务
{plan.task}

## 今日产出
{plan.deliverable}

## 建议学习节奏
{rhythm}

## 完成记录
- 完成时间：
- 实际投入：
- 遇到的问题：
- 解决方式：

## 今日代码 / 笔记链接
- 代码文件：
- 相关截图：
- 延伸阅读：

## 复盘
- 今天学到了什么：
- 还没弄懂什么：
- 明天开始前要准备什么：

## 与 90 天目标的关系
这一天的任务会服务于你的最终作品集，目标是在 90 天结束时至少拿出下面 3 个项目中的 2～3 个：

- {projects[0]}
- {projects[1]}
- {projects[2]}
"""


def week_readme(week_number: int, plans: list[DayPlan]) -> str:
    week_info = WEEKS[week_number]
    lines = [
        f"# 第 {week_number} 周",
        "",
        f"- 周主题：{week_info['theme']}",
        f"- 日期范围：{(START_DATE + timedelta(days=plans[0].day - 1)).isoformat()} ～ {(START_DATE + timedelta(days=plans[-1].day - 1)).isoformat()}",
        "",
        "## 本周安排",
    ]
    for plan in plans:
        current_date = START_DATE + timedelta(days=plan.day - 1)
        filename = f"{current_date.isoformat()}-day-{plan.day:02d}.md"
        lines.append(f"- [{current_date.isoformat()} Day {plan.day:02d}]({filename})：{plan.title}")
    lines.append("")
    return "\n".join(lines)


def root_readme() -> str:
    lines = [
        "# AI 学习笔记",
        "",
        "这是一个按周和日期展开的 90 天 AI / LLM 学习计划仓库，适合以 AI 应用开发为目标的前端学习者。",
        "",
        "## 默认学习假设",
        "",
        "- 学习周期：90 天",
        "- 每天投入：2～3 小时",
        "- 每天都学，不留空白天",
        "- 目标：3 个月后能独立做 2～3 个 LLM 项目，具备初级 LLM 应用开发能力",
        "- 起始日期：2026-03-25",
        "",
        "## 每天固定节奏",
        "",
    ]
    lines.extend(f"- {item}" for item in DAILY_RHYTHM)
    lines.extend(
        [
            "",
            "## 90 天结束时建议固定的 3 个项目",
            "",
            "- AI 文案/总结助手：体现 API 调用、Prompt、结构化输出、前后端联调",
            "- RAG 知识库助手：体现 Embedding、检索、引用、评测、优化",
            "- 工具/数据库问答助手：体现 Tool Calling、SQL、业务系统接入、工程能力",
            "",
            "## 目录结构",
            "",
            "- `study-plan/README.md`：完整路线索引",
            "- `study-plan/week-xx-*/README.md`：每周安排",
            "- `study-plan/week-xx-*/*.md`：每天的学习记录模板",
            "- `scripts/generate_study_plan.py`：用于重新生成计划文件",
        ]
    )
    return "\n".join(lines) + "\n"


def plan_index() -> str:
    lines = [
        "# 90 天学习路线索引",
        "",
        f"- 起始日期：{START_DATE.isoformat()}",
        f"- 结束日期：{(START_DATE + timedelta(days=len(PLANS) - 1)).isoformat()}",
        "",
        "## 阶段目标",
    ]
    for phase in PHASES:
        lines.append(f"- {phase['title']}（Day {phase['start']:02d}～Day {phase['end']:02d}）：{phase['goal']}")
    lines.extend(["", "## 周目录"])
    for week_number, info in WEEKS.items():
        week_plans = [plan for plan in PLANS if ((plan.day - 1) // 7) + 1 == week_number]
        start = START_DATE + timedelta(days=week_plans[0].day - 1)
        end = START_DATE + timedelta(days=week_plans[-1].day - 1)
        lines.append(
            f"- [第 {week_number} 周：{info['theme']}]({info['slug']}/README.md)（{start.isoformat()} ～ {end.isoformat()}）"
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    (ROOT / "README.md").write_text(root_readme(), encoding="utf-8")
    (OUTPUT_DIR / "README.md").write_text(plan_index(), encoding="utf-8")

    for week_number, info in WEEKS.items():
        week_dir = OUTPUT_DIR / info["slug"]
        week_dir.mkdir(parents=True, exist_ok=True)
        week_plans = [plan for plan in PLANS if ((plan.day - 1) // 7) + 1 == week_number]
        (week_dir / "README.md").write_text(week_readme(week_number, week_plans), encoding="utf-8")
        for plan in week_plans:
            current_date = START_DATE + timedelta(days=plan.day - 1)
            filename = f"{current_date.isoformat()}-day-{plan.day:02d}.md"
            (week_dir / filename).write_text(day_markdown(plan), encoding="utf-8")


if __name__ == "__main__":
    main()
