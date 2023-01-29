USE [xdealfinderdb]
GO
/****** Object:  Table [dbo].[EntityStatus]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityStatus](
	[EntityStatusId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_354e75a169a6712ef14c1725ab1] PRIMARY KEY CLUSTERED 
(
	[EntityStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Files]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Files](
	[FileId] [bigint] IDENTITY(1,1) NOT NULL,
	[OriginalFileName] [nvarchar](max) NOT NULL,
	[FileName] [nvarchar](max) NOT NULL,
	[Url] [varchar](max) NULL,
 CONSTRAINT [PK_Files] PRIMARY KEY CLUSTERED 
(
	[FileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gender]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gender](
	[GenderId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_1673678cb8f182c0d0201d23f16] PRIMARY KEY CLUSTERED 
(
	[GenderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Offers]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Offers](
	[OfferId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[Description] [nvarchar](255) NOT NULL,
	[Due] [date] NOT NULL,
	[StoreId] [bigint] NOT NULL,
	[OfferTypeId] [bigint] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_e6f904e9e6517d0ff43132ffe1d] PRIMARY KEY CLUSTERED 
(
	[OfferId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OfferTypes]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OfferTypes](
	[OfferTypeId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_6c32fdc5371fdb48a94efb52c64] PRIMARY KEY CLUSTERED 
(
	[OfferTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StoreDocuments]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StoreDocuments](
	[StoreDocumentId] [bigint] IDENTITY(1,1) NOT NULL,
	[StoreId] [bigint] NOT NULL,
	[FileId] [bigint] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_StoreDocuments] PRIMARY KEY CLUSTERED 
(
	[StoreDocumentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StoreReviews]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StoreReviews](
	[UserId] [bigint] NOT NULL,
	[StoreId] [bigint] NOT NULL,
	[Rate] [bigint] NOT NULL,
 CONSTRAINT [PK_StoreReviews] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Stores]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Stores](
	[StoreId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[ThumbnailFileId] [bigint] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[Reviews] [bigint] NOT NULL,
	[IsApproved] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_d23f306e16cd758dcaaf08d8e53] PRIMARY KEY CLUSTERED 
(
	[StoreId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [bigint] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](250) NOT NULL,
	[MiddleName] [nvarchar](250) NULL,
	[LastName] [nvarchar](250) NOT NULL,
	[Age] [smallint] NULL,
	[BirthDate] [date] NULL,
	[Address] [nvarchar](255) NOT NULL,
	[MobileNumber] [nvarchar](255) NOT NULL,
	[Username] [nvarchar](250) NOT NULL,
	[Password] [nvarchar](250) NOT NULL,
	[IsLock] [bit] NOT NULL,
	[IsAdminUserType] [bit] NOT NULL,
	[IsAdminApproved] [bit] NOT NULL,
	[GenderId] [bigint] NOT NULL,
	[ProfilePictureFileId] [bigint] NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_aedbd821ea6272148b6a8f18ae6] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[EntityStatus] ([EntityStatusId], [Name]) VALUES (1, N'Active')
GO
INSERT [dbo].[EntityStatus] ([EntityStatusId], [Name]) VALUES (2, N'Deleted')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (1, N'Male')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (2, N'Female')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (3, N'Rather not say')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (1, N'Foods')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (2, N'Grocery')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (3, N'Apparel')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (4, N'Shoes')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (5, N'Bags')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (6, N'Health & Personal Care')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (7, N'Accessories')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (8, N'Home Appliances')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (9, N'Travel Toys, Games & Collectibles')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (10, N'Laptops & Computers')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (11, N'Mobiles & Gadgets')
GO
INSERT [dbo].[OfferTypes] ([OfferTypeId], [Name]) VALUES (12, N'Mobiles Accessories')
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([UserId], [FirstName], [MiddleName], [LastName], [Age], [BirthDate], [Address], [MobileNumber], [Username], [Password], [IsLock], [IsAdminUserType], [IsAdminApproved], [GenderId], [ProfilePictureFileId], [EntityStatusId]) VALUES (1, N'Admin', NULL, N'Admin', 0, CAST(N'2023-01-08' AS Date), N'CEBU', N'09950431207', N'admin', N'$2b$10$w7PH40/7VoYH5IXVaTbI3udi.QMLSf65GyFGA.cwdUnFAQa82srQ6', 0, 1, 0, 1, NULL, 1)
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[Offers] ADD  CONSTRAINT [DF_Offers_StoreId]  DEFAULT ((0)) FOR [StoreId]
GO
ALTER TABLE [dbo].[Offers] ADD  CONSTRAINT [DF_Offers_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[StoreDocuments] ADD  CONSTRAINT [DF_StoreDocuments_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[StoreReviews] ADD  CONSTRAINT [DF_StoreReviews_Rate]  DEFAULT ((0)) FOR [Rate]
GO
ALTER TABLE [dbo].[Stores] ADD  CONSTRAINT [DF_Stores_Reviews]  DEFAULT ((0)) FOR [Reviews]
GO
ALTER TABLE [dbo].[Stores] ADD  CONSTRAINT [DF_Stores_IsApproved]  DEFAULT ((0)) FOR [IsApproved]
GO
ALTER TABLE [dbo].[Stores] ADD  CONSTRAINT [DF_Stores_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_481b0282d1e0bb2a0842df770b7]  DEFAULT ((1)) FOR [IsLock]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_f8df923887687837714d4ce9771]  DEFAULT ((0)) FOR [IsAdminUserType]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_5da51d7d31d64663b508b47701b]  DEFAULT ((0)) FOR [IsAdminApproved]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[Offers]  WITH CHECK ADD  CONSTRAINT [FK_Offers_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Offers] CHECK CONSTRAINT [FK_Offers_EntityStatus]
GO
ALTER TABLE [dbo].[Offers]  WITH CHECK ADD  CONSTRAINT [FK_Offers_OfferTypes] FOREIGN KEY([OfferTypeId])
REFERENCES [dbo].[OfferTypes] ([OfferTypeId])
GO
ALTER TABLE [dbo].[Offers] CHECK CONSTRAINT [FK_Offers_OfferTypes]
GO
ALTER TABLE [dbo].[Offers]  WITH CHECK ADD  CONSTRAINT [FK_Offers_Stores] FOREIGN KEY([StoreId])
REFERENCES [dbo].[Stores] ([StoreId])
GO
ALTER TABLE [dbo].[Offers] CHECK CONSTRAINT [FK_Offers_Stores]
GO
ALTER TABLE [dbo].[StoreDocuments]  WITH CHECK ADD  CONSTRAINT [FK_StoreDocuments_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[StoreDocuments] CHECK CONSTRAINT [FK_StoreDocuments_EntityStatus]
GO
ALTER TABLE [dbo].[StoreDocuments]  WITH CHECK ADD  CONSTRAINT [FK_StoreDocuments_Files] FOREIGN KEY([FileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[StoreDocuments] CHECK CONSTRAINT [FK_StoreDocuments_Files]
GO
ALTER TABLE [dbo].[StoreDocuments]  WITH CHECK ADD  CONSTRAINT [FK_StoreDocuments_Stores] FOREIGN KEY([StoreId])
REFERENCES [dbo].[Stores] ([StoreId])
GO
ALTER TABLE [dbo].[StoreDocuments] CHECK CONSTRAINT [FK_StoreDocuments_Stores]
GO
ALTER TABLE [dbo].[StoreReviews]  WITH CHECK ADD  CONSTRAINT [FK_StoreReviews_Stores] FOREIGN KEY([StoreId])
REFERENCES [dbo].[Stores] ([StoreId])
GO
ALTER TABLE [dbo].[StoreReviews] CHECK CONSTRAINT [FK_StoreReviews_Stores]
GO
ALTER TABLE [dbo].[StoreReviews]  WITH CHECK ADD  CONSTRAINT [FK_StoreReviews_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[StoreReviews] CHECK CONSTRAINT [FK_StoreReviews_Users]
GO
ALTER TABLE [dbo].[Stores]  WITH CHECK ADD  CONSTRAINT [FK_Stores_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Stores] CHECK CONSTRAINT [FK_Stores_EntityStatus]
GO
ALTER TABLE [dbo].[Stores]  WITH CHECK ADD  CONSTRAINT [FK_Stores_Files] FOREIGN KEY([ThumbnailFileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[Stores] CHECK CONSTRAINT [FK_Stores_Files]
GO
ALTER TABLE [dbo].[Stores]  WITH CHECK ADD  CONSTRAINT [FK_Stores_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Stores] CHECK CONSTRAINT [FK_Stores_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_4f0d9f391bd6cc5b4b29dceda10] FOREIGN KEY([GenderId])
REFERENCES [dbo].[Gender] ([GenderId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_4f0d9f391bd6cc5b4b29dceda10]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_c1c7a4a1e829bdcef1b65637324] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_c1c7a4a1e829bdcef1b65637324]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Files] FOREIGN KEY([ProfilePictureFileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Files]
GO
/****** Object:  StoredProcedure [dbo].[usp_Reset]    Script Date: 1/17/2023 8:09:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ====================================================================
-- Created date: Sept 25, 2020
-- Author: 
-- ====================================================================
CREATE PROCEDURE [dbo].[usp_Reset]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
		SET NOCOUNT ON;
		
		
		DELETE FROM [dbo].[StoreReviews];
		DELETE FROM [dbo].[StoreDocuments];
		DBCC CHECKIDENT ('StoreDocuments', RESEED, 0)
		DELETE FROM [dbo].[Offers];
		DBCC CHECKIDENT ('Offers', RESEED, 0)
		DELETE FROM [dbo].[Stores];
		DBCC CHECKIDENT ('Stores', RESEED, 0)
		DELETE FROM [dbo].[Users];
		DBCC CHECKIDENT ('Users', RESEED, 0)
		DELETE FROM [dbo].[Files];
		DBCC CHECKIDENT ('Files', RESEED, 0)
		
		SET IDENTITY_INSERT [dbo].[Users] ON 
		INSERT [dbo].[Users] ([UserId], [FirstName], [MiddleName], [LastName], [BirthDate], [Address], [Age], [MobileNumber], [Username], [Password], [IsLock], [IsAdminUserType], [IsAdminApproved], [GenderId], [EntityStatusId]) VALUES (1, N'Admin', NULL, N'Admin', CAST(N'2023-01-08' AS Date), N'CEBU', 0,  N'09950431207',  N'admin', N'$2b$10$w7PH40/7VoYH5IXVaTbI3udi.QMLSf65GyFGA.cwdUnFAQa82srQ6', 0, 1, 0, 1, 1)
		SET IDENTITY_INSERT [dbo].[Users] OFF

    END TRY
    BEGIN CATCH

        SELECT
            'Error'           AS Status,
            ERROR_NUMBER()    AS ErrorNumber,
            ERROR_SEVERITY()  AS ErrorSeverity,
            ERROR_STATE()     AS ErrorState,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE()      AS ErrorLine,
            ERROR_MESSAGE()   AS ErrorMessage;

    END CATCH

END
GO
