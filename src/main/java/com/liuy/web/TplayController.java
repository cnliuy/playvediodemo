package com.liuy.web;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
//@RequestMapping("/t")
public class TplayController {
	
	
	@RequestMapping("/playvedio")
	public  String playvedio(Map<String, Object> model, HttpServletRequest request) {
		
		String vedioplaynum =  request.getParameter("playnum");	
		//System.out.println("-------------- here  "+vedioplaynum);
		if("".equals(vedioplaynum)||vedioplaynum==null){
			return "erro";		
		}else{
			vedioplaynum = vedioplaynum.trim();
			model.put("vedioplaynum",vedioplaynum);		
			return "playceshit";		
		}
	}
}
