package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.Static;

public class DeleteDto {

    private String email;
    private int password;
    private int primary_id;

    public DeleteDto() {}

    public DeleteDto(String email, String password, int primary_id) {
        this.email = email;
        this.password = password.hashCode();
        this.primary_id = primary_id;
    }

    public void delete(SessionKey sk, String type) {
        if(type.equals("user")) {
            Static.delete_user_globally(this.primary_id);
        }
    }

    public String getEmail() {
        return this.email;
    }
    public int getPassword() {
        return this.password;
    }
    public int getPrimary_id() {
        return this.primary_id;
    }

}
