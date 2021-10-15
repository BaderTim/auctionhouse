package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

public class MailDto {

    private String message;
    private String title;
    private int author_user_id;
    private long unix_creation_time;

    public MailDto() {}

    public MailDto(MailDto new_mail, SessionKey sk) {
        if(new_mail.getMessage().length() > 1500) {
            throw new InvalidArgumentsException("Message cannot be longer than 1500 chars.");
        }
        if(new_mail.getMessage().contains("\"") || new_mail.getMessage().contains("\'") || new_mail.getMessage().contains("´")
        || new_mail.getTitle().contains("\"") || new_mail.getTitle().contains("\'") || new_mail.getTitle().contains("´")) {
            throw new InvalidArgumentsException("Message cannot contain any type of quotation mark.");
        }
        if(new_mail.getTitle().length() > 100) {
            throw new InvalidArgumentsException("Title cannot be longer than 100 chars.");
        }
        this.title = new_mail.getTitle();
        this.message = new_mail.getMessage();
        this.author_user_id = sk.getUser_id();
        this.unix_creation_time = System.currentTimeMillis();
    }

    public void send(LightUserDto lightUserDto) {
        // TODO: send email
    }

    public long getUnix_creation_time() {
        return unix_creation_time;
    }

    public int getAuthor_user_id() {
        return author_user_id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }
}
