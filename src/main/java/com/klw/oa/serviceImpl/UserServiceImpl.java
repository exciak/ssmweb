package com.klw.oa.serviceImpl;

import com.klw.oa.dao.QuestionnaireMapper;
import com.klw.oa.dao.UserMapper;
import com.klw.oa.entity.User;
import com.klw.oa.service.UserService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/5/17.
 */
@Service("UserServiceImpl")
public class UserServiceImpl implements UserService {
    @Autowired
    SqlSessionFactory factory;
    @Autowired
    UserMapper userMapper;
    @Override
    public User getUserById(Integer userId) {
        return userMapper.selectByPrimaryKey(userId);
    }

    /**
     * 判断是否登录成功
     * @param user
     * @return
     */
    @Override
    public boolean loginCheck(User user) {
        boolean b = false;

        User u = userMapper.selectByUserName(user.getUserName());
        if(u!=null){
            if(u.getPassword().equals(u.getPassword())){
                b = true;
            }
        }
        return b;
    }


    @Override
    public User getUserByName(String userName) {
        return userMapper.selectByUserName(userName);
    }

    @Override
    public int addUser(User user) {
        int result = 0;

        User existUser = userMapper.selectByUserName(user.getUserName());
        if(existUser==null){

            result = userMapper.insertSelective(user);

        }else{

            result = -1;
        }
        return result;
    }
}
