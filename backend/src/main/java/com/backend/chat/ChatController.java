package com.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
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
}
