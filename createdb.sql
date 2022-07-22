create database aixihu;

DROP TABLE IF EXISTS `tb_xhuser`;
create table tb_xhuser(
id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
openid TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
username TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
phone TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
village TEXT COLLATE utf8mb4_unicode_ci,
userrole INT(1),
shanchu INT(11) NOT NULL DEFAULT '0'
);

DROP TABLE IF EXISTS `tb_greenhouse`;
create table tb_greenhouse(
id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
houseidbyxhuser INT(11) NOT NULL,
housename TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
xhuserid INT(11) NOT NULL,
houseowner TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
ownerphone TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
area FLOAT NOT NULL,
housetype INT(11)  NOT NULL,
shanchu INT(11) NOT NULL DEFAULT '0'
);

DROP TABLE IF EXISTS `tb_plant`;
create table tb_plant(
id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
greenhouseid INT(11) NOT NULL,
vegetable INT(11) NOT NULL,
plant_time DATE NOT NULL,
ripe_time DATE NOT NULL,
yield INT(11) NOT NULL,
recordtime DATETIME NOT NULL,
byxhuser INT(11) NOT NULL,
shanchu INT(11) NOT NULL DEFAULT '0'
);

DROP TABLE IF EXISTS `tb_dict`;
create table tb_dict(
id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
typename TEXT COLLATE utf8mb4_unicode_ci NOT NULL
);