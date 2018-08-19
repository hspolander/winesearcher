USE winereview;
CREATE TABLE `wine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` year(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `country` varchar(50) NOT NULL,
  `color` varchar(15) NOT NULL,
  `producer` varchar(50) NOT NULL,
  `boughtfrom` varchar(50) NOT NULL,
  `price` varchar(10) NOT NULL,
  `glass` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(999) NOT NULL,
  `score` int(11) NOT NULL,
  `reviewer` varchar(50) NOT NULL,
  `fk_wine_id` int(11) NOT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_review_wine_id` (`fk_wine_id`),
  CONSTRAINT `FK_review_wine_id` FOREIGN KEY (`fk_wine_id`) REFERENCES `wine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `grapes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grape` varchar(100) NOT NULL,
  `fk_wine_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_grape_wine_id` (`fk_wine_id`),
  CONSTRAINT `FK_grape_wine_id` FOREIGN KEY (`fk_wine_id`) REFERENCES `wine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `hash` varchar(1000) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `uuid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) NOT NULL,
  `uuid` varchar(1000) NOT NULL,
  `ttl` bigint(15) NOT NULL,
  `ttl_max` bigint(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_token_user_id` (`fk_user_id`),
  CONSTRAINT `FK_token_user_id` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `systembolaget_sortiment` (
  `nr` int(20),
  `Artikelid` int(20),
  `Varnummer` int(20),
  `Namn` varchar(100),
  `Namn2` varchar(100),
  `Prisinklmoms` varchar(20),
  `Volymiml` varchar(20),
  `PrisPerLiter` varchar(20),
  `Saljstart` varchar(50),
  `Utgått` tinyint(1),
  `Varugrupp` varchar(100),
  `Typ` varchar(100),
  `Stil` varchar(100),
  `Forpackning` varchar(100),
  `Forslutning` varchar(100),
  `Ursprunglandnamn` varchar(100),
  `Leverantor` varchar(100),
  `Argang` varchar(15),
  `Provadargang` varchar(999),
  `Alkoholhalt` varchar(10),
  `Sortiment` varchar(999),
  `SortimentText` varchar(999),
  `Producent` varchar(100),
  `Ekologisk` tinyint(1),
  `Etiskt` tinyint(1),
  `Koscher` tinyint(1),
  `glass` tinyint(1),
  PRIMARY KEY (`ArtikelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

GRANT ALL PRIVILEGES ON `winereview`.* TO 'wineuser'@'localhost'