package backend.repository;

import backend.entity.BloodRequest;
import backend.entity.BloodGroup;
import backend.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByBloodGroup(BloodGroup bloodGroup);

    List<BloodRequest> findByStatus(RequestStatus status);

    List<BloodRequest> findByLocationContainingIgnoreCase(String location);
}