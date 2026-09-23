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









    // ==================================================
    // CREATE HELP REQUEST
    // ==================================================

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









    // ==================================================
    // GET AVAILABLE REQUESTS
    // Show other users' OPEN requests
    // ==================================================

    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<TimeRequest>> getAvailableRequests(


            @PathVariable Long userId


    ){


        return ResponseEntity.ok(

                timeBankService.getOpenRequests(

                        userId

                )

        );


    }









    // ==================================================
    // GET MY REQUESTS
    // ==================================================

    @GetMapping("/my-requests/{userId}")
    public ResponseEntity<List<TimeRequest>> getMyRequests(


            @PathVariable Long userId


    ){


        return ResponseEntity.ok(

                timeBankService.getUserRequests(

                        userId

                )

        );


    }









    // ==================================================
    // ACCEPT REQUEST
    // User B accepts User A request
    // ==================================================

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<TimeRequest> acceptRequest(


            @PathVariable Long requestId,


            @RequestParam Long helperId


    ){



        return ResponseEntity.ok(


                timeBankService.acceptRequest(


                        requestId,


                        helperId


                )


        );


    }









    // ==================================================
    // COMPLETE REQUEST
    // Helper earns credits
    // ==================================================

    @PutMapping("/complete/{requestId}")
    public ResponseEntity<TimeTransaction> completeRequest(


            @PathVariable Long requestId


    ){



        return ResponseEntity.ok(


                timeBankService.completeRequest(


                        requestId


                )


        );


    }









    // ==================================================
    // GET BALANCE
    // ==================================================

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




}