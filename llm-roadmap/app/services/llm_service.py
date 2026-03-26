import json
from urllib import error, request

from app.core.config import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT


# 配置类错误：通常是模型名或基础配置缺失
class LLMConfigError(Exception):
    pass


# 连接类错误：通常是 Ollama 服务未启动或地址不可达
class LLMConnectionError(Exception):
    pass


# 超时错误：用于映射到 504
class LLMTimeoutError(Exception):
    pass


# 请求类错误：通常是上游返回异常状态或空结果
class LLMRequestError(Exception):
    pass


# 最小会话存储（仅学习用）：session_id -> messages
# 注意：生产环境建议迁移到 Redis/数据库
session_store: dict[str, list[dict[str, str]]] = {}


# 聊天场景下长期规则：稳定角色与回答风格
CHAT_SYSTEM_PROMPT = "你是一个帮助前端开发者学习大模型应用开发的中文教练。回答要清晰、具体、少空话。"


# 单轮任务场景下长期规则：强调严格按要求输出
TASK_SYSTEM_PROMPT = "你是一个严格按要求输出的中文文本处理助手。"


def _chat_with_ollama(messages: list[dict[str, str]]) -> str:
    """调用 Ollama /api/chat 并返回 assistant 文本。"""
    if not OLLAMA_MODEL:
        raise LLMConfigError("OLLAMA_MODEL is not configured")

    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat"
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
    }

    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=OLLAMA_TIMEOUT) as resp:
            raw = resp.read().decode("utf-8")
            data = json.loads(raw)
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise LLMRequestError(f"Ollama HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        reason = str(getattr(exc, "reason", ""))
        if "timed out" in reason.lower():
            raise LLMTimeoutError("Request to Ollama timed out") from exc
        raise LLMConnectionError(f"Cannot connect to Ollama: {exc.reason}") from exc
    except TimeoutError as exc:
        raise LLMTimeoutError("Request to Ollama timed out") from exc

    message = data.get("message") or {}
    text = (message.get("content") or "").strip()
    if not text:
        raise LLMRequestError("Ollama returned empty response")

    return text


def build_summarize_prompt(text: str) -> str:
    """总结任务的 Prompt 模板。"""
    return f"""
请把下面内容总结成 3 条要点。

要求：
1. 使用中文
2. 每条不超过 20 个字
3. 不要加入原文没有的信息
4. 只输出结果

内容：
{text}
""".strip()


def build_rewrite_prompt(text: str, style: str) -> str:
    """改写任务的 Prompt 模板。"""
    return f"""
请把下面内容改写成“{style}”风格。

要求：
1. 保持原意
2. 不要增加新观点
3. 输出只保留改写后的结果

原文：
{text}
""".strip()


def build_keyword_prompt(text: str) -> str:
    """关键词提取任务的 Prompt 模板。"""
    return f"""
请从下面内容中提取 5 个关键词。

要求：
1. 使用中文
2. 只输出关键词
3. 用逗号分隔
4. 不要输出解释

内容：
{text}
""".strip()


def run_prompt_task(task: str, text: str, style: str = "正式") -> str:
    """统一执行单轮 Prompt 任务（summarize/rewrite/keywords）。"""
    task = task.strip().lower()
    text = text.strip()

    if not task:
        raise ValueError("task cannot be empty")
    if not text:
        raise ValueError("text cannot be empty")

    if task == "summarize":
        user_prompt = build_summarize_prompt(text)
    elif task == "rewrite":
        user_prompt = build_rewrite_prompt(text, style)
    elif task == "keywords":
        user_prompt = build_keyword_prompt(text)
    else:
        raise ValueError("unsupported task")

    return _chat_with_ollama(
        [
            {"role": "system", "content": TASK_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ]
    )


def summarize_with_llm(text: str) -> str:
    """保持 Day13 兼容：总结接口内部复用任务执行器。"""
    return run_prompt_task("summarize", text)


def rewrite_with_llm(text: str, style: str) -> str:
    """保持 Day13 兼容：改写接口内部复用任务执行器。"""
    return run_prompt_task("rewrite", text, style)


def _initial_chat_messages() -> list[dict[str, str]]:
    """新会话初始化：先放 system 规则。"""
    return [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]


def _trim_chat_history(messages: list[dict[str, str]], max_turn_messages: int = 20) -> list[dict[str, str]]:
    """保留 system 消息 + 最近 N 条 user/assistant，避免内存无限增长。"""
    if not messages:
        return _initial_chat_messages()

    system_message = messages[0]
    tail = messages[1:]
    return [system_message] + tail[-max_turn_messages:]


def chat_with_llm(session_id: str, message: str) -> tuple[str, bool]:
    """多轮聊天：同一个 session_id 共享上下文。"""
    session_id = session_id.strip()
    message = message.strip()

    if not session_id:
        raise ValueError("session_id cannot be empty")
    if not message:
        raise ValueError("message cannot be empty")

    history = session_store.get(session_id)
    if history is None:
        history = _initial_chat_messages()

    # history 里除 system 外有内容，表示本轮是“带上下文”
    has_context = len(history) > 1

    history.append({"role": "user", "content": message})
    answer = _chat_with_ollama(history)
    history.append({"role": "assistant", "content": answer})

    session_store[session_id] = _trim_chat_history(history)
    return answer, has_context


def chat_once_with_llm(message: str) -> str:
    """单轮聊天：只发 system + 当前 user，不读写 session_store。"""
    message = message.strip()
    if not message:
        raise ValueError("message cannot be empty")

    return _chat_with_ollama(
        [
            {"role": "system", "content": CHAT_SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ]
    )


def reset_session(session_id: str) -> bool:
    """清空指定会话，返回是否成功删除已有会话。"""
    session_id = session_id.strip()
    if not session_id:
        raise ValueError("session_id cannot be empty")

    if session_id in session_store:
        del session_store[session_id]
        return True
    return False
