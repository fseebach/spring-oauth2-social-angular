package de.fseebach.authserver.user;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>{

	public Optional<User> findByFacebookId(String id);
	public Optional<User> findByUsername(String userName);
	
}
