package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InternalJSONObjectException extends RuntimeException {

    public InternalJSONObjectException(String message) {super(message); }

    @ExceptionHandler(value = InternalJSONObjectException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDto handleInternalDatabaseException(InternalJSONObjectException ex) {
        return new ErrorDto("Internal JSON Object conversion error. Please contact a administrator.");
    }
}
