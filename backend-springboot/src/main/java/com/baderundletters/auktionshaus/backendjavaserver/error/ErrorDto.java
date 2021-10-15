package com.baderundletters.auktionshaus.backendjavaserver.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class ErrorDto {

    public final String error;

    public ErrorDto(String message) {
        if(message != null) {
            this.error = System.currentTimeMillis()+" "+message;
        } else {
            this.error = System.currentTimeMillis()+" Internal server error. Please check your arguments and their data types. If you feel like this error is not on your side please contact the administrators.";
        }

    }

}
