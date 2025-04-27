package com.todoApp;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title = "Todo Application REST API Documentation",
				description = "Todo Application REST API Documentation",
				version = "v1",
				contact = @Contact(
						name = "Beining Xu",
						email = "wanyue77@outlook.com"
				)

		)

)
public class RestfulWebServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestfulWebServicesApplication.class, args);
	}
	
	//http://localhost:3000/ to 8080
	//Cross Origin Requests
	//Allow all requests only from http://localhost:3000/
	
//	@Bean
//	public WebMvcConfigurer corsConfigurer() {
//		return new WebMvcConfigurer() {
//			public void addCorsMappings(CorsRegistry registry) {
//				registry.addMapping("/**")
//					.allowedMethods("*")
//					.allowedOrigins("*");//#CHANGE //NOT RECOMMENDED FOR PRODUCTION
//			}
//		};
//	}

}
