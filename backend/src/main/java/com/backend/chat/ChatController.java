package com.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{id}")
    public ResponseEntity<ChatDTO> getChat(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.getChatById(id));
    }

    @PostMapping("/")
    public ResponseEntity<ChatDTO> createChat(@RequestBody List<Integer> participantIds) {
        return ResponseEntity.ok(chatService.createChat(participantIds));
    }

    @GetMapping
    public ResponseEntity<List<ChatDTO>> getAllChats() {
        return ResponseEntity.ok(chatService.getAllChats());
    }

    @PostMapping
    public ResponseEntity<ChatDTO> createChat(@RequestBody ChatDTO chatDTO) {
        ChatDTO newChat = chatService.createChat(chatDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newChat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChatDTO> updateChat(
            @PathVariable Integer id,
            @RequestBody ChatDTO chatDTO) {
        ChatDTO updatedChat = chatService.updateChat(id, chatDTO);
        return ResponseEntity.ok(updatedChat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Integer id) {
        boolean isDeleted = chatService.deleteChat(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
