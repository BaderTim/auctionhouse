package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.MessageDto;

public class MessageWrapper {

    private MessageDto messageDto;
    private IDDto idDto;

    public MessageWrapper() {}

    public IDDto getIdDto() {
        return idDto;
    }

    public MessageDto getMessageDto() {
        return messageDto;
    }
}
