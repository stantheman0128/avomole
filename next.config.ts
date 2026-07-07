import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 是原生模組（.node 二進位），不能被 server bundler 打包，
  // 列進 serverExternalPackages 讓它在 runtime 用 require 載入（本機 build 與 Zeabur 皆需）。
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
