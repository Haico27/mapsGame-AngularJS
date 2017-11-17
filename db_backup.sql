-- MySQL dump 10.13  Distrib 5.7.19, for Win64 (x86_64)
--
-- Host: localhost    Database: map_data
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `distancequestions`
--

DROP TABLE IF EXISTS `distancequestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `distancequestions` (
  `id` int(11) NOT NULL,
  `marker_pos_lat` decimal(17,14) DEFAULT NULL,
  `marker_pos_lng` decimal(17,14) DEFAULT NULL,
  `distance` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distancequestions`
--

LOCK TABLES `distancequestions` WRITE;
/*!40000 ALTER TABLE `distancequestions` DISABLE KEYS */;
INSERT INTO `distancequestions` VALUES (5,48.85635757099250,2.35227584838867,100000);
/*!40000 ALTER TABLE `distancequestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimatequestions`
--

DROP TABLE IF EXISTS `estimatequestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estimatequestions` (
  `id` int(11) NOT NULL,
  `answer_lat` decimal(17,14) DEFAULT NULL,
  `answer_lng` decimal(17,14) DEFAULT NULL,
  `max_distance` int(11) DEFAULT NULL,
  `margin` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimatequestions`
--

LOCK TABLES `estimatequestions` WRITE;
/*!40000 ALTER TABLE `estimatequestions` DISABLE KEYS */;
INSERT INTO `estimatequestions` VALUES (4,51.57168183170401,4.76832389831543,50000,0.95);
/*!40000 ALTER TABLE `estimatequestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_data`
--

DROP TABLE IF EXISTS `map_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `map_data` (
  `name` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_data`
--

LOCK TABLES `map_data` WRITE;
/*!40000 ALTER TABLE `map_data` DISABLE KEYS */;
INSERT INTO `map_data` VALUES ('Amsterdam','52.36861221024165','4.8834228515625'),('Schotten','50.494793061901184','9.228515625');
/*!40000 ALTER TABLE `map_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multiplayer`
--

DROP TABLE IF EXISTS `multiplayer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `multiplayer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `player1` varchar(255) DEFAULT NULL,
  `player2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multiplayer`
--

LOCK TABLES `multiplayer` WRITE;
/*!40000 ALTER TABLE `multiplayer` DISABLE KEYS */;
/*!40000 ALTER TABLE `multiplayer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `map_zoom` int(11) DEFAULT NULL,
  `map_pos_lat` decimal(17,14) DEFAULT NULL,
  `map_pos_lng` decimal(17,14) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'What is the capital city of Japan?','Tokyo','exact',100,3,42.06074579169293,11.81469726562502),(2,'In which city were the Olympic Games 2016 being held?','Rio de Janeiro','exact',100,3,42.06074579169293,11.81469726562502),(3,'Where is ITPH located?','Zwolle','exact',100,8,52.25406333661776,6.06060791015627),(4,'Where is Breda located?','Breda','estimate',250,8,52.25406333661776,6.06060791015627),(5,'Place a marker exactly 100 km away from the shown marker.','Parijs','distance',400,8,48.85635757099250,2.35227584838867);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remember`
--

DROP TABLE IF EXISTS `remember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `remember` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `authenticator` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remember`
--

LOCK TABLES `remember` WRITE;
/*!40000 ALTER TABLE `remember` DISABLE KEYS */;
INSERT INTO `remember` VALUES (36,9,9067473),(37,9,4641680),(38,9,6391787),(39,9,1179673),(40,9,8703926),(41,9,486651);
/*!40000 ALTER TABLE `remember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `highscore` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (25,'matthijs','$2a$10$EE6kab6fIwoIT3DyIsLAmupx6N33PhbylHKquzbtloBQLYvRwpUb.','Matthijs','van der Jagt',23,NULL,'849'),(26,'jantje','$2a$10$D.tJBRp2rqEisEmsBjByfOLjdwWDNSWxaSqZoggtCgP6sbnA/YFV2','Jan','Jansen',12,NULL,NULL),(27,'Klaas','$2a$10$jHUO7dojdVvKDyjo3PCJX.37ExyKT2YvgJdlEc07CfcnAhBOvTc4K','Klaas','Klaassen',29,NULL,NULL),(28,'Piet','$2a$10$EfboB.BFt7etFecFtYomkekGJN7MgAOhcK4hETmNBVSwlhQJJWi.a','Piet','Pieters',31,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-08-31 15:36:16
