-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: authapp
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table [__efmigrationshistory[
--

DROP TABLE IF EXISTS [__efmigrationshistory];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [__efmigrationshistory] (
  [MigrationId] nvarchar(150) NOT NULL,
  [ProductVersion] nvarchar(32)  NOT NULL,
  PRIMARY KEY ([MigrationId])
); /*ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;*/
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table ]__efmigrationshistory]
--

/*LOCK TABLES [__efmigrationshistory] WRITE;*/
/*!40000 ALTER TABLE ]__efmigrationshistory] DISABLE KEYS */;
INSERT INTO [__efmigrationshistory´] VALUES ('20241103105413_InitialCreate','8.0.10'),('20241110163710_CreateBackgroundImagesTable','8.0.10');

/*!40000 ALTER TABLE [__efmigrationshistory] ENABLE KEYS ;
UNLOCK TABLES;*/

--
-- Table structure for table [backgroundimages]
--

DROP TABLE IF EXISTS [backgroundimages];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [backgroundimages] (
  [Id] int NOT NULL IDENTITY(6,1) PRIMARY KEY,
  [BackgroundType] longtext  NOT NULL,
  [ImagePath] longtext  NOT NULL,
  [UpdatedAt] datetime(6) NOT NULL 
) ;
--ENGINE=InnoDB IDENTITY(1,1)=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;*/
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table ]backgroundimages]
--

--LOCK TABLES [backgroundimages] WRITE;
/*!40000 ALTER TABLE ]backgroundimages] DISABLE KEYS */;
INSERT INTO [backgroundimages] VALUES (1,'background1','/img-bgd/background1.png','2024-12-25 15:38:05.346027'),(2,'background2','/img-bgd/background2.jpg','2024-12-25 15:38:33.624043'),(3,'background3','/img-bgd/background3.jpg','2024-12-25 15:39:00.925043'),(4,'background4','/img-bgd/background4.jpg','2024-12-25 15:39:13.094144'),(5,'background5','/img-bgd/background5.jpg','2024-12-25 15:39:37.767424');
/*!40000 ALTER TABLE [backgroundimages] ENABLE KEYS */;
--UNLOCK TABLES;

--
-- Table structure for table ]bookings]
--

DROP TABLE IF EXISTS [bookings];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [bookings] (
  [Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [StartTime] datetime NOT NULL,
  [EndTime] datetime NOT NULL,
  [Price] decimal(10,2) NOT NULL,
  [UserId] int NOT NULL,
  CONSTRAINT [FK_Booking_User] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id])
); --ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table [bookings]
--

--LOCK TABLES [bookings] WRITE;
/*!40000 ALTER TABLE [bookings] DISABLE KEYS */;
/*!40000 ALTER TABLE [bookings] ENABLE KEYS */;
--UNLOCK TABLES;

--
-- Table structure for table [members]
--

DROP TABLE IF EXISTS [members];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [members] (
  [MemberId] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [Name] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Description] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [BusinessUrl] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [ProfilePictureUrl] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
); --ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table [members]
--

--LOCK TABLES [members] WRITE;
/*!40000 ALTER TABLE [members] DISABLE KEYS */;
/*!40000 ALTER TABLE [members] ENABLE KEYS */;
--UNLOCK TABLES;

--
-- Table structure for table [prices]
--

DROP TABLE IF EXISTS [prices];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [prices] (
  [Id] int NOT NULL IDENTITY(6, 1) PRIMARY KEY,
  [Location] nvarchar(100) COLLATE utf8mb3_general_ci NOT NULL,
  [Amount] decimal(18,2) NOT NULL,
  [Date] datetime NOT NULL,
); --ENGINE=InnoDB IDENTITY(1,1)=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table [prices]
--

--LOCK TABLES [prices] WRITE;
/*!40000 ALTER TABLE [prices] DISABLE KEYS */;
INSERT INTO [prices] VALUES (1,'Fast kontorsplats',4050.00,'2024-12-11 16:50:59'),(2,'Flex kontorsplats',1800.00,'2024-12-11 16:51:00'),(3,'Mötes Heldag',3000.00,'2024-12-11 16:52:00'),(4,'Mötes Halvdag',1800.00,'2024-12-11 16:53:00'),(5,'Mötes Helgdag',4000.00,'2024-12-11 16:54:00');
/*!40000 ALTER TABLE [prices] ENABLE KEYS */;
--UNLOCK TABLES;

--
-- Table structure for table [rooms]
--

DROP TABLE IF EXISTS [rooms];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [rooms] (
  [Id] int NOT NULL Identity(1,1),
  [Title] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Price] decimal(65,30) NOT NULL,
  [Description] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Availability] tinyint(1) NOT NULL,
  PRIMARY KEY ([Id])
); --ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table [rooms]
--

--LOCK TABLES [rooms] WRITE;
/*!40000 ALTER TABLE [rooms] DISABLE KEYS */;
/*!40000 ALTER TABLE [rooms] ENABLE KEYS */;
--UNLOCK TABLES;

--
-- Table structure for table [users]
--

DROP TABLE IF EXISTS [users];
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE [users] (
  [Id] int NOT NULL IDENTITY(1,1),
  [Username] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Password] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Role] NVARCHAR(MAX) COLLATE utf8mb4_0900_ai_ci,
  [Name] nvarchar(255) DEFAULT NULL,
  [PictureUrl] nvarchar(255) DEFAULT NULL,
  [Email] nvarchar(255) DEFAULT NULL,
  [WebUrl] nvarchar(255) DEFAULT NULL,
  [Description] text,
  [RegistrationDate] timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  [UpdatedDate] timestamp NULL DEFAULT GETDATE(),
  PRIMARY KEY ([Id])
); --ENGINE=InnoDB IDENTITY(1,1)=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Create a trigger to update the UpdatedDate column on row updates
/*CREATE TRIGGER trg_UpdateTimestamp
ON [users]
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE [users]
  SET UpdatedDate = GETDATE()
  WHERE ID IN (SELECT DISTINCT ID FROM Inserted);
END;*/

--
-- Dumping data for table [users]
--

--LOCK TABLES [users] WRITE;
/*!40000 ALTER TABLE [users] DISABLE KEYS */;
INSERT INTO [users] VALUES (30,'emadmin','$2a$11$xE0DU7x/okowAuigaYatje5TvJeFQIE07fn9VqCCjEj3nKXOBdMLi','admin','','https://localhost:7177/img-prfl\\emadmin.png','','','','2024-11-27 15:55:33','2024-12-16 08:43:28'),(41,'adminAsa','$2a$11$4vYx9RWJftEFI.Eg3XRcROsPHuzHu8KntkW6RTO4XMrt4wKC4H.iy','admin','Åsa Andreasson','https://localhost:7177/img-prfl\\adminAsa.png','','https://www.kreativakvadrat.com/','Kreativa Kvadrat','2024-12-11 09:30:23','2025-01-28 13:09:17'),(42,'adminTinna','$2a$11$tUgJIfFqZ/XaQLm.kBLMueS35QtiLg8z1chtQg1UDyeZmdQm79o96','admin','Tinna Ahlander','https://localhost:7177/img-prfl\\adminTinna.png','','https://tinnadesign.se/','Tinna design','2024-12-11 09:32:40','2025-01-28 13:08:49'),(43,'bill','$2a$11$8OKxJr968RV/EFPe9Qmw.uYlLU6BpLW4Om.VujaCPxG6.bGiXlM6S','user','Bill Friman','','','https://www.gulddeal.se/','Gulddeal','2024-12-11 12:01:30','2025-01-28 13:09:57'),(44,'anna','$2a$11$3/7pfE8mts9SRn27IbPkOO4RidkcRVT8CnUn1OP1Q/qpi99wyyGYC','user','Anna Vestman','https://localhost:7177/img-prfl\\anna.png','','https://hundrasvart.se/','Hundrasvart','2024-12-11 13:27:35','2025-01-28 13:10:02'),(45,'klas','$2a$11$o2qKlimiOaYU1Rm10vP97e7MLwsCTVsojw/hlo3SWWfH.SzPMmxn2','user','Klas Åkerskog','https://localhost:7177/img-prfl\\klas.png','','https://swcg.com/','Swedish Consulting group','2024-12-11 13:28:08','2025-01-28 13:12:29'),(46,'maddehollender','$2a$11$f4DDMYUZqLfJM6NR2Z8YC.bMSczy4cVBahwAeyjljBwwQloHRxRZ2','user','Madeleine Hollender','https://localhost:7177/img-prfl\\maddehollender.png','','https://maddehollender.se','Madde Hollender design','2025-01-28 13:07:22','2025-01-28 13:10:14'),(47,'lovisalaurits','$2a$11$dpChFCycOhC9Pk990/1xb.TW57LP.6MPqDs8s4pOBJksANArGbZny','user','Lovisa Laurits','','','https://www.lovisalaurits.se','Lovisa Laurits','2025-01-28 13:11:30','2025-01-28 13:11:30');
/*!40000 ALTER TABLE ]users] ENABLE KEYS */;
--UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-28 19:08:46
