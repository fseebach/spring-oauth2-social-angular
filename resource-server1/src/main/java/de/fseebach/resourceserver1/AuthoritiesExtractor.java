package de.fseebach.resourceserver1;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.databind.ObjectMapper;

public class AuthoritiesExtractor implements org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor {

	@Autowired
	private ObjectMapper om;
	
	@Override
	public List<GrantedAuthority> extractAuthorities(Map<String, Object> map) {
		map.get("authorities");
		return null;
	}

}
