-- =====================================================================
-- V1 初始 schema：members / member_wallet / spin_history
--
-- 內容來自 SSMS「產生指令碼」匯出的既有資料庫結構，僅移除 USE [slot_game]
-- （資料庫由連線字串決定，migration 內不切換資料庫）。
--
-- 注意：這支檔案跑過之後就不可再修改，Flyway 會比對 checksum。
--       要改結構請新增 V2__xxx.sql。
-- =====================================================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ---------------------------------------------------------------------
-- 資料表
-- ---------------------------------------------------------------------

CREATE TABLE [dbo].[members](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[status] [tinyint] NOT NULL,
	[created_at] [datetime2](0) NOT NULL,
 CONSTRAINT [PK_members] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_members_username] UNIQUE NONCLUSTERED
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[member_wallet](
	[member_id] [int] NOT NULL,
	[balance] [int] NOT NULL,
	[updated_at] [datetime2](0) NOT NULL,
 CONSTRAINT [PK_member_wallet] PRIMARY KEY CLUSTERED
(
	[member_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[spin_history](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[member_id] [int] NOT NULL,
	[bet_amount] [int] NOT NULL,
	[win_amount] [int] NOT NULL,
	[InitialBalance] [int] NOT NULL,
	[finalBalance] [int] NOT NULL,
	[total_multiplier] [int] NOT NULL,
	[created_at] [datetime2](3) NOT NULL,
 CONSTRAINT [PK_spin_history] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- ---------------------------------------------------------------------
-- 預設值
-- ---------------------------------------------------------------------

ALTER TABLE [dbo].[members] ADD  CONSTRAINT [DF_members_status]  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [dbo].[members] ADD  CONSTRAINT [DF_members_created_at]  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[member_wallet] ADD  CONSTRAINT [DF_member_wallet_balance]  DEFAULT ((1000)) FOR [balance]
GO
ALTER TABLE [dbo].[member_wallet] ADD  CONSTRAINT [DF_member_wallet_updated_at]  DEFAULT (sysdatetime()) FOR [updated_at]
GO
ALTER TABLE [dbo].[spin_history] ADD  CONSTRAINT [DF_spin_history_created_at]  DEFAULT (sysdatetime()) FOR [created_at]
GO

-- ---------------------------------------------------------------------
-- 外鍵
-- ---------------------------------------------------------------------

ALTER TABLE [dbo].[member_wallet]  WITH CHECK ADD  CONSTRAINT [FK_member_wallet_members] FOREIGN KEY([member_id])
REFERENCES [dbo].[members] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[member_wallet] CHECK CONSTRAINT [FK_member_wallet_members]
GO

ALTER TABLE [dbo].[spin_history]  WITH CHECK ADD  CONSTRAINT [FK_spin_history_members] FOREIGN KEY([member_id])
REFERENCES [dbo].[members] ([id])
GO
ALTER TABLE [dbo].[spin_history] CHECK CONSTRAINT [FK_spin_history_members]
GO

-- ---------------------------------------------------------------------
-- 檢查約束
-- ---------------------------------------------------------------------

ALTER TABLE [dbo].[members]  WITH CHECK ADD  CONSTRAINT [CK_members_status] CHECK  (([status]=(1) OR [status]=(0)))
GO
ALTER TABLE [dbo].[members] CHECK CONSTRAINT [CK_members_status]
GO

ALTER TABLE [dbo].[member_wallet]  WITH CHECK ADD  CONSTRAINT [CK_member_wallet_balance] CHECK  (([balance]>=(0)))
GO
ALTER TABLE [dbo].[member_wallet] CHECK CONSTRAINT [CK_member_wallet_balance]
GO

ALTER TABLE [dbo].[spin_history]  WITH CHECK ADD  CONSTRAINT [CK_spin_history_bet_amount] CHECK  (([bet_amount]>(0) AND [bet_amount]<=(500)))
GO
ALTER TABLE [dbo].[spin_history] CHECK CONSTRAINT [CK_spin_history_bet_amount]
GO

ALTER TABLE [dbo].[spin_history]  WITH CHECK ADD  CONSTRAINT [CK_spin_history_win_amount] CHECK  (([win_amount]>=(0)))
GO
ALTER TABLE [dbo].[spin_history] CHECK CONSTRAINT [CK_spin_history_win_amount]
GO
