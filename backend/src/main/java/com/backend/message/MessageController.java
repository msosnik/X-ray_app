package com.backend.message;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/")
    public MessageDTO createMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.createMessage(messageDTO);
    }

    @GetMapping("/{id}")
    public Message getMessage(@PathVariable Integer id) {
        return messageService.getMessageById(id);
    }

    @GetMapping("/chat/{chatId}")
    public List<MessageDTO> getMessages(@PathVariable Integer chatId) {
        return messageService.getMessagesByChatId(chatId);
    }

    @Data
    public static class CreateMessageRequest {
        private Integer authorId;
        private Integer chatId;
        private String text;

    }
}

