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

    ){

        this.timeBankService = timeBankService;

    }









    // ======================================
    // CREATE HELP REQUEST
    // ======================================


    @PostMapping("/requests")
    public ResponseEntity<TimeRequest> createRequest(

            @RequestParam Long userId,

            @RequestParam String title,

            @RequestParam String description,

            @RequestParam String category,

            @RequestParam Integer hours

    ){


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









    // ======================================
    // GET OPEN REQUESTS
    // ======================================


    @GetMapping("/requests")
    public ResponseEntity<List<TimeRequest>> getRequests(){


        return ResponseEntity.ok(

                timeBankService.getOpenRequests()

        );


    }









    // ======================================
    // GET USER REQUESTS
    // ======================================


    @GetMapping("/requests/user/{userId}")
    public ResponseEntity<List<TimeRequest>> getUserRequests(

            @PathVariable Long userId

    ){


        return ResponseEntity.ok(

                timeBankService.getUserRequests(userId)

        );


    }









    // ======================================
    // ACCEPT REQUEST
    // ======================================


    @PutMapping("/accept/{requestId}")
    public ResponseEntity<TimeRequest> acceptRequest(

            @PathVariable Long requestId

    ){


        return ResponseEntity.ok(

                timeBankService.acceptRequest(requestId)

        );


    }









    // ======================================
    // COMPLETE REQUEST
    // ======================================


    @PutMapping("/complete/{requestId}")
    public ResponseEntity<TimeTransaction> completeRequest(

            @PathVariable Long requestId,

            @RequestParam Long helperId

    ){


        return ResponseEntity.ok(

                timeBankService.completeRequest(

                        requestId,

                        helperId

                )

        );


    }









    // ======================================
    // BALANCE
    // ======================================


    @GetMapping("/balance/{userId}")
    public ResponseEntity<Integer> getBalance(

            @PathVariable Long userId

    ){


        return ResponseEntity.ok(

                timeBankService.getBalance(userId)

        );


    }



}