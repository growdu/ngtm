"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/onboarding", label: "建档" },
  { path: "/analysis", label: "初始分析" },
  { path: "/questionnaire", label: "持续问答" },
  { path: "/profile", label: "动态画像" },
  { path: "/match", label: "历史人物" },
  { path: "/advice", label: "改命建议" },
  { path: "/archive", label: "成长档案" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
          <span className={styles.logoIcon}>☯</span>
          <span className={styles.logoText}>逆天改命</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${
                pathname === item.path ? styles.active : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.versionBadge}>V4</span>
          <div className={styles.avatar}>
            <span>张</span>
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="菜单"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ""}`} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.appShell}>
      <Navigation />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>逆天改命算命软件 · 原型演示</span>
          <span className={styles.footerDivider}>|</span>
          <span>持续交互演进画像系统</span>
        </div>
      </footer>
    </div>
  );
}
