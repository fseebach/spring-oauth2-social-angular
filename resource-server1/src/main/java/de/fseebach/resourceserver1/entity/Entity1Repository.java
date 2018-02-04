package de.fseebach.resourceserver1.entity;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasAuthority('LOCALUSER')")
public interface Entity1Repository extends PagingAndSortingRepository<Entity1, Long>  {
	
}
