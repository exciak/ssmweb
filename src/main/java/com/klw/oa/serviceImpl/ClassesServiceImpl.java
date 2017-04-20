package com.klw.oa.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.klw.oa.dao.ClassesMapper;
import com.klw.oa.dao.TechClsMapper;
import com.klw.oa.entity.Classes;
import com.klw.oa.service.ClassesService;
import com.klw.oa.service.TechClsService;
@Component("clsService")
public class ClassesServiceImpl implements ClassesService{
	@Autowired
	SqlSessionFactory factory ;
	
	@Autowired
	ClassesMapper classesDao;
	
	@Autowired
	TechClsMapper tcDao;
	
	public ClassesServiceImpl() {
	}
	@Override
	public List<Classes> getAllClsByPage(Classes classesCriteria, int pageIndex,
			int pageSize) {
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("classesCriteria", classesCriteria);
		map.put("pageIndex", pageIndex);
		map.put("pageSize", pageSize);
		
		
		List<Classes> classes = null;
			
			classes = classesDao.selectAllByPage(map);
		
		return classes;
	}
	@Override
	public int countClsByName(Classes criteriaClasses) {
		int count = 0;
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("classesCriteria", criteriaClasses);
			count = classesDao.countByClasses(map);
		return count;
	}
	@Override
	public int addClass(Classes classes) {
		int result = 0;
			
			Classes chkClass = classesDao.selectByName(classes.getClassname());
			if(chkClass==null){
				
				result = classesDao.insertSelective(classes);
				
			}else{
				
				result = -1;
			}
		return result;
	}
	@Override
	public Classes getByName(String clsname) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public int delClass(Integer classid) {
		int result = 0;
		int count = 0;
		count = tcDao.selectByClsId(classid);
		if(count == 0){
			
			result = classesDao.deleteByPrimaryKey(classid);
		}else{
			result = -1;
		}
			
			
		return result;
	}
	@Override
	public Classes getById(Integer id) {
		
		Classes classes = null;
			
			classes = classesDao.selectByPrimaryKey(id);
		
		return classes;
	}
	@Override
	public int editClass(Classes classes) {
		int result = 0;
			
			Classes chkClasses = classesDao.selectByName(classes.getClassname());
			if(chkClasses==null){
				
				result = classesDao.updateByPrimaryKeySelective(classes);
				
			}else{
				if(chkClasses.getClassid().equals(classes.getClassid())){
					result = classesDao.updateByPrimaryKeySelective(classes);
				}else{
					
					result = -1;
				}
			}
		return result;
	}
	@Override
	public List<Classes> getClassesByCls(Classes classesCriteria, int pageIndex,
			int pageSize) {
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("classesCriteria", classesCriteria);
		map.put("pageIndex", pageIndex);
		map.put("pageSize", pageSize);
		
		
		List<Classes> classes = null;
			
			classes = classesDao.selectAllByCls(map);
		
		return classes;
	}

}
