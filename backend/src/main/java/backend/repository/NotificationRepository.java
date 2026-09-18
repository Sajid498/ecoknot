package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.Notification;



public interface NotificationRepository 
        extends JpaRepository<Notification, Long> {




    // Get all notifications of a user

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );







    // Count unread notifications

    long countByUserIdAndReadStatusFalse(
            Long userId
    );



}