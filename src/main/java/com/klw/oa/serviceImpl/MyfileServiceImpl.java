package com.klw.oa.serviceImpl;

import com.klw.oa.dao.MyfileMapper;
import com.klw.oa.entity.Myfile;
import com.klw.oa.service.MyfileService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by exciak on 2017/5/4.
 */
@Service("MyfileServiceImpl")
public class MyfileServiceImpl implements MyfileService{

    @Autowired
    SqlSessionFactory factory;
    @Autowired
    MyfileMapper fileDao;

    @Override
    public List<Myfile> getAllFileFromAdminId(Integer userId) {
        return fileDao.selectByUserId(userId);
    }

    @Override
    public int insertFileSer(Myfile myfile) {
        int result = 0;
        fileDao.insertSelective(myfile);
        result = 1;
        return result;
    }

    @Override
    public Myfile getFileById(Integer fileId) {
        return fileDao.selectByPrimaryKey(fileId);
    }

    @Override
    public int delMyFileSer(Integer myfileId) {

        int result = fileDao.deleteByPrimaryKey(myfileId);
        return result;
    }
}
