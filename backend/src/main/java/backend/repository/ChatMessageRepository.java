package backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.entity.ChatMessage;


public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {


    @Query("""
        SELECT c
        FROM ChatMessage c
        WHERE c.requestId = :requestId
        AND (
            (c.senderId = :user1 AND c.receiverId = :user2)
            OR
            (c.senderId = :user2 AND c.receiverId = :user1)
        )
        ORDER BY c.timestamp ASC
    """)
    List<ChatMessage> findConversation(
            @Param("requestId") Long requestId,
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );


    List<ChatMessage> findByReceiverIdOrSenderId(
            Long receiverId,
            Long senderId
    );
}