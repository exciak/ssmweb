package com.klw.oa.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DXPLog {
    private Logger logger;

    public Logger getLogger() {
        return logger;
    }

    public void setLogger(Logger logger) {
        this.logger = logger;
    }

    public DXPLog() {
    }

    /*哪个类需要打印日志，就需要在该类中创建日志*/
    public DXPLog(Class clazz) {
       this.logger = LoggerFactory.getLogger(clazz);
    }

    public void error(String logContent) {
        logger.error(logContent);
    }

    public void error(Exception e) {
        logger.error("", e);
    }

    public void error(String errorMsg, Exception e) {
        logger.error(errorMsg, e);
    }

    public void error(String errorMsg, Throwable e) {
        logger.error(errorMsg, e);
    }

    public void warn(String logContent) {
        logger.warn(logContent);
    }

    public void info(String logContent){
        logger.info(logContent);
    }

    public void debug(String logContent){
        logger.debug(logContent);
    }

    public void trace(String logContent){
        logger.trace(logContent);
    }

}
