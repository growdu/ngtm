"use client";

import { useState } from "react";
import { AppShell } from "../components/Navigation";
import { todayAdvice, weeklyPlan, luckyDays } from "../data/mockData";
import styles from "./advice.module.css";

export default function AdvicePage() {
  const [adviceList, setAdviceList] = useState(todayAdvice);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const handleMarkDone = (id: string) => {
    setAdviceList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "completed" } : item
      )
    );
  };

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className="version-tag">4</span>
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>你的改命建议</h1>
                <p className={styles.subtitle}>
                  基于 V4 画像生成的个性化建议
                </p>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {/* 左侧主内容 */}
            <div className={styles.mainContent}>
              {/* 今日建议 */}
              <div className={`${styles.card} ${styles.todayCard}`}>
                <div className="card-header">
                  <span className="card-title">今日建议</span>
                  <span className="tag tag-success">待执行</span>
                </div>
                <div className={styles.adviceList}>
                  {adviceList.map((advice) => (
                    <div key={advice.id} className={styles.adviceItem}>
                      <div className={styles.adviceContent}>
                        <div className={styles.adviceType}>
                          <span
                            className={`${styles.typeBadge} ${
                              advice.type === "avoid" ? styles.avoid : ""
                            } ${advice.type === "action" ? styles.action : ""} ${
                              advice.type === "record" ? styles.record : ""
                            }`}
                          >
                            {advice.type === "avoid" && "忌"}
                            {advice.type === "action" && "宜"}
                            {advice.type === "record" && "记"}
                          </span>
                          <span className={styles.adviceTitle}>{advice.title}</span>
                        </div>
                        <p className={styles.adviceText}>{advice.content}</p>
                        <p className={styles.adviceReason}>
                          <span className={styles.reasonLabel}>原因：</span>
                          {advice.reason}
                        </p>
                      </div>
                      <div className={styles.adviceActions}>
                        {advice.status === "pending" ? (
                          <button
                            className={styles.markDoneBtn}
                            onClick={() => handleMarkDone(advice.id)}
                          >
                            标记已执行
                          </button>
                        ) : (
                          <span className={styles.completedBadge}>✓ 已完成</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7日计划 */}
              <div className={`${styles.card} ${styles.weeklyCard}`}>
                <div className="card-header">
                  <span className="card-title">7日计划</span>
                </div>
                <div className={styles.weeklyList}>
                  {weeklyPlan.map((day) => (
                    <div key={day.day} className={styles.weeklyItem}>
                      <div className={styles.dayBadge}>
                        <span className={styles.dayNumber}>Day {day.day}</span>
                      </div>
                      <div className={styles.dayContent}>
                        <h4 className={styles.dayTitle}>{day.title}</h4>
                        <p className={styles.dayDesc}>{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧辅助 */}
            <div className={styles.sidebar}>
              {/* 吉日提醒 */}
              <div className={`${styles.card} ${styles.luckyCard}`}>
                <div className="card-header">
                  <span className="card-title">吉日提醒</span>
                </div>
                <div className={styles.luckyList}>
                  {luckyDays.map((day) => (
                    <div key={day.date} className={styles.luckyItem}>
                      <div className={styles.luckyDate}>
                        <span className={styles.dateDay}>
                          {new Date(day.date).getDate()}
                        </span>
                        <span className={styles.dateMonth}>
                          {new Date(day.date).getMonth() + 1}月
                        </span>
                      </div>
                      <div className={styles.luckyInfo}>
                        <span className={styles.luckyActivity}>{day.activity}</span>
                        <span className={styles.luckyNote}>{day.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 反馈入口 */}
              <div className={`${styles.card} ${styles.feedbackCard}`}>
                <h3 className={styles.feedbackTitle}>执行效果反馈</h3>
                <p className={styles.feedbackText}>
                  记录建议执行后的效果，帮助系统更好地为你定制建议
                </p>
                <div className={styles.feedbackActions}>
                  <button
                    className={`${styles.feedbackBtn} ${selectedFeedback === "good" ? styles.selected : ""}`}
                    onClick={() => setSelectedFeedback("good")}
                  >
                    有效果
                  </button>
                  <button
                    className={`${styles.feedbackBtn} ${selectedFeedback === "normal" ? styles.selected : ""}`}
                    onClick={() => setSelectedFeedback("normal")}
                  >
                    一般
                  </button>
                  <button
                    className={`${styles.feedbackBtn} ${selectedFeedback === "none" ? styles.selected : ""}`}
                    onClick={() => setSelectedFeedback("none")}
                  >
                    无效果
                  </button>
                </div>
                <textarea
                  placeholder="补充说明（可选）..."
                  className={styles.feedbackInput}
                  rows={3}
                />
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  提交反馈
                </button>
              </div>

              {/* 说明 */}
              <div className={`${styles.card} ${styles.infoCard}`}>
                <h3 className={styles.infoTitle}>建议来源</h3>
                <p className={styles.infoText}>
                  每条建议都基于你的画像弱项、优势强化、风险规避和目标人物差距修正生成。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}