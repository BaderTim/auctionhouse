package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InvalidLocationException extends RuntimeException {

    public InvalidLocationException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InvalidLocationException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ErrorDto handleInvalidLocationException(InvalidLocationException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
