package de.fseebach.resourceserver1;

import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

import de.fseebach.resourceserver1.entity.Entity1;

@SpringBootApplication
@EnableDiscoveryClient
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ResourceServer1Application extends ResourceServerConfigurerAdapter implements CommandLineRunner {

	@Autowired
	private EntityManager em;

	public static void main(String[] args) {
		SpringApplication.run(ResourceServer1Application.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		IntStream.range(1, 100).boxed().map(i -> new Entity1("Entity " + i)).forEach(em::persist);

	}
		
}
