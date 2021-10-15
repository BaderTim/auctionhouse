package com.baderundletters.auktionshaus.backendjavaserver.controller.account;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.DoubleIdWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDFilterWrapper;
import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/account/follow")
public class FollowController {

    // Follow another user
    @PostMapping(path ="/")
    public ResponseEntity follow_user(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        if(sk.getUser_id() == idDto.getId()) {
            throw new InvalidArgumentsException("You cannot follow yourself");
        }
        LightUserDto current_user = new LightUserDto(sk);
        current_user.follow(new LightUserDto(idDto.getId()));
        return ResponseEntity.ok().build();
    }

    // Unfollow another user
    @PostMapping(path ="/unfollow", consumes = "application/json", produces = "application/json")
    public ResponseEntity unfollow_user(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        LightUserDto current_user = new LightUserDto(sk);
        current_user.unfollow(new LightUserDto(idDto.getId()));
        return ResponseEntity.ok().build();
    }

    // Is user following me?
    @PostMapping(path ="/is_following_me", consumes = "application/json", produces = "application/json")
    public boolean is_following_me(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        LightUserDto current_user = new LightUserDto(sk);
        return current_user.is_following_me(new LightUserDto(idDto.getId()));
    }

    // Is user x following y?
    @PostMapping(path ="/is_following_user", consumes = "application/json", produces = "application/json")
    public boolean is_following_user(@RequestBody DoubleIdWrapper ids) {
        JSONArray arr = SQLConnector.sql_get(Query.is_following_user(ids.getIdDto1().getId(), ids.getIdDto2().getId()));
        return (arr.length() > 0);
    }


    // Get all followers
    @PostMapping(path ="/get_followers")
    public LightUserDto[] get_followers(@RequestBody IDFilterWrapper idFilterWrapper) {
        LightUserDto current_user = new LightUserDto(idFilterWrapper.getIdDto().getId());
        return current_user.get_followers(idFilterWrapper.getFilterDto());
    }

    // Get follower count
    @PostMapping(path ="/get_follower_count")
    public int get_follower_count(@RequestBody IDDto idDto) {
        JSONArray arr = SQLConnector.sql_get(Query.get_follow_count(idDto.getId()));
        return arr.getJSONObject(0).getInt("count");
    }
}
