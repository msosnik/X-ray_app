package com.backend.chat;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatDTO {
    private List<Integer> patricipantsIds;
    private List<Integer> messageIds;
}