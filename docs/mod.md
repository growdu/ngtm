# 逆天改命算命软件模块设计与数据流向文档

## 1. 文档目标

本文档聚焦系统模块设计与数据流向，回答四个问题：

1. 系统应拆成哪些模块
2. 每个模块的职责边界是什么
3. 模块之间如何调用与协作
4. 数据从采集到画像、匹配、建议是如何流转和沉淀的

本文档面向研发实现，默认以前文的 `product.md`、`overview-design.md`、`detailed-design.md` 和 `ui.md` 为基础，不再重复产品背景。

---

## 2. 设计原则

### 2.1 模块拆分原则

1. 按稳定业务能力拆分，而不是按页面拆分。
2. 规则计算与文案生成分离。
3. 读模型与写模型分离。
4. 长耗时计算异步化。
5. 所有核心产物版本化。

### 2.2 数据流原则

1. 用户输入先沉淀为原始证据，再进入计算链路。
2. 任一模块都不直接覆盖上游原始数据。
3. 用户画像是多源融合后的中心对象。
4. 历史人物匹配与改命建议都围绕“当前画像版本”工作。
5. 所有重要输出都必须能追溯到输入证据。

---

## 3. 系统模块总览

系统建议拆为 5 层 14 个核心模块。

### 3.1 分层结构

1. 客户端表现层
2. 接入与编排层
3. 核心业务服务层
4. 规则与计算引擎层
5. 数据与基础设施层

### 3.2 模块清单

#### 表现层

1. Web 客户端模块
2. Mobile 客户端模块
3. Desktop 客户端模块

#### 接入层

4. API Gateway / BFF 模块

#### 核心业务服务层

5. 用户账户模块
6. 信息采集模块
7. 图像资产模块
8. 八字分析模块
9. 图像分析模块
10. 问答校准模块
11. 画像引擎模块
12. 历史人物匹配模块
13. 改命建议模块
14. 成长档案与报告模块
15. 通知与提醒模块

#### 基础能力模块

16. 任务调度模块
17. 规则库管理模块
18. 审计与观测模块

#### 数据层

19. PostgreSQL 模块
20. Redis / Queue 模块
21. Object Storage 模块

---

## 4. 模块关系图

```text
Client(Web/Mobile/Desktop)
        |
        v
API Gateway / BFF
        |
        +------------------> 用户账户模块
        +------------------> 信息采集模块
        +------------------> 成长档案与报告模块
        +------------------> 通知与提醒模块
        |
        +------------------> 图像资产模块
        |                         |
        |                         v
        |                   图像分析模块
        |
        +------------------> 八字分析模块
        +------------------> 问答校准模块
        |
        +------------------> 画像引擎模块
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
           历史人物匹配模块                    改命建议模块
                  |                                 |
                  +---------------+-----------------+
                                  v
                          成长档案与报告模块

所有长耗时模块统一通过任务调度模块异步触发；
规则型模块统一依赖规则库管理模块；
所有模块统一沉淀到 PostgreSQL / Redis / Object Storage；
所有关键行为统一进入审计与观测模块。
```

---

## 5. 各模块详细设计

## 5.1 Web / Mobile / Desktop 客户端模块

### 职责

1. 呈现建档、问答、画像、人物匹配、建议、成长档案页面。
2. 采集用户输入。
3. 上传图片与文件。
4. 展示版本变化与反馈结果。
5. 接收推送、提醒和异步计算状态。

### 输入

1. 用户操作
2. 设备能力
3. BFF 聚合响应

### 输出

1. 表单提交请求
2. 图片上传请求
3. 反馈请求
4. 查询请求

### 不负责

1. 业务规则判断
2. 核心评分
3. 最终画像计算

---

## 5.2 API Gateway / BFF 模块

### 职责

1. 聚合客户端接口。
2. 完成鉴权、会话、限流、灰度控制。
3. 屏蔽后端模块复杂性。
4. 针对不同端返回适配后的视图模型。

### 主要输入

1. 客户端 REST/GraphQL 请求
2. 用户身份上下文

### 主要输出

1. 转发到各业务模块的标准化请求
2. 聚合后的页面数据

### 内部子职责

1. `Auth Adapter`
2. `Profile View Assembler`
3. `Match View Assembler`
4. `Advice View Assembler`
5. `Archive View Assembler`

### 依赖

1. 用户账户模块
2. 信息采集模块
3. 画像引擎模块
4. 历史人物匹配模块
5. 改命建议模块
6. 成长档案与报告模块

---

## 5.3 用户账户模块

### 职责

1. 用户建档。
2. 用户基础资料维护。
3. 当前画像版本指针维护。
4. 用户偏好、通知设置管理。

### 输入

1. 基础资料表单
2. 账户设置更新
3. 画像版本更新回调

### 输出

1. `users` 表记录
2. `current_profile_version` 更新
3. 用户基础上下文

### 核心数据

1. `users`
2. `user_preferences`

### 对外接口

1. 创建/更新用户
2. 获取用户基础信息
3. 更新当前版本指针

---

## 5.4 信息采集模块

### 职责

1. 接收基础资料、问答答案、人生事件、自我反馈。
2. 将所有输入先落为“原始证据”。
3. 判断是否需要触发八字分析、图像分析、画像重算。
4. 维护待追问问题池。

### 输入类型

1. 基础信息
2. 问卷答案
3. 自由文本补充
4. 人生事件
5. 建议执行反馈

### 输出

1. `intake_records`
2. `life_events`
3. 任务触发事件

### 核心子模块

1. `Basic Intake Handler`
2. `Questionnaire Intake Handler`
3. `Event Intake Handler`
4. `Feedback Intake Handler`
5. `Intake Trigger Evaluator`

### 关键规则

1. 所有输入先落盘，再进入分析。
2. 不允许客户端直接改画像结果。
3. 关键事件优先触发画像重算。

---

## 5.5 图像资产模块

### 职责

1. 处理面部和手掌图片上传。
2. 保存对象存储地址和元数据。
3. 做去重、校验和质量检测入口。
4. 分发图像分析任务。

### 输入

1. 用户上传的图片
2. 图片元数据

### 输出

1. `image_assets`
2. 对象存储路径
3. `analyze_face` / `analyze_palm` 任务

### 子模块

1. `Upload Handler`
2. `Metadata Extractor`
3. `Asset Registry`
4. `Image Analysis Dispatcher`

---

## 5.6 八字分析模块

### 职责

1. 基于出生信息生成四柱命盘。
2. 计算五行、十神、大运流年等特征。
3. 输出结构化命理特征和第一层解释特征。

### 输入

1. 基础出生信息
2. 可能的出生时辰候选

### 输出

1. `bazi_analyses`
2. 标准化 trait evidence
3. 不确定性标记

### 子模块

1. `Chart Calculator`
2. `Five Elements Scorer`
3. `Ten Gods Resolver`
4. `Luck Cycle Analyzer`
5. `Interpretation Extractor`

### 依赖

1. 规则库管理模块

### 特点

1. 命盘原始结果固定。
2. 对命盘的现实映射解释可以被后续证据校准。

---

## 5.7 图像分析模块

### 职责

1. 面部关键点识别。
2. 手掌主线、辅线和手型识别。
3. 提取可映射到画像引擎的图像特征。
4. 计算图像质量和结果置信度。

### 输入

1. `image_assets`
2. 图片文件流

### 输出

1. `face_analyses`
2. `palm_analyses`
3. 标准化 trait evidence
4. 图片质量反馈

### 子模块

1. `Face Landmark Analyzer`
2. `Palm Line Analyzer`
3. `Image Quality Evaluator`
4. `Vision Trait Mapper`

### 依赖

1. Object Storage
2. 规则库管理模块

### 降级策略

1. 图片质量低则只输出“待补充”，不进入高置信度画像计算。

---

## 5.8 问答校准模块

### 职责

1. 根据画像缺口和冲突项挑选下一组问题。
2. 将答案转换成标准化人格与行为证据。
3. 维护问题优先级和追问逻辑。

### 输入

1. 当前画像版本
2. 当前置信度图
3. 冲突维度
4. 用户最近输入

### 输出

1. 下一题列表
2. `intake_records`
3. trait evidence

### 子模块

1. `Question Selector`
2. `Question Priority Evaluator`
3. `Answer Normalizer`
4. `Followup Planner`

### 关键依赖

1. 画像引擎模块
2. 规则库管理模块

---

## 5.9 画像引擎模块

### 职责

1. 汇总八字、图像、问答、人生事件等多源证据。
2. 计算当前画像各维度得分。
3. 计算各维度置信度。
4. 生成新的画像版本。
5. 生成和上一版的变化说明。

### 输入

1. `bazi_analyses`
2. `face_analyses`
3. `palm_analyses`
4. `intake_records`
5. `life_events`
6. 规则库配置

### 输出

1. `profile_versions`
2. `profile_change_logs`
3. 画像摘要视图
4. 需要追问的维度集合
5. 下游匹配与建议触发事件

### 子模块

1. `Trait Evidence Loader`
2. `Trait Standardizer`
3. `Trait Fusion Calculator`
4. `Confidence Resolver`
5. `Conflict Detector`
6. `Profile Version Builder`
7. `Change Summary Builder`

### 这是系统核心中台模块

所有人物匹配、建议生成、成长档案展示都以它生成的画像版本为准。

---

## 5.10 历史人物匹配模块

### 职责

1. 读取当前画像版本。
2. 从人物画像库中挑选候选集。
3. 计算 Top N 人物匹配结果。
4. 生成相似点、差异点和人生阶段映射说明。

### 输入

1. `profile_versions`
2. `historical_figures`
3. `figure_traits`

### 输出

1. `match_results`
2. Top 1 人物
3. Top N 候选列表
4. 匹配拆解视图

### 子模块

1. `Figure Candidate Filter`
2. `Similarity Calculator`
3. `Difference Analyzer`
4. `Stage Mapper`
5. `Match Explanation Builder`

### 依赖

1. 规则库管理模块
2. 人物画像库数据

---

## 5.11 改命建议模块

### 职责

1. 读取当前画像版本和匹配结果。
2. 找出弱项、机会点、风险点。
3. 生成风水、行为、节律、吉日等建议。
4. 拆成可执行行动项。
5. 接收执行反馈并反哺上游。

### 输入

1. 当前画像版本
2. 当前人物匹配结果
3. 用户关注主题
4. 执行反馈历史

### 输出

1. `advice_plans`
2. `advice_actions`
3. 追踪提醒任务
4. 反馈证据

### 子模块

1. `Advice Strategy Resolver`
2. `Action Planner`
3. `Schedule Generator`
4. `Advice Explanation Builder`
5. `Advice Feedback Evaluator`

### 特点

1. 它不是一次性吐文案，而是一个持续闭环模块。

---

## 5.12 成长档案与报告模块

### 职责

1. 汇总版本变化、关键事件、建议执行、人物变化轨迹。
2. 生成成长档案时间线。
3. 支持 PDF 导出、分享卡片、历史回溯。

### 输入

1. `profile_versions`
2. `profile_change_logs`
3. `match_results`
4. `advice_plans`
5. `life_events`

### 输出

1. 档案时间线视图
2. 版本对比视图
3. PDF/分享导出文件

### 子模块

1. `Timeline Builder`
2. `Version Compare Builder`
3. `Share Card Builder`
4. `PDF Generator`

---

## 5.13 通知与提醒模块

### 职责

1. 发送画像更新通知。
2. 发送问答补充提醒。
3. 发送吉日、建议执行、反馈回填提醒。

### 输入

1. 画像更新事件
2. 建议计划
3. 用户通知偏好

### 输出

1. App Push
2. 桌面通知
3. 浏览器通知
4. 站内消息

---

## 5.14 任务调度模块

### 职责

1. 调度所有异步任务。
2. 管理任务队列、重试、幂等和死信。
3. 串联多模块长链路。

### 管理任务类型

1. `analyze_bazi`
2. `analyze_face`
3. `analyze_palm`
4. `recompute_profile`
5. `recompute_match`
6. `generate_advice`
7. `generate_report`
8. `send_notification`

### 关键能力

1. 幂等执行
2. 重试策略
3. 链路编排
4. 任务状态可观测

---

## 5.15 规则库管理模块

### 职责

1. 存储命理规则、图像特征映射规则、画像维度权重、人物匹配规则、建议生成规则。
2. 给核心计算模块提供可配置规则。
3. 控制规则版本。

### 服务对象

1. 八字分析模块
2. 图像分析模块
3. 问答校准模块
4. 画像引擎模块
5. 历史人物匹配模块
6. 改命建议模块

### 特点

1. 规则变更必须可审计。
2. 规则版本必须随核心结果一起记录。

---

## 5.16 审计与观测模块

### 职责

1. 记录关键模块调用日志。
2. 记录画像版本变化来源。
3. 记录匹配结果版本。
4. 记录建议来源。
5. 输出性能、错误和业务指标。

### 输入

1. 模块调用日志
2. 任务状态
3. 关键业务事件

### 输出

1. 审计记录
2. 监控指标
3. 异常告警

---

## 6. 核心数据实体与模块归属

| 数据实体 | 归属模块 | 主要用途 |
| ---- | ---- | ---- |
| `users` | 用户账户模块 | 用户基础资料、当前画像版本指针 |
| `intake_records` | 信息采集模块 | 所有原始输入证据 |
| `image_assets` | 图像资产模块 | 图片文件索引与元数据 |
| `bazi_analyses` | 八字分析模块 | 命盘与结构化命理特征 |
| `face_analyses` | 图像分析模块 | 面部特征与解释特征 |
| `palm_analyses` | 图像分析模块 | 掌纹特征与解释特征 |
| `life_events` | 信息采集模块 | 人生关键事件证据 |
| `profile_versions` | 画像引擎模块 | 画像稳定快照 |
| `profile_change_logs` | 画像引擎模块 | 画像版本变化记录 |
| `historical_figures` | 历史人物匹配模块 | 历史人物基础资料 |
| `figure_traits` | 历史人物匹配模块 | 历史人物结构化画像 |
| `match_results` | 历史人物匹配模块 | 当前画像的匹配输出 |
| `advice_plans` | 改命建议模块 | 当前版本建议集合 |
| `advice_actions` | 改命建议模块 | 可执行建议动作 |
| `advice_feedback` | 改命建议模块 | 建议执行反馈 |

---

## 7. 数据流总览

### 7.1 一级总流程

```text
用户输入
-> 原始证据沉淀
-> 单模块分析
-> 画像融合
-> 人物匹配
-> 建议生成
-> 通知与展示
-> 用户反馈
-> 回流为新证据
```

### 7.2 总数据流图

```text
客户端输入
  |
  v
信息采集模块 -----------------------> PostgreSQL:intake_records / life_events
  |                                              |
  |                                              v
  |----> 八字分析模块 ----------------------> bazi_analyses
  |
  |----> 图像资产模块 -> Object Storage
  |                    -> 图像分析模块 -----> face_analyses / palm_analyses
  |
  |----> 问答校准模块 ----------------------> intake trait evidence
                                                 |
                                                 v
                                         画像引擎模块
                                                 |
                           +---------------------+---------------------+
                           |                                           |
                           v                                           v
                  profile_versions / change_logs               待追问维度集合
                           |                                           |
                           v                                           v
                 历史人物匹配模块                                 问答校准模块
                           |
                           v
                      match_results
                           |
                           v
                      改命建议模块
                           |
                           v
                 advice_plans / advice_actions
                           |
                           v
                    通知与提醒模块
                           |
                           v
                         客户端
                           |
                           v
                   用户执行与反馈提交
                           |
                           +------------> 信息采集模块
```

---

## 8. 关键业务场景数据流

## 8.1 场景一：首次建档数据流

### 目标

用户从零开始，生成第一版画像。

### 流程

```text
1. 用户提交基础信息
2. BFF 调用用户账户模块更新 users
3. BFF 调用信息采集模块写入 intake_records
4. 信息采集模块触发 analyze_bazi 任务
5. 八字分析模块生成 bazi_analyses
6. 信息采集模块检查是否已有足够资料生成画像
7. 若满足条件，触发 recompute_profile
8. 画像引擎模块生成 profile_versions.V1
9. 触发 recompute_match
10. 历史人物匹配模块生成 match_results
11. 触发 generate_advice
12. 改命建议模块生成 advice_plans
13. BFF 返回“初始分析已生成”
```

### 数据沉淀

1. `users`
2. `intake_records`
3. `bazi_analyses`
4. `profile_versions`
5. `match_results`
6. `advice_plans`

---

## 8.2 场景二：上传照片后的数据流

### 目标

将面相和手相特征纳入画像修正。

### 流程

```text
1. 用户上传照片
2. 客户端先获取上传凭证
3. 图片写入 Object Storage
4. 图像资产模块写入 image_assets
5. 图像资产模块触发 analyze_face / analyze_palm
6. 图像分析模块输出 face_analyses / palm_analyses
7. 图像分析模块产出标准化 trait evidence
8. 任务调度模块触发 recompute_profile
9. 画像引擎生成新 profile_version
10. 若画像关键维度变化明显，则重跑人物匹配和建议生成
11. 通知模块提示用户“画像已更新”
```

### 关键判断点

1. 图片质量低时，不触发高优先级画像更新。
2. 图片分析完成后，必须记录图像置信度。

---

## 8.3 场景三：持续问答校准数据流

### 目标

通过多轮问答降低画像不确定性。

### 流程

```text
1. 用户打开持续问答页
2. BFF 请求问答校准模块获取下一题
3. 问答校准模块读取当前 profile_version 与低置信度维度
4. Question Selector 生成问题
5. 用户提交答案
6. 信息采集模块写入 intake_records
7. Answer Normalizer 将答案转成 trait evidence
8. 触发 recompute_profile
9. 画像引擎生成 profile_version.Vn
10. 画像变化日志写入 profile_change_logs
11. 若人物候选变化，触发 recompute_match
12. 前端展示“你的画像有变化”
```

### 数据变化重点

1. `intake_records` 增加
2. `profile_versions` 增加
3. `profile_change_logs` 增加
4. `match_results` 可能更新

---

## 8.4 场景四：记录重大人生事件数据流

### 目标

让真实经历成为画像修正的强证据。

### 流程

```text
1. 用户记录事件，例如离职创业
2. 信息采集模块写入 life_events
3. Event Intake Handler 识别这是高影响事件
4. 触发 recompute_profile
5. 画像引擎提升相关维度权重
6. 生成新的画像版本和变化说明
7. 重跑人物匹配
8. 重算建议计划
9. 成长档案时间线增加该事件节点
```

### 关键特性

1. 事件证据通常比单道问答更强。
2. 重大事件变化要进入成长档案主时间线。

---

## 8.5 场景五：建议执行反馈数据流

### 目标

把建议结果反向变成画像证据。

### 流程

```text
1. 用户在建议页点击“已执行”
2. 改命建议模块写入 advice_feedback
3. 信息采集模块同步写入 intake_records 或反馈证据
4. Advice Feedback Evaluator 判断反馈有效性
5. 若反馈影响人格或状态维度，触发 recompute_profile
6. 画像引擎更新 profile_version
7. 成长档案记录“建议执行影响”
```

### 设计意义

这是系统从“推荐器”升级到“闭环成长系统”的关键数据流。

---

## 9. 模块间接口与事件流向

## 9.1 同步接口流

适合页面请求和即时读操作。

### 典型同步流

1. 客户端 -> BFF -> 获取当前画像
2. 客户端 -> BFF -> 获取当前人物匹配
3. 客户端 -> BFF -> 获取当前建议
4. 客户端 -> BFF -> 获取成长档案时间线

### 同步接口特点

1. 返回已沉淀数据
2. 不做长耗时计算
3. 计算型任务只返回状态，不阻塞等待

---

## 9.2 异步事件流

适合分析、重算、生成、通知。

### 典型事件链

1. `basic_info_submitted` -> `analyze_bazi`
2. `image_uploaded` -> `analyze_face` / `analyze_palm`
3. `analysis_completed` -> `recompute_profile`
4. `profile_version_created` -> `recompute_match`
5. `match_completed` -> `generate_advice`
6. `advice_created` -> `send_notification`

### 事件命名建议

1. `intake.basic.saved`
2. `intake.questionnaire.saved`
3. `life_event.created`
4. `analysis.bazi.completed`
5. `analysis.vision.completed`
6. `profile.version.created`
7. `match.completed`
8. `advice.plan.created`
9. `notification.dispatch.requested`

---

## 10. 数据读写边界

### 10.1 写边界

1. `users` 只能由用户账户模块更新。
2. `intake_records` 和 `life_events` 只能由信息采集模块写入。
3. `bazi_analyses` 只能由八字分析模块写入。
4. `face_analyses` / `palm_analyses` 只能由图像分析模块写入。
5. `profile_versions` / `profile_change_logs` 只能由画像引擎模块写入。
6. `match_results` 只能由历史人物匹配模块写入。
7. `advice_plans` / `advice_actions` / `advice_feedback` 只能由改命建议模块写入。

### 10.2 读边界

1. BFF 可以聚合读取，但不直写核心业务表。
2. 报告模块以只读方式消费画像、匹配、建议结果。
3. 通知模块只读消费，不负责业务计算。

---

## 11. 状态与版本流向

## 11.1 画像版本流向

```text
V0: 无画像
-> V1: 基础资料 + 八字
-> V2: 加入问答
-> V3: 加入图像
-> V4: 加入重大事件
-> Vn: 加入建议反馈 / 后续更新
```

### 版本推进规则

1. 新版本必须是不可变快照。
2. 当前版本指针由用户账户模块维护。
3. 历史人物和建议都要绑定生成时的画像版本号。

## 11.2 人物匹配版本流向

```text
profile_version_created
-> 读取对应版本画像
-> 生成该版本 Top N 匹配
-> 固化到 match_results(profile_version = n)
```

## 11.3 建议版本流向

```text
profile_version_created 或 match_completed
-> 读取最新画像与匹配
-> 生成 advice_plan(profile_version = n)
-> 后续执行反馈回流
```

---

## 12. 异常数据流与降级设计

## 12.1 图片质量差

```text
图片上传
-> 图像质量评估失败
-> image_assets 标记低质量
-> 图像分析结果仅写提示，不生成高权重 evidence
-> BFF 返回“建议重拍”
```

## 12.2 出生时辰不确定

```text
基础资料提交
-> 八字分析模块生成多候选命盘
-> 画像引擎降低相关维度置信度
-> 问答校准模块优先出相关问题
```

## 12.3 多源结论冲突

```text
画像引擎融合证据
-> Conflict Detector 发现差异过大
-> 降低该维度置信度
-> 写入 profile_change_logs 的 conflict 标记
-> 推送到问答校准模块形成追问
```

## 12.4 人物库覆盖不足

```text
匹配模块计算后有效候选过少
-> 返回 Top N 近似候选
-> explanation 标注“人物库覆盖有限”
-> 审计模块打点待扩容类目
```

---

## 13. 模块实现优先级

## 13.1 第一阶段必须实现

1. API Gateway / BFF 模块
2. 用户账户模块
3. 信息采集模块
4. 八字分析模块
5. 问答校准模块
6. 画像引擎模块
7. 历史人物匹配模块
8. 改命建议模块
9. 任务调度模块

### 目标

先跑通“基础资料 -> 初始画像 -> 持续问答 -> 新画像 -> 人物匹配 -> 建议”的闭环。

## 13.2 第二阶段增强

1. 图像资产模块
2. 图像分析模块
3. 通知与提醒模块
4. 成长档案与报告模块

## 13.3 第三阶段增强

1. 规则库管理后台能力
2. 更精细的人物阶段匹配
3. 更多建议执行追踪能力

---

## 14. 推荐开发顺序

1. 建表和原始证据链路
2. 八字分析结果落盘
3. 画像引擎最小版本
4. 问答校准与版本迭代
5. 历史人物匹配
6. 建议生成
7. 成长档案聚合视图
8. 图像分析接入
9. 通知与回流闭环

---

## 15. 研发落地注意事项

1. 不要让任何页面直接驱动画像字段写入，必须经由证据 -> 引擎 -> 版本。
2. 不要把“问答答案”和“最终性格结论”存在同一层。
3. 匹配结果和建议结果都必须绑定画像版本号。
4. 模块间传递的不是自然语言结论，而应是结构化特征和版本上下文。
5. 第一阶段先保证数据链路可解释，再追求模型复杂度。

