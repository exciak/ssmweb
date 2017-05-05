package com.klw.oa.utils;

import java.util.Date;

public class FileUtils {

	public static String getFileName(String ext){
		
		String name = DateUtils.getStrByDate(new Date(),"yyyyMMddHHmmss" );
		for(int i = 0 ; i<4;i++){
			name +=(int)(Math.random()*10);
		}
		
		return name+ext;
	}
	public static String getFileName(){
		
		String name = DateUtils.getStrByDate(new Date(),"yyyyMMddHHmmss" );
		for(int i = 0 ; i<4;i++){
			name +=(int)(Math.random()*10);
		}
		
		return name;
	}
}
