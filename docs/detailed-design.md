# 逆天改命算命软件详细设计文档

## 1. 文档目的

本文档在概要设计基础上，细化系统领域模型、数据库结构、服务职责、接口定义、核心算法、异步任务流、状态管理和异常处理，作为研发实现依据。

---

## 2. 设计基线

### 2.1 核心业务假设

1. 用户画像是系统最重要的核心对象。
2. 每次新的信息输入都会产生新的“证据”。
3. 画像由多源证据融合而成，不依赖单一模块。
4. 历史人物匹配基于当前画像版本进行，不直接依赖原始输入。
5. 建议系统以当前画像弱项、当前运势阶段和目标人物差距为输入。

### 2.2 核心对象关系

```text
User
 |- IntakeRecord
 |- LifeEvent
 |- ImageAsset
 |- AnalysisResult(Bazi/Face/Palm)
 |- UserProfileVersion
      |- ProfileTrait
      |- ProfileChangeLog
      |- MatchResult
      |- AdvicePlan
```

---

## 3. 领域模型设计

### 3.1 User

含义：用户主实体。

关键字段：

1. `id`
2. `name`
3. `gender`
4. `birth_datetime`
5. `birth_place`
6. `current_profile_version`
7. `status`

### 3.2 IntakeRecord

含义：用户每次输入的结构化记录。

类型：

1. 基础信息
2. 问卷回答
3. 自由文本输入
4. 图片上传
5. 反馈校准

关键字段：

1. `intake_type`
2. `payload`
3. `source_channel`
4. `confidence`
5. `submitted_at`

### 3.3 AnalysisResult

含义：单一分析模块输出。

子类：

1. `BaziAnalysis`
2. `FaceAnalysis`
3. `PalmAnalysis`

通用字段：

1. `raw_features`
2. `derived_traits`
3. `score`
4. `confidence`
5. `engine_version`

### 3.4 LifeEvent

含义：用户主动输入或系统采集的人生事件。

示例：

1. 升职
2. 创业
3. 分手
4. 结婚
5. 搬家
6. 生病
7. 财务波动

用途：

1. 校正画像
2. 校正运势解释
3. 验证建议有效性

### 3.5 UserProfileVersion

含义：用户画像某一版稳定快照。

核心内容：

1. 性格维度
2. 能力维度
3. 关系模式维度
4. 财富与事业驱动维度
5. 风险与运势阶段维度
6. 置信度图谱
7. 相对上一版的变化

### 3.6 HistoricalFigure

含义：结构化历史人物原型。

维度：

1. 人格结构
2. 权力倾向
3. 创造/秩序偏好
4. 决策风格
5. 情感模式
6. 命运起伏模式
7. 成功路径
8. 失败模式

### 3.7 MatchResult

含义：用户画像与历史人物画像的匹配结果。

包含：

1. 总相似度
2. 各维度相似度
3. 差异维度
4. 候选排序
5. 解释文本

### 3.8 AdvicePlan

含义：针对某个画像版本的行动建议集合。

类型：

1. 风水布局建议
2. 行为调整建议
3. 节律安排建议
4. 风险规避建议
5. 进化方向建议

---

## 4. 数据库设计

### 4.1 表清单

1. `users`
2. `intake_records`
3. `image_assets`
4. `bazi_analyses`
5. `face_analyses`
6. `palm_analyses`
7. `life_events`
8. `profile_versions`
9. `profile_change_logs`
10. `historical_figures`
11. `figure_traits`
12. `match_results`
13. `advice_plans`
14. `advice_actions`
15. `advice_feedback`
16. `jobs`
17. `audit_logs`

### 4.2 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  gender CHAR(1),
  birth_datetime TIMESTAMPTZ,
  birth_place TEXT,
  current_profile_version INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.3 intake_records

```sql
CREATE TABLE intake_records (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  intake_type TEXT NOT NULL,
  source_channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  confidence NUMERIC(5,4),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_intake_records_user_id ON intake_records(user_id);
CREATE INDEX idx_intake_records_type ON intake_records(intake_type);
CREATE INDEX idx_intake_records_payload_gin ON intake_records USING GIN(payload);
```

### 4.4 image_assets

```sql
CREATE TABLE image_assets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  image_type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  checksum TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  quality_score NUMERIC(5,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.5 bazi_analyses

```sql
CREATE TABLE bazi_analyses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  birth_input JSONB NOT NULL,
  chart_data JSONB NOT NULL,
  feature_data JSONB NOT NULL,
  interpretation_data JSONB NOT NULL,
  score INT,
  confidence NUMERIC(5,4),
  engine_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.6 face_analyses / palm_analyses

```sql
CREATE TABLE face_analyses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  image_asset_id UUID NOT NULL REFERENCES image_assets(id),
  landmark_data JSONB NOT NULL,
  feature_data JSONB NOT NULL,
  interpretation_data JSONB NOT NULL,
  score INT,
  confidence NUMERIC(5,4),
  engine_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE palm_analyses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  image_asset_id UUID NOT NULL REFERENCES image_assets(id),
  line_data JSONB NOT NULL,
  feature_data JSONB NOT NULL,
  interpretation_data JSONB NOT NULL,
  score INT,
  confidence NUMERIC(5,4),
  engine_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.7 life_events

```sql
CREATE TABLE life_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  event_type TEXT NOT NULL,
  event_time TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  impact_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.8 profile_versions

```sql
CREATE TABLE profile_versions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  version_no INT NOT NULL,
  summary JSONB NOT NULL,
  personality_traits JSONB NOT NULL,
  ability_traits JSONB NOT NULL,
  relationship_traits JSONB NOT NULL,
  fortune_traits JSONB NOT NULL,
  confidence_map JSONB NOT NULL,
  source_snapshot JSONB NOT NULL,
  engine_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, version_no)
);
```

### 4.9 profile_change_logs

```sql
CREATE TABLE profile_change_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  from_version INT NOT NULL,
  to_version INT NOT NULL,
  changed_dimensions JSONB NOT NULL,
  reason_summary JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.10 historical_figures / figure_traits

```sql
CREATE TABLE historical_figures (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  dynasty TEXT,
  role_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  bio JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE figure_traits (
  figure_id UUID PRIMARY KEY REFERENCES historical_figures(id),
  personality_traits JSONB NOT NULL,
  ability_traits JSONB NOT NULL,
  relationship_traits JSONB NOT NULL,
  fortune_traits JSONB NOT NULL,
  vector_data JSONB NOT NULL,
  source_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.11 match_results

```sql
CREATE TABLE match_results (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  profile_version INT NOT NULL,
  figure_id UUID NOT NULL REFERENCES historical_figures(id),
  rank_no INT NOT NULL,
  similarity_score NUMERIC(5,4) NOT NULL,
  similarity_breakdown JSONB NOT NULL,
  difference_breakdown JSONB NOT NULL,
  explanation JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_match_results_user_version ON match_results(user_id, profile_version);
```

### 4.12 advice_plans / advice_actions / advice_feedback

```sql
CREATE TABLE advice_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  profile_version INT NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE advice_actions (
  id UUID PRIMARY KEY,
  advice_plan_id UUID NOT NULL REFERENCES advice_plans(id),
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail JSONB NOT NULL,
  priority INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE advice_feedback (
  id UUID PRIMARY KEY,
  advice_action_id UUID NOT NULL REFERENCES advice_actions(id),
  feedback_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. 服务设计

### 5.1 API Gateway / BFF

职责：

1. 统一鉴权
2. 参数校验
3. 聚合前端所需多个服务结果
4. 做移动端、桌面端、Web 端适配

### 5.2 User Service

职责：

1. 用户建档
2. 用户基础信息更新
3. 当前画像版本游标管理

### 5.3 Intake Service

职责：

1. 接收用户输入
2. 落盘为 intake_records
3. 触发后续分析或重算任务
4. 管理追问问题队列

### 5.4 Bazi Service

职责：

1. 计算命盘
2. 输出结构化命理特征
3. 输出解释层特征

### 5.5 Vision Service

职责：

1. 管理图片分析
2. 面相/手相识别
3. 图像质量评估
4. 归一化成可供画像引擎消费的特征

### 5.6 Profile Service

职责：

1. 融合多源证据
2. 生成画像版本
3. 输出变化说明
4. 管理画像维度和置信度

### 5.7 Match Service

职责：

1. 根据画像取候选人物
2. 计算相似度
3. 输出排名和解释

### 5.8 Advice Service

职责：

1. 结合画像和匹配结果生成建议
2. 拆解行动项
3. 接收执行反馈
4. 输出建议有效性评估

### 5.9 Report Service

职责：

1. 生成报告视图模型
2. 输出 HTML/PDF
3. 供分享与导出

---

## 6. 核心接口设计

### 6.1 创建或更新基础信息

`POST /api/v1/intake/basic`

请求：

```json
{
  "name": "张三",
  "gender": "M",
  "birthDatetime": "1993-08-10T09:30:00+08:00",
  "birthPlace": "浙江杭州"
}
```

响应：

```json
{
  "userId": "uuid",
  "accepted": true,
  "nextAction": "trigger_bazi_analysis"
}
```

### 6.2 上传图片

`POST /api/v1/intake/images`

请求：

```json
{
  "userId": "uuid",
  "imageType": "face",
  "storageKey": "uploads/face/abc.jpg",
  "metadata": {
    "angle": "front",
    "light": "normal"
  }
}
```

### 6.3 提交问卷答案

`POST /api/v1/intake/questionnaire/answer`

请求：

```json
{
  "userId": "uuid",
  "questionId": "career-risk-preference",
  "answer": {
    "value": "high",
    "reason": "愿意为更大收益承担短期不确定性"
  }
}
```

### 6.4 提交人生事件

`POST /api/v1/events`

请求：

```json
{
  "userId": "uuid",
  "eventType": "career_change",
  "eventTime": "2025-04-01T00:00:00+08:00",
  "title": "离职创业",
  "description": "离开大厂开始创业"
}
```

### 6.5 获取当前画像

`GET /api/v1/profile/current?userId=uuid`

响应：

```json
{
  "userId": "uuid",
  "version": 4,
  "summary": {
    "keywords": ["强控制欲", "高风险偏好", "长线主义"]
  },
  "traits": {
    "personality": {
      "introversion": 0.42,
      "rationality": 0.84,
      "riskPreference": 0.79
    }
  },
  "confidenceMap": {
    "riskPreference": 0.88,
    "emotionStability": 0.56
  },
  "changes": [
    {
      "dimension": "riskPreference",
      "direction": "increase",
      "reason": "新增创业事件与问卷答案支持高风险偏好"
    }
  ]
}
```

### 6.6 手动触发画像重算

`POST /api/v1/profile/recompute`

请求：

```json
{
  "userId": "uuid",
  "reason": "new_intake_records"
}
```

### 6.7 获取匹配结果

`GET /api/v1/match/current?userId=uuid`

响应：

```json
{
  "userId": "uuid",
  "profileVersion": 4,
  "topMatches": [
    {
      "rank": 1,
      "figureName": "曹操",
      "similarityScore": 0.82,
      "highlights": [
        "高控制欲",
        "现实主义决策",
        "高权力驱动"
      ],
      "differences": [
        "你的情感稳定性高于该人物"
      ]
    }
  ]
}
```

### 6.8 获取建议

`GET /api/v1/advice/current?userId=uuid`

### 6.9 回填建议执行结果

`POST /api/v1/advice/execution`

请求：

```json
{
  "userId": "uuid",
  "actionId": "uuid",
  "feedbackType": "weekly_checkin",
  "payload": {
    "done": true,
    "effectScore": 7,
    "notes": "执行后睡眠和专注度改善"
  }
}
```

---

## 7. 画像引擎详细设计

### 7.1 输入源

画像引擎消费五类输入：

1. 八字特征
2. 面相特征
3. 手相特征
4. 问答特征
5. 人生事件特征

### 7.2 标准化特征模型

所有输入应映射到统一 trait schema：

```json
{
  "traitKey": "riskPreference",
  "score": 0.78,
  "confidence": 0.81,
  "source": "questionnaire",
  "sourceRef": "intake_record_uuid",
  "direction": "increase"
}
```

### 7.3 画像维度建议

1. `introversion`
2. `rationality`
3. `impulsiveness`
4. `risk_preference`
5. `power_drive`
6. `wealth_drive`
7. `relationship_dependency`
8. `emotion_stability`
9. `orderliness`
10. `creativity`
11. `execution_strength`
12. `long_term_orientation`

### 7.4 融合算法

每个画像维度使用多源加权融合：

```text
final_trait_score
= Σ(source_score * source_weight * source_confidence)
  / Σ(source_weight * source_confidence)
```

建议初始权重：

1. 八字特征：0.35
2. 面相特征：0.10
3. 手相特征：0.10
4. 问答特征：0.20
5. 人生事件特征：0.25

说明：

1. 问答和人生事件用于现实校准。
2. 若某类输入缺失，不参与分母。
3. 若多源冲突严重，则降低最终置信度。

### 7.5 冲突处理

当多个来源对同一维度给出相反结论时：

1. 保留冲突证据
2. 计算冲突度
3. 输出较低置信度
4. 将该维度标记为“需要追问”

冲突度示意：

```text
conflict = max(score) - min(score)
```

若 `conflict > 0.45`，则加入追问队列。

### 7.6 画像版本生成规则

触发条件：

1. 新增基础信息
2. 新增关键问答
3. 新增重大人生事件
4. 新增图像分析完成
5. 建议执行反馈达到阈值

生成流程：

```text
收集新增证据
-> 标准化特征
-> 重新计算各维度
-> 计算与上一版差异
-> 生成 version_no + 1
-> 更新 users.current_profile_version
```

### 7.7 画像变化说明生成

变化说明至少包含：

1. 哪些维度上升
2. 哪些维度下降
3. 哪些维度仍不确定
4. 本次变化主要由哪些新证据驱动

---

## 8. 问答引擎详细设计

### 8.1 问题模型

字段：

1. `question_id`
2. `question_text`
3. `trait_targets`
4. `priority`
5. `option_schema`
6. `followup_rules`

### 8.2 问题挑选策略

系统每轮优先挑选：

1. 对高价值画像维度影响最大的问题
2. 当前置信度最低的问题
3. 当前冲突度最高的问题

优先级公式示意：

```text
question_priority
= trait_business_weight * trait_uncertainty * expected_information_gain
```

### 8.3 问答结果映射

每个答案应映射成标准化 trait evidence，并记录：

1. 显式答案
2. 解释文本
3. 时间上下文
4. 自信程度

---

## 9. 历史人物匹配详细设计

### 9.1 人物库建模

每个历史人物需结构化成与用户画像一致的维度。

示例：

```json
{
  "name": "曹操",
  "roleType": "warlord",
  "traits": {
    "power_drive": 0.95,
    "risk_preference": 0.82,
    "rationality": 0.89,
    "relationship_dependency": 0.33,
    "execution_strength": 0.93
  }
}
```

### 9.2 匹配流程

```text
读取当前画像版本
-> 选择有效维度
-> 过滤人物候选集
-> 计算人物维度距离
-> 计算总相似度
-> 输出 Top N
-> 生成可解释文本
```

### 9.3 相似度算法

建议使用加权距离反向映射为相似度：

```text
distance = Σ(abs(user_trait - figure_trait) * trait_weight)
similarity = 1 - distance / Σ(trait_weight)
```

维度权重建议：

1. 性格核心维度：0.40
2. 能力结构维度：0.25
3. 关系模式维度：0.15
4. 运势与命运节奏维度：0.20

### 9.4 候选过滤

先做粗过滤，减少无意义比较：

1. 角色类型过滤
2. 极端人格维度过滤
3. 人生路径标签过滤

### 9.5 解释生成

解释分三部分：

1. 最像的地方
2. 最不像的地方
3. 更像该人物的哪个人生阶段

解释文本来源：

1. 结构化匹配结果模板
2. LLM 负责润色，但不得改写数值结论

---

## 10. 建议引擎详细设计

### 10.1 输入

1. 当前画像版本
2. 当前运势阶段
3. 历史人物匹配结果
4. 用户目标或关注主题

### 10.2 输出分类

1. 风水建议
2. 习惯建议
3. 决策建议
4. 人际关系建议
5. 时间节律建议

### 10.3 生成规则

建议 = 弱项补偿 + 优势强化 + 风险规避 + 目标人物差距修正

示例：

```text
若 risk_preference 高 且 emotion_stability 低
-> 输出“高风险前先引入决策冷却机制”
```

### 10.4 追踪机制

每条建议至少包含：

1. 执行动作
2. 预期效果
3. 追踪周期
4. 回填方式

---

## 11. 异步任务设计

### 11.1 任务类型

1. `analyze_bazi`
2. `analyze_face`
3. `analyze_palm`
4. `recompute_profile`
5. `recompute_match`
6. `generate_advice`
7. `generate_report`

### 11.2 任务流

```text
用户输入
-> 写入 intake_records
-> 发布任务
-> Worker 消费
-> 写入分析结果
-> 触发画像重算
-> 触发匹配和建议生成
```

### 11.3 幂等与重试

每个任务都需：

1. 带 `job_key`
2. 幂等执行
3. 支持失败重试
4. 支持死信记录

---

## 12. 状态机设计

### 12.1 用户分析状态

1. `draft`
2. `basic_info_ready`
3. `initial_analysis_ready`
4. `profile_v1_ready`
5. `evolving`
6. `advice_tracking`

### 12.2 图片分析状态

1. `uploaded`
2. `queued`
3. `processing`
4. `completed`
5. `failed`

### 12.3 建议动作状态

1. `pending`
2. `accepted`
3. `in_progress`
4. `completed`
5. `skipped`

---

## 13. 异常与降级设计

### 13.1 图片质量不足

处理：

1. 不直接生成高置信度结论
2. 返回重拍提示
3. 标记该维度待补充

### 13.2 八字时辰缺失

处理：

1. 生成多个候选命盘
2. 用问答和人生事件逐步缩小范围

### 13.3 多源结论冲突

处理：

1. 降低维度置信度
2. 增加追问
3. 不输出强确定性文案

### 13.4 人物库覆盖不足

处理：

1. 返回 Top N 相近人物
2. 提示“当前人物库覆盖有限”
3. 标记待扩展人物类型

---

## 14. 审计与观测

### 14.1 审计要求

必须记录：

1. 画像版本生成日志
2. 匹配计算版本
3. 建议生成来源
4. 用户关键输入变更

### 14.2 监控指标

1. 画像重算成功率
2. 画像重算平均耗时
3. 图片分析成功率
4. 匹配结果生成耗时
5. 建议执行反馈率

---

## 15. 测试设计

### 15.1 单元测试

1. 八字计算逻辑
2. 画像融合算法
3. 相似度算法
4. 问题优先级算法

### 15.2 集成测试

1. 输入到画像更新完整链路
2. 图片上传到分析完成链路
3. 画像更新到匹配更新链路
4. 建议执行反馈闭环链路

### 15.3 验收测试

1. 用户能生成第一版画像
2. 新增事件后画像发生可解释变化
3. 能产出 Top 3 历史人物匹配
4. 建议页能关联画像弱项输出建议

---

## 16. MVP 实现顺序

### 阶段 1

1. 用户建档
2. 八字分析
3. 基础问答
4. 画像 V1

### 阶段 2

1. 画像版本更新
2. 人生事件录入
3. 历史人物匹配

### 阶段 3

1. 建议生成
2. 建议追踪
3. 报告导出

### 阶段 4

1. 面相分析
2. 手相分析
3. 多端增强能力

---

## 17. 开发注意事项

1. 先实现结构化结果，再做文案润色。
2. 先实现画像版本化，再做复杂 UI。
3. 先保证“解释得通”，再追求“像不像”。
4. 历史人物库必须人工校审，不应完全自动生成。
5. 健康、寿命、重大风险类输出必须做保守表达。

