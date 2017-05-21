/*
Navicat MySQL Data Transfer

Source Server         : 1121
Source Server Version : 50623
Source Host           : localhost:3306
Source Database       : queryweb

Target Server Type    : MYSQL
Target Server Version : 50623
File Encoding         : 65001

Date: 2017-05-21 19:32:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dept`
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
-- Table structure for `myfile`
-- ----------------------------
DROP TABLE IF EXISTS `myfile`;
CREATE TABLE `myfile` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `file_desc` varchar(255) DEFAULT NULL,
  `real_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of myfile
-- ----------------------------
INSERT INTO `myfile` VALUES ('1', 'aaa', 'aaaa', '201705051301471669.jpg', null);
INSERT INTO `myfile` VALUES ('2', 'aaaa', 'aaaa', '201705051325023732.jpg', null);
INSERT INTO `myfile` VALUES ('3', 'asda', 'adfaa', '201705171744528581.properties', null);
INSERT INTO `myfile` VALUES ('4', 'ffa', 'asaa', '201705172056431846.dll', null);

-- ----------------------------
-- Table structure for `question`
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_name` varchar(3000) DEFAULT NULL,
  `question_selection` text,
  `question_type` varchar(255) DEFAULT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  `active_flag` bit(1) DEFAULT NULL,
  `is_edit` int(1) DEFAULT NULL,
  `is_necessary` int(1) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question
-- ----------------------------
INSERT INTO `question` VALUES ('16', '单选题', '[net.sf.ezmorph.bean.MorphDynaBean@429526f2[\r\n  {isSelected=false, text=选项内容1}\r\n], net.sf.ezmorph.bean.MorphDynaBean@50de7f6d[\r\n  {isSelected=false, text=选项内容2}\r\n], net.sf.ezmorph.bean.MorphDynaBean@70715c54[\r\n  {isSelected=false, text=选项内容3}\r\n]]', '0', '10', null, '0', '1');
INSERT INTO `question` VALUES ('17', '单选题', '[net.sf.ezmorph.bean.MorphDynaBean@8b5d35e[\r\n  {isSelected=false, text=选项内容1}\r\n], net.sf.ezmorph.bean.MorphDynaBean@63fcc60c[\r\n  {isSelected=false, text=选项内容2}\r\n], net.sf.ezmorph.bean.MorphDynaBean@407ae809[\r\n  {isSelected=false, text=选项内容3}\r\n]]', '0', '10', null, '0', '1');
INSERT INTO `question` VALUES ('18', '单选题', '[net.sf.ezmorph.bean.MorphDynaBean@169601b6[\r\n  {isSelected=false, text=选项内容1}\r\n], net.sf.ezmorph.bean.MorphDynaBean@12a987bc[\r\n  {isSelected=false, text=选项内容2}\r\n], net.sf.ezmorph.bean.MorphDynaBean@57ab0b8d[\r\n  {isSelected=false, text=选项内容3}\r\n]]', '0', '11', null, '0', '1');
INSERT INTO `question` VALUES ('19', '单选题', '[net.sf.ezmorph.bean.MorphDynaBean@408bba38[\r\n  {isSelected=false, text=选项内容1}\r\n], net.sf.ezmorph.bean.MorphDynaBean@66b6982e[\r\n  {isSelected=false, text=选项内容2}\r\n], net.sf.ezmorph.bean.MorphDynaBean@387c7723[\r\n  {isSelected=false, text=选项内容3}\r\n]]', '0', '11', null, '0', '1');
INSERT INTO `question` VALUES ('20', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '12', null, '0', '1');
INSERT INTO `question` VALUES ('21', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '12', null, '0', '1');
INSERT INTO `question` VALUES ('22', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '13', null, '0', '1');
INSERT INTO `question` VALUES ('23', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '13', null, '0', '1');

-- ----------------------------
-- Table structure for `questionnaire`
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire`;
CREATE TABLE `questionnaire` (
  `questionnaire_id` int(10) NOT NULL AUTO_INCREMENT,
  `questionnaire_name` varchar(500) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `questionnaire_type` varchar(255) DEFAULT NULL,
  `questionnaire_catalog` varchar(255) DEFAULT NULL,
  `create_id` int(11) DEFAULT NULL,
  `q_state` int(11) DEFAULT NULL,
  `questionnaire_prompt` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire
-- ----------------------------
INSERT INTO `questionnaire` VALUES ('9', 'qname', null, '2017-05-21 13:09:08', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('10', 'qname', null, '2017-05-21 13:29:24', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('11', 'qname', null, '2017-05-21 13:34:13', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('12', 'qname', null, '2017-05-21 13:46:33', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('13', 'qname', null, '2017-05-21 13:52:08', null, null, null, null, null);

-- ----------------------------
-- Table structure for `questionnaire_answer`
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire_answer`;
CREATE TABLE `questionnaire_answer` (
  `questionnaire_answerid` int(11) NOT NULL AUTO_INCREMENT,
  `questionnaire_id` int(11) DEFAULT NULL,
  `count_answer` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_answerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire_answer
-- ----------------------------

-- ----------------------------
-- Table structure for `question_answer`
-- ----------------------------
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE `question_answer` (
  `question_answerid` int(11) NOT NULL AUTO_INCREMENT,
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
-- Table structure for `question_answercount`
-- ----------------------------
DROP TABLE IF EXISTS `question_answercount`;
CREATE TABLE `question_answercount` (
  `question__answercountid` int(11) NOT NULL AUTO_INCREMENT,
  `questionnaire_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_count` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`question__answercountid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question_answercount
-- ----------------------------

-- ----------------------------
-- Table structure for `test`
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
-- Table structure for `user`
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', null, null, null, null, 'admin', null, null);
INSERT INTO `user` VALUES ('2', 'admisn', '', 'addr', '15757115291', 'em', 'admin', 'man', 'head');
