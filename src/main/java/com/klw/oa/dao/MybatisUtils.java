package com.klw.oa.dao;

import java.io.IOException;
import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MybatisUtils {
	private static SqlSessionFactory factory = null;
	
	public static SqlSessionFactory getSqlSessionFactory(){
		if(factory == null){
			
			synchronized (MybatisUtils.class) {
				
				if(factory == null){
					
					String resource = "mybatis/Configuration.xml";
					
					Reader reader;
					try {
						reader = Resources.getResourceAsReader(resource);
						factory = new SqlSessionFactoryBuilder().build(reader);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
		}
		
		return factory;
	}

}
