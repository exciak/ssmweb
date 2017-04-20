package com.klw.oa.entity;

import java.util.Date;

import javax.annotation.Resource;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;
@Component("cls")
public class Classes {
    private Integer classid;

    private String classname;

    private String classdesc;
    @Resource(name="pros")
    private Profession pros;
    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date createDate;
    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date enddate;

    public Integer getClassid() {
        return classid;
    }

    public void setClassid(Integer classid) {
        this.classid = classid;
    }

    public String getClassname() {
        return classname;
    }

    public void setClassname(String classname) {
        this.classname = classname == null ? null : classname.trim();
    }

    public String getClassdesc() {
        return classdesc;
    }

    public void setClassdesc(String classdesc) {
        this.classdesc = classdesc == null ? null : classdesc.trim();
    }

    public Profession getPros() {
		return pros;
	}
    public void setPros(Profession pros) {
		this.pros = pros;
	}

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

	@Override
	public String toString() {
		return "Classes [classid=" + classid + ", classname=" + classname
				+ ", classdesc=" + classdesc + ", pros=" + pros
				+ ", createDate=" + createDate + ", enddate=" + enddate + "]";
	}
    
}