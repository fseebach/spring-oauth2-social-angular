package de.fseebach.authserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.social.UserIdSource;
import org.springframework.social.config.annotation.ConnectionFactoryConfigurer;
import org.springframework.social.config.annotation.EnableSocial;
import org.springframework.social.config.annotation.SocialConfigurer;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.mem.InMemoryUsersConnectionRepository;
import org.springframework.social.connect.web.ConnectController;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.security.AuthenticationNameUserIdSource;
import org.springframework.social.security.SocialUser;
import org.springframework.social.security.SocialUserDetailsService;

import de.fseebach.authserver.user.User;
import de.fseebach.authserver.user.UserRepository;

@Configuration
@EnableSocial
public class SocialConfig implements SocialConfigurer {

	@Autowired
	private UserRepository userRepository;
	
	@Bean
	public SocialUserDetailsService SocialUserDetailsService() {
		return (id) -> {
			User user = userRepository.findByUsername(id).get();
			return new SocialUser(user.getUsername(), user.getPassword(), user.getAuthorities());
		};
	}
	
	
	@Bean
    public ConnectController connectController(
                ConnectionFactoryLocator connectionFactoryLocator,
                ConnectionRepository connectionRepository) {
        return new ConnectController(connectionFactoryLocator, connectionRepository);
    }
	
	@Override
	public void addConnectionFactories(ConnectionFactoryConfigurer connectionFactoryConfigurer,
			Environment environment) {
		connectionFactoryConfigurer.addConnectionFactory(new FacebookConnectionFactory(
				environment.getProperty("facebook.clientId"),
				environment.getProperty("facebook.clientSecret")));
	}

	@Override
	public UserIdSource getUserIdSource() {
		return new AuthenticationNameUserIdSource();
	}

	@Override
	public UsersConnectionRepository getUsersConnectionRepository(ConnectionFactoryLocator connectionFactoryLocator) {
		InMemoryUsersConnectionRepository inMemoryUsersConnectionRepository = new InMemoryUsersConnectionRepository(connectionFactoryLocator);
		
		inMemoryUsersConnectionRepository.setConnectionSignUp(id -> {
			//hier muss man sehen obs zur facebook email schon einen lokalen 
			//user gibt... dann kann man die ohne signup redirect verbandeln.
			return "";
		});
		
		return inMemoryUsersConnectionRepository;
	}
}