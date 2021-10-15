package com.baderundletters.auktionshaus.backendjavaserver;

import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@SpringBootApplication
@EnableScheduling
public class BackendJavaServerApplication {

	public static void main(String[] args) {
		SQLConnector.start_jdbc_ssl_initializer();
		EmailHandler.initialize();
		SpringApplication.run(BackendJavaServerApplication.class, args);
	}
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH")
						.allowedOrigins("*");
			}
		};
	}

}
