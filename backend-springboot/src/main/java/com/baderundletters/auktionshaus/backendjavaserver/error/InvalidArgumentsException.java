package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InvalidArgumentsException extends RuntimeException {

    public InvalidArgumentsException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InvalidArgumentsException.class)
    @ResponseStatus(code = HttpStatus.CONFLICT)
    public ErrorDto handleInvalidArgumentsException(InvalidArgumentsException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
