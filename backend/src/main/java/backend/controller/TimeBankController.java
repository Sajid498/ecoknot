package backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.TimeOffer;
import backend.entity.TimeRequest;
import backend.entity.TimeTransaction;
import backend.service.TimeBankService;

@RestController
@RequestMapping("/api/time-bank")
@CrossOrigin(origins = "*")
public class TimeBankController {

    private final TimeBankService timeBankService;

    public TimeBankController(
            TimeBankService timeBankService
    ) {
        this.timeBankService =
                timeBankService;
    }

    // ==================================================
    // CREATE TIME OFFER
    // ==================================================
    @PostMapping("/offers")
    public ResponseEntity<TimeOffer> createOffer(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String skillCategory,
            @RequestParam Integer hours
    ) {

        return ResponseEntity.ok(
                timeBankService.createOffer(
                        userId,
                        title,
                        description,
                        skillCategory,
                        hours
                )
        );
    }

    // ==================================================
    // GET AVAILABLE OFFERS
    // ==================================================
    @GetMapping("/offers")
    public ResponseEntity<List<TimeOffer>>
    getAvailableOffers() {

        return ResponseEntity.ok(
                timeBankService
                        .getAvailableOffers()
        );
    }

    // ==================================================
    // GET USER OFFERS
    // ==================================================
    @GetMapping("/offers/user/{userId}")
    public ResponseEntity<List<TimeOffer>>
    getUserOffers(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                timeBankService
                        .getUserOffers(
                                userId
                        )
        );
    }

    // ==================================================
    // CREATE HELP REQUEST
    // ==================================================
    @PostMapping("/requests")
    public ResponseEntity<TimeRequest>
    createRequest(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Integer hours
    ) {

        return ResponseEntity.ok(
                timeBankService.createRequest(
                        userId,
                        title,
                        description,
                        category,
                        hours
                )
        );
    }

    // ==================================================
    // GET AVAILABLE REQUESTS
    // ==================================================
    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<TimeRequest>>
    getAvailableRequests(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                timeBankService
                        .getOpenRequests(
                                userId
                        )
        );
    }

    // ==================================================
    // GET MY REQUESTS
    // ==================================================
    @GetMapping("/my-requests/{userId}")
    public ResponseEntity<List<TimeRequest>>
    getMyRequests(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                timeBankService
                        .getUserRequests(
                                userId
                        )
        );
    }

    // ==================================================
    // ACCEPT REQUEST
    // ==================================================
    @PutMapping("/accept/{requestId}")
    public ResponseEntity<TimeRequest>
    acceptRequest(
            @PathVariable Long requestId,
            @RequestParam Long helperId
    ) {

        return ResponseEntity.ok(
                timeBankService.acceptRequest(
                        requestId,
                        helperId
                )
        );
    }

    // ==================================================
    // COMPLETE REQUEST
    // Only requester can complete
    // ==================================================
    @PutMapping("/complete/{requestId}")
    public ResponseEntity<TimeTransaction>
    completeRequest(
            @PathVariable Long requestId,
            @RequestParam Long requesterId
    ) {

        return ResponseEntity.ok(
                timeBankService.completeRequest(
                        requestId,
                        requesterId
                )
        );
    }

    // ==================================================
    // GET HISTORY
    // ==================================================
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TimeTransaction>>
    getHistory(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                timeBankService
                        .getHistory(
                                userId
                        )
        );
    }

    // ==================================================
    // GET BALANCE
    // ==================================================
    @GetMapping("/balance/{userId}")
    public ResponseEntity<Integer>
    getBalance(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                timeBankService
                        .getBalance(
                                userId
                        )
        );
    }
}