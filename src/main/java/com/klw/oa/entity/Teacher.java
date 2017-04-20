package com.klw.oa.entity;

import org.springframework.stereotype.Component;

@Component("teach")
public class Teacher {
    private Integer techid;

    private String techname;

    private String gender;

    private Integer age;

    public Integer getTechid() {
        return techid;
    }

    public void setTechid(Integer techid) {
        this.techid = techid;
    }

    public String getTechname() {
        return techname;
    }

    public void setTechname(String techname) {
        this.techname = techname == null ? null : techname.trim();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}