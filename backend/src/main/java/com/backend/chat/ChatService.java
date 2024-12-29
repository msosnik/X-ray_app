package com.backend.chat;
import com.backend.exception.ResourceNotFoundException;
import com.backend.message.Message;
import com.backend.message.MessageRepository;
import com.backend.user.BaseUserRepository;
import com.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    private ChatDTO convertToDTO(Chat chat) {
        return new ChatDTO(
            chat.getId(),
            chat.getParticipants().stream().map(User::getId).toList(),
            chat.getMessages().stream().map(Message::getId).toList()
        );
    }

    private Chat convertToEntity(ChatDTO dto) {
        return new Chat(
                dto.getId(),
                userRepository.findAllById(dto.getPatricipantsIds()),
                messageRepository.findAllById(dto.getMessageIds())
        );
    }

    public ChatDTO getChatById(Integer id) {
        Chat chat = chatRepository.findById(id).orElseThrow(() -> new RuntimeException("Chat not found"));
        List<Integer> participantIds = chat.getParticipants().stream()
                .map(User::getId)
                .collect(Collectors.toList());
        List<Integer> messageIds = chat.getMessages().stream()
                .map(Message::getId)
                .collect(Collectors.toList());
        return new ChatDTO(id, participantIds, messageIds);
    }

    public ChatDTO createChat(List<Integer> participantIds) {
        List<User> participants = userRepository.findAllById(participantIds);
        Chat chat = new Chat();
        chat.setParticipants(participants);

        List<Message> messageIds = new ArrayList<>();
        chat.setMessages(messageIds);

        return convertToDTO( chatRepository.save(chat));

    }

    public List<ChatDTO> getAllChats() {
        return chatRepository.findAll().stream().map(this::convertToDTO).toList();
    }

    public ChatDTO updateChat(Integer id, ChatDTO chatDTO) {
        Chat chat = chatRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("no chat with id: "+id));
        chat.setParticipants(userRepository.findAllById(chatDTO.getPatricipantsIds()));
        chat.setMessages(messageRepository.findAllById(chatDTO.getMessageIds()));
        return convertToDTO( chatRepository.save(chat));
    }

    public boolean deleteChat(Integer id) {
        boolean existed = chatRepository.findById(id).isPresent();
        if (existed)
            chatRepository.deleteById(id);
        return existed;
    }

    public ChatDTO createChat(ChatDTO chatDTO) {
        return convertToDTO(chatRepository.save(convertToEntity(chatDTO)));
    }
}

