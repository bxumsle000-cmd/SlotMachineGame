-- =====================================================================
-- V2 密碼改存 BCrypt 雜湊
--
-- 原本 members.password 是 nvarchar(50) 存明文，直接用
--   WHERE username = ? AND password = ?
-- 比對。改用 BCrypt 之後，同一組密碼每次雜湊結果都不同（salt 隨機），
-- 所以 SQL 不能再拿密碼當查詢條件，比對改在 Java 端用
--   passwordEncoder.matches(明文, 雜湊)
-- 進行（見 LoginService）。
--
-- 欄位長度：BCrypt 輸出固定 60 字元，例如
--   $2a$10$3rzrkOeeO2iPkuUqkBSj6exeYlatUBNEX25YNSpZk0lZ8CxXjVVJG
-- 開到 100 是預留餘裕：若將來改用 DelegatingPasswordEncoder
-- （雜湊前面會多一個 {bcrypt} 前綴，變成 68 字元）或換更長的演算法，
-- 不必再動 schema。
--
-- 注意：既有的明文密碼不會自動轉換，舊帳號在此之後將無法登入。
--       開發階段請用 docker compose down -v 清掉資料重新註冊。
-- =====================================================================

ALTER TABLE [dbo].[members] ALTER COLUMN [password] NVARCHAR(100) NOT NULL
GO
