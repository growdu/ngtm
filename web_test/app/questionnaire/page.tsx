"use client";

import { useState, useEffect } from "react";
import { AppShell } from "../components/Navigation";
import { questionnaireData } from "../data/mockData";
import { profileV4 } from "../data/mockData";
import styles from "./questionnaire.module.css";

const STORAGE_KEY = "ntgm_questionnaire_progress";

interface Answer {
  questionId: string;
  selectedOption: string;
  reasoning: string;
  timestamp: string;
}

export default function QuestionnairePage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const total = questionnaireData.total;
  const question = questionnaireData.question;

  // 持久化
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentQuestion(parsed.currentQuestion || 1);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, currentQuestion })
    );
  }, [answers, currentQuestion]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[`q-${currentQuestion - 1}`];
      if (prevAnswer) {
        setSelectedOption(prevAnswer.selectedOption);
        setReasoning(prevAnswer.reasoning);
      } else {
        setSelectedOption(null);
        setReasoning("");
      }
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      showToast("请选择一个选项");
      return;
    }

    const answer: Answer = {
      questionId: question.id,
      selectedOption,
      reasoning,
      timestamp: new Date().toISOString(),
    };

    setAnswers((prev) => ({ ...prev, [`q-${currentQuestion}`]: answer }));

    if (currentQuestion < total) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setReasoning("");
    } else {
      setSubmitted(true);
      showToast("所有问题已完成，感谢你的回答！");
    }
  };

  const confidenceMap = profileV4.confidenceMap;

  if (submitted) {
    return (
      <AppShell>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.completedState}>
              <div className={styles.completedIcon}>✓</div>
              <h2 className={styles.completedTitle}>问答完成</h2>
              <p className={styles.completedDesc}>
                你已完成 {total} 道校准问题。系统将根据你的回答更新画像。
              </p>
              <p className={styles.completedSub}>
                预计置信度提升：风险偏好 +8%，长线主义 +5%
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {toastMessage && (
        <div className={styles.toast} role="alert">
          {toastMessage}
        </div>
      )}
      <div className={styles.page}>
        <div className={styles.container}>
          {/* 进度 */}
          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span className={styles.progressText}>
                校准你的画像：第 {currentQuestion} / {total} 题
              </span>
              <div className={styles.progressBarWrap}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(currentQuestion / total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {/* 问题区 */}
            <div className={styles.mainSection}>
              <div className={`${styles.card} ${styles.questionCard}`}>
                <div className={styles.questionHeader}>
                  <span className={styles.impactBadge}>
                    <span className={styles.impactIcon}>📊</span>
                    {question.impact}
                  </span>
                </div>
                <h2 className={styles.questionText}>{question.text}</h2>

                <div className={styles.options}>
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`${styles.optionItem} ${selectedOption === option.value ? styles.selected : ""}`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={() => setSelectedOption(option.value)}
                        className={styles.radioInput}
                        aria-label={option.label}
                      />
                      <span className={styles.optionRadio} />
                      <span className={styles.optionLabel}>{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.reasoningSection}>
                  <label className={styles.reasoningLabel}>
                    补充说明（可选）
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="可以补充一些背景信息，帮助系统更准确地理解你的选择..."
                    className={styles.reasoningInput}
                    rows={3}
                    aria-label="补充说明"
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className="btn btn-secondary"
                  onClick={handlePrev}
                  disabled={currentQuestion === 1}
                >
                  上一题
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  {currentQuestion < total ? "提交并继续" : "完成问答"}
                </button>
              </div>
            </div>

            {/* 右侧预览 */}
            <div className={styles.sidebar}>
              <div className={`${styles.card} ${styles.previewCard}`}>
                <h3 className={styles.previewTitle}>
                  <span className={styles.previewIcon}>🔮</span>
                  当前回答后，系统可能会：
                </h3>
                <ul className={styles.previewList}>
                  {questionnaireData.previewAfterAnswer.map((item, index) => (
                    <li key={index} className={styles.previewItem}>
                      <span className={styles.previewDot} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${styles.card} ${styles.hintCard}`}>
                <h3 className={styles.hintTitle}>答题提示</h3>
                <ul className={styles.hintList}>
                  <li>根据你的真实行为选择，而非理想状态</li>
                  <li>没有正确答案，系统需要的是真实的你</li>
                  <li>可以补充说明来提供更多上下文</li>
                </ul>
              </div>

              <div className={`${styles.card} ${styles.progressCard}`}>
                <h3 className={styles.progressTitle}>当前画像置信度</h3>
                <div className={styles.confidenceList}>
                  {Object.entries({
                    riskPreference: "风险偏好",
                    longTermOrientation: "长线主义",
                    emotionStability: "情绪稳定",
                  }).map(([key, label]) => (
                    <div key={key} className={styles.confidenceItem}>
                      <span>{label}</span>
                      <span className={styles.confidenceValue}>
                        {Math.round((confidenceMap[key] || 0.5) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
