"""Day 7 业务层函数集合。"""


def summarize_text(text: str):
    """模拟文本总结逻辑。"""
    text = text.strip()
    if not text:
        return "文本为空，无法总结。"
    return f"这段文本共 {len(text)} 个字符，主题摘要：这是一段待处理文本。"


def rewrite_text(text: str, style: str):
    """模拟按指定风格改写文本。"""
    text = text.strip()
    if not text:
        return "文本为空，无法改写。"
    return f"[{style}风格改写] {text}"


def extract_keywords(text: str):
    """用简单规则模拟关键词提取。"""
    text = text.strip()
    if not text:
        return []
    words = text.replace("，", " ").replace("。", " ").split()
    return words[:5]


def count_words(text: str):
    """统计输入文本的单词数。"""
    text = text.strip()
    if not text:
        return 0
    return len(text.split())


def uppercase_text(text: str):
    """返回文本的大写版本。"""
    return text.strip().upper()


def analyze_profile(name: str, role: str, target: str):
    """根据用户背景返回一段简短分析。"""
    return f"{name} 当前是 {role}，目标是 {target}，适合从 AI 应用开发方向切入。"
