package de.fseebach.authserver.signin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SigninController {

	@GetMapping("/signin")
	public void signin() {
	}
	
}
