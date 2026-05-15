# Code Review Report: /Users/growduduan/ai/ntgm/web_test/

**Reviewed:** 2026-05-11T10:30:00Z
**Depth:** Deep (comprehensive analysis)
**Files Reviewed:** 20 files
**Status:** issues_found

## Summary

This is a Next.js web prototype for a fortune-telling application ("逆天改命算命软件") featuring a dynamic personality profile system. The codebase demonstrates good visual design and CSS consistency with the product's "命盘感" aesthetic. However, there are significant functional gaps: most form interactions are non-functional, page states are incomplete, and several core features described in the UI/Product docs are missing.

---

## Critical Issues (Must Fix Before Production)

### CR-01: Onboarding Multi-Step Form Non-Functional

**File:** `app/onboarding/page.tsx:33-41`
**Issue:** The onboarding flow has 5 steps but only shows step 1 content. `handleNext()` increments state but the UI never renders different content for steps 2-5 (photo upload, initial analysis, calibration questions, completion).
```tsx
// Current: Only renders the first step's form
// Missing: Conditional rendering for different step content
```

**Fix:**
```tsx
const renderStepContent = () => {
  switch (currentStep) {
    case 1: return <BasicInfoForm />;
    case 2: return <PhotoUploadStep />;
    case 3: return <InitialAnalysisStep />;
    case 4: return <CalibrationStep />;
    case 5: return <CompletionStep />;
  }
};
```

---

### CR-02: Questionnaire Page Buttons Non-Functional

**File:** `app/questionnaire/page.tsx:80-83`
**Issue:** "上一题" button has no onClick handler, and "提交并继续" doesn't actually submit the answer or navigate. No validation feedback when trying to submit without selection.

**Fix:** Add handlers and validation:
```tsx
<button className="btn btn-secondary" onClick={handlePrevQuestion}>
  上一题
</button>
<button
  className="btn btn-primary"
  disabled={!selectedOption}
  onClick={handleSubmit}
>
  提交并继续
</button>
```

---

### CR-03: Archive Export Buttons Non-Functional

**File:** `app/archive/page.tsx:136-143`
**Issue:** "导出 PDF" and "生成分享海报" buttons have no onClick handlers. These are core features per UI doc section 5.9.

**Fix:** Implement export functionality or add disabled state with tooltip.

---

### CR-04: Advice Feedback Submission Non-Operational

**File:** `app/advice/page.tsx:166-168`
**Issue:** The submit feedback button has no onClick handler. `selectedFeedback` state is tracked but never submitted to any backend.

**Fix:** Add submission handler:
```tsx
const handleFeedbackSubmit = () => {
  // TODO: Implement API call
  console.log("Submitting feedback:", selectedFeedback);
};
```

---

### CR-05: Profile Evidence Tabs Non-Interactive

**File:** `app/profile/page.tsx:274-281`
**Issue:** Evidence source tabs (八字分析, 问答记录, etc.) are styled as buttons but have no click handlers. Only "八字分析" has visual active state hardcoded.

**Fix:** Implement tab switching:
```tsx
const [activeTab, setActiveTab] = useState("bazi");

<button
  className={`${styles.evidenceTab} ${activeTab === "bazi" ? styles.active : ""}`}
  onClick={() => setActiveTab("bazi")}
>
  八字分析
</button>
```

---

## Important Issues (Should Fix)

### WR-01: Missing Page States (Loading/Error/Empty)

**Files:** All page files
**Issue:** According to UI doc section 7.1, every core page must have: initial empty state, loading state, success state, partial data missing state, error state. Currently, no pages implement these states.

**Fix:** Add loading skeleton components and error boundaries:
```tsx
if (loading) return <LoadingSkeleton />;
if (error) return <ErrorState message={error} />;
if (!data) return <EmptyState onAction={refetch} />;
```

---

### WR-02: Onboarding Form No Validation

**File:** `app/onboarding/page.tsx:26-31`
**Issue:** `handleInputChange` doesn't validate required fields (name, birthDate, gender). Users can proceed with empty required fields.

**Fix:** Add validation before step progression:
```tsx
const canProceed = () => {
  return formData.name && formData.birthDate && formData.gender;
};
```

---

### WR-03: Hardcoded Figure History

**File:** `app/archive/page.tsx:8`
**Issue:** `figureHistory` is hardcoded as `["王安石", "韩非", "曹操", "曹操"]` instead of deriving from actual matchResults across profile versions.

**Fix:** Derive from version history:
```tsx
const figureHistory = evolutionHistory.map(item => {
  const versionProfile = getProfileByVersion(item.version);
  return getTopMatchFigure(versionProfile);
});
```

---

### WR-04: Missing Mobile Navigation Menu

**File:** `app/components/Navigation.module.css:120-123`
**Issue:** Nav is hidden on mobile via `display: none` but no hamburger menu replacement exists.

**Fix:** Implement mobile menu toggle:
```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// Add hamburger button for mobile
// Toggle menu visibility based on state
```

---

### WR-05: No State Persistence in Questionnaire

**File:** `app/questionnaire/page.tsx`
**Issue:** No mechanism to save answers, revisit previous questions, or persist progress. Page reload loses all answers.

**Fix:** Use localStorage or URL state to persist:
```tsx
const saveProgress = (questionId: string, answer: string) => {
  localStorage.setItem(`q-${questionId}`, answer);
};
```

---

### WR-06: Advice Lucky Days Date Parsing

**File:** `app/advice/page.tsx:120-123`
**Issue:** `new Date(day.date)` may cause timezone issues since dates like "2026-05-15" are treated as UTC in some environments.

**Fix:** Add explicit timezone handling:
```tsx
const date = new Date(day.date + "T00:00:00"); // Append local time
```

---

### WR-07: Profile Version Selector Missing V1 Data

**File:** `app/profile/page.tsx:117-118`
**Issue:** Version selector can switch to V1/V2 but only profileV3 and profileV4 are imported. Will cause undefined errors.

**Fix:** Import all profile versions or show "V1 data not available" for older versions:
```tsx
const profile = selectedVersion === 4 ? profileV4 :
                selectedVersion === 3 ? profileV3 :
                selectedVersion === 2 ? profileV2 : profileV1;
```

---

### WR-08: Questionnaires Missing Answer State

**File:** `app/questionnaire/page.tsx:12`
**Issue:** Only one question is shown from `questionnaireData`. No mechanism to cycle through questions after submission.

**Fix:** Add state to track current question index and load questions array.

---

## Minor Issues (Nice to Have)

### IN-01: Code Duplication - Card Patterns

**Files:** All page components
**Issue:** Repeated card structure patterns across pages. Should extract to shared `Card` component with variants.

**Recommendation:** Create `app/components/Card.tsx`:
```tsx
interface CardProps { variant?: 'default' | 'highlight' | 'warning'; children: ReactNode; }
```

---

### IN-02: Unused Animation Classes

**File:** `app/globals.css:276-301`
**Issue:** `.animate-fade-in` and `.animate-pulse` classes defined but never used anywhere.

**Fix:** Remove or implement skeleton loaders using these classes.

---

### IN-03: Inline Alert Instead of Toast

**File:** `app/onboarding/page.tsx:40`
**Issue:** Uses native `alert()` for submission feedback instead of a proper toast notification.

**Fix:** Implement toast system:
```tsx
import { useToast } from "@/hooks/useToast";
const toast = useToast();
toast.success("建档信息已保存！");
```

---

### IN-04: Static Progress Display

**File:** `app/onboarding/page.tsx:229-230`
**Issue:** Sidebar shows "1 / 5 步" hardcoded instead of deriving from `currentStep` and total steps.

**Fix:**
```tsx
<span className={styles.progressValue}>{currentStep}</span>
<span className={styles.progressLabel}>/ {steps.length} 步</span>
```

---

### IN-05: Missing ARIA Labels

**Files:** `app/questionnaire/page.tsx`, `app/advice/page.tsx`
**Issue:** Interactive elements like radio buttons, buttons lack proper ARIA labels for screen readers.

**Fix:**
```tsx
<input aria-label={`选项: ${option.label}`} />
<button aria-label="提交反馈">提交反馈</button>
```

---

### IN-06: Incomplete Responsive Breakpoints

**Files:** `app/profile/profile.module.css`, `app/match/match.module.css`
**Issue:** Some components don't respond to 768px mobile breakpoint (only 900px defined). Grid layouts may overflow on smaller devices.

**Fix:** Add 768px media queries where missing:
```css
@media (max-width: 768px) {
  .personalityGrid {
    grid-template-columns: 1fr;
  }
}
```

---

### IN-07: Hardcoded Confidence Values in Sidebar

**File:** `app/questionnaire/page.tsx:116-127`
**Issue:** Confidence percentages (82%, 88%, 72%) are hardcoded instead of derived from actual profile data.

**Fix:** Derive from `profileV4.confidenceMap`:
```tsx
const confidenceMap = profileV4.confidenceMap;
```

---

### IN-08: Match Page Differences Not Mapped

**File:** `app/match/page.tsx:65-77`
**Issue:** "不同的地方" section renders correctly, but `differences` array might be empty in mockData. Should handle gracefully.

**Fix:** Add conditional rendering:
```tsx
{currentMatch.differences.length > 0 && (
  <div className={`${styles.card} ${styles.differentCard}`}>
    ...
  </div>
)}
```

---

### IN-09: CSS Variable Duplication

**Files:** Multiple CSS files
**Issue:** `.card`, `.card-header`, `.card-title` classes defined in both `globals.css` and page-specific CSS modules. CSS Modules should reference global classes consistently.

**Fix:** Either use exclusively global classes or prefix with module namespace.

---

### IN-10: Missing Date Utility

**Files:** `app/archive/page.tsx`, `app/advice/page.tsx`
**Issue:** Date formatting repeated in multiple places. Should extract to shared utility.

**Recommendation:**
```tsx
// app/utils/date.ts
export const formatDate = (date: string, locale = 'zh-CN') => {
  return new Date(date).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric'
  });
};
```

---

## Suggestions for Improvement

### Architecture

1. **Shared Components Missing**
   - Create `Card`, `ProgressBar`, `ScoreBadge`, `StatBar` as reusable components
   - Implement `DataTable`, `Timeline` for consistent data presentation

2. **State Management**
   - Consider using Zustand or Context for cross-page state (current profile, answered questions)
   - Add proper loading/error states per page

3. **API Layer Structure**
   - Define mock API service (`lib/api.ts`) with functions like:
     ```ts
     export const submitOnboarding = async (data: OnboardingFormData) => {...}
     export const submitAnswer = async (questionId: string, answer: string) => {...}
     ```

### Data Model

1. **TypeScript Interfaces Incomplete**
   - `ProfileVersion` uses `Record<string, number>` for traits but doesn't enforce known keys
   - Add specific types for each trait category:
   ```ts
   interface PersonalityTraits {
     introversion: number;
     rationality: number;
     // ... all known keys as required
   }
   ```

2. **Missing Profile Data for V1/V2**
   - mockData.ts only exports profileV1, profileV3, profileV4 (profileV2 missing!)
   - Add complete mock data for all versions

### UI/UX Gaps

1. **Navigation Active State**
   - Current path highlighting works but consider adding breadcrumb for nested pages

2. **Empty States**
   - Add meaningful empty states: "暂无画像数据，请先完成建档"

3. **Confirmation Dialogs**
   - "保存草稿" should confirm before losing unsaved changes

4. **Keyboard Navigation**
   - Add keyboard shortcuts for power users (J/K navigation, Enter to submit)

---

## Files Reviewed

- `app/page.tsx` + `app/page.module.css`
- `app/onboarding/page.tsx` + `app/onboarding/onboarding.module.css`
- `app/analysis/page.tsx` + `app/analysis/analysis.module.css`
- `app/questionnaire/page.tsx` + `app/questionnaire/questionnaire.module.css`
- `app/profile/page.tsx` + `app/profile/profile.module.css`
- `app/match/page.tsx` + `app/match/match.module.css`
- `app/advice/page.tsx` + `app/advice/advice.module.css`
- `app/archive/page.tsx` + `app/archive/archive.module.css`
- `app/components/Navigation.tsx` + `app/components/Navigation.module.css`
- `app/data/mockData.ts`
- `app/globals.css`
- `app/layout.tsx`
- `next.config.mjs`
- `docs/ui.md`
- `docs/product.md`

---

_Reviewed: 2026-05-11T10:30:00Z_
_Reviewer: Claude (Comprehensive Code Review)_