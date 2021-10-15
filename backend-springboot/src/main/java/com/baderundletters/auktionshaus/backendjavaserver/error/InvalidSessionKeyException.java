package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InvalidSessionKeyException extends RuntimeException {

    public InvalidSessionKeyException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InvalidSessionKeyException.class)
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ErrorDto handleInvalidSessionKeyException(InvalidSessionKeyException ex) {
        return new ErrorDto("Session key is invalid or expired.");
        // return new ErrorDto(ex.getMessage());
    }
}
