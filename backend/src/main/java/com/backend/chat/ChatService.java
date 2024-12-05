package com.backend.chat;
import com.backend.message.Message;
import com.backend.message.MessageRepository;
import com.backend.user.BaseUserRepository;
import com.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private BaseUserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public ChatDTO getChatById(Integer id) {
        Chat chat = chatRepository.findById(id).orElseThrow(() -> new RuntimeException("Chat not found"));
        List<Integer> participantIds = chat.getParticipants().stream()
                .map(User::getId)
                .collect(Collectors.toList());
        List<Integer> messageIds = chat.getMessages().stream()
                .map(Message::getId)
                .collect(Collectors.toList());
        return new ChatDTO(chat.getId(), participantIds, messageIds);
    }

    public ChatDTO createChat(List<Integer> participantIds) {
        List<User> participants = userRepository.findAllById(participantIds);
        Chat chat = new Chat();
        chat.setParticipants(participants);
        Chat savedChat = chatRepository.save(chat);

        List<Integer> messageIds = savedChat.getMessages().stream()
                .map(Message::getId)
                .collect(Collectors.toList());
        return new ChatDTO(savedChat.getId(), participantIds, messageIds);
    }
}

