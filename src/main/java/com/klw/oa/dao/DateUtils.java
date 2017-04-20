package com.klw.oa.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {

	/**
	 * 
	 * @param dateStr
	 * @param formatStr 格式  "yyyy-MM-dd HH:mm:ss"
	 * @return
	 */
	public static Date getDateByStr(String dateStr,String formatStr){
		Date date = null;
		SimpleDateFormat format = new SimpleDateFormat(formatStr);
		try {
			date = format.parse(dateStr);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return date;
	}
	
	public static String getStrByDate(Date date,String format){
		String str = null;
		SimpleDateFormat fm = new SimpleDateFormat(format);
		str = fm.format(date);
		return str;
		
	}
}
