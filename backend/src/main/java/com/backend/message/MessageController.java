package com.backend.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/")
    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageDTO messageDTO) {
        MessageDTO message = messageService.createMessage(messageDTO);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable Integer id) {
        return ResponseEntity.ok( messageService.getMessageById(id));
    }

    @GetMapping("/chat/{chatId}")
    public List<MessageDTO> getMessages(@PathVariable Integer chatId) {
        return messageService.getMessagesByChatId(chatId);
    }
}

