"use client";

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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>☯</span>
          <span className={styles.logoText}>逆天改命</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${
                pathname === item.path ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.userInfo}>
          <span className={styles.versionBadge}>V4</span>
          <div className={styles.avatar}>
            <span>张</span>
          </div>
        </div>
      </div>
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