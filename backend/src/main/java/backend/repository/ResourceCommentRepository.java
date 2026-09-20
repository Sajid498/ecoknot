package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.ResourceComment;



@Repository
public interface ResourceCommentRepository

extends JpaRepository<ResourceComment, Long>{



    List<ResourceComment> findByResourceId(Long resourceId);


}