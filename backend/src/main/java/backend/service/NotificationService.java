package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.Notification;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.NotificationRepository;
import backend.repository.UserRepository;


@Service
public class NotificationService {


    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;





    public NotificationService(

            NotificationRepository notificationRepository,

            UserRepository userRepository

    ){


        this.notificationRepository =
                notificationRepository;


        this.userRepository =
                userRepository;

    }








    // =====================================
    // Create notification using User object
    // =====================================

    public Notification createNotification(

            User user,

            String message,

            String type

    ){


        Notification notification =
                new Notification();


        notification.setUser(
                user
        );


        notification.setMessage(
                message
        );


        notification.setType(
                type
        );


        notification.setCreatedAt(
                LocalDateTime.now()
        );


        notification.setReadStatus(
                false
        );


        return notificationRepository.save(
                notification
        );

    }








    // =====================================
    // Create notification using user ID
    // =====================================

    public Notification createNotification(

            Long userId,

            String message,

            String type

    ){


        User user =

                userRepository

                        .findById(
                                userId
                        )

                        .orElseThrow(

                                () ->

                                        new ResourceNotFoundException(

                                                "User not found with id: "
                                                +
                                                userId

                                        )

                        );



        return createNotification(

                user,

                message,

                type

        );

    }








    // =====================================
    // Get all notifications of a user
    // =====================================

    public List<Notification> getUserNotifications(

            Long userId

    ){


        return notificationRepository

                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );

    }








    // =====================================
    // Get unread notification count
    // =====================================

    public long getUnreadCount(

            Long userId

    ){


        return notificationRepository

                .countByUserIdAndReadStatusFalse(
                        userId
                );

    }








    // =====================================
    // Mark notification as read
    // =====================================

    public Notification markAsRead(

            Long id

    ){


        Notification notification =

                notificationRepository

                        .findById(
                                id
                        )

                        .orElseThrow(

                                () ->

                                        new ResourceNotFoundException(

                                                "Notification not found with id: "
                                                +
                                                id

                                        )

                        );



        notification.setReadStatus(
                true
        );


        notification.setReadAt(
                LocalDateTime.now()
        );


        return notificationRepository.save(
                notification
        );

    }


}