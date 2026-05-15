"use client";

import { useState } from "react";
import { AppShell } from "../components/Navigation";
import { profileV4, profileV3, evolutionHistory } from "../data/mockData";
import styles from "./profile.module.css";

// 雷达图组件
function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 110;
  const levels = 4;

  const angleStep = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = value * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const polygonPoints = data
    .map((d, i) => {
      const p = getPoint(i, d.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} className={styles.radarSvg}>
      {/* 背景网格 */}
      {Array.from({ length: levels }).map((_, i) => {
        const r = maxRadius * ((i + 1) / levels);
        const points = data
          .map((_, j) => {
            const angle = startAngle + j * angleStep;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(182, 136, 61, 0.2)"
            strokeWidth="1"
          />
        );
      })}

      {/* 轴线 */}
      {data.map((_, i) => {
        const p = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(182, 136, 61, 0.3)"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据区域 */}
      <polygon
        points={polygonPoints}
        fill="rgba(182, 136, 61, 0.3)"
        stroke="var(--accent-gold)"
        strokeWidth="2"
      />

      {/* 数据点 */}
      {data.map((d, i) => {
        const p = getPoint(i, d.value);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--accent-gold)"
            stroke="var(--bg-primary)"
            strokeWidth="2"
          />
        );
      })}

      {/* 标签 */}
      {data.map((d, i) => {
        const p = getPoint(i, 1.2);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y + 5}
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize="12"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function ProfilePage() {
  const [selectedVersion, setSelectedVersion] = useState(4);
  const profile = selectedVersion === 4 ? profileV4 : profileV3;

  const abilityData = [
    { label: "执行力", value: profile.traits.ability.execution },
    { label: "领导力", value: profile.traits.ability.leadership },
    { label: "学习力", value: profile.traits.ability.learning },
    { label: "资源整合", value: profile.traits.ability.resource },
    { label: "策略思维", value: profile.traits.ability.strategy || 0.7 },
  ];

  const personalityEntries = Object.entries(profile.traits.personality);
  const traitLabels: Record<string, string> = {
    introversion: "内向/外向",
    rationality: "理性/感性",
    impulsiveness: "冲动/克制",
    riskPreference: "风险偏好",
    powerDrive: "权力驱动",
    emotionStability: "情绪稳定",
    orderliness: "秩序感",
    creativity: "创造力",
  };

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.versionBadge}>
                <span className="version-tag">{profile.version}</span>
              </div>
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>动态画像</h1>
                <div className={styles.scoreInfo}>
                  <span className="score-badge">{profile.summary.overallScore}</span>
                  <span className={styles.scoreLabel}>综合评分</span>
                </div>
              </div>
            </div>
            <div className={styles.keywords}>
              {profile.summary.keywords.map((kw) => (
                <span key={kw} className="tag">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Version Selector */}
          <div className={styles.versionSelector}>
            <span className={styles.selectorLabel}>查看版本：</span>
            <div className={styles.versionButtons}>
              {[4, 3, 2, 1].map((v) => (
                <button
                  key={v}
                  className={`${styles.versionButton} ${selectedVersion === v ? styles.active : ""}`}
                  onClick={() => setSelectedVersion(v)}
                >
                  V{v}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.content}>
            {/* 左侧：性格维度 + 雷达图 */}
            <div className={styles.leftColumn}>
              {/* 性格矩阵 */}
              <div className={`${styles.card} ${styles.personalityCard}`}>
                <div className="card-header">
                  <span className="card-title">性格维度</span>
                </div>
                <div className={styles.personalityGrid}>
                  {personalityEntries.map(([key, value]) => (
                    <div key={key} className={styles.personalityItem}>
                      <div className={styles.personalityLabel}>
                        <span>{traitLabels[key] || key}</span>
                        <span className={styles.confidence}>
                          {Math.round((profile.confidenceMap[key] || 0.5) * 100)}%
                        </span>
                      </div>
                      <div className="stat-bar">
                        <div className="stat-bar-track">
                          <div
                            className="stat-bar-fill"
                            style={{
                              width: `${value * 100}%`,
                              background:
                                key === "riskPreference"
                                  ? "linear-gradient(90deg, var(--accent-gold-dark), var(--accent-red))"
                                  : "linear-gradient(90deg, var(--accent-gold-dark), var(--accent-gold))",
                            }}
                          />
                        </div>
                        <span className="stat-bar-value">
                          {Math.round(value * 100)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 能力雷达图 */}
              <div className={`${styles.card} ${styles.radarCard}`}>
                <div className="card-header">
                  <span className="card-title">能力雷达</span>
                </div>
                <div className={styles.radarContainer}>
                  <RadarChart data={abilityData} />
                </div>
              </div>
            </div>

            {/* 右侧：变化说明 + 证据来源 */}
            <div className={styles.rightColumn}>
              {/* 本次变化 */}
              {profile.changes.length > 0 && (
                <div className={`${styles.card} ${styles.changeCard}`}>
                  <div className="card-header">
                    <span className="card-title">本次变化</span>
                    <span className="tag">
                      V{selectedVersion - 1} → V{selectedVersion}
                    </span>
                  </div>
                  <div className={styles.changeList}>
                    {profile.changes.map((change, index) => (
                      <div key={index} className={styles.changeItem}>
                        <div className={styles.changeHeader}>
                          <span className={styles.changeDimension}>
                            {traitLabels[change.dimension] || change.dimension}
                          </span>
                          <span
                            className={`${styles.changeDirection} ${
                              change.direction === "increase"
                                ? styles.increase
                                : styles.decrease
                            }`}
                          >
                            {change.direction === "increase" ? "↑" : "↓"}
                            {change.direction === "increase" ? "上升" : "下降"}
                          </span>
                        </div>
                        <p className={styles.changeReason}>{change.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 证据来源 */}
              <div className={`${styles.card} ${styles.evidenceCard}`}>
                <div className="card-header">
                  <span className="card-title">证据来源</span>
                </div>
                <div className={styles.evidenceTabs}>
                  <button className={`${styles.evidenceTab} ${styles.active}`}>
                    八字分析
                  </button>
                  <button className={styles.evidenceTab}>问答记录</button>
                  <button className={styles.evidenceTab}>人生事件</button>
                  <button className={styles.evidenceTab}>面相</button>
                  <button className={styles.evidenceTab}>手相</button>
                </div>
                <div className={styles.evidenceContent}>
                  <ul className={styles.evidenceList}>
                    <li>出生日期推算八字命盘</li>
                    <li>五行强弱统计分析</li>
                    <li>十神关系分析</li>
                    <li>大运流年初步预测</li>
                  </ul>
                </div>
              </div>

              {/* 版本历史 */}
              <div className={`${styles.card} ${styles.historyCard}`}>
                <div className="card-header">
                  <span className="card-title">演进历史</span>
                </div>
                <div className={styles.historyList}>
                  {evolutionHistory.slice(0, 4).map((item) => (
                    <div key={item.version} className={styles.historyItem}>
                      <span className="version-tag">{item.version}</span>
                      <div className={styles.historyContent}>
                        <span className={styles.historyTitle}>{item.title}</span>
                        <span className={styles.historyDate}>{item.date}</span>
                      </div>
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