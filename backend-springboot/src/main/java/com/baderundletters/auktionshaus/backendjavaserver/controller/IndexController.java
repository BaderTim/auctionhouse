package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.object.LoginDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.SessionKey;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/")
public class IndexController {

    // Builds index response
    // Returns an arraylist with 3 other array lists
    // own playlists, followed playlists and featured songs
    @GetMapping(value = "/", produces = "application/json")
    public long server_time() {
        return System.currentTimeMillis();
    }

    // Returns session key if login data is valid
    @PostMapping(path ="/login", consumes = "application/json", produces = "application/json")
    public SessionKey login(@RequestBody LoginDto login) {
        return new SessionKey(login.getEmail(), login.getPassword().hashCode()+"");
    }


}
