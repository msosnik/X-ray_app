package com.backend.message;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository  extends JpaRepository<Message, Integer> {
    List<Message> findByChat_Id(Integer chatId);
}