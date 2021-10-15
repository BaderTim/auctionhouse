package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class SpamProtectionException extends RuntimeException {

    public SpamProtectionException(String message) {
        super(message);
    }

    @ExceptionHandler(value = SpamProtectionException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ErrorDto handleSpamProtectionException(SpamProtectionException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
