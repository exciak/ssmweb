package com.klw.oa.utils;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.converters.*;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

/**
 * Created by l0350 on 2016/8/16.
 */
public class DmallBeanUtils extends BeanUtils {


    private static void register() {
        ConvertUtils.register(new LongConverter(null), Long.class);
        ConvertUtils.register(new ShortConverter(null), Short.class);
        ConvertUtils.register(new IntegerConverter(null), Integer.class);
        ConvertUtils.register(new DoubleConverter(null), Double.class);
        ConvertUtils.register(new BigDecimalConverter(null), BigDecimal.class);
        ConvertUtils.register(new DmallStringConverter(), String.class);
    }

    public static void copyProperties(Object dest, Object orig)
            throws IllegalAccessException, InvocationTargetException {
        register();
        BeanUtilsBean.getInstance().copyProperties(dest, orig);
    }
}

class DmallStringConverter extends AbstractConverter {

    protected String convertToString(Object value) throws Throwable {
        return convertToType(String.class, value).toString();
    }

    @Override
    protected Object convertToType(Class type, Object value) throws Throwable {
        if (value instanceof Date) {
            return DXPTime.formatDateTime((Date) value, DXPTime.TIME_DATE);
        } else if (value instanceof Timestamp) {
            return DXPTime.formatDateTime(new Date(((Timestamp) value).getTime()), DXPTime.TIME_DATE);
        } else {
            return value.toString();
        }
    }

    @Override
    protected Class getDefaultType() {
        return String.class;
    }
}
