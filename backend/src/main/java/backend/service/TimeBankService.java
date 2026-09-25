package backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.entity.TimeOffer;
import backend.entity.TimeOfferStatus;
import backend.entity.TimeRequest;
import backend.entity.TimeTransaction;
import backend.entity.User;
import backend.repository.TimeOfferRepository;
import backend.repository.TimeRequestRepository;
import backend.repository.TimeTransactionRepository;
import backend.repository.UserRepository;

@Service
public class TimeBankService {

    private final TimeRequestRepository timeRequestRepository;
    private final TimeTransactionRepository timeTransactionRepository;
    private final TimeOfferRepository timeOfferRepository;
    private final UserRepository userRepository;

    public TimeBankService(
            TimeRequestRepository timeRequestRepository,
            TimeTransactionRepository timeTransactionRepository,
            TimeOfferRepository timeOfferRepository,
            UserRepository userRepository
    ) {
        this.timeRequestRepository = timeRequestRepository;
        this.timeTransactionRepository = timeTransactionRepository;
        this.timeOfferRepository = timeOfferRepository;
        this.userRepository = userRepository;
    }

    // ==================================================
    // CREATE TIME OFFER
    // ==================================================
    public TimeOffer createOffer(
            Long userId,
            String title,
            String description,
            String skillCategory,
            Integer hours
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException(
                    "Offer title is required"
            );
        }

        if (description == null || description.trim().isEmpty()) {
            throw new RuntimeException(
                    "Offer description is required"
            );
        }

        if (skillCategory == null || skillCategory.trim().isEmpty()) {
            throw new RuntimeException(
                    "Skill category is required"
            );
        }

        if (hours == null || hours <= 0) {
            throw new RuntimeException(
                    "Available hours must be greater than 0"
            );
        }

        TimeOffer offer =
                new TimeOffer(
                        user,
                        title.trim(),
                        description.trim(),
                        skillCategory.trim(),
                        hours
                );

        return timeOfferRepository.save(
                offer
        );
    }

    // ==================================================
    // GET AVAILABLE TIME OFFERS
    // ==================================================
    public List<TimeOffer> getAvailableOffers() {

        return timeOfferRepository
                .findByStatusOrderByCreatedAtDesc(
                        TimeOfferStatus.AVAILABLE
                );
    }

    // ==================================================
    // GET USER OFFERS
    // ==================================================
    public List<TimeOffer> getUserOffers(
            Long userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        return timeOfferRepository
                .findByUserId(userId);
    }

    // ==================================================
    // CREATE HELP REQUEST
    // ==================================================
    public TimeRequest createRequest(
            Long userId,
            String title,
            String description,
            String category,
            Integer hours
    ) {

        User requester =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException(
                    "Request title is required"
            );
        }

        if (description == null || description.trim().isEmpty()) {
            throw new RuntimeException(
                    "Request description is required"
            );
        }

        if (category == null || category.trim().isEmpty()) {
            throw new RuntimeException(
                    "Request category is required"
            );
        }

        if (hours == null || hours <= 0) {
            throw new RuntimeException(
                    "Required hours must be greater than 0"
            );
        }

        TimeRequest request =
                new TimeRequest(
                        requester,
                        title.trim(),
                        description.trim(),
                        category.trim(),
                        hours
                );

        return timeRequestRepository.save(
                request
        );
    }

    // ==================================================
    // GET AVAILABLE REQUESTS
    // ==================================================
    public List<TimeRequest> getOpenRequests(
            Long userId
    ) {

        return timeRequestRepository
                .findByStatusAndRequesterIdNot(
                        "OPEN",
                        userId
                );
    }

    // ==================================================
    // GET MY REQUESTS
    // ==================================================
    public List<TimeRequest> getUserRequests(
            Long userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        return timeRequestRepository
                .findByRequesterId(userId);
    }

    // ==================================================
    // ACCEPT REQUEST
    // ==================================================
    @Transactional
    public TimeRequest acceptRequest(
            Long requestId,
            Long helperId
    ) {

        TimeRequest request =
                timeRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Request not found"
                                )
                        );

        if (!"OPEN".equals(request.getStatus())) {
            throw new RuntimeException(
                    "Request is not available"
            );
        }

        User helper =
                userRepository
                        .findById(helperId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Helper not found"
                                )
                        );

        Long requesterId =
                request
                        .getRequester()
                        .getId();

        if (requesterId.equals(helperId)) {
            throw new RuntimeException(
                    "You cannot accept your own request"
            );
        }

        Integer requesterBalance =
                getBalance(
                        requesterId
                );

        Integer requiredHours =
                request.getRequiredHours();

        if (requesterBalance < requiredHours) {
            throw new RuntimeException(
                    "Requester does not have enough time credits"
            );
        }

        request.setHelper(
                helper
        );

        request.setStatus(
                "ACCEPTED"
        );

        return timeRequestRepository.save(
                request
        );
    }

    // ==================================================
    // COMPLETE REQUEST
    // Only requester can complete
    // ==================================================
    @Transactional
    public TimeTransaction completeRequest(
            Long requestId,
            Long requesterId
    ) {

        TimeRequest request =
                timeRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Request not found"
                                )
                        );

        Long actualRequesterId =
                request
                        .getRequester()
                        .getId();

        if (!actualRequesterId.equals(requesterId)) {
            throw new RuntimeException(
                    "Only the requester can complete this request"
            );
        }

        if (request.getHelper() == null) {
            throw new RuntimeException(
                    "No helper accepted this request"
            );
        }

        if (!"ACCEPTED".equals(request.getStatus())) {
            throw new RuntimeException(
                    "Request is not ready for completion"
            );
        }

        User helper =
                request.getHelper();

        User requester =
                request.getRequester();

        Integer requiredHours =
                request.getRequiredHours();

        Integer requesterBalance =
                getBalance(
                        requester.getId()
                );

        if (requesterBalance < requiredHours) {
            throw new RuntimeException(
                    "Requester does not have enough time credits to complete this transaction"
            );
        }

        request.setStatus(
                "COMPLETED"
        );

        timeRequestRepository.save(
                request
        );

        TimeTransaction transaction =
                new TimeTransaction();

        transaction.setProvider(
                helper
        );

        transaction.setRequester(
                requester
        );

        transaction.setHours(
                requiredHours
        );

        transaction.setDescription(
                "Completed help request: "
                        + request.getTitle()
        );

        transaction.setTransactionType(
                "TRANSFER"
        );

        transaction.setCreatedAt(
                LocalDateTime.now()
        );

        return timeTransactionRepository.save(
                transaction
        );
    }

    // ==================================================
    // GET HISTORY
    // ==================================================
    public List<TimeTransaction> getHistory(
            Long userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        return timeTransactionRepository
                .findByProviderIdOrRequesterIdOrderByCreatedAtDesc(
                        userId,
                        userId
                );
    }

    // ==================================================
    // GET BALANCE
    // earned - spent
    // ==================================================
    public Integer getBalance(
            Long userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        List<TimeTransaction> earnedTransactions =
                timeTransactionRepository
                        .findByProviderIdOrderByCreatedAtDesc(
                                userId
                        );

        List<TimeTransaction> spentTransactions =
                timeTransactionRepository
                        .findByRequesterIdOrderByCreatedAtDesc(
                                userId
                        );

        int earnedHours =
                earnedTransactions
                        .stream()
                        .mapToInt(
                                TimeTransaction::getHours
                        )
                        .sum();

        int spentHours =
                spentTransactions
                        .stream()
                        .mapToInt(
                                TimeTransaction::getHours
                        )
                        .sum();

        return earnedHours - spentHours;
    }
}