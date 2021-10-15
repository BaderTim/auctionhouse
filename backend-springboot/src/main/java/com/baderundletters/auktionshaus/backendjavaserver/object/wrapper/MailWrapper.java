package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.MailDto;

public class MailWrapper {

    private MailDto mailDto;
    private IDDto idDto;

    public MailWrapper() {}

    public IDDto getIdDto() {
        return idDto;
    }

    public MailDto getMailDto() {
        return mailDto;
    }
}
