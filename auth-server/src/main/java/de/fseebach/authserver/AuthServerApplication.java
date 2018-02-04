package de.fseebach.authserver;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.CompositeFilter;

import de.fseebach.authserver.user.User;
import de.fseebach.authserver.user.UserDetailService;
import de.fseebach.authserver.user.UserRepository;

@SpringBootApplication
@RestController
@EnableOAuth2Client
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class AuthServerApplication extends WebSecurityConfigurerAdapter implements CommandLineRunner {

	@Autowired
	private OAuth2ClientContext oauth2ClientContext;
	
	@Autowired
	private UserDetailService userDetailService;

	@Autowired
	private UserRepository userRepository;

	@Override
	public void run(String... args) throws Exception {
		//Register user
		User user = new User();
		user.setUsername("john");
		user.setPassword(encoder().encode("doe"));
		user.addAuthority(new SimpleGrantedAuthority("LOCALUSER"));
		userRepository.save(user);
		
	}

	@RequestMapping({"/user","/me"})
	public @ResponseBody User user(OAuth2Authentication principal) {
		return (User) principal.getPrincipal();
	}
	
	@Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
        	.userDetailsService(userDetailService)
        	.passwordEncoder(encoder());
    }
	
	@Bean
	public PasswordEncoder encoder() {
	    return new BCryptPasswordEncoder(11);
	}

	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
    		.authorizeRequests()
        		.antMatchers("/", "/login**").permitAll()
        		.anyRequest().authenticated()
        	.and()
        		.formLogin().loginPage("/login").permitAll()
        	.and()
        		.addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class);
	}

	private Filter ssoFilter() {
		CompositeFilter filter = new CompositeFilter();
		List<Filter> filters = new ArrayList<>();
		filters.add(ssoFilter(facebook(), "/login/facebook"));
		filter.setFilters(filters);
		return filter;
	}

	private Filter ssoFilter(ClientResources client, String path) {
		OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(path);
		OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), oauth2ClientContext);
		filter.setRestTemplate(template);
		UserInfoTokenServices tokenServices = new UserInfoTokenServices(client.getResource().getUserInfoUri(),
				client.getClient().getClientId());
		tokenServices.setRestTemplate(template);
		tokenServices.setPrincipalExtractor(this.facebookPrincipalExtractor());
		filter.setTokenServices(tokenServices);
		return filter;
	}

	@Bean
	@ConfigurationProperties("facebook")
	public ClientResources facebook() {
	  return new ClientResources();
	}

	@Bean
	public FilterRegistrationBean oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(filter);
		registration.setOrder(-100);
		return registration;
	}

	@Configuration
	@EnableResourceServer
	protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
		@Override
		public void configure(HttpSecurity http) throws Exception {
			http
				.antMatcher("/me").authorizeRequests()
				.anyRequest().authenticated();
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);
	}
	
	
	@Bean
    public PrincipalExtractor facebookPrincipalExtractor() {
        return map -> {
            String principalId = (String) map.get("id");
            
            User user = userRepository.findByFacebookId(principalId).orElseGet(() -> {
            	User u = new User();
                u = new User();
                u.setUsername("facebook-" + principalId);
                u.setFacebookId(principalId);
                u.setCreated(LocalDateTime.now());
                u.setEmail((String) map.get("email"));
                u.setFullName((String) map.get("name"));
                u.setPhoto((String) map.get("picture"));
                return u;
            });
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            return user;
        };
    }

}
