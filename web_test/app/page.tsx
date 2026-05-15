"use client";

import Link from "next/link";
import { AppShell } from "./components/Navigation";
import {
  profileV4,
  matchResults,
  todayAdvice,
  evolutionHistory,
} from "./data/mockData";
import styles from "./page.module.css";

export default function HomePage() {
  const topMatch = matchResults[0];
  const latestAdvice = todayAdvice[0];

  return (
    <AppShell>
      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              你的命，不止能算，还能被持续校正
            </h1>
            <p className={styles.heroSubtitle}>
              从出生信息、照片、经历到性格模式，逐步形成你的命运画像
            </p>
            <div className={styles.heroActions}>
              <Link href="/onboarding" className="btn btn-primary">
                开始建档
              </Link>
              <Link href="/profile" className="btn btn-secondary">
                查看当前画像
              </Link>
            </div>
          </div>
          <div className={styles.heroDecoration}>
            <div className={styles.yinYang}>
              <span>☯</span>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className={styles.cardsSection}>
          <div className={styles.cardsGrid}>
            {/* 当前画像摘要 */}
            <div className={`${styles.card} ${styles.profileCard}`}>
              <div className="card-header">
                <span className="card-title">当前画像摘要</span>
                <span className="version-tag">{profileV4.version}</span>
              </div>
              <div className={styles.profileScore}>
                <span className="score-badge">{profileV4.summary.overallScore}</span>
                <span className={styles.scoreLabel}>综合评分</span>
              </div>
              <div className={styles.keywords}>
                {profileV4.summary.keywords.map((kw) => (
                  <span key={kw} className="tag">
                    {kw}
                  </span>
                ))}
              </div>
              <div className={styles.statBars}>
                <div className="stat-bar">
                  <span className="stat-bar-label">风险偏好</span>
                  <div className="stat-bar-track">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${profileV4.traits.personality.riskPreference * 100}%`,
                        background: "linear-gradient(90deg, var(--accent-gold-dark), var(--accent-red))",
                      }}
                    />
                  </div>
                  <span className="stat-bar-value">
                    {Math.round(profileV4.traits.personality.riskPreference * 100)}
                  </span>
                </div>
                <div className="stat-bar">
                  <span className="stat-bar-label">长线主义</span>
                  <div className="stat-bar-track">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${profileV4.traits.fortune.longTermOrientation * 100}%`,
                        background: "linear-gradient(90deg, var(--accent-jade), var(--accent-jade-light))",
                      }}
                    />
                  </div>
                  <span className="stat-bar-value">
                    {Math.round(profileV4.traits.fortune.longTermOrientation * 100)}
                  </span>
                </div>
                <div className="stat-bar">
                  <span className="stat-bar-label">情绪稳定</span>
                  <div className="stat-bar-track">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${profileV4.traits.personality.emotionStability * 100}%`,
                        background: "linear-gradient(90deg, var(--accent-gold-dark), var(--accent-gold))",
                      }}
                    />
                  </div>
                  <span className="stat-bar-value">
                    {Math.round(profileV4.traits.personality.emotionStability * 100)}
                  </span>
                </div>
              </div>
              <Link href="/profile" className={styles.cardLink}>
                查看完整画像 →
              </Link>
            </div>

            {/* 历史人物匹配 */}
            <div className={`${styles.card} ${styles.matchCard}`}>
              <div className="card-header">
                <span className="card-title">最像的历史人物</span>
              </div>
              <div className={styles.matchMain}>
                <div className={styles.matchFigure}>
                  <div className={styles.figureAvatar}>
                    <span>{topMatch.figureName[0]}</span>
                  </div>
                  <div className={styles.figureInfo}>
                    <h3 className={styles.figureName}>{topMatch.figureName}</h3>
                    <span className={styles.figureMeta}>
                      {topMatch.dynasty} · {topMatch.roleType}
                    </span>
                  </div>
                </div>
                <div className={styles.similarityScore}>
                  <span className="score-badge">
                    {Math.round(topMatch.similarityScore * 100)}
                  </span>
                  <span className={styles.scoreLabel}>相似度</span>
                </div>
              </div>
              <div className={styles.similarityPoints}>
                <p className={styles.similarityLabel}>相似点：</p>
                <ul className={styles.pointsList}>
                  {topMatch.highlights.slice(0, 2).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
              <Link href="/match" className={styles.cardLink}>
                查看详细匹配 →
              </Link>
            </div>

            {/* 今日建议 */}
            <div className={`${styles.card} ${styles.adviceCard}`}>
              <div className="card-header">
                <span className="card-title">今日建议</span>
                <span className="tag tag-warning">
                  {latestAdvice.type === "avoid" ? "忌" : "宜"}
                </span>
              </div>
              <div className={styles.adviceContent}>
                <p className={styles.adviceText}>{latestAdvice.content}</p>
                <p className={styles.adviceReason}>
                  <span className={styles.reasonLabel}>原因：</span>
                  {latestAdvice.reason}
                </p>
              </div>
              <div className={styles.adviceActions}>
                <Link href="/advice" className="btn btn-primary">
                  去执行
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 最近演进 */}
        <section className={styles.evolutionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>最近演进</h2>
            <Link href="/archive" className={styles.sectionLink}>
              查看完整时间线 →
            </Link>
          </div>
          <div className={styles.evolutionTimeline}>
            {evolutionHistory.map((item, index) => (
              <div key={item.version} className={styles.evolutionItem}>
                <div className={styles.evolutionDot}>
                  <span className="version-tag">{item.version}</span>
                </div>
                <div className={styles.evolutionContent}>
                  <div className={styles.evolutionMeta}>
                    <span className={styles.evolutionDate}>{item.date}</span>
                    <span className={styles.evolutionTitle}>{item.title}</span>
                  </div>
                  <p className={styles.evolutionDesc}>{item.description}</p>
                </div>
                {index < evolutionHistory.length - 1 && (
                  <div className={styles.evolutionLine} />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}