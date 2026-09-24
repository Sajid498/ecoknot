package backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.FundDisbursement;
import backend.entity.DisbursementStatus;

public interface FundDisbursementRepository extends JpaRepository<FundDisbursement, Long> {
    List<FundDisbursement> findByAssignmentCampaignIdOrderBySubmittedAtDesc(Long campaignId);
    List<FundDisbursement> findByStatusOrderBySubmittedAtAsc(DisbursementStatus status);
}
