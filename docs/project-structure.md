# 逆天改命算命软件项目目录结构文档

## 1. 文档说明

本文档定义项目推荐的 monorepo 目录结构，用于指导工程初始化、模块边界和代码归属。

目标是：

1. 支持 Web、Android、iOS、Desktop 跨端协作
2. 支持 API、Worker、共享包清晰拆分
3. 支持后续从模块化单体平滑演进

---

## 2. 结构设计原则

1. 应用与共享包分离
2. API 与 Worker 分离
3. 类型、SDK、校验规则共享
4. 文档、脚本、配置集中管理
5. 尽量避免端侧重复定义领域模型

---

## 3. 推荐顶层结构

```text
ntgm/
├── README.md
├── docs/
├── apps/
├── services/
├── packages/
├── infra/
├── scripts/
├── .env.example
├── package.json
└── pnpm-workspace.yaml
```

---

## 4. apps 目录

`apps/` 用于放各端应用壳层。

推荐：

```text
apps/
├── web/
├── mobile/
└── desktop/
```

### 4.1 apps/web

用途：

1. Next.js Web 前端
2. 首页、画像页、人物匹配页、成长档案页
3. 分享页与导出页

建议子结构：

```text
apps/web/
├── app/
├── components/
├── features/
├── lib/
├── styles/
└── public/
```

### 4.2 apps/mobile

用途：

1. React Native + Expo
2. Android / iOS 页面
3. 拍照、通知、事件记录、持续问答

建议子结构：

```text
apps/mobile/
├── app/
├── components/
├── features/
├── lib/
└── assets/
```

### 4.3 apps/desktop

用途：

1. Tauri 桌面端壳
2. 长文本录入、导出和桌面通知

建议子结构：

```text
apps/desktop/
├── src/
├── src-tauri/
└── assets/
```

---

## 5. services 目录

`services/` 用于放后端服务。

推荐：

```text
services/
├── api/
└── worker/
```

### 5.1 services/api

用途：

1. FastAPI 主服务
2. REST API
3. 鉴权
4. 业务编排

建议子结构：

```text
services/api/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   └── main.py
├── migrations/
└── tests/
```

#### app/api

放路由层，例如：

1. `users`
2. `questionnaire`
3. `profiles`
4. `matches`
5. `advice`
6. `archive`

#### app/core

放基础配置：

1. settings
2. logging
3. auth
4. database
5. redis

#### app/models

放 ORM 模型。

#### app/schemas

放 Pydantic 请求与响应模型。

#### app/services

放业务服务层逻辑。

#### app/repositories

放数据访问层。

### 5.2 services/worker

用途：

1. Celery Worker
2. Celery Beat
3. 长耗时任务

建议子结构：

```text
services/worker/
├── app/
│   ├── tasks/
│   ├── jobs/
│   ├── pipelines/
│   └── celery_app.py
└── tests/
```

#### app/tasks

按任务类型拆分：

1. `analyze_bazi`
2. `analyze_face`
3. `analyze_palm`
4. `recompute_profile`
5. `recompute_match`
6. `generate_advice`
7. `generate_report`

#### app/pipelines

用于放任务链路编排逻辑。

---

## 6. packages 目录

`packages/` 用于放多端共享包。

推荐：

```text
packages/
├── api-schema/
├── sdk/
├── domain/
├── validation/
├── design-tokens/
└── utils/
```

### 6.1 api-schema

用途：

1. API DTO
2. OpenAPI 生成类型
3. 接口枚举

### 6.2 sdk

用途：

1. Web / Mobile / Desktop 共用 API Client
2. 请求封装
3. 鉴权头封装

### 6.3 domain

用途：

1. 画像模型
2. 匹配模型
3. 建议模型
4. 时间线模型

### 6.4 validation

用途：

1. 表单校验规则
2. Zod schema
3. 枚举约束

### 6.5 design-tokens

用途：

1. 颜色
2. 字体
3. 间距
4. 圆角
5. 阴影

### 6.6 utils

用途：

1. 通用工具函数
2. 日期与时间处理
3. 平台无关辅助方法

---

## 7. infra 目录

`infra/` 用于放部署和基础设施相关配置。

推荐：

```text
infra/
├── docker/
├── compose/
├── nginx/
├── k8s/
└── ci/
```

### 用途

1. Dockerfile
2. Docker Compose 配置
3. Nginx 配置
4. 未来 K8s 配置
5. CI/CD 模板

---

## 8. scripts 目录

`scripts/` 用于放项目辅助脚本。

推荐：

```text
scripts/
├── dev/
├── db/
├── deploy/
└── maintenance/
```

### 示例用途

1. 本地启动脚本
2. 数据库初始化脚本
3. 测试数据导入脚本
4. 部署辅助脚本
5. 清理临时文件脚本

---

## 9. docs 目录

`docs/` 用于放项目所有文档。

当前建议包含：

1. 产品文档
2. 设计文档
3. UI 文档
4. 模块文档
5. 技术文档
6. 资源文档
7. 部署文档
8. API 文档
9. 用户文档
10. 运维文档
11. 路线图文档
12. 项目结构文档

---

## 10. 根目录建议文件

建议根目录保留：

1. `README.md`
2. `.gitignore`
3. `.editorconfig`
4. `.env.example`
5. `package.json`
6. `pnpm-workspace.yaml`

后端如果独立依赖管理，也可增加：

1. `pyproject.toml`
2. `uv.lock` 或等价锁文件

---

## 11. 代码归属规则

建议执行以下规则：

1. 页面代码只放在 `apps/*`
2. 共享领域模型不放在 app 内部
3. API 协议定义集中在 `packages/api-schema`
4. 表单校验规则集中在 `packages/validation`
5. 后端数据库模型只放在 `services/api`
6. 异步任务逻辑只放在 `services/worker`

这样可以避免：

1. 同一模型多端重复定义
2. 页面层直接持有复杂业务逻辑
3. Worker 和 API 逻辑混杂

---

## 12. MVP 推荐最小结构

如果先实现最小版本，可以从下面这套最小结构开始：

```text
ntgm/
├── README.md
├── docs/
├── apps/
│   ├── web/
│   └── mobile/
├── services/
│   ├── api/
│   └── worker/
├── packages/
│   ├── sdk/
│   ├── domain/
│   └── validation/
└── infra/
```

桌面端可以在第二阶段再加入 `apps/desktop`。

---

## 13. 后续演进建议

随着项目发展，可逐步增加：

1. `packages/ui` 用于共享基础组件
2. `services/vision` 用于独立图像分析服务
3. `services/match` 用于独立匹配服务
4. `services/profile` 用于独立画像引擎服务

但在 MVP 阶段，不建议一开始就拆成大量独立服务。

---

## 14. 当前推荐下一步

基于这份结构文档，下一步最合适的动作是：

1. 初始化 monorepo
2. 创建 `apps/web`
3. 创建 `apps/mobile`
4. 创建 `services/api`
5. 创建 `services/worker`
6. 创建 `packages/sdk`
7. 创建 `packages/domain`
8. 创建 `packages/validation`

