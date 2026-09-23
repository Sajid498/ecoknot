package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.TimeRequest;



public interface TimeRequestRepository 
extends JpaRepository<TimeRequest, Long>{



    List<TimeRequest> findByStatus(String status);



    List<TimeRequest> findByRequesterId(Long userId);



    List<TimeRequest> findByStatusAndRequesterIdNot(
            String status,
            Long userId
    );


}