package com.klw.oa.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.klw.oa.dao.ClassesMapper;
import com.klw.oa.dao.ProfessionMapper;
import com.klw.oa.entity.Profession;
import com.klw.oa.service.ProfessionService;

@Component("proService")
public class ProfessionServiceImpl implements ProfessionService {
	@Autowired
	SqlSessionFactory factory;
	@Autowired
	ProfessionMapper professionDao;
	@Autowired
	ClassesMapper classDao;

	public ProfessionServiceImpl() {
	}

	@Override
	public List<Profession> getAllPros() {

		List<Profession> professions = null;

		professions = professionDao.selectAll();

		return professions;
	}

	@Override
	public Profession getByName(String name) {

		Profession profession = null;

		profession = professionDao.selectByName(name);

		return profession;
	}

	@Override
	public Profession getById(Integer id) {

		Profession profession = null;

		profession = professionDao.selectByPrimaryKey(id);

		return profession;
	}

	@Override
	public int addProfession(Profession profession) {
		int result = 0;

		Profession chkProfession = professionDao.selectByName(profession
				.getProsname());
		if (chkProfession == null) {

			result = professionDao.insertSelective(profession);
			System.out.println("===================================="+profession.getProsid());
		} else {

			result = -1;
		}
		return result;
	}

	@Override
	public List<Profession> getAllProsByPage(Profession professionCriteria,
			int pageIndex, int pageNum) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("professionCriteria", professionCriteria);
		map.put("pageIndex", pageIndex);
		map.put("pageNum", pageNum);

		List<Profession> professions = null;

		professions = professionDao.selectAllByPage(map);
		
		Profession pros = professionDao.selectProById(3);

		System.out.println("==========================================================="+pros);
		return professions;

	}

	@Override
	public int countProsByName(Profession profession) {
		int count = 0;
		count = professionDao.countByProfess(profession);
		return count;
	}

	@Override
	public int delProfession(Integer prosid) {
		int result = 0;

		int count = 0;
		count = classDao.selectByProsId(prosid);
		if (count == 0) {

			result = professionDao.deleteByPrimaryKey(prosid);

		} else {
			result = -1;
		}
		return result;
	}

	@Override
	public int editProfession(Profession profession) {
		int result = 0;

		Profession chkProfession = professionDao.selectByName(profession
				.getProsname());
		if (chkProfession == null) {

			result = professionDao.updateByPrimaryKeySelective(profession);

		} else {
			if (chkProfession.getProsid().equals(profession.getProsid())) {
				result = professionDao.updateByPrimaryKeySelective(profession);
			} else {

				result = -1;
			}
		}
		return result;
	}

}
