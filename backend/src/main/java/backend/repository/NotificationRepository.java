package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.Notification;




public interface NotificationRepository

        extends JpaRepository<Notification, Long> {






    // Get all notifications of a specific user
    // Latest notification first

    List<Notification> findByUserIdOrderByCreatedAtDesc(

            Long userId

    );









    // Count unread notifications of a user

    long countByUserIdAndReadStatusFalse(

            Long userId

    );





}