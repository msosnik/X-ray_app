package com.backend.message;
import com.backend.chat.Chat;
import com.backend.chat.ChatRepository;
import com.backend.exception.ResourceNotFoundException;
import com.backend.user.BaseUserRepository;
import com.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public List<MessageDTO> getMessagesByChatId(Integer chatId) {
        List<Message> messages = messageRepository.findByChat_Id(chatId);
        return messages.stream()
                .map(msg -> new MessageDTO(msg.getAuthor().getId(), msg.getChat().getId(), msg.getText(), msg.getTimestamp()))
                .collect(Collectors.toList());
    }

    public MessageDTO createMessage(MessageDTO messageDTO) {
        User author = userRepository.findById(messageDTO.getAuthorId()).orElseThrow(() -> new RuntimeException("User not found"));
        Chat chat = chatRepository.findById(messageDTO.getChatId()).orElseThrow(() -> new RuntimeException("Chat not found"));
        Message message = new Message();
        message.setAuthor(author);
        message.setChat(chat);
        message.setText(message.getText());
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);
        return new MessageDTO(author.getId(), chat.getId(), savedMessage.getText(), savedMessage.getTimestamp());
    }

    public Message getMessageById(Integer id) {
        return messageRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Message not found with id: " + id));
    }
}

