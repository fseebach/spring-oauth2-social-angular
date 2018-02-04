package de.fseebach.resourceserver1;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class PrincipalExtractor implements org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor {

	@Autowired
	private ObjectMapper om;
	
	@Override
	public Object extractPrincipal(Map<String, Object> map) {
		User convertValue = om.convertValue(map, User.class);
		return convertValue;
	}

}
