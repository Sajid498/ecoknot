package backend.controller;


import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import backend.entity.TimeOffer;
import backend.entity.TimeTransaction;
import backend.service.TimeBankService;



@RestController
@RequestMapping("/api/time-bank")
@CrossOrigin(origins = "*")
public class TimeBankController {





    private final TimeBankService timeBankService;







    public TimeBankController(

            TimeBankService timeBankService

    ){

        this.timeBankService = timeBankService;

    }









    // ==================================
    // Create Time Offer
    // ==================================

    @PostMapping("/offers")
    public ResponseEntity<TimeOffer> createOffer(

            @RequestParam Long userId,

            @RequestParam String title,

            @RequestParam String description,

            @RequestParam String skillCategory,

            @RequestParam Integer hours

    ){



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









    // ==================================
    // Get Available Offers
    // ==================================

    @GetMapping("/offers")
    public ResponseEntity<List<TimeOffer>> getOffers(){



        return ResponseEntity.ok(

                timeBankService.getAvailableOffers()

        );


    }









    // ==================================
    // Get My Offers
    // ==================================

    @GetMapping("/my-offers/{userId}")
    public ResponseEntity<List<TimeOffer>> getMyOffers(

            @PathVariable Long userId

    ){



        return ResponseEntity.ok(

                timeBankService.getUserOffers(

                        userId

                )

        );


    }









    // ==================================
    // Complete Exchange
    // ==================================

    @PutMapping("/complete/{offerId}")
    public ResponseEntity<TimeTransaction> completeExchange(

            @PathVariable Long offerId,

            @RequestParam Long userId

    ){



        return ResponseEntity.ok(

                timeBankService.completeExchange(

                        userId,

                        offerId

                )

        );


    }









    // ==================================
    // Spend Credits
    // ==================================

    @PostMapping("/spend")
    public ResponseEntity<TimeTransaction> spendCredits(

            @RequestParam Long userId,

            @RequestParam Integer hours,

            @RequestParam String description

    ){



        return ResponseEntity.ok(

                timeBankService.spendCredits(

                        userId,

                        hours,

                        description

                )

        );


    }









    // ==================================
    // Get Balance
    // ==================================

    @GetMapping("/balance/{userId}")
    public ResponseEntity<Integer> getBalance(

            @PathVariable Long userId

    ){



        return ResponseEntity.ok(

                timeBankService.getBalance(

                        userId

                )

        );


    }









    // ==================================
    // Transaction History
    // ==================================

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TimeTransaction>> getHistory(

            @PathVariable Long userId

    ){



        return ResponseEntity.ok(

                timeBankService.getHistory(

                        userId

                )

        );


    }



}