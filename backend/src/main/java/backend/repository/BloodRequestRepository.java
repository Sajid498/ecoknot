package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.BloodGroup;
import backend.entity.BloodRequest;


public interface BloodRequestRepository 
        extends JpaRepository<BloodRequest, Long>{


    List<BloodRequest> findByUserId(Long userId);


    List<BloodRequest> findByBloodGroup(BloodGroup bloodGroup);


}