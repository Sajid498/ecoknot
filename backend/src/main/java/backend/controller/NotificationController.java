package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.Notification;
import backend.service.NotificationService;



@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {



    private final NotificationService notificationService;




    public NotificationController(
            NotificationService notificationService
    ){

        this.notificationService =
                notificationService;

    }







    // Get notifications of a user


    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(

            @PathVariable Long userId

    ){


        return notificationService
                .getUserNotifications(userId);


    }



}