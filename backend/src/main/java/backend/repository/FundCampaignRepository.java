package backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.FundCampaign;
import backend.entity.FundStatus;
public interface FundCampaignRepository extends JpaRepository<FundCampaign,Long>{ List<FundCampaign> findByStatusOrderByCreatedAtDesc(FundStatus status); List<FundCampaign> findByAuthorIdOrderByCreatedAtDesc(Long authorId); }
