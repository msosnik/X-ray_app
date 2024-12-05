package com.backend.message;

import com.backend.chat.Chat;
import com.backend.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private User author;
    @ManyToOne
    private Chat chat;
    @NonNull
    private String text;
    @NonNull
    private LocalDateTime timestamp;
}
