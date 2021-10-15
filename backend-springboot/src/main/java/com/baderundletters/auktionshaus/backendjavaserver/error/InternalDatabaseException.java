package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InternalDatabaseException extends RuntimeException {

    public InternalDatabaseException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InternalDatabaseException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDto handleInternalDatabaseException(InternalDatabaseException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
