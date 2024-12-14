package com.backend.message;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MessageDTO {
    private int id;
    private Integer authorId;
    private Integer chatId;
    private String text;
    private LocalDateTime timestamp;
}
