package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class MissingPermissionException extends RuntimeException {

    public MissingPermissionException(String message) {
        super(message);
    }

    @ExceptionHandler(value = MissingPermissionException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ErrorDto handleMissingPermissionException(MissingPermissionException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
