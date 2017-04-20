package com.klw.oa.entity;

import java.util.Date;

import javax.annotation.Resource;


import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;
@Component("tcls")
public class TechCls {
    private Integer techclsid;
    @Resource(name="cls")
    private Classes classes;
    @Resource(name="teach")
    private Teacher teacher;
    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date startdate;
    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date enddate;

    private Integer phase;

    public Integer getTechclsid() {
        return techclsid;
    }

    public void setTechclsid(Integer techclsid) {
        this.techclsid = techclsid;
    }

  

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public Integer getPhase() {
        return phase;
    }

    public void setPhase(Integer phase) {
        this.phase = phase;
    }

	@Override
	public String toString() {
		return "TechCls [techclsid=" + techclsid + ", classes=" + classes
				+ ", teacher=" + teacher + ", startdate=" + startdate
				+ ", enddate=" + enddate + ", phase=" + phase + "]";
	}

	public Classes getClasses() {
		return classes;
	}

	public void setClasses(Classes classes) {
		this.classes = classes;
	}

	public Teacher getTeacher() {
		return teacher;
	}

	public void setTeacher(Teacher teacher) {
		this.teacher = teacher;
	}
    
    
}