package backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.VolunteerAssignment;

public interface VolunteerAssignmentRepository extends JpaRepository<VolunteerAssignment, Long> {
    List<VolunteerAssignment> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);
    List<VolunteerAssignment> findByVolunteerIdOrderByCreatedAtDesc(Long volunteerId);
}
