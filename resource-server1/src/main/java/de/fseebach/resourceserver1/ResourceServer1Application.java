package de.fseebach.resourceserver1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import de.fseebach.resourceserver1.entity.Entity1;
import de.fseebach.resourceserver1.entity.Entity1Repository;

@SpringBootApplication
@EnableDiscoveryClient
@EnableResourceServer
@RestController
public class ResourceServer1Application {

	@Autowired
	private Entity1Repository repository;
	
	@GetMapping("api/helloworld")
	public @ResponseBody Entity1 helloWorld() {
		Entity1 entity1 = new Entity1();
		entity1.setId(123L);
		return entity1;
	}
	
	
	public static void main(String[] args) {
		SpringApplication.run(ResourceServer1Application.class, args);
	}
	
}
