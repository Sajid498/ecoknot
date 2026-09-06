package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.ChatMessage;
import backend.service.ChatMessageService;



@RestController
@RequestMapping("/api/chat")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class ChatMessageController {



    private final ChatMessageService chatMessageService;



    public ChatMessageController(
            ChatMessageService chatMessageService
    ){

        this.chatMessageService = chatMessageService;

    }






    @PostMapping("/send")
    public ChatMessage sendMessage(
            @RequestBody ChatMessage message
    ){

        return chatMessageService
                .sendMessage(message);

    }







    @GetMapping("/{senderId}/{receiverId}/request/{requestId}")
    public List<ChatMessage> getConversation(
            @PathVariable Long senderId,
            @PathVariable Long receiverId,
            @PathVariable Long requestId
    ){

        return chatMessageService
                .getConversation(
                        senderId,
                        receiverId,
                        requestId
                );

    }


}