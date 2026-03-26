from fastapi import Body, FastAPI

app = FastAPI()


@app.get("/")
def home():
    # 根路由通常用来做服务欢迎页或健康提示。
    return {"message": "Hello, FastAPI!"}


@app.get("/ping")
def ping():
    # 这是最常见的健康检查接口写法。
    return {"status": "ok"}


@app.get("/profile")
def profile():
    # 返回固定 JSON，练习最基础的 GET 响应。
    return {
        "name": "charon",
        "role": "frontend developer",
        "target": "llm developer",
    }


@app.get("/hello")
def hello(name: str = "world"):
    # 查询参数会从 URL 中读取，比如 /hello?name=charon。
    return {"message": f"Hello, {name}!"}


@app.get("/square")
def square(num: int):
    # FastAPI 会自动把查询参数转换成你声明的类型。
    return {"num": num, "result": num * num}


@app.get("/check-role")
def check_role(role: str):
    return {"role": role, "is_match": role == "frontend"}


@app.get("/skills/{skill_name}")
def get_skill(skill_name: str):
    # 路径参数适合表达“某个具体资源”。
    return {"skill": skill_name}


@app.post("/echo")
def echo(data: dict = Body(...)):
    # Body(...) 表示从请求体中接收 JSON 数据。
    return {"received": data}


@app.post("/summarize")
def summarize(data: dict = Body(...)):
    # 这里先做模拟总结，后面再替换成真实大模型调用。
    text = data.get("text", "")
    return {
        "original_text": text,
        "summary": f"收到一段文本，长度为 {len(text)}",
    }
