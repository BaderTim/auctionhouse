package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class NoSessionKeyException extends RuntimeException {

    public NoSessionKeyException(String message) {
        super(message);
    }

    @ExceptionHandler(value = NoSessionKeyException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ErrorDto handleNoSessionKeyException(NoSessionKeyException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
