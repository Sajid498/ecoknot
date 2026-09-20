package backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.FundContribution;
public interface FundContributionRepository extends JpaRepository<FundContribution,Long>{ List<FundContribution> findByCampaignIdOrderByCreatedAtDesc(Long campaignId); List<FundContribution> findByDonorIdOrderByCreatedAtDesc(Long donorId); }
