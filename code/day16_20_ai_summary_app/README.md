# AI 总结助手（项目 v1）

这是第 2 阶段 Day16~21 的第一个可运行全栈小项目。  
目标是让用户输入一段文章后，快速得到高质量中文总结，并可切换输出风格。

## 项目亮点
- 支持三种总结风格：`简洁版` / `要点版` / `结构化版`
- 前端支持 mock 联调与真实联调双模式
- 包含基础 UX：loading、错误提示、复制结果
- 后端提供统一接口：`POST /generate`

## Day16~21 对应关系
- Day16：完成架构图和目录设计（见 `docs/day16_architecture.md`）
- Day17：完成前端页面初版（`frontend/day17_app.html`）
- Day18：完成后端接口（`backend/day18_main.py`）
- Day19：完成前后端联调
- Day20：完成基础 UX 优化
- Day21：完成 README + 截图清单 + 项目复盘（项目 v1）

## 目录结构
```text
day16_20_ai_summary_app/
├── backend/
│   ├── day18_main.py
│   └── day18_requirements.txt
├── frontend/
│   └── day17_app.html
├── docs/
│   ├── day16_architecture.md
│   ├── day19_day20_checklist.md
│   ├── day21_project_v1_report.md
│   └── day21_screenshot_checklist.md
├── screenshots/
│   └── README.md
└── README.md
```

## 快速启动
在仓库根目录执行：

```bash
cd code/day16_20_ai_summary_app
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r backend/day18_requirements.txt
python3 -m pip install certifi
uvicorn backend.day18_main:app --reload --port 8000
```

前端打开方式：
- 浏览器直接打开 `frontend/day17_app.html`
或者：
- `cd frontend && python3 -m http.server 5173` 后访问 `http://127.0.0.1:5173/day17_app.html`

## 环境变量（远程 API 模式）
后端当前已支持远程 OpenAI 兼容接口，默认读取：
- `REMOTE_API_BASE_URL`（默认 `https://dashscope.aliyuncs.com/compatible-mode/v1`）
- `REMOTE_API_KEY`（若未设置会回退到 `DASHSCOPE_API_KEY`）
- `REMOTE_MODEL_NAME`（默认 `qwen-turbo`）

示例：

```bash
export REMOTE_API_KEY="你的密钥"
export REMOTE_MODEL_NAME="qwen-turbo"
```

## 接口说明
### `GET /ping`
健康检查。

### `POST /generate`
请求体：

```json
{
  "text": "待总结原文",
  "style": "brief"
}
```

`style` 可选值：
- `brief`
- `bullets`
- `structured`

成功响应：

```json
{
  "ok": true,
  "summary": "生成结果",
  "style": "brief",
  "model": "qwen-turbo",
  "error": ""
}
```

## 联调模式
- 勾选“使用 mock 数据”：走前端内置 mock（适合界面演示）
- 取消勾选：走真实后端 `/generate`（适合完整链路验证）

## 演示路径（项目 v1）
1. 输入一段文章
2. 选择风格（简洁版/要点版/结构化版）
3. 点击“生成总结”
4. 查看结果、复制结果
5. 切换 mock 与真实联调，验证两条路径都可用

## 截图与复盘
- 截图清单：`docs/day21_screenshot_checklist.md`
- 截图目录：`screenshots/`
- Day21 复盘：`docs/day21_project_v1_report.md`
