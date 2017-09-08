CREATE TABLE IF NOT EXISTS `pages` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `admin_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `involved` (
  `user_id` varchar(255) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `user_desc` varchar(255),
  PRIMARY KEY (`user_id`, `page_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `questions` (
  `page_id` varchar(255) NOT NULL,
  `index` int NOT NULL,
  `attribute` varchar(255) NOT NULL,
  PRIMARY KEY (`page_id`, `index`),
  FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `responses` (
  `user_id` varchar(255) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `question_index` int NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`user_id`, `page_id`, `question_index`),
  FOREIGN KEY (`page_id`, `question_index`) REFERENCES `questions`(`page_id`, `index`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

INSERT INTO pages VALUES('page_id', 'CS3216', 'admin_id');

INSERT INTO users VALUES('1', 'Aaron Ong Chong Shi');
INSERT INTO users VALUES('2', 'Li Zihan');
INSERT INTO users VALUES('3', 'Ho Yi Hang');
INSERT INTO users VALUES('4', 'Goh Wei Wen');
INSERT INTO users VALUES('5', 'Chan Khan');
INSERT INTO users VALUES('6', 'Stefano Chiesa Suryanto');
INSERT INTO users VALUES('7', 'Lau Shi Jie');
INSERT INTO users VALUES('8', 'Yip Mun Kit Bernard');
INSERT INTO users VALUES('9', 'Tan Zheng Wei');
INSERT INTO users VALUES('10', 'Tan Kai Meng Wilson');
INSERT INTO users VALUES('11', 'Jeremy Jee De Sheng');
INSERT INTO users VALUES('12', 'Ng Jun Wei');
INSERT INTO users VALUES('13', 'Chan Jin Jia');
INSERT INTO users VALUES('14', 'Chua Lin Jing');
INSERT INTO users VALUES('15', 'Apoorva Ullas');
INSERT INTO users VALUES('16', 'Charlton Lim');
INSERT INTO users VALUES('17', 'WANG RIWU');
INSERT INTO users VALUES('18', 'Lim Jia Yee');
INSERT INTO users VALUES('19', 'Lim Ta Eu');
INSERT INTO users VALUES('20', 'Danielle Chan Xin Yun');
INSERT INTO users VALUES('21', 'Maximilianus Kusnadi');
INSERT INTO users VALUES('22', 'Oh Han Gyeol');
INSERT INTO users VALUES('23', 'WON JUN RU DAPHNE');
INSERT INTO users VALUES('24', 'Kushagra Goyal');
INSERT INTO users VALUES('25', 'Curtis Tan Wei Jie');
INSERT INTO users VALUES('26', 'See Soon Kiat');
INSERT INTO users VALUES('27', 'See Loo Jane');
INSERT INTO users VALUES('28', 'Alan Lee Yung Chong');
INSERT INTO users VALUES('29', 'Fan Weiguang');
INSERT INTO users VALUES('30', 'Bai Chuan');
INSERT INTO users VALUES('31', 'Chng Hui Yie');
INSERT INTO users VALUES('32', 'Ong Jing Yin');
INSERT INTO users VALUES('33', 'Ng Si Kai');
INSERT INTO users VALUES('34', 'Liew Yu Young Jovin');


INSERT INTO involved VALUES('1', 'page_id', 'temp_description');
INSERT INTO involved VALUES('2', 'page_id', 'temp_description');
INSERT INTO involved VALUES('3', 'page_id', 'temp_description');
INSERT INTO involved VALUES('4', 'page_id', 'temp_description');
INSERT INTO involved VALUES('5', 'page_id', 'temp_description');
INSERT INTO involved VALUES('6', 'page_id', 'temp_description');
INSERT INTO involved VALUES('7', 'page_id', 'temp_description');
INSERT INTO involved VALUES('8', 'page_id', 'temp_description');
INSERT INTO involved VALUES('9', 'page_id', 'temp_description');
INSERT INTO involved VALUES('10', 'page_id', 'temp_description');
INSERT INTO involved VALUES('11', 'page_id', 'temp_description');
INSERT INTO involved VALUES('12', 'page_id', 'temp_description');
INSERT INTO involved VALUES('13', 'page_id', 'temp_description');
INSERT INTO involved VALUES('14', 'page_id', 'temp_description');
INSERT INTO involved VALUES('15', 'page_id', 'temp_description');
INSERT INTO involved VALUES('16', 'page_id', 'temp_description');
INSERT INTO involved VALUES('17', 'page_id', 'temp_description');
INSERT INTO involved VALUES('18', 'page_id', 'temp_description');
INSERT INTO involved VALUES('19', 'page_id', 'temp_description');
INSERT INTO involved VALUES('20', 'page_id', 'temp_description');
INSERT INTO involved VALUES('21', 'page_id', 'temp_description');
INSERT INTO involved VALUES('22', 'page_id', 'temp_description');
INSERT INTO involved VALUES('23', 'page_id', 'temp_description');
INSERT INTO involved VALUES('24', 'page_id', 'temp_description');
INSERT INTO involved VALUES('25', 'page_id', 'temp_description');
INSERT INTO involved VALUES('26', 'page_id', 'temp_description');
INSERT INTO involved VALUES('27', 'page_id', 'temp_description');
INSERT INTO involved VALUES('28', 'page_id', 'temp_description');
INSERT INTO involved VALUES('29', 'page_id', 'temp_description');
INSERT INTO involved VALUES('30', 'page_id', 'temp_description');
INSERT INTO involved VALUES('31', 'page_id', 'temp_description');
INSERT INTO involved VALUES('32', 'page_id', 'temp_description');
INSERT INTO involved VALUES('33', 'page_id', 'temp_description');
INSERT INTO involved VALUES('34', 'page_id', 'temp_description');

INSERT INTO questions VALUES('page_id', 1, 'Photoshop and design');
INSERT INTO questions VALUES('page_id', 2, 'Html and CSS');
INSERT INTO questions VALUES('page_id', 3, 'Javascript');
INSERT INTO questions VALUES('page_id', 4, 'server-side languages');
INSERT INTO questions VALUES('page_id', 5, 'database');

INSERT INTO responses VALUES('1', 'page_id', 1, 0);
INSERT INTO responses VALUES('1', 'page_id', 2, 6);
INSERT INTO responses VALUES('1', 'page_id', 3, 2);
INSERT INTO responses VALUES('1', 'page_id', 4, 3);
INSERT INTO responses VALUES('1', 'page_id', 5, 9);
INSERT INTO responses VALUES('2', 'page_id', 1, 6);
INSERT INTO responses VALUES('2', 'page_id', 2, 8);
INSERT INTO responses VALUES('2', 'page_id', 3, 6);
INSERT INTO responses VALUES('2', 'page_id', 4, 6);
INSERT INTO responses VALUES('2', 'page_id', 5, 7);
INSERT INTO responses VALUES('3', 'page_id', 1, 6);
INSERT INTO responses VALUES('3', 'page_id', 2, 9);
INSERT INTO responses VALUES('3', 'page_id', 3, 7);
INSERT INTO responses VALUES('3', 'page_id', 4, 7);
INSERT INTO responses VALUES('3', 'page_id', 5, 4);
INSERT INTO responses VALUES('4', 'page_id', 1, 0);
INSERT INTO responses VALUES('4', 'page_id', 2, 1);
INSERT INTO responses VALUES('4', 'page_id', 3, 5);
INSERT INTO responses VALUES('4', 'page_id', 4, 1);
INSERT INTO responses VALUES('4', 'page_id', 5, 4);
INSERT INTO responses VALUES('5', 'page_id', 1, 4);
INSERT INTO responses VALUES('5', 'page_id', 2, 8);
INSERT INTO responses VALUES('5', 'page_id', 3, 2);
INSERT INTO responses VALUES('5', 'page_id', 4, 8);
INSERT INTO responses VALUES('5', 'page_id', 5, 9);
INSERT INTO responses VALUES('6', 'page_id', 1, 1);
INSERT INTO responses VALUES('6', 'page_id', 2, 6);
INSERT INTO responses VALUES('6', 'page_id', 3, 8);
INSERT INTO responses VALUES('6', 'page_id', 4, 1);
INSERT INTO responses VALUES('6', 'page_id', 5, 0);
INSERT INTO responses VALUES('7', 'page_id', 1, 2);
INSERT INTO responses VALUES('7', 'page_id', 2, 9);
INSERT INTO responses VALUES('7', 'page_id', 3, 1);
INSERT INTO responses VALUES('7', 'page_id', 4, 7);
INSERT INTO responses VALUES('7', 'page_id', 5, 8);
INSERT INTO responses VALUES('8', 'page_id', 1, 5);
INSERT INTO responses VALUES('8', 'page_id', 2, 7);
INSERT INTO responses VALUES('8', 'page_id', 3, 7);
INSERT INTO responses VALUES('8', 'page_id', 4, 9);
INSERT INTO responses VALUES('8', 'page_id', 5, 9);
INSERT INTO responses VALUES('9', 'page_id', 1, 9);
INSERT INTO responses VALUES('9', 'page_id', 2, 9);
INSERT INTO responses VALUES('9', 'page_id', 3, 4);
INSERT INTO responses VALUES('9', 'page_id', 4, 9);
INSERT INTO responses VALUES('9', 'page_id', 5, 5);
INSERT INTO responses VALUES('10', 'page_id', 1, 9);
INSERT INTO responses VALUES('10', 'page_id', 2, 6);
INSERT INTO responses VALUES('10', 'page_id', 3, 3);
INSERT INTO responses VALUES('10', 'page_id', 4, 6);
INSERT INTO responses VALUES('10', 'page_id', 5, 9);
INSERT INTO responses VALUES('11', 'page_id', 1, 9);
INSERT INTO responses VALUES('11', 'page_id', 2, 1);
INSERT INTO responses VALUES('11', 'page_id', 3, 9);
INSERT INTO responses VALUES('11', 'page_id', 4, 9);
INSERT INTO responses VALUES('11', 'page_id', 5, 9);
INSERT INTO responses VALUES('12', 'page_id', 1, 6);
INSERT INTO responses VALUES('12', 'page_id', 2, 1);
INSERT INTO responses VALUES('12', 'page_id', 3, 3);
INSERT INTO responses VALUES('12', 'page_id', 4, 4);
INSERT INTO responses VALUES('12', 'page_id', 5, 8);
INSERT INTO responses VALUES('13', 'page_id', 1, 1);
INSERT INTO responses VALUES('13', 'page_id', 2, 4);
INSERT INTO responses VALUES('13', 'page_id', 3, 4);
INSERT INTO responses VALUES('13', 'page_id', 4, 9);
INSERT INTO responses VALUES('13', 'page_id', 5, 2);
INSERT INTO responses VALUES('14', 'page_id', 1, 8);
INSERT INTO responses VALUES('14', 'page_id', 2, 4);
INSERT INTO responses VALUES('14', 'page_id', 3, 7);
INSERT INTO responses VALUES('14', 'page_id', 4, 4);
INSERT INTO responses VALUES('14', 'page_id', 5, 6);
INSERT INTO responses VALUES('15', 'page_id', 1, 8);
INSERT INTO responses VALUES('15', 'page_id', 2, 0);
INSERT INTO responses VALUES('15', 'page_id', 3, 3);
INSERT INTO responses VALUES('15', 'page_id', 4, 7);
INSERT INTO responses VALUES('15', 'page_id', 5, 2);
INSERT INTO responses VALUES('16', 'page_id', 1, 5);
INSERT INTO responses VALUES('16', 'page_id', 2, 4);
INSERT INTO responses VALUES('16', 'page_id', 3, 1);
INSERT INTO responses VALUES('16', 'page_id', 4, 8);
INSERT INTO responses VALUES('16', 'page_id', 5, 2);
INSERT INTO responses VALUES('17', 'page_id', 1, 6);
INSERT INTO responses VALUES('17', 'page_id', 2, 5);
INSERT INTO responses VALUES('17', 'page_id', 3, 1);
INSERT INTO responses VALUES('17', 'page_id', 4, 3);
INSERT INTO responses VALUES('17', 'page_id', 5, 3);
INSERT INTO responses VALUES('18', 'page_id', 1, 8);
INSERT INTO responses VALUES('18', 'page_id', 2, 4);
INSERT INTO responses VALUES('18', 'page_id', 3, 1);
INSERT INTO responses VALUES('18', 'page_id', 4, 3);
INSERT INTO responses VALUES('18', 'page_id', 5, 1);
INSERT INTO responses VALUES('19', 'page_id', 1, 4);
INSERT INTO responses VALUES('19', 'page_id', 2, 7);
INSERT INTO responses VALUES('19', 'page_id', 3, 9);
INSERT INTO responses VALUES('19', 'page_id', 4, 3);
INSERT INTO responses VALUES('19', 'page_id', 5, 4);
INSERT INTO responses VALUES('20', 'page_id', 1, 7);
INSERT INTO responses VALUES('20', 'page_id', 2, 2);
INSERT INTO responses VALUES('20', 'page_id', 3, 0);
INSERT INTO responses VALUES('20', 'page_id', 4, 0);
INSERT INTO responses VALUES('20', 'page_id', 5, 6);
INSERT INTO responses VALUES('21', 'page_id', 1, 7);
INSERT INTO responses VALUES('21', 'page_id', 2, 3);
INSERT INTO responses VALUES('21', 'page_id', 3, 1);
INSERT INTO responses VALUES('21', 'page_id', 4, 2);
INSERT INTO responses VALUES('21', 'page_id', 5, 7);
INSERT INTO responses VALUES('22', 'page_id', 1, 5);
INSERT INTO responses VALUES('22', 'page_id', 2, 5);
INSERT INTO responses VALUES('22', 'page_id', 3, 5);
INSERT INTO responses VALUES('22', 'page_id', 4, 7);
INSERT INTO responses VALUES('22', 'page_id', 5, 8);
INSERT INTO responses VALUES('23', 'page_id', 1, 8);
INSERT INTO responses VALUES('23', 'page_id', 2, 1);
INSERT INTO responses VALUES('23', 'page_id', 3, 1);
INSERT INTO responses VALUES('23', 'page_id', 4, 4);
INSERT INTO responses VALUES('23', 'page_id', 5, 3);
INSERT INTO responses VALUES('24', 'page_id', 1, 2);
INSERT INTO responses VALUES('24', 'page_id', 2, 4);
INSERT INTO responses VALUES('24', 'page_id', 3, 2);
INSERT INTO responses VALUES('24', 'page_id', 4, 1);
INSERT INTO responses VALUES('24', 'page_id', 5, 3);
INSERT INTO responses VALUES('25', 'page_id', 1, 3);
INSERT INTO responses VALUES('25', 'page_id', 2, 0);
INSERT INTO responses VALUES('25', 'page_id', 3, 7);
INSERT INTO responses VALUES('25', 'page_id', 4, 1);
INSERT INTO responses VALUES('25', 'page_id', 5, 7);
INSERT INTO responses VALUES('26', 'page_id', 1, 0);
INSERT INTO responses VALUES('26', 'page_id', 2, 8);
INSERT INTO responses VALUES('26', 'page_id', 3, 5);
INSERT INTO responses VALUES('26', 'page_id', 4, 8);
INSERT INTO responses VALUES('26', 'page_id', 5, 5);
INSERT INTO responses VALUES('27', 'page_id', 1, 1);
INSERT INTO responses VALUES('27', 'page_id', 2, 3);
INSERT INTO responses VALUES('27', 'page_id', 3, 7);
INSERT INTO responses VALUES('27', 'page_id', 4, 5);
INSERT INTO responses VALUES('27', 'page_id', 5, 0);
INSERT INTO responses VALUES('28', 'page_id', 1, 9);
INSERT INTO responses VALUES('28', 'page_id', 2, 8);
INSERT INTO responses VALUES('28', 'page_id', 3, 1);
INSERT INTO responses VALUES('28', 'page_id', 4, 0);
INSERT INTO responses VALUES('28', 'page_id', 5, 2);
INSERT INTO responses VALUES('29', 'page_id', 1, 5);
INSERT INTO responses VALUES('29', 'page_id', 2, 9);
INSERT INTO responses VALUES('29', 'page_id', 3, 9);
INSERT INTO responses VALUES('29', 'page_id', 4, 9);
INSERT INTO responses VALUES('29', 'page_id', 5, 9);
INSERT INTO responses VALUES('30', 'page_id', 1, 5);
INSERT INTO responses VALUES('30', 'page_id', 2, 4);
INSERT INTO responses VALUES('30', 'page_id', 3, 7);
INSERT INTO responses VALUES('30', 'page_id', 4, 1);
INSERT INTO responses VALUES('30', 'page_id', 5, 2);
INSERT INTO responses VALUES('31', 'page_id', 1, 2);
INSERT INTO responses VALUES('31', 'page_id', 2, 8);
INSERT INTO responses VALUES('31', 'page_id', 3, 2);
INSERT INTO responses VALUES('31', 'page_id', 4, 7);
INSERT INTO responses VALUES('31', 'page_id', 5, 1);
INSERT INTO responses VALUES('32', 'page_id', 1, 0);
INSERT INTO responses VALUES('32', 'page_id', 2, 9);
INSERT INTO responses VALUES('32', 'page_id', 3, 8);
INSERT INTO responses VALUES('32', 'page_id', 4, 4);
INSERT INTO responses VALUES('32', 'page_id', 5, 1);
INSERT INTO responses VALUES('33', 'page_id', 1, 8);
INSERT INTO responses VALUES('33', 'page_id', 2, 2);
INSERT INTO responses VALUES('33', 'page_id', 3, 9);
INSERT INTO responses VALUES('33', 'page_id', 4, 2);
INSERT INTO responses VALUES('33', 'page_id', 5, 2);
INSERT INTO responses VALUES('34', 'page_id', 1, 7);
INSERT INTO responses VALUES('34', 'page_id', 2, 6);
INSERT INTO responses VALUES('34', 'page_id', 3, 8);
INSERT INTO responses VALUES('34', 'page_id', 4, 7);
INSERT INTO responses VALUES('34', 'page_id', 5, 9);



