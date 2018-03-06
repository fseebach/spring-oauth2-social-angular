package de.fseebach.resourceserver1.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;


@PreAuthorize("hasAuthority('LOCALUSER')")
public interface Entity1Repository extends PagingAndSortingRepository<Entity1, Long>  {

	Page<Entity1> findAll(Pageable pageable);
}
