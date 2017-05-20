package com.klw.oa.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {

		HttpServletRequest request=(HttpServletRequest)arg0;
		HttpServletResponse response = (HttpServletResponse)arg1;
		String url = request.getRequestURL().toString();
		String qs =request.getQueryString();
		url += qs;
		System.out.println(url);
		HttpSession session = request.getSession();
		/*if(url.indexOf("login")==-1&&url.indexOf("css")==-1&&url.indexOf("jquery")==-1){
			if(session.getAttribute("user")==null){
				response.sendRedirect(request.getContextPath()+"/login.jsp");
				return ;
			}else{
				arg2.doFilter(request, response);
			}
		}else{
			arg2.doFilter(request, response);
		}*/
		arg2.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
