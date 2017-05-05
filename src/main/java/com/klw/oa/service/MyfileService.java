package com.klw.oa.service;

import com.klw.oa.entity.Myfile;

import java.util.List;

/**
 * Created by exciak on 2017/5/4.
 */
public interface MyfileService {
    List<Myfile> getAllFileFromAdminId(Integer userId);

    int insertFileSer(Myfile myfile);

    Myfile getFileById(Integer fileId);

    int delMyFileSer(Integer myfileId);
}
