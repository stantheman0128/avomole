# v2 後端基礎線：Postgres + Prisma + Auth.js v5

需求來源：docs/SPEC-v2.md §3/§4/§5/§9/§10；plan Phase 0B + Wave B1。
檔案邊界：只碰 prisma/**、lib/prisma.ts、lib/db.ts、lib/auth.ts、scripts/seed.ts、
app/login/**、app/signup/**、app/dashboard/page.tsx、app/api/auth/**、components/Nav.tsx、
app/layout.tsx(只加 SessionProvider)、package.json、.env.example、.env(只補 AUTH_SECRET)。
必要時在 app/tutors、app/match、app/discover、app/api/chat 只加 await（不動 JSX）。

## 步驟
- [ ] 1. 裝依賴（prisma @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs @types/bcryptjs）
- [ ] 2. prisma/schema.prisma（User+Role+Account/Session/VerificationToken+TutorProfile+Review+Endorsement）
- [ ] 3. lib/prisma.ts（singleton）
- [ ] 4. lib/db.ts 用 Prisma 重寫（簽名不變，改 async，getTutors 只回 published）
- [ ] 5. 更新呼叫端加 await（tutors/match/discover pages、api/chat）＋ db.test.ts
- [ ] 6. scripts/seed.ts 改 upsert 9 位講師進 Postgres
- [ ] 7. npx prisma db push + npm run seed（對真 DB）
- [ ] 8. lib/auth.ts（Credentials+Google、Prisma adapter、jwt、role callbacks）＋ route handler
- [ ] 9. .env.example ＋ 本機 .env 補 AUTH_SECRET（不 commit）
- [ ] 10. app/layout.tsx 掛 SessionProvider
- [ ] 11. 真 /login + /signup（server actions、錯誤態、loading、角色分流）
- [ ] 12. Nav 顯示登入狀態
- [ ] 13. 驗證：tsc --noEmit（自己範圍）＋ 本機 3101 測註冊/登入

## Review
- 依賴：Prisma 從 v7 退到 v6.19.3（v7 需 prisma-client generator+driver adapter+自訂 output，對 demo 太重）。
- lib/db 全改 async，呼叫端加 await：tutors/page、tutors/[slug]/page、match/page、api/chat/route。
  discover/page 被設計線改成不讀 db（已無 await 需求）。db.test.ts 改寫（toPublic 純測 + DB 整合測 skipIf 無 DB）。
- Auth.js v5：Credentials(bcrypt)+Google(無 key 自動略過)、Prisma adapter、session=jwt、role 進 jwt/session。
  HTTP 驗證：/login /signup 200、/api/auth/providers 只列 credentials、/api/auth/session=null、/dashboard→307→/login。
- schema 為 frozen 型別多加 TutorProfile.name/nameEn/seq（seq=對外數字 id）。
- 阻塞：.env 的 DATABASE_URL 是未展開的 ${POSTGRES_*} Zeabur 佔位 → 本機連不到 DB → db push/seed 未能執行。
  Zeabur Postgres 服務(6a4d1e2b1a139de1d5cee1ac)沒開 public endpoint，變數全是內部 reference。需 Stan 提供可連的 DATABASE_URL。
- tsc --noEmit 綠、vitest 綠（2 DB 測 skip）。未 commit。
