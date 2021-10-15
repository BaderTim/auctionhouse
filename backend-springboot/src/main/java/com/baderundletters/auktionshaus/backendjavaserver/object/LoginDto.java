package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

public class LoginDto {

    private String email;
    private String password;

    public LoginDto(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        if (this.email.length() < 4) {
            throw new InvalidArgumentsException("Email is too short.");
        }
        return this.email;
    }
    public String getPassword() {
        if (this.password.length() < 4) {
            throw new InvalidArgumentsException("Password is too short.");
        }
        return this.password;
    }


}
