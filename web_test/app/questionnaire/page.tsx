"use client";

import { useState } from "react";
import { AppShell } from "../components/Navigation";
import { questionnaireData } from "../data/mockData";
import styles from "./questionnaire.module.css";

export default function QuestionnairePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");

  const { current, total, question, previewAfterAnswer } = questionnaireData;

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* 进度 */}
          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span className={styles.progressText}>
                校准你的画像：第 {current} / {total} 题
              </span>
              <div className={styles.progressBar}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(current / total) * 100}%` }}
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
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-secondary">上一题</button>
                <button className="btn btn-primary" disabled={!selectedOption}>
                  提交并继续
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
                  {previewAfterAnswer.map((item, index) => (
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
                <h3 className={styles.progressTitle}>画像置信度</h3>
                <div className={styles.confidenceList}>
                  <div className={styles.confidenceItem}>
                    <span>风险偏好</span>
                    <span className={styles.confidenceValue}>82%</span>
                  </div>
                  <div className={styles.confidenceItem}>
                    <span>长线主义</span>
                    <span className={styles.confidenceValue}>88%</span>
                  </div>
                  <div className={styles.confidenceItem}>
                    <span>情绪稳定</span>
                    <span className={styles.confidenceValue}>72%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}