package com.klw.oa.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;


public class DXPTime {

    private static Calendar cal;
    public final static String TIME_DATE = "yyyy-MM-dd";
    public final static String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public final static String TIME_SIMPLE = "yyyyMMddHHmmss";
    public final static String TIME_FORMAT_CN = "yyyy年MM月dd日 HH:mm:ss";
    private static DXPLog logger = new DXPLog(DXPTime.class);
    private static Calendar getCurrentUtcTime(){
        //1、获取当前时间
        Calendar cal = Calendar.getInstance();
        //System.out.println(cal.getTime());
        //2、取得时间偏移量：
        final int zoneOffset = cal.get(Calendar.ZONE_OFFSET);
        //System.out.println(zoneOffset);
        //3、取得夏令时差：
        final int dstOffset = cal.get(Calendar.DST_OFFSET);
        //System.out.println(dstOffset);
        //4、从本地时间里扣除这些差量，即可以取得UTC时间：
        cal.add(Calendar.MILLISECOND, -(zoneOffset + dstOffset));

        return cal;
    }

    public static Date getCurrentTime(){
        Calendar cal = Calendar.getInstance();
        //SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
        return cal.getTime();
    }

    public static String getStartTime(){

        cal = getCurrentUtcTime();
        cal.add(Calendar.MILLISECOND, -(61 * 60 * 1000));
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(cal.getTime());
    }

    public static String getEndTime(){
        cal = getCurrentUtcTime();
        cal.add(Calendar.MILLISECOND, -(1 * 60 * 1000));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        return sdf.format(cal.getTime());
    }

    /*转换时间，将string类型转换成字符串的"yyyy-MM-dd HH:mm:ss"*/
    public static Date convertDate(String dataTimeStr) {
        return convertDate(dataTimeStr, TIME_FORMAT);
    }

    public static Date convertDate(String dataTimeStr, String dataFormat) {
        Date dataTime = null;
        try {
            // dataFormat = "yyyy-MM-dd HH:mm:ss"
            SimpleDateFormat df = new SimpleDateFormat(dataFormat);
            dataTime = df.parse(dataTimeStr);
        } catch (Exception e) {
            logger.error(ExceptionType.ERROR_TIME_FORMAT.getMessage(), e);
            return null;
        }

        return dataTime;
    }

    public static String formatDateTime(Date currDate) {
        return formatDateTime(currDate, TIME_FORMAT);
    }

    /*转换时间，将date类型按时间格式转换成字符串*/
    public static String formatDateTime(Date currDate, String format){
        String res = "-";

        if (currDate == null) {
            return res;
        }

        SimpleDateFormat dateFormatdB = null;
        try {
            dateFormatdB = new SimpleDateFormat(format);
            return dateFormatdB.format(currDate);
        } catch (Exception e) {
            logger.error(ExceptionType.ERROR_TIME_FORMAT.getMessage(), e);
            return res;
        }
    }

    /*根据输入的当前时间、天数和输出时间格式，输出当前时间加天数*/
    public static Date addDay(Date currentDate, int days, String format) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(currentDate);
        calendar.add(calendar.DATE, days);
        currentDate = calendar.getTime();

        SimpleDateFormat sdf = new SimpleDateFormat(format);
        String format1 = sdf.format(currentDate);

        return currentDate;
    }

    /*根据输入的当前时间、天数和输出时间格式，输出当前时间加天数*/
    public static String dateAddDaysTranStr(Date currentDate, int days, String format) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(currentDate);
        calendar.add(calendar.DATE, days);
        currentDate = calendar.getTime();

        SimpleDateFormat sdf = new SimpleDateFormat(format);
        String date = sdf.format(currentDate);

        return date;
    }

}
