package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class InternalFileSystemException extends RuntimeException {

    public InternalFileSystemException(String message) {
        super(message);
    }

    @ExceptionHandler(value = InternalFileSystemException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDto handleInternalFileSystemException(InternalFileSystemException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
