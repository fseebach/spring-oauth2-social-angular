package de.fseebach.authserver.signup;

import java.awt.TrayIcon.MessageType;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.WebRequest;

import de.fseebach.authserver.message.Message;
import de.fseebach.authserver.user.User;
import de.fseebach.authserver.user.UserRepository;

@Controller
public class SignupController {

	private final ProviderSignInUtils providerSignInUtils;
	private UserRepository userRepository;

	@Autowired
	public SignupController(UserRepository userRepository, 
		                    ConnectionFactoryLocator connectionFactoryLocator,
		                    UsersConnectionRepository connectionRepository) {
		this.userRepository = userRepository;
		this.providerSignInUtils = new ProviderSignInUtils(connectionFactoryLocator, connectionRepository);
	}

	@RequestMapping(value="/signup", method=RequestMethod.GET)
	public SignupForm signupForm(WebRequest request) {
		Connection<?> connection = providerSignInUtils.getConnectionFromSession(request);
		
		if (connection != null) {
			request.setAttribute("message", new Message(MessageType.INFO, "Your " + StringUtils.capitalize(connection.getKey().getProviderId()) + " account is not associated with a Spring Social Showcase account. If you're new, please sign up."), WebRequest.SCOPE_REQUEST);
			return SignupForm.fromProviderUser(connection.fetchUserProfile());
		} else {
			return new SignupForm();
		}
	}

	@RequestMapping(value="/signup", method=RequestMethod.POST)
	@Transactional
	public String signup(@Valid SignupForm form, BindingResult formBinding, WebRequest request) {
		if (formBinding.hasErrors()) {
			return null;
		}
		User account = createAccount(form, formBinding);
		if (account != null) {
			SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(account.getUsername(), null, null));
			providerSignInUtils.doPostSignUp(account.getUsername(), request);
			
			return this.getRedirectUrl(request);
		}
		return null;
	}

	private String getRedirectUrl(WebRequest request) {
		
		String red = Optional.ofNullable(request.getAttribute("SPRING_SECURITY_SAVED_REQUEST",1))
			.map(req -> ((DefaultSavedRequest)req).getRedirectUrl()).orElse("/");
		
		return "redirect:" + red;
		
	}
	
	private User createAccount(SignupForm form, BindingResult formBinding) {
		try {
			User u = new User();
			u.setUsername(form.getUsername());
			u.setPassword("{noop}" + form.getPassword());
			u.setFirstName(form.getFirstName());
			u.setLastName(form.getLastName());
			u.setEmail(form.getEmail());
			u.addAuthority(new SimpleGrantedAuthority("LOCALUSER"));
			userRepository.save(u);
			return u;
		} catch (Exception e) {
			formBinding.rejectValue("username", "user.duplicateUsername", "already in use");
			return null;
		}
	}

}
