/*
Navicat MySQL Data Transfer

Source Server         : 10.84.1.124
Source Server Version : 50623
Source Host           : localhost:3306
Source Database       : queryweb

Target Server Type    : MYSQL
Target Server Version : 50623
File Encoding         : 65001

Date: 2017-04-24 19:20:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dept
-- ----------------------------
DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `dept_name` varchar(255) DEFAULT NULL,
  `dept_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dept
-- ----------------------------
INSERT INTO `dept` VALUES ('1', null, '根节点', null);
INSERT INTO `dept` VALUES ('2', '2', 'adfaa', 'null,2');

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `question_id` int(11) NOT NULL,
  `question_name` varchar(3000) DEFAULT NULL,
  `question_selection` text,
  `question_type` varchar(255) DEFAULT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question
-- ----------------------------
INSERT INTO `question` VALUES ('1', 'k', 'k', 'k', '2');
INSERT INTO `question` VALUES ('2', 'test_2', 'selection_two', 'type_two', '2');
INSERT INTO `question` VALUES ('3', 'k', 'f', 'l', '2');

-- ----------------------------
-- Table structure for questionnaire
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire`;
CREATE TABLE `questionnaire` (
  `questionnaire_id` int(10) NOT NULL,
  `questionnaire_name` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `questionnaire_type` varchar(255) DEFAULT NULL,
  `questionnaire_catalog` varchar(255) DEFAULT NULL,
  `create_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire
-- ----------------------------
INSERT INTO `questionnaire` VALUES ('1', 'test01', '2017-04-22 16:00:46', '2017-04-23 16:00:50', '生活', 'test', '1');
INSERT INTO `questionnaire` VALUES ('2', 'test02', null, null, 'afa', 'adfa', '2');

-- ----------------------------
-- Table structure for questionnaire_answer
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire_answer`;
CREATE TABLE `questionnaire_answer` (
  `questionnaire_answerid` int(11) NOT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  `count_answer` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_answerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire_answer
-- ----------------------------

-- ----------------------------
-- Table structure for question_answer
-- ----------------------------
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE `question_answer` (
  `question_answerid` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  `group_number` bigint(20) DEFAULT NULL,
  `question_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_answerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question_answer
-- ----------------------------

-- ----------------------------
-- Table structure for question_answercount
-- ----------------------------
DROP TABLE IF EXISTS `question_answercount`;
CREATE TABLE `question_answercount` (
  `question__answercountid` int(11) NOT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_count` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`question__answercountid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question_answercount
-- ----------------------------

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of test
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) NOT NULL,
  `is_admin` bit(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  `sex` varchar(6) DEFAULT NULL,
  `head` varchar(255) DEFAULT NULL COMMENT '头像',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
