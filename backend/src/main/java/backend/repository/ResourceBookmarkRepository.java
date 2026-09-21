package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.ResourceBookmark;
import backend.entity.User;




@Repository
public interface ResourceBookmarkRepository

extends JpaRepository<ResourceBookmark, Long>{





    List<ResourceBookmark> findByUser(

            User user

    );





    boolean existsByUserIdAndResourceId(

            Long userId,

            Long resourceId

    );





    void deleteByUserIdAndResourceId(

            Long userId,

            Long resourceId

    );



}