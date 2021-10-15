package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

public class MessageDto {

    private String message;
    private int author_user_id;
    private long unix_creation_time;

    public MessageDto() {}

    public MessageDto(String message, int author_user_id, long unix_creation_time) {
        if(message.length() > 500) {
            throw new InvalidArgumentsException("Message cannot be bigger than 500 chars.");
        }
        this.message = message;
        this.author_user_id = author_user_id;
        this.unix_creation_time = unix_creation_time;
    }

    public MessageDto(MessageDto new_message, SessionKey sk) {
        if(new_message.getMessage().length() > 500) {
            throw new InvalidArgumentsException("Message cannot be longer than 500 chars.");
        }
        this.message = new_message.getMessage();
        this.author_user_id = sk.getUser_id();
        this.unix_creation_time = System.currentTimeMillis();
    }

    public MessageDto(String new_message, LightUserDto user) {
        if(new_message.length() > 500) {
            throw new InvalidArgumentsException("Message cannot be longer than 500 chars.");
        }
        this.message = new_message;
        this.author_user_id = user.getUser_id();
        this.unix_creation_time = System.currentTimeMillis();
    }

    public long getUnix_creation_time() {
        return unix_creation_time;
    }

    public int getAuthor_user_id() {
        return author_user_id;
    }

    public String getMessage() {
        return message;
    }
}
