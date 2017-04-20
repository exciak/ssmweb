package com.klw.oa.entity;

import org.springframework.stereotype.Component;

@Component("dept")
public class Dept {
    private Integer dept_id;

    private Integer pid;

    private String dept_name;

    private String dept_url;

    public Integer getDept_id() {
        return dept_id;
    }

    public void setDept_id(Integer dept_id) {
        this.dept_id = dept_id;
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public String getDept_name() {
        return dept_name;
    }

    public void setDept_name(String dept_name) {
        this.dept_name = dept_name == null ? null : dept_name.trim();
    }

    public String getDept_url() {
        return dept_url;
    }

    public void setDept_url(String dept_url) {
        this.dept_url = dept_url == null ? null : dept_url.trim();
    }

	@Override
	public String toString() {
		return "Dept [dept_id=" + dept_id + ", pid=" + pid + ", dept_name="
				+ dept_name + ", dept_url=" + dept_url + "]";
	}
    
}