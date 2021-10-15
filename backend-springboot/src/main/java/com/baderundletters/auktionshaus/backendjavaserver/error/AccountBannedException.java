package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class AccountBannedException extends RuntimeException {

    public AccountBannedException(String message) {
        super(message);
    }

    @ExceptionHandler(value = AccountBannedException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ErrorDto handleAccountBannedException(AccountBannedException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
