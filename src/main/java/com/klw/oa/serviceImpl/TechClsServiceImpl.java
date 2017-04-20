package com.klw.oa.serviceImpl;

import java.util.List;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.klw.oa.dao.TechClsMapper;
import com.klw.oa.entity.TechCls;
import com.klw.oa.service.TechClsService;
@Component("techClsService")
public class TechClsServiceImpl implements TechClsService {

	@Autowired
	SqlSessionFactory factory ;
	
	@Autowired
	TechClsMapper techClsDao;
	@Override
	public List<TechCls> getAllTechCls() {
		
		return techClsDao.selectAll();
	}
	@Override
	public String getAllTechClsByClsId(Integer clsid) {
		String techs = "";
		List<TechCls> techClses =  techClsDao.selectAllByClsId(clsid);
		TechCls tc = null;
		if(techClses.size()>0){
			for (int i=0;i<techClses.size();i++) {
				tc=techClses.get(i);
				if(i==techClses.size()-1){
					techs=techs+tc.getTeacher().getTechname();
				}else{
					techs=techs+tc.getTeacher().getTechname()+",";
					
				}
				
			}
		}else{
			techs="待分配";
		}
		return techs;
	}
	@Override
	public List<TechCls> getAllByClsId(Integer clsid) {
		
		
			
		return techClsDao.selectAllByClsId(clsid);
	}
	@Override
	public int addTechCls(TechCls tcls) {
		
		return techClsDao.insert(tcls);
	}
	@Override
	public int delTechCls(Integer techclsid) {
		// TODO Auto-generated method stub
		return techClsDao.deleteByPrimaryKey(techclsid);
	}
	@Override
	public TechCls getById(Integer techClsId) {
		// TODO Auto-generated method stub
		return techClsDao.selectByPrimaryKey(techClsId);
	}
	@Override
	public int editTechCls(TechCls tcls) {
		// TODO Auto-generated method stub
		return techClsDao.updateByPrimaryKeySelective(tcls);
	}

}
