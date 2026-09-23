package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.TimeRequest;





public interface TimeRequestRepository 

extends JpaRepository<TimeRequest, Long>{





    // Get all open help requests

    List<TimeRequest> findByStatus(String status);






    // Get requests created by a specific user

    List<TimeRequest> findByRequesterId(Long userId);





}