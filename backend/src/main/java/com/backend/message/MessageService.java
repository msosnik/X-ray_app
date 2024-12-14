package com.backend.message;

import com.backend.chat.Chat;
import com.backend.chat.ChatRepository;
import com.backend.exception.ResourceNotFoundException;
import com.backend.user.BaseUserRepository;
import com.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private BaseUserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    private MessageDTO convertToDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getAuthor().getId(),
                message.getChat().getId(),
                message.getText(),
                message.getTimestamp()
        );
    }

    private Message convertToEntity(MessageDTO dto) {
        User author = userRepository.findById(dto.getAuthorId()).orElseThrow(()-> new ResourceNotFoundException("no User with id: " + dto.getAuthorId()) );
        Chat chat = chatRepository.findById(dto.getChatId()).orElseThrow(()->new ResourceNotFoundException("no Chat with id: "+dto.getChatId()));
        return new Message(
                dto.getId(),
                author,
                chat,
                dto.getText(),
                dto.getTimestamp()
        );
    }

    public List<MessageDTO> getMessagesByChatId(Integer chatId) {
        List<Message> messages = messageRepository.findByChat_Id(chatId);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MessageDTO createMessage(MessageDTO messageDTO) {
        Message savedMessage = convertToEntity(messageDTO);
        messageRepository.save(savedMessage);
        return convertToDTO(savedMessage);
    }

    public MessageDTO getMessageById(Integer id) {
        Message message = messageRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Message not found with id: " + id));
        return convertToDTO(message);
    }
}

