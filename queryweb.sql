/*
Navicat MySQL Data Transfer

Source Server         : 1121
Source Server Version : 50623
Source Host           : localhost:3306
Source Database       : queryweb

Target Server Type    : MYSQL
Target Server Version : 50623
File Encoding         : 65001

Date: 2017-05-30 23:30:43
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of myfile
-- ----------------------------
INSERT INTO `myfile` VALUES ('1', 'aaa', 'aaaa', '201705051301471669.jpg', null);
INSERT INTO `myfile` VALUES ('2', 'aaaa', 'aaaa', '201705051325023732.jpg', null);
INSERT INTO `myfile` VALUES ('3', 'asda', 'adfaa', '201705171744528581.properties', null);
INSERT INTO `myfile` VALUES ('4', 'ffa', 'asaa', '201705172056431846.dll', null);
INSERT INTO `myfile` VALUES ('5', 'aaaa', 'aaaa', '201705252046092098.jpg', null);
INSERT INTO `myfile` VALUES ('6', 'afa', 'adfa', '201705252051223001.jpg', null);
INSERT INTO `myfile` VALUES ('7', 'aaaa', 'aaaa', '201705252058586651.jpg', null);

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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question
-- ----------------------------
INSERT INTO `question` VALUES ('26', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '15', null, '0', '1');
INSERT INTO `question` VALUES ('27', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '15', null, '0', '1');
INSERT INTO `question` VALUES ('28', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '16', null, '0', '1');
INSERT INTO `question` VALUES ('29', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '16', null, '0', '1');
INSERT INTO `question` VALUES ('30', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '16', null, '0', '1');
INSERT INTO `question` VALUES ('31', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '16', null, '0', '1');
INSERT INTO `question` VALUES ('32', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '18', null, '0', '1');
INSERT INTO `question` VALUES ('33', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '18', null, '0', '1');
INSERT INTO `question` VALUES ('34', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '19', null, '0', '1');
INSERT INTO `question` VALUES ('35', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '19', null, '0', '1');
INSERT INTO `question` VALUES ('36', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '20', null, '0', '1');
INSERT INTO `question` VALUES ('37', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '20', null, '0', '1');
INSERT INTO `question` VALUES ('38', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '21', null, '0', '1');
INSERT INTO `question` VALUES ('39', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '21', null, '0', '1');
INSERT INTO `question` VALUES ('40', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '22', null, '0', '1');
INSERT INTO `question` VALUES ('41', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '22', null, '0', '1');
INSERT INTO `question` VALUES ('42', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '23', null, '0', '1');
INSERT INTO `question` VALUES ('43', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '23', null, '0', '1');
INSERT INTO `question` VALUES ('44', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '24', null, '0', '1');
INSERT INTO `question` VALUES ('45', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '24', null, '0', '1');
INSERT INTO `question` VALUES ('46', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '1', '26', null, '0', '1');
INSERT INTO `question` VALUES ('47', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '0', '26', null, '0', '1');
INSERT INTO `question` VALUES ('48', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '2', '27', null, '0', '1');
INSERT INTO `question` VALUES ('49', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '1', '27', null, '0', '1');
INSERT INTO `question` VALUES ('50', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '2', '28', null, '0', '1');
INSERT INTO `question` VALUES ('51', '单选题', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]', '1', '28', null, '0', '1');

-- ----------------------------
-- Table structure for `questionnaire`
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire`;
CREATE TABLE `questionnaire` (
  `questionnaire_id` int(10) NOT NULL AUTO_INCREMENT,
  `questionnaire_name` varchar(500) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `questionnaire_type` int(255) DEFAULT NULL,
  `questionnaire_catalog` varchar(255) DEFAULT NULL,
  `create_id` int(11) DEFAULT NULL,
  `q_state` int(11) DEFAULT NULL,
  `questionnaire_prompt` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire
-- ----------------------------
INSERT INTO `questionnaire` VALUES ('15', 'qname', '2017-05-23 22:32:44', '2017-05-23 22:32:44', '1', '1', '11', null, 'prompt');
INSERT INTO `questionnaire` VALUES ('16', 'aa', '2017-05-23 22:32:46', '2017-05-23 22:32:46', '1', '1', '1', '1', null);
INSERT INTO `questionnaire` VALUES ('17', 'aaa', '2017-05-23 22:04:37', '2017-05-23 22:04:37', null, null, null, '1', null);
INSERT INTO `questionnaire` VALUES ('18', 'aaa', '2017-05-23 22:32:46', '2017-05-23 22:32:46', null, null, '1', '1', null);
INSERT INTO `questionnaire` VALUES ('19', 'aaaa', '2017-05-23 13:40:28', '2017-05-23 13:40:28', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('20', 'faas', '2017-05-23 22:32:51', '2017-05-23 22:32:51', null, null, '1', null, null);
INSERT INTO `questionnaire` VALUES ('21', 'asa', '2017-05-23 13:40:31', '2017-05-23 13:40:31', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('22', 'saa', '2017-05-23 13:40:32', '2017-05-23 13:40:32', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('23', 'faa', '2017-05-23 13:40:34', '2017-05-23 13:40:34', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('24', 'qname', '2017-05-23 13:40:22', '2017-05-23 13:40:22', null, null, null, null, 'prompt');
INSERT INTO `questionnaire` VALUES ('25', null, '2017-05-23 13:41:53', '2017-05-23 13:41:53', null, null, null, null, null);
INSERT INTO `questionnaire` VALUES ('26', 'qname', '2017-05-26 20:10:22', '2017-05-26 20:10:22', null, null, null, '0', 'prompt');
INSERT INTO `questionnaire` VALUES ('27', 'qname', '2017-05-26 20:12:11', '2017-05-26 20:12:11', null, null, null, '0', 'prompt');
INSERT INTO `questionnaire` VALUES ('28', 'qname', '2017-05-26 20:12:59', '2017-05-26 20:12:59', null, null, null, '0', 'prompt');

-- ----------------------------
-- Table structure for `questionnaire_answer`
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire_answer`;
CREATE TABLE `questionnaire_answer` (
  `questionnaire_answerid` int(11) NOT NULL AUTO_INCREMENT,
  `questionnaire_id` int(11) DEFAULT NULL,
  `count_answer` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`questionnaire_answerid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionnaire_answer
-- ----------------------------
INSERT INTO `questionnaire_answer` VALUES ('1', '41', '1');
INSERT INTO `questionnaire_answer` VALUES ('2', '41', '1');
INSERT INTO `questionnaire_answer` VALUES ('3', '41', '1');

-- ----------------------------
-- Table structure for `question_answer`
-- ----------------------------
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE `question_answer` (
  `question_answerid` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  `group_number` varchar(200) DEFAULT NULL,
  `question_type` varchar(255) DEFAULT NULL,
  `answer` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`question_answerid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question_answer
-- ----------------------------
INSERT INTO `question_answer` VALUES ('1', '47', null, '41', '0', '0', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('2', '48', null, '41', '2', '1', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('3', '49', null, '41', '0', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('4', '49', null, '41', '1', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('5', '47', null, '41', '0', '0', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('6', '48', null, '41', '2', '1', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('7', '49', null, '41', '0', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('8', '49', null, '41', '1', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('9', '50', null, '41', '[]', '3', '[{\"isSelected\":false,\"text\":\"1111111\"}]');
INSERT INTO `question_answer` VALUES ('10', '51', null, '41', '[]', '4', '[{\"isSelected\":false,\"text\":\"122131 213 12 3 123 123\"}]');
INSERT INTO `question_answer` VALUES ('11', '52', null, '41', '[10]', '5', '[{\"choice\":[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}],\"line\":[{\"isSelected\":[],\"text\":\"\"},{\"isSelected\":[0],\"text\":\"矩阵行1\"},{\"isSelected\":[1],\"text\":\"矩阵行2\"},{\"isSelected\":[2],\"text\":\"矩阵行3\"},{\"isSelected\":[1],\"text\":\"矩阵行4\"}]}]');
INSERT INTO `question_answer` VALUES ('12', '53', null, '41', '[-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11]', '6', '[{\"choice\":[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}],\"line\":[{\"isSelected\":[],\"text\":\"\"},{\"isSelected\":[],\"text\":\"矩阵行1\"},{\"isSelected\":[],\"text\":\"矩阵行2\"},{\"isSelected\":[],\"text\":\"矩阵行3\"},{\"isSelected\":[],\"text\":\"矩阵行4\"}]}]');
INSERT INTO `question_answer` VALUES ('13', '54', null, '41', '0', '7', '[{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301531581248.jpg\",\"isSelected\":false,\"text\":\"选项内容1\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532073437.jpg\",\"isSelected\":false,\"text\":\"选项内容2\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532136065.jpg\",\"isSelected\":false,\"text\":\"选项内容3\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532200621.jpg\",\"isSelected\":false,\"text\":\"选项内容4\"}]');
INSERT INTO `question_answer` VALUES ('14', '56', null, '41', '[]', '9', '[{\"isSelected\":false,\"text\":\"撒电视亲爱的\"}]');
INSERT INTO `question_answer` VALUES ('15', '47', null, '41', '0', '0', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('16', '48', null, '41', '2', '1', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('17', '49', null, '41', '0', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('18', '49', null, '41', '1', '2', '[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":true,\"text\":\"选项内容2\"},{\"isSelected\":true,\"text\":\"选项内容3\"}]');
INSERT INTO `question_answer` VALUES ('19', '50', null, '41', '[]', '3', '[{\"isSelected\":false,\"text\":\"1111111\"}]');
INSERT INTO `question_answer` VALUES ('20', '51', null, '41', '[]', '4', '[{\"isSelected\":false,\"text\":\"122131 213 12 3 123 123\"}]');
INSERT INTO `question_answer` VALUES ('21', '52', null, '41', '[10]', '5', '[{\"choice\":[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}],\"line\":[{\"isSelected\":[],\"text\":\"\"},{\"isSelected\":[0],\"text\":\"矩阵行1\"},{\"isSelected\":[1],\"text\":\"矩阵行2\"},{\"isSelected\":[2],\"text\":\"矩阵行3\"},{\"isSelected\":[1],\"text\":\"矩阵行4\"}]}]');
INSERT INTO `question_answer` VALUES ('22', '53', null, '41', '[-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11]', '6', '[{\"choice\":[{\"isSelected\":false,\"text\":\"选项内容1\"},{\"isSelected\":false,\"text\":\"选项内容2\"},{\"isSelected\":false,\"text\":\"选项内容3\"}],\"line\":[{\"isSelected\":[],\"text\":\"\"},{\"isSelected\":[],\"text\":\"矩阵行1\"},{\"isSelected\":[],\"text\":\"矩阵行2\"},{\"isSelected\":[],\"text\":\"矩阵行3\"},{\"isSelected\":[],\"text\":\"矩阵行4\"}]}]');
INSERT INTO `question_answer` VALUES ('23', '54', null, '41', '0', '7', '[{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301531581248.jpg\",\"isSelected\":false,\"text\":\"选项内容1\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532073437.jpg\",\"isSelected\":false,\"text\":\"选项内容2\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532136065.jpg\",\"isSelected\":false,\"text\":\"选项内容3\"},{\"imgUrl\":\"http://localhost:10080/oa/api/upload/201705301532200621.jpg\",\"isSelected\":false,\"text\":\"选项内容4\"}]');
INSERT INTO `question_answer` VALUES ('24', '56', null, '41', '[]', '9', '[{\"isSelected\":false,\"text\":\"撒电视亲爱的\"}]');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question_answercount
-- ----------------------------
INSERT INTO `question_answercount` VALUES ('1', '41', '147', '3');
INSERT INTO `question_answercount` VALUES ('2', '41', '148', '3');
INSERT INTO `question_answercount` VALUES ('3', '41', '149', '3');
INSERT INTO `question_answercount` VALUES ('4', '41', '150', '3');
INSERT INTO `question_answercount` VALUES ('5', '41', '151', '3');
INSERT INTO `question_answercount` VALUES ('6', '41', '152', '3');
INSERT INTO `question_answercount` VALUES ('7', '41', '153', '3');
INSERT INTO `question_answercount` VALUES ('8', '41', '154', '3');
INSERT INTO `question_answercount` VALUES ('9', '41', '155', '3');
INSERT INTO `question_answercount` VALUES ('10', '41', '156', '3');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', null, null, null, null, 'admin', null, null);
INSERT INTO `user` VALUES ('2', 'admis', '', 'addr', '15757115291', 'em', 'admin', 'man', 'head');
INSERT INTO `user` VALUES ('3', 'admisn', '', 'addr', '15757115291', 'em', 'admin', 'man', 'head');
INSERT INTO `user` VALUES ('4', 'admisns1', '', 'addr', '15757115291', 'em', 'admin', 'man', 'head');
