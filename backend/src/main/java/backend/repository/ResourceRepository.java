package backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.Resource;



@Repository
public interface ResourceRepository 
extends JpaRepository<Resource, Long>{


}