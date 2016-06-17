package com.liuy;

import javax.servlet.Filter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.HttpPutFormContentFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


//@Configuration
//@EnableAutoConfiguration
//@ComponentScan
@SpringBootApplication
//public class PlayvediodemoApplication  extends WebMvcConfigurerAdapter{
public class PlayvediodemoApplication  extends SpringBootServletInitializer{
	
	public static void main(String[] args) {
		SpringApplication.run(PlayvediodemoApplication.class, args);
	}
	

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(PlayvediodemoApplication.class);
    }
}


