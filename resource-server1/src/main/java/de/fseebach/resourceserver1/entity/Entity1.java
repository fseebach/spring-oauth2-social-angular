package de.fseebach.resourceserver1.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Entity1 {

	@Id
	private Long id;
	
	private String property1;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProperty1() {
		return property1;
	}

	public void setProperty1(String property1) {
		this.property1 = property1;
	}
	
}
