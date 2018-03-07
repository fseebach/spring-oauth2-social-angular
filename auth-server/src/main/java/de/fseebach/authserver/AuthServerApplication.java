package de.fseebach.authserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.social.security.SpringSocialConfigurer;
import org.springframework.web.bind.annotation.RestController;

import de.fseebach.authserver.user.User;
import de.fseebach.authserver.user.UserDetailService;
import de.fseebach.authserver.user.UserRepository;

@SpringBootApplication
@RestController
public class AuthServerApplication 
	extends WebSecurityConfigurerAdapter 
	implements CommandLineRunner {
	
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		http
	        .formLogin()
	            .loginPage("/signin")
	            .loginProcessingUrl("/signin/authenticate")
	            .failureUrl("/signin?error=bad_credentials")
	        .and()
	            .logout()
	                .logoutUrl("/signout")
	                .deleteCookies("JSESSIONID")
	        .and()
	            .authorizeRequests()
	                .antMatchers("/favicon.ico", "/signin","/signup", "/connect/facebook").permitAll()
	                .antMatchers("/**").authenticated()
	        .and()
	            .rememberMe()
	        .and()
	            .apply(new SpringSocialConfigurer());
	}


	@Autowired
	private UserRepository userRepository;

	
	@Autowired
	private UserDetailService userDetailService;
	
	@Override
	public void run(String... args) throws Exception {
		User user = new User();
		user.setUsername("john");
		user.setPassword("{noop}doe");
		user.addAuthority(new SimpleGrantedAuthority("LOCALUSER"));
		userRepository.save(user);
		
	}

	@Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
        	.userDetailsService(userDetailService);
    }
	
	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		// TODO Auto-generated method stub
		return super.authenticationManagerBean();
	}

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);
	}


}
