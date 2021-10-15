-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 02. Feb 2021 um 17:25
-- Server-Version: 10.4.17-MariaDB
-- PHP-Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `auctionhouse`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `admin`
--

INSERT INTO `admin` (`admin_id`, `user_id`, `unix_time`) VALUES
(1, 1, '2021-02-01 14:31:50');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auction`
--

CREATE TABLE `auction` (
  `auction_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` text NOT NULL,
  `description` text NOT NULL,
  `auction_type` text NOT NULL,
  `amount` int(11) NOT NULL,
  `starting_price` float NOT NULL,
  `unix_starting_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `international` tinyint(1) NOT NULL,
  `item_type` text NOT NULL,
  `currency` text NOT NULL,
  `unix_ending_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `current_price` float NOT NULL,
  `cost` float NOT NULL,
  `image_count` int(11) NOT NULL,
  `bank_transfer` tinyint(1) NOT NULL,
  `cash` tinyint(1) NOT NULL,
  `paypal` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `auction`
--

INSERT INTO `auction` (`auction_id`, `seller_id`, `unix_time`, `title`, `description`, `auction_type`, `amount`, `starting_price`, `unix_starting_time`, `international`, `item_type`, `currency`, `unix_ending_time`, `current_price`, `cost`, `image_count`, `bank_transfer`, `cash`, `paypal`) VALUES
(2, 2, '2021-01-12 13:52:21', 'test auktion Porsche', 'Das hier ist eine tolle Beschreibung. Gerade trinke ich Cola.', 'auction', 2, 10, '2021-01-12 15:43:00', 1, 'ww1', 'eur', '2021-01-17 15:43:00', 10, 0.35, 3, 1, 1, 0),
(3, 2, '2021-01-31 21:57:39', 'asd', 'asd', 'auction', 1, 22, '2021-01-31 22:57:00', 1, 'ww2', 'eur', '2021-02-05 22:57:00', 23, 0.35, 1, 0, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auction_statistic`
--

CREATE TABLE `auction_statistic` (
  `auction_statistic_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `clicks` int(11) NOT NULL,
  `bets` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bet`
--

CREATE TABLE `bet` (
  `bet_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `bet`
--

INSERT INTO `bet` (`bet_id`, `auction_id`, `user_id`, `amount`, `unix_time`) VALUES
(1, 3, 2, 23, '2021-02-01 14:08:05');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chat`
--

CREATE TABLE `chat` (
  `chat_id` int(11) NOT NULL,
  `author_user_id` int(11) NOT NULL,
  `recipient_user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT 0,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `follow`
--

CREATE TABLE `follow` (
  `follow_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `to_follow_user_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `image`
--

CREATE TABLE `image` (
  `image_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `image`
--

INSERT INTO `image` (`image_id`, `auction_id`, `image`) VALUES
(1, 2, '1'),
(2, 2, '2'),
(3, 2, '3'),
(4, 3, '1');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `bank_transfer` tinyint(1) NOT NULL,
  `paypal` tinyint(1) NOT NULL,
  `cash` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rating`
--

CREATE TABLE `rating` (
  `rating_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `creator_user_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reported_user_id` int(11) NOT NULL,
  `problem` text NOT NULL,
  `description` text NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `seller`
--

CREATE TABLE `seller` (
  `seller_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `stripe_id` text DEFAULT NULL,
  `payment_id` text DEFAULT NULL,
  `is_validated` tinyint(1) NOT NULL DEFAULT 0,
  `unix_validation_time` timestamp NULL DEFAULT NULL,
  `auction` float NOT NULL,
  `photo_album` float NOT NULL,
  `additional_image` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `seller`
--

INSERT INTO `seller` (`seller_id`, `user_id`, `stripe_id`, `payment_id`, `is_validated`, `unix_validation_time`, `auction`, `photo_album`, `additional_image`) VALUES
(2, 1, 'cus_Ir1ib0aqX3gMjt', 'pm_1IFNodGXT5tgmfQyNKzV9C7F', 1, NULL, 0, 0, 0),
(3, 2, 'cus_Irmg1MXiJ48XNE', 'pm_1IG3CvGXT5tgmfQyCXQ35J5r', 1, NULL, 0, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session`
--

CREATE TABLE `session` (
  `session_id` int(11) NOT NULL,
  `session_key` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `expiration_unix_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `session`
--

INSERT INTO `session` (`session_id`, `session_key`, `user_id`, `unix_time`, `expiration_unix_time`) VALUES
(1, '-125539077159690952570571639', 1, '2021-01-12 13:32:27', '2021-01-17 14:32:24'),
(2, '1955162732-408808047-319203949', 1, '2021-01-12 13:38:49', '2021-01-17 14:38:46'),
(3, '-1298771089798864891-1777244377', 1, '2021-01-30 10:15:31', '2021-02-04 10:15:31'),
(4, '-1629125892833397477-2014914981', 1, '2021-01-30 10:17:59', '2021-02-04 10:17:59'),
(5, '-68504736916356566041996631651', 1, '2021-01-30 15:26:15', '2021-02-04 15:26:15'),
(6, '1878766647-1617675030-1714297655', 1, '2021-01-30 15:26:51', '2021-02-04 15:26:51'),
(7, '14431533003957915462127119186', 1, '2021-01-30 15:28:57', '2021-02-04 15:28:57'),
(8, '-16959596952114514780-445492701', 1, '2021-01-30 15:30:17', '2021-02-04 15:30:17'),
(9, '-2134978162-20003394881683106981', 1, '2021-01-30 15:31:21', '2021-02-04 15:31:21'),
(10, '-2012185358-384379644-361967761', 1, '2021-01-30 18:00:07', '2021-02-04 18:00:07'),
(11, '1557366685-1070316513-2093694737', 1, '2021-01-30 18:04:37', '2021-02-04 18:04:37'),
(12, '-1914866476-1461230121733564765', 1, '2021-02-01 12:44:04', '2021-02-06 12:44:04'),
(13, '-177765796-14173139101655184421', 1, '2021-02-01 12:45:58', '2021-02-06 12:45:58'),
(14, '-878530677-88564855554538101', 1, '2021-02-01 13:31:10', '2021-02-06 13:31:10'),
(15, '561828326-1018663298-298101895', 2, '2021-02-01 14:07:04', '2021-02-06 14:07:04'),
(16, '685716996-1100626271387635777', 1, '2021-02-01 14:18:14', '2021-02-06 14:18:14'),
(17, '-136527224113616919211457935339', 1, '2021-02-01 14:32:00', '2021-02-06 14:32:00'),
(18, '-17733433913295663481034133118', 2, '2021-02-01 15:41:07', '2021-02-06 15:41:07'),
(19, '-188453953415036912212129391599', 1, '2021-02-02 14:33:55', '2021-02-07 14:33:55'),
(20, '1902004670-714647895-1657484562', 1, '2021-02-02 16:18:07', '2021-02-07 16:18:07'),
(21, '-1165073436-1998669778920525109', 2, '2021-02-02 16:23:00', '2021-02-07 16:23:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `unix_creation_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_picture` tinyint(1) DEFAULT NULL,
  `password` text NOT NULL,
  `email` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `phone_number` text NOT NULL,
  `birth_date` text NOT NULL,
  `street_name` text NOT NULL,
  `house_number` text NOT NULL,
  `address_addition` text NOT NULL,
  `postal_code` int(11) NOT NULL,
  `city` text NOT NULL,
  `country` text NOT NULL,
  `description` text NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `banned` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `unix_creation_time`, `profile_picture`, `password`, `email`, `first_name`, `last_name`, `phone_number`, `birth_date`, `street_name`, `house_number`, `address_addition`, `postal_code`, `city`, `country`, `description`, `admin`, `banned`) VALUES
(1, '2021-01-12 13:30:29', 0, '-891985903', 'te@st.de', 'Kevin', 'Mustermann', '+49123123324234', '2000-02-22', 'Teststraße', '123', '', 12345, 'Berlin', 'Deutschland', '', 0, 0),
(2, '2021-02-01 14:07:04', 0, '-891985903', 'test2@test.de', 'Weber', 'Weber', '+49 12334435', '2002-12-17', 'asd', '1', 'rfsfs', 13456, 'asdasd', 'Deutschland', '', 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_statistic`
--

CREATE TABLE `user_statistic` (
  `user_statistic_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `page_views` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `watchlist`
--

CREATE TABLE `watchlist` (
  `watchlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `unix_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `watchlist`
--

INSERT INTO `watchlist` (`watchlist_id`, `user_id`, `auction_id`, `unix_time`) VALUES
(1, 2, 3, '2021-02-01 14:08:37');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indizes für die Tabelle `auction`
--
ALTER TABLE `auction`
  ADD PRIMARY KEY (`auction_id`);

--
-- Indizes für die Tabelle `auction_statistic`
--
ALTER TABLE `auction_statistic`
  ADD PRIMARY KEY (`auction_statistic_id`);

--
-- Indizes für die Tabelle `bet`
--
ALTER TABLE `bet`
  ADD PRIMARY KEY (`bet_id`);

--
-- Indizes für die Tabelle `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`chat_id`);

--
-- Indizes für die Tabelle `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`follow_id`);

--
-- Indizes für die Tabelle `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`image_id`);

--
-- Indizes für die Tabelle `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indizes für die Tabelle `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`rating_id`);

--
-- Indizes für die Tabelle `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`);

--
-- Indizes für die Tabelle `seller`
--
ALTER TABLE `seller`
  ADD PRIMARY KEY (`seller_id`);

--
-- Indizes für die Tabelle `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`session_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indizes für die Tabelle `user_statistic`
--
ALTER TABLE `user_statistic`
  ADD PRIMARY KEY (`user_statistic_id`);

--
-- Indizes für die Tabelle `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`watchlist_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `auction`
--
ALTER TABLE `auction`
  MODIFY `auction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `auction_statistic`
--
ALTER TABLE `auction_statistic`
  MODIFY `auction_statistic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `bet`
--
ALTER TABLE `bet`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `chat`
--
ALTER TABLE `chat`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `follow`
--
ALTER TABLE `follow`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `image`
--
ALTER TABLE `image`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `rating`
--
ALTER TABLE `rating`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `seller`
--
ALTER TABLE `seller`
  MODIFY `seller_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `session`
--
ALTER TABLE `session`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `user_statistic`
--
ALTER TABLE `user_statistic`
  MODIFY `user_statistic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `watchlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
