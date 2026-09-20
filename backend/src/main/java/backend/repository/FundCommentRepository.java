package backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.FundComment;
public interface FundCommentRepository extends JpaRepository<FundComment,Long>{ List<FundComment> findByCampaignIdOrderByCreatedAtAsc(Long campaignId); }
