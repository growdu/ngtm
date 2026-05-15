"use client";

import { AppShell } from "../components/Navigation";
import { evolutionHistory, matchResults, profileV4 } from "../data/mockData";
import styles from "./archive.module.css";

export default function ArchivePage() {
  const figureHistory = ["王安石", "韩非", "曹操", "曹操"];

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>你的成长档案</h1>
            <p className={styles.subtitle}>
              记录你的画像演进历程，追踪命运变化轨迹
            </p>
          </div>

          <div className={styles.content}>
            {/* 左侧时间线 */}
            <div className={styles.mainSection}>
              {/* 时间线 */}
              <div className={`${styles.card} ${styles.timelineCard}`}>
                <div className="card-header">
                  <span className="card-title">版本时间线</span>
                </div>
                <div className={styles.timeline}>
                  {evolutionHistory.map((item, index) => (
                    <div key={item.version} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <span className="version-tag">{item.version}</span>
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineMeta}>
                          <span className={styles.timelineDate}>{item.date}</span>
                          <span className={styles.timelineTitle}>{item.title}</span>
                        </div>
                        <p className={styles.timelineDesc}>{item.description}</p>
                      </div>
                      {index < evolutionHistory.length - 1 && (
                        <div className={styles.timelineLine} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 历史人物轨迹 */}
              <div className={`${styles.card} ${styles.figuresCard}`}>
                <div className="card-header">
                  <span className="card-title">历史人物轨迹</span>
                </div>
                <div className={styles.figureTrail}>
                  {figureHistory.map((name, index) => (
                    <div key={index} className={styles.figureItem}>
                      <div className={styles.figureAvatar}>
                        <span>{name[0]}</span>
                      </div>
                      <span className={styles.figureName}>{name}</span>
                      <span className={styles.figureVersion}>V{index + 1}</span>
                      {index < figureHistory.length - 1 && (
                        <div className={styles.figureArrow}>→</div>
                      )}
                    </div>
                  ))}
                </div>
                <p className={styles.figureNote}>
                  从王安石到曹操，系统逐步识别出你的高权力驱动特征
                </p>
              </div>

              {/* 画像版本列表 */}
              <div className={`${styles.card} ${styles.versionsCard}`}>
                <div className="card-header">
                  <span className="card-title">画像版本列表</span>
                </div>
                <div className={styles.versionsList}>
                  {[4, 3, 2, 1].map((version) => (
                    <div key={version} className={styles.versionItem}>
                      <div className={styles.versionHeader}>
                        <span className="version-tag">{version}</span>
                        <span className={styles.versionLabel}>版本</span>
                        {version === 4 && (
                          <span className="tag tag-success">当前</span>
                        )}
                      </div>
                      <div className={styles.versionStats}>
                        <div className={styles.versionStat}>
                          <span className={styles.statLabel}>综合评分</span>
                          <span className={styles.statValue}>
                            {version === 4
                              ? profileV4.summary.overallScore
                              : version === 3
                                ? 73
                                : version === 2
                                  ? 67
                                  : 61}
                          </span>
                        </div>
                        <div className={styles.versionStat}>
                          <span className={styles.statLabel}>关键词</span>
                          <span className={styles.statValue}>
                            {version === 4
                              ? profileV4.summary.keywords.slice(0, 2).join(" / ")
                              : version === 3
                                ? "强控制感 / 理性"
                                : version === 2
                                  ? "理性控制 / 事业"
                                  : "行动力强 / 理性"}
                          </span>
                        </div>
                      </div>
                      {version === 4 && (
                        <div className={styles.versionNote}>
                          最新版本，画像最为完善
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧辅助 */}
            <div className={styles.sidebar}>
              {/* 导出功能 */}
              <div className={`${styles.card} ${styles.exportCard}`}>
                <h3 className={styles.exportTitle}>导出与分享</h3>
                <p className={styles.exportText}>
                  将你的成长档案导出为 PDF 或生成分享海报
                </p>
                <div className={styles.exportActions}>
                  <button className={styles.exportBtn}>
                    <span className={styles.exportIcon}>📄</span>
                    导出 PDF
                  </button>
                  <button className={styles.exportBtn}>
                    <span className={styles.exportIcon}>🖼</span>
                    生成分享海报
                  </button>
                </div>
              </div>

              {/* 统计 */}
              <div className={`${styles.card} ${styles.statsCard}`}>
                <h3 className={styles.statsTitle}>档案统计</h3>
                <div className={styles.statsList}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>4</span>
                    <span className={styles.statName}>画像版本</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>27</span>
                    <span className={styles.statName}>天使用</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>12</span>
                    <span className={styles.statName}>问答完成</span>
                  </div>
                </div>
              </div>

              {/* 说明 */}
              <div className={`${styles.card} ${styles.infoCard}`}>
                <h3 className={styles.infoTitle}>成长档案说明</h3>
                <p className={styles.infoText}>
                  你的每一版画像都会被完整保存，系统持续追踪你的性格、能力、关系模式的演变轨迹。
                </p>
                <p className={styles.infoText}>
                  通过回顾历史版本，你可以清晰地看到「系统是如何逐步认识你的」。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}