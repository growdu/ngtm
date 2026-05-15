# 原型迁移至正式产品实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `web_test` 原型迁移至 `apps/web`，替换现有工作台，以原型为最终实现目标，mock 数据替换为 `@ntgm/sdk` 真实 API 调用。

**Architecture:** 整体替换策略 — 不保留 `apps/web` 现有工作台（`workbench.tsx`），将原型代码直接迁移，样式复用，API 层通过 `@ntgm/sdk` 调用。按建档主流程顺序迁移页面。

**Tech Stack:** Next.js 15 + React 19 + CSS Modules + `@ntgm/sdk`

---

## 文件结构映射

迁移前先理解两个项目的文件布局差异：

| web_test 源路径 | apps/web 目标路径 |
|---|---|
| `app/globals.css` | `app/globals.css` (合并) |
| `app/components/Navigation.tsx` | `app/components/Navigation.tsx` |
| `app/components/Navigation.module.css` | `app/components/Navigation.module.css` |
| `app/components/Toast.tsx` | `app/components/Toast.tsx` |
| `app/components/Toast.module.css` | `app/components/Toast.module.css` |
| `app/page.tsx` | `app/page.tsx` (首页) |
| `app/page.module.css` | `app/page.module.css` |
| `app/onboarding/*` | `app/onboarding/*` |
| `app/analysis/*` | `app/analysis/*` |
| `app/questionnaire/*` | `app/questionnaire/*` |
| `app/profile/*` | `app/profile/*` |
| `app/match/*` | `app/match/*` |
| `app/advice/*` | `app/advice/*` |
| `app/archive/*` | `app/archive/*` |
| `app/data/mockData.ts` | **不迁移** (用 SDK 替代) |
| `app/workbench.tsx` | **删除** |

**注意**: 原型的 per-page CSS module 文件各自独立，而 apps/web 的 `globals.css` 只包含 CSS 变量和少量全局样式。迁移方案：per-page CSS module 独立迁移到 apps/web 的各页面目录（与原型结构一致），globals.css 只合并 CSS 变量。

---

## Mock → SDK 替换对照表

| 原型数据引用 | 替换为 SDK 函数 |
|---|---|
| `import { profileV4 } from "../data/mockData"` | `import { fetchCurrentProfile } from "@ntgm/sdk"` |
| `import { matchResults } from "../data/mockData"` | `import { fetchCurrentMatch } from "@ntgm/sdk"` |
| `import { todayAdvice, weeklyPlan, luckyDays } from "../data/mockData"` | `import { fetchCurrentAdvice } from "@ntgm/sdk"` |
| `import { questionnaireData } from "../data/mockData"` | `import { fetchNextQuestions, submitQuestionnaireAnswers } from "@ntgm/sdk"` |
| `import { profileV1 } from "../data/mockData"` | `import { fetchCurrentBazi } from "@ntgm/sdk"` |
| `import { evolutionHistory } from "../data/mockData"` | `import { fetchArchiveChanges, fetchArchiveTimeline } from "@ntgm/sdk"` |
| `import { baziData } from "../data/mockData"` | `import { fetchCurrentBazi } from "@ntgm/sdk"` |
| `import { submitBasicIntake } from "../data/mockData"` | `import { submitBasicIntake } from "@ntgm/sdk"` |

API_BASE_URL 与 apps/web 现有 workbench.tsx 保持一致:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
```

---

## 任务清单

### Task 1: 基础设施 — CSS 变量 + 共享组件

**Files:**
- Create: `apps/web/app/globals.css` (替换内容)
- Create: `apps/web/app/components/Navigation.tsx`
- Create: `apps/web/app/components/Navigation.module.css`
- Create: `apps/web/app/components/Toast.tsx`
- Create: `apps/web/app/components/Toast.module.css`
- Delete: `apps/web/app/workbench.tsx`
- Modify: `apps/web/app/page.tsx` (重建为首页)
- Modify: `apps/web/app/layout.tsx` (不变)

- [ ] **Step 1: 合并 CSS 变量到 globals.css**

将 `web_test/app/globals.css` 全部内容（302 行）替换 `apps/web/app/globals.css` 现有内容（24 行）。

- [ ] **Step 2: 迁移 Navigation 组件**

将 `web_test/app/components/Navigation.tsx` 和 `Navigation.module.css` 复制到 `apps/web/app/components/`。

- [ ] **Step 3: 迁移 Toast 组件**

将 `web_test/app/components/Toast.tsx` 和 `Toast.module.css` 复制到 `apps/web/app/components/`。

- [ ] **Step 4: 删除旧工作台**

删除 `apps/web/app/workbench.tsx`。

- [ ] **Step 5: 提交**

```bash
cd /Users/growduduan/ai/ntgm/apps/web
git add -A
git commit -m "feat(web): migrate shared components and CSS from prototype"
```

---

### Task 2: 迁移 Home 页

**Files:**
- Create: `apps/web/app/page.tsx` (重建)
- Create: `apps/web/app/page.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/page.tsx` 和 `page.module.css` 复制到 `apps/web/app/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

在 `apps/web/app/page.tsx` 中：

1. 删除 `import { profileV4, matchResults, todayAdvice, evolutionHistory } from "../data/mockData"` 行

2. 添加 SDK 导入：
```typescript
import { fetchCurrentProfile, fetchCurrentMatch, fetchCurrentAdvice } from "@ntgm/sdk";
```

3. 将组件内的 `profileV4` 引用替换为从 SDK 获取的状态
4. 将 `matchResults` 引用替换为 `fetchCurrentMatch` 返回数据
5. 将 `todayAdvice` 引用替换为 `fetchCurrentAdvice` 返回数据
6. 将 `evolutionHistory` 引用替换为 `fetchArchiveTimeline` 返回数据

示例改造（参考 `apps/web/app/workbench.tsx` 中的数据获取模式）：
```typescript
// 页面顶部添加
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const [profile, setProfile] = useState<ProfileSummaryResponse | null>(null);
const [match, setMatch] = useState<MatchCurrentResponse | null>(null);
const [advice, setAdvice] = useState<AdviceCurrentResponse | null>(null);

useEffect(() => {
  const load = async () => {
    const [p, m, a] = await Promise.all([
      fetchCurrentProfile(API_BASE_URL).catch(() => null),
      fetchCurrentMatch(API_BASE_URL).catch(() => null),
      fetchCurrentAdvice(API_BASE_URL).catch(() => null),
    ]);
    setProfile(p);
    setMatch(m);
    setAdvice(a);
  };
  load();
}, []);
```

- [ ] **Step 3: 提交**

```bash
cd /Users/growduduan/ai/ntgm/apps/web
git add -A
git commit -m "feat(web): migrate home page with SDK integration"
```

---

### Task 3: 迁移 Onboarding 页

**Files:**
- Create: `apps/web/app/onboarding/page.tsx`
- Create: `apps/web/app/onboarding/onboarding.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/onboarding/page.tsx` 和 `onboarding.module.css` 复制到 `apps/web/app/onboarding/`。

- [ ] **Step 2: 替换 mock submit 为 SDK**

在 `apps/web/app/onboarding/page.tsx` 中：

1. 删除 `import { submitBasicIntake } from "../data/mockData"` 行

2. 添加 SDK 导入：
```typescript
import { submitBasicIntake } from "@ntgm/sdk";
```

3. `submitBasicIntake` 在原型中是 mock 函数，返回 `{ success: true, message: "..." }`。替换为 SDK 调用：
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const handleSubmit = async (data: BasicIntakeRequest) => {
  setIsSubmitting(true);
  try {
    await submitBasicIntake(API_BASE_URL, {
      name: data.name,
      gender: data.gender,
      birthDatetime: data.birthDatetime,
      birthPlace: data.birthPlace,
    });
    // ... 后续逻辑保持不变
  } catch (error) {
    // ... 错误处理保持不变
  }
};
```

- [ ] **Step 3: 提交**

```bash
cd /Users/growduduan/ai/ntgm/apps/web
git add -A
git commit -m "feat(web): migrate onboarding page with SDK"
```

---

### Task 4: 迁移 Analysis 页

**Files:**
- Create: `apps/web/app/analysis/page.tsx`
- Create: `apps/web/app/analysis/analysis.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/analysis/page.tsx` 和 `analysis.module.css` 复制到 `apps/web/app/analysis/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

1. 删除 mock 导入：
```typescript
// 删除这一行
import { baziData, profileV1 } from "../data/mockData";
```

2. 添加 SDK 导入：
```typescript
import { fetchCurrentBazi, fetchProfileVersion } from "@ntgm/sdk";
```

3. 使用 `fetchCurrentBazi` 替换 `baziData`，使用 `fetchProfileVersion(API_BASE_URL, 1)` 替换 `profileV1`。参考 `workbench.tsx` 中的调用模式添加 `useEffect` 和 `useState`。

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate analysis page with SDK"
```

---

### Task 5: 迁移 Questionnaire 页

**Files:**
- Create: `apps/web/app/questionnaire/page.tsx`
- Create: `apps/web/app/questionnaire/questionnaire.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/questionnaire/page.tsx` 和 `questionnaire.module.css` 复制到 `apps/web/app/questionnaire/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

1. 删除 mock 导入：
```typescript
// 删除这一行
import { questionnaireData } from "../data/mockData";
```

2. 添加 SDK 导入：
```typescript
import { fetchNextQuestions, submitQuestionnaireAnswers } from "@ntgm/sdk";
import type { QuestionnaireQuestion, QuestionnaireAnswerItem } from "@ntgm/sdk";
```

3. `questionnaireData.questions` → 替换为 `fetchNextQuestions(API_BASE_URL).then(r => r.questions)`
4. `submitQuestionnaireAnswers` 调用 → 直接使用 SDK 的同名函数，参数格式匹配 `QuestionnaireAnswerItem[]`
5. **localStorage 持久化逻辑保留** — 这是原型 UX 的核心部分，不要删除

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate questionnaire page with SDK"
```

---

### Task 6: 迁移 Profile 页

**Files:**
- Create: `apps/web/app/profile/page.tsx`
- Create: `apps/web/app/profile/profile.module.css`
- Create: `apps/web/app/profile/RadarChart.tsx` (原型中有此组件)

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/profile/page.tsx`、`profile.module.css`、`RadarChart.tsx` 复制到 `apps/web/app/profile/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

1. 删除 mock 导入，替换为：
```typescript
import { fetchCurrentProfile, fetchProfileVersion, fetchProfileVersions } from "@ntgm/sdk";
```

2. `profileV1-V4` → 使用 `fetchProfileVersions(API_BASE_URL)` 获取版本列表，用 `fetchProfileVersion(API_BASE_URL, n)` 获取特定版本
3. 雷达图数据 `abilityData` → 从 `fetchCurrentProfile` 返回的 `abilityTraits` 字段提取
4. 版本演进 → 从版本列表按时间排序

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate profile page with SDK"
```

---

### Task 7: 迁移 Match 页

**Files:**
- Create: `apps/web/app/match/page.tsx`
- Create: `apps/web/app/match/match.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/match/page.tsx` 和 `match.module.css` 复制到 `apps/web/app/match/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

1. 删除 mock 导入，替换为：
```typescript
import { fetchCurrentMatch } from "@ntgm/sdk";
```

2. `matchResults` → `fetchCurrentMatch(API_BASE_URL)`
3. 其余数据展示逻辑复用原型 UI

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate match page with SDK"
```

---

### Task 8: 迁移 Advice 页

**Files:**
- Create: `apps/web/app/advice/page.tsx`
- Create: `apps/web/app/advice/advice.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/advice/page.tsx` 和 `advice.module.css` 复制到 `apps/web/app/advice/`。

- [ ] **Step 2: 替换 mock 数据**

1. 删除 mock 导入，替换为：
```typescript
import { fetchCurrentAdvice } from "@ntgm/sdk";
```

2. `todayAdvice` → 从 `fetchCurrentAdvice` 返回的 `summary` 字段提取（当前 SDK `AdviceCurrentResponse.summary` 是 `Record<string, unknown>`，需要类型断言为 `{ todayAdvice, weeklyPlan, luckyDays }`）
3. 原型的 `todayAdvice`、`weeklyPlan`、`luckyDays` 是分离的 mock 数据，当前 SDK 的 `/advice/current` 可能只返回一个 summary 对象。如果数据不够，需要考虑用 mock 数据补充（Phase 2 再接入完整 API），或者将 `fetchCurrentAdvice` 的 summary 展开为三个字段。

**注意**: 当前 SDK 的 Advice API 只返回 summary（通用描述），没有具体的今日建议列表和吉日数据。这一部分在 Phase 1 可以保留部分 mock 数据作为 fallback，等后端补充 API 后再替换。

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate advice page with SDK"
```

---

### Task 9: 迁移 Archive 页

**Files:**
- Create: `apps/web/app/archive/page.tsx`
- Create: `apps/web/app/archive/archive.module.css`

- [ ] **Step 1: 复制页面文件**

将 `web_test/app/archive/page.tsx` 和 `archive.module.css` 复制到 `apps/web/app/archive/`。

- [ ] **Step 2: 替换 mock 数据为 SDK 调用**

1. 删除 mock 导入，替换为：
```typescript
import { fetchArchiveChanges, fetchArchiveTimeline, fetchProfileVersions } from "@ntgm/sdk";
```

2. `evolutionHistory` → `fetchArchiveChanges(API_BASE_URL)`
3. `timelineData` → `fetchArchiveTimeline(API_BASE_URL)`
4. 版本列表 → `fetchProfileVersions(API_BASE_URL)`

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat(web): migrate archive page with SDK"
```

---

### Task 10: 验证构建

**Files:**
- Modify: `apps/web/app/layout.tsx` (如有需要)

- [ ] **Step 1: 运行构建**

```bash
cd /Users/growduduan/ai/ntgm/apps/web
npm run build 2>&1 | head -100
```

预期: 无编译错误，所有 8 个页面路由可访问。

- [ ] **Step 2: 修复类型错误**

如果出现 TypeScript 错误，按错误提示修复。重点关注：
- `fetchCurrentAdvice` 返回的 `summary` 类型是 `Record<string, unknown>`，使用时需要类型断言
- `QuestionnaireAnswerItem` 格式与原型中 submit 调用的参数格式对比，确保兼容
- `ProfileSummaryResponse` 中的 `personalityTraits`、`abilityTraits` 等字段是 `Record<string, unknown>`，需要断言为具体类型后使用

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "fix(web): resolve build errors after migration"
```

---

## 实施顺序

```
Task 1 (基础设施)
   └─ Task 2 (Home)
   └─ Task 3 (Onboarding)
   └─ Task 4 (Analysis)
   └─ Task 5 (Questionnaire)
   └─ Task 6 (Profile)
   └─ Task 7 (Match)
   └─ Task 8 (Advice)
   └─ Task 9 (Archive)
   └─ Task 10 (验证构建)
```

---

## 已知限制（Phase 1 不处理）

1. **Advice API 数据不足**: SDK 的 `fetchCurrentAdvice` 只返回 `summary: Record<string, unknown>`，没有具体的今日建议列表和吉日数据。Phase 1 中 Advice 页的部分内容可能需要保留 mock fallback，等后端补充 API。
2. **后端 API 补全**: 部分原型功能（如 `fetchLuckyDays`、`fetchWeeklyPlan`、`markAdviceDone`）在 SDK 中不存在，需要后端实现后补充。
3. **PDF 导出/海报生成**: 原型中的导出按钮是 stub（alert），Phase 1 保持不变。