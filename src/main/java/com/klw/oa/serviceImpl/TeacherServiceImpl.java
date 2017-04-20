package com.klw.oa.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.klw.oa.dao.TeacherMapper;
import com.klw.oa.entity.Teacher;
import com.klw.oa.service.TeacherService;

@Component("techService")
public class TeacherServiceImpl implements TeacherService{
	@Autowired
	SqlSessionFactory factory;
	
	@Autowired
	TeacherMapper techDao;

	@Override
	public List<Teacher> getAllTechByPage(Teacher techCriteria, int pageIndex,
			int pageSize) {
		
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("teacherCriteria", techCriteria);
		map.put("pageIndex", pageIndex);
		map.put("pageSize", pageSize);
		
		
		List<Teacher> techs = null;
			
		techs = techDao.selectAllByPage(map);
		
		return techs;
	}

	@Override
	public int countTechByCriteria(Teacher criteriaTech) {
		int count = 0;
		
		count = techDao.countByCriteriaTech(criteriaTech);
		return count;
	}

	@Override
	public int addTech(Teacher teacher) {
		int result = 0;
		
		Teacher chkTech = techDao.selectByName(teacher.getTechname());
		if(chkTech==null){
			
			result = techDao.insertSelective(teacher);
			
		}else{
			
			result = -1;
		}
		return result;
	}

	@Override
	public int delTech(Integer techid) {
		int result = 0;
		
		result = techDao.deleteByPrimaryKey(techid);
		
		
		return result;
	}

	@Override
	public Teacher getById(Integer techid) {
		Teacher tech = null;
		
		tech = techDao.selectByPrimaryKey(techid);
	
		return tech;
	}

	@Override
	public int editTech(Teacher tech) {
		int result = 0;
		
		Teacher chkTech = techDao.selectByName(tech.getTechname());
		if(chkTech==null){
			
			result = techDao.updateByPrimaryKeySelective(tech);
			
		}else{
			if(chkTech.getTechid().equals(tech.getTechid())){
				result = techDao.updateByPrimaryKeySelective(tech);
			}else{
				
				result = -1;
			}
		}
		return result;
	}

	@Override
	public List<Teacher> getAll() {
		// TODO Auto-generated method stub
		return techDao.selectAll();
	}
}
