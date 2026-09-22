package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.Notification;
import backend.exception.ResourceNotFoundException;
import backend.repository.NotificationRepository;




@Service
public class NotificationService {




    private final NotificationRepository notificationRepository;







    public NotificationService(

            NotificationRepository notificationRepository

    ){


        this.notificationRepository = notificationRepository;


    }









    // Create notification

    public Notification createNotification(

            Long userId,

            String message,

            String type

    ){



        Notification notification = new Notification(

                userId,

                message,

                type

        );





        return notificationRepository.save(

                notification

        );


    }









    // Get all notifications of a user

    public List<Notification> getUserNotifications(

            Long userId

    ){



        return notificationRepository

                .findByUserIdOrderByCreatedAtDesc(

                        userId

                );


    }









    // Get unread notification count

    public long getUnreadCount(

            Long userId

    ){



        return notificationRepository

                .countByUserIdAndReadStatusFalse(

                        userId

                );


    }









    // Mark notification as read

    public Notification markAsRead(

            Long id

    ){



        Notification notification =

                notificationRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Notification not found with id: "

                                        + id

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