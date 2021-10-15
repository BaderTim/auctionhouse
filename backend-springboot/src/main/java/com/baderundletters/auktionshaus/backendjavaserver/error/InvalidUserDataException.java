package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InvalidUserDataException extends RuntimeException {

    public InvalidUserDataException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InvalidUserDataException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ErrorDto handleInvalidUserDataException(InvalidUserDataException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
