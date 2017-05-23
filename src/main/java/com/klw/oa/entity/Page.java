package com.klw.oa.entity;

import org.springframework.stereotype.Component;

@Component("page")
public class Page {

	private Integer page;
	private Integer rows;
	private Integer total;
	private Integer totalPage;

	public void setTotal(Integer total) {
		this.total = total;
	}

	public void setTotalPage(Integer totalPage) {
		this.totalPage = totalPage;
	}

	public Integer getTotal() {
		return total;
	}

	public Integer getTotalPage() {
		return totalPage;
	}

	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public Integer getRows() {
		return rows;
	}
	public void setRows(Integer rows) {
		this.rows = rows;
	}
	
}
