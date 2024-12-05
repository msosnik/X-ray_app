package com.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{id}")
    public ChatDTO getChat(@PathVariable Integer id) {
        return chatService.getChatById(id);
    }

    @PostMapping("/")
    public ChatDTO createChat(@RequestBody List<Integer> participantIds) {
        return chatService.createChat(participantIds);
    }
}
