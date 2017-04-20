package com.klw.oa.entity;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;
@Component("pros")
public class Profession {
    private Integer prosid;

    private String prosname;

    private String prosdesc;
    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date createDate;
    
    private List<Classes> classes;
    

    public List<Classes> getClasses() {
		return classes;
	}

	public void setClasses(List<Classes> classes) {
		this.classes = classes;
	}

	public Integer getProsid() {
        return prosid;
    }

    public void setProsid(Integer prosid) {
        this.prosid = prosid;
    }

    public String getProsname() {
        return prosname;
    }

    public void setProsname(String prosname) {
        this.prosname = prosname == null ? null : prosname.trim();
    }

    public String getProsdesc() {
        return prosdesc;
    }

    public void setProsdesc(String prosdesc) {
        this.prosdesc = prosdesc == null ? null : prosdesc.trim();
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

	@Override
	public String toString() {
		return "Profession [prosid=" + prosid + ", prosname=" + prosname
				+ ", prosdesc=" + prosdesc + ", createDate=" + createDate
				+ ", classes=" + classes + "]";
	}

	
    
}