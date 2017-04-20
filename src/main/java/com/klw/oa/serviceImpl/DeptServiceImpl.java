package com.klw.oa.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.klw.oa.dao.DeptMapper;
import com.klw.oa.entity.Dept;
import com.klw.oa.service.DeptService;
@Component("deptSer")
public class DeptServiceImpl implements DeptService {

	@Autowired
	SqlSessionFactory factory;
	@Autowired
	DeptMapper deptDao;
	@Override
	public List<Map<Object, Object>> getAllMap() {
		return deptDao.selectAllMap();
	}
	@Override
	public int addDept(Dept dept) {
		int result = 0;
		
		Dept chkDept = deptDao.selectByName(dept.getDept_name());
		if(chkDept==null){
			
			result = deptDao.insertSelective(dept);
			
		}else{
			
			result = -1;
		}
		return result;
	}
	@Override
	public int editDept(Dept dept) {
		int result = 0;
		
		Dept chkDept = deptDao.selectByName(dept.getDept_name());
		if(chkDept==null){
			
			result = deptDao.updateByPrimaryKeySelective(dept);
			
		}else{
			if(chkDept.getDept_name().equals(dept.getDept_name())){
				result = deptDao.updateByPrimaryKeySelective(dept);
			}else{
				
				result = -1;
			}
		}
		return result;
	}

	@Override
	public int delDept(Dept dept) {
		return deptDao.deleteByUrl(dept.getDept_id().toString());
	}

}
