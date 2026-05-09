# 逆天改命算命软件

这是一个面向“持续交互演进画像”的命理产品方案仓库。

项目核心不是一次性算命报告，而是围绕以下闭环展开：

1. 用户提交基础资料、照片、问答和人生事件
2. 系统持续生成和修正用户画像
3. 系统匹配历史人物原型
4. 系统输出可执行建议并接收反馈
5. 所有结果沉淀为可回溯的成长档案

## 文档目录

所有项目文档统一放在 [docs](./docs/) 目录下：

1. [产品需求文档](./docs/product.md)
2. [概要设计文档](./docs/overview-design.md)
3. [详细设计文档](./docs/detailed-design.md)
4. [UI 原型设计与交互流程文档](./docs/ui.md)
5. [模块设计与数据流向文档](./docs/mod.md)
6. [技术架构选型文档](./docs/tech.md)
7. [资源要求文档](./docs/resource.md)
8. [部署文档](./docs/deployment.md)
9. [API 文档](./docs/api.md)
10. [实施路线文档](./docs/roadmap.md)
11. [项目目录结构文档](./docs/project-structure.md)
12. [用户文档](./docs/user-guide.md)
13. [运维文档](./docs/operations.md)

## 推荐阅读顺序

如果你是第一次进入项目，建议按这个顺序阅读：

1. [docs/product.md](./docs/product.md)
2. [docs/ui.md](./docs/ui.md)
3. [docs/overview-design.md](./docs/overview-design.md)
4. [docs/detailed-design.md](./docs/detailed-design.md)
5. [docs/mod.md](./docs/mod.md)
6. [docs/tech.md](./docs/tech.md)
7. [docs/resource.md](./docs/resource.md)
8. [docs/deployment.md](./docs/deployment.md)
9. [docs/api.md](./docs/api.md)
10. [docs/roadmap.md](./docs/roadmap.md)
11. [docs/project-structure.md](./docs/project-structure.md)
12. [docs/user-guide.md](./docs/user-guide.md)
13. [docs/operations.md](./docs/operations.md)

## 当前状态

当前仓库以产品与架构文档为主，尚未开始正式代码实现。

现阶段输出已经覆盖：

1. 产品需求
2. 系统设计
3. UI 原型与交互流程
4. 模块与数据流
5. 技术选型
6. 资源要求
7. 部署文档
8. API 文档
9. 实施路线
10. 项目目录结构
11. 用户文档
12. 运维文档

## 下一步建议

建议后续按以下顺序推进：

1. 确定最终跨平台技术方案
2. 初始化 monorepo 与工程脚手架
3. 定义数据库迁移与核心 API 契约
4. 实现 MVP 闭环
5. 补充部署脚本和自动化测试
