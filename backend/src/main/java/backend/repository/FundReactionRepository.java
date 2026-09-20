package backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.FundReaction;
public interface FundReactionRepository extends JpaRepository<FundReaction,Long>{ Optional<FundReaction> findByCampaignIdAndUserId(Long campaignId,Long userId); long countByCampaignId(Long campaignId); }
