"use client";

import { useState } from "react";
import { AppShell } from "../components/Navigation";
import styles from "./onboarding.module.css";

const steps = [
  { id: 1, label: "基础信息" },
  { id: 2, label: "上传照片" },
  { id: 3, label: "初始分析" },
  { id: 4, label: "校准问答" },
  { id: 5, label: "完成" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    timeUncertain: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    alert("建档信息已保存！");
  };

  const impactedItems = [
    "八字命盘计算",
    "初版性格推断",
    "待补充问题列表",
    "命运走势初步判断",
  ];

  return (
    <AppShell>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* 进度指示器 */}
          <div className={styles.progressSection}>
            <div className={styles.stepper}>
              {steps.map((step, index) => (
                <div key={step.id} className={styles.stepItem}>
                  <div
                    className={`${styles.stepDot} ${
                      currentStep >= step.id ? styles.active : ""
                    } ${currentStep === step.id ? styles.current : ""}`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`${styles.stepLabel} ${
                      currentStep >= step.id ? styles.active : ""
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`${styles.stepLine} ${
                        currentStep > step.id ? styles.active : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 主内容区 */}
          <div className={styles.content}>
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                <h1 className={styles.title}>第一步：建立你的命理底盘</h1>
                <p className={styles.subtitle}>
                  这些信息用于生成第一版命盘，不会直接决定最终画像
                </p>
              </div>

              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="请输入姓名"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>性别</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">请选择</option>
                    <option value="M">男</option>
                    <option value="F">女</option>
                  </select>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>出生日期</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>出生时辰</label>
                    <div className={styles.timeInput}>
                      <select
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="">请选择</option>
                        <option value="00:00">子时 (23:00-01:00)</option>
                        <option value="01:00">丑时 (01:00-03:00)</option>
                        <option value="02:00">寅时 (03:00-05:00)</option>
                        <option value="03:00">卯时 (05:00-07:00)</option>
                        <option value="04:00">辰时 (07:00-09:00)</option>
                        <option value="05:00">巳时 (09:00-11:00)</option>
                        <option value="06:00">午时 (11:00-13:00)</option>
                        <option value="07:00">未时 (13:00-15:00)</option>
                        <option value="08:00">申时 (15:00-17:00)</option>
                        <option value="09:00">酉时 (17:00-19:00)</option>
                        <option value="10:00">戌时 (19:00-21:00)</option>
                        <option value="11:00">亥时 (21:00-23:00)</option>
                      </select>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.timeUncertain}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              timeUncertain: e.target.checked,
                            }))
                          }
                        />
                        时辰不确定
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>出生地</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="如：浙江省杭州市"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* 时辰不确定提示 */}
              {formData.timeUncertain && (
                <div className={styles.notice}>
                  <span className={styles.noticeIcon}>⚠</span>
                  <p>
                    系统将生成多个候选命盘，后续通过问答校准确定准确时辰。
                  </p>
                </div>
              )}

              {/* 本轮提交后更新内容 */}
              <div className={styles.impactSection}>
                <h3 className={styles.impactTitle}>
                  本轮提交后将更新：
                </h3>
                <ul className={styles.impactList}>
                  {impactedItems.map((item, index) => (
                    <li key={index} className={styles.impactItem}>
                      <span className={styles.impactDot} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-secondary">保存草稿</button>
                <button
                  className="btn btn-primary"
                  onClick={currentStep < 5 ? handleNext : handleSubmit}
                >
                  {currentStep < 5 ? "下一步" : "完成建档"}
                </button>
              </div>
            </div>

            {/* 右侧辅助信息 */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>建档进度</h3>
                <div className={styles.progressInfo}>
                  <div className={styles.progressStat}>
                    <span className={styles.progressValue}>1</span>
                    <span className={styles.progressLabel}>/ 5 步</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>预计耗时</h3>
                <p className={styles.sidebarText}>约 5 分钟完成基本信息录入</p>
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>隐私说明</h3>
                <p className={styles.sidebarText}>
                  你的信息仅用于命理分析，不会共享给第三方。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}