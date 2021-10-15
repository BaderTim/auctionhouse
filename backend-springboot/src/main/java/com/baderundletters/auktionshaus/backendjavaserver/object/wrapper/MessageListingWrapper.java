package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.MessageDto;

public class MessageListingWrapper {

    private LightUserDto lightUserDto;
    private int unread_messages;

    public MessageListingWrapper() {}

    public MessageListingWrapper(LightUserDto lightUserDto, int unread_messages) {
        this.lightUserDto = lightUserDto;
        this.unread_messages = unread_messages;
    }

    public int getUnread_messages() {
        return unread_messages;
    }

    public LightUserDto getlightUserDto() {
        return lightUserDto;
    }
}
