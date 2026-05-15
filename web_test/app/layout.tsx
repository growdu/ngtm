import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "逆天改命 - 原型演示",
  description: "持续交互演进的命理画像系统 Web 原型",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}