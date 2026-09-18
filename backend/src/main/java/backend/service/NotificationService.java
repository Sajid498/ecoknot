package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.Notification;
import backend.repository.NotificationRepository;



@Service
public class NotificationService {



    private final NotificationRepository notificationRepository;





    public NotificationService(
            NotificationRepository notificationRepository
    ){

        this.notificationRepository =
                notificationRepository;

    }







    public Notification createNotification(
            Long userId,
            String message,
            String type
    ){


        Notification notification =
                new Notification(
                        userId,
                        message,
                        type
                );



        return notificationRepository.save(
                notification
        );


    }









    public List<Notification> getUserNotifications(
            Long userId
    ){


        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );


    }



}