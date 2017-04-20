package com.klw.oa.aop;

import java.util.Date;

import org.aspectj.lang.JoinPoint;

import com.klw.oa.dao.DateUtils;

public class LogAop {
	public void before(JoinPoint joinPoint){
		String classname = joinPoint.getTarget().getClass().getName();
		String methodname = joinPoint.getSignature().getName();
		
		String date = DateUtils.getStrByDate(new Date(), "yyyy-MM-dd");
		
		System.out.println(date+": "+classname+"."+methodname);
		
	}
	
	public void after(JoinPoint joinPoint){
		Object [] args = joinPoint.getArgs();
		for (int i = 0; i < args.length; i++) {
			System.out.println(args[i]+",");
		}
		
	}
	public void afterReturn(JoinPoint joinPoint,Object value){
		System.out.println("执行结果："+value);
	}

}
