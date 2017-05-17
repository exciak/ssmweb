package com.klw.oa.service;

import com.klw.oa.entity.User;

/**
 * Created by Administrator on 2017/5/17.
 */
public interface UserService {

    User getUserById (Integer userId);

    boolean loginCheck(User user);

    User getUserByName(String userName);

    int addUser(User user);
}
