# Web 原型界面设计文档

**日期**: 2026-05-12
**范围**: web_test 目录下的静态原型界面

## 1. 技术方案

- **框架**: Next.js 15 + React 19（与现有 apps/web 保持一致）
- **路由**: app router，单页多 sections 或简单路由
- **样式**: CSS Modules + 全局 CSS 变量（符合现有 globals.css）
- **图表**: 纯 CSS/Canvas 实现雷达图，或使用 recharts
- **数据**: 静态 JSON 文件模拟完整画像版本演进

## 2. 视觉风格

### 2.1 色彩系统

```css
--bg-primary: #0d1016      /* 深墨色底 */
--bg-secondary: #111827     /* 次级背景 */
--accent-gold: #b6883d      /* 古金/铜金 */
--accent-red: #c94040       /* 朱砂红 */
--accent-jade: #3d7a6e      /* 青玉绿 */
--text-primary: #f3ead7     /* 骨白文字 */
--text-secondary: #a8998a   /* 次级文字 */
--card-bg: rgba(30, 35, 45, 0.8)
```

### 2.2 字体

- 主字体: Noto Serif SC（现有）
- 辅助: PingFang SC

### 2.3 组件风格

- 命盘感：圆形轨迹、轴线
- 档案感：卡片边框、印章感
- 演进感：变化指示器、版本标签

## 3. 页面结构

### 3.1 路由设计

```
/                       -> 首页 (Home)
/onboarding             -> 建档页
/analysis               -> 初始分析结果
/questionnaire          -> 持续问答
/profile                -> 动态画像页
/match                  -> 历史人物匹配
/advice                 -> 改命建议
/archive                -> 成长档案
```

### 3.2 布局

- 顶部导航栏（Logo + 7 个导航项）
- 左侧进度指示（可选）
- 中央主内容区
- 右侧辅助信息栏（版本号、置信度、今日提醒）

## 4. 页面详情

### 4.1 首页 (`/`)

组件:
- HeroSection: 主标语 + CTA 按钮
- ProfileSummaryCard: 当前画像摘要（V4）
- HistoricalMatchCard: 最像的历史人物（曹操 82%）
- TodayAdviceCard: 今日建议
- RecentEvolution: 最近演进（V3 -> V4）

### 4.2 建档页 (`/onboarding`)

组件:
- ProgressStepper: 建档进度（步骤 1-5）
- BasicInfoForm: 姓名、性别、出生日期、时辰、出生地
- TimeUncertaintyNotice: 时辰不确定说明
- NextImpactPreview: 本轮提交后将更新的内容

### 4.3 初始分析页 (`/analysis`)

组件:
- ProfileV1Header: 版本号 + 置信度
- BaziSummaryCard: 命盘摘要（四柱 + 五行）
- InitialInferCard: 初步推断列表
- UncertaintyCard: 当前不确定项列表
- ContinueCTA: 继续校准按钮

### 4.4 持续问答页 (`/questionnaire`)

组件:
- QuestionProgress: 当前题号 + 总题数
- QuestionCard: 问题文本 + 影响说明
- AnswerOptions: 单选/多选选项
- ReasoningInput: 补充说明输入框
- ImpactPreview: 回答后系统将如何调整

### 4.5 动态画像页 (`/profile`)

组件:
- ProfileHeader: 版本号 + 综合评分 + 关键词
- PersonalityMatrix: 性格维度列表（内向/外向、理性/感性等）
- AbilityRadarChart: 能力雷达图（执行、领导、学习、资源）
- ChangeCard: 本次变化说明
- EvidenceTabs: 证据来源（八字/问答/事件/面相/手相）
- VersionCompare: 版本对比视图

### 4.6 历史人物匹配页 (`/match`)

组件:
- TopMatchCard: 最匹配人物主卡（曹操 + 相似度 82%）
- SimilaritySection: 相似的地方
- DifferenceSection: 不同的地方
- LifeStageSection: 更像他的人生阶段
- CandidateList: Top 3 候选列表

### 4.7 改命建议页 (`/advice`)

组件:
- AdviceHeader: 版本号
- TodayAdviceCard: 今日建议列表
- WeeklyPlanCard: 7日计划
- LuckyDaysCard: 吉日提醒
- ActionCard: 建议行动卡（优先级、理由、执行状态）
- FeedbackButton: 标记已执行 / 填写效果反馈

### 4.8 成长档案页 (`/archive`)

组件:
- TimelinePanel: 版本时间线
- VersionListCard: 画像版本列表
- FigureHistoryCard: 历史人物变化轨迹
- ExportButtons: 导出 PDF / 生成分享海报

## 5. 静态数据结构

### 5.1 模拟数据文件

```typescript
// data/profile.ts
export const profileV1 = { ... }
export const profileV2 = { ... }
export const profileV3 = { ... }
export const profileV4 = { ... }
```

### 5.2 画像数据结构

```typescript
interface ProfileVersion {
  version: number
  summary: {
    keywords: string[]
    overallScore: number
  }
  traits: {
    personality: Record<string, number>
    ability: Record<string, number>
    relationship: Record<string, number>
    fortune: Record<string, number>
  }
  confidenceMap: Record<string, number>
  changes: Array<{
    dimension: string
    direction: 'increase' | 'decrease'
    reason: string
  }>
}
```

### 5.3 人物匹配数据结构

```typescript
interface MatchResult {
  profileVersion: number
  topMatches: Array<{
    rank: number
    figureName: string
    dynasty: string
    roleType: string
    similarityScore: number
    highlights: string[]
    differences: string[]
    lifeStage: string
  }>
}
```

## 6. 实现优先级

1. 全局布局 + 导航 + CSS 变量
2. 首页（Hero + 卡片）
3. 建档页 + 初始分析页
4. 动态画像页（雷达图 + 维度卡）
5. 历史人物匹配页
6. 持续问答页
7. 改命建议页 + 成长档案页

## 7. 验收标准

- [ ] 7 个页面全部可访问
- [ ] 视觉风格统一（深墨色 + 古金）
- [ ] 静态数据展示完整画像演进（V1-V4）
- [ ] 雷达图正常渲染
- [ ] 页面跳转正常