package com.backend.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

//    @PostMapping("/")
//    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageDTO messageDTO) {
//        MessageDTO message = messageService.createMessage(messageDTO);
//        return ResponseEntity.ok(message);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable Integer id) {
        return ResponseEntity.ok( messageService.getMessageById(id));
    }

    @GetMapping("/chat/{chatId}")
    public List<MessageDTO> getMessages(@PathVariable Integer chatId) {
        return messageService.getMessagesByChatId(chatId);
    }

    @GetMapping
    public ResponseEntity<List<MessageDTO>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageDTO messageDTO) {
        MessageDTO newMessage = messageService.createMessage(messageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newMessage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDTO> updateMessage(
            @PathVariable Integer id,
            @RequestBody MessageDTO messageDTO) {
        MessageDTO updatedMessage = messageService.updateMessage(id, messageDTO);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer id) {
        boolean isDeleted = messageService.deleteMessage(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

