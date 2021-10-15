package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDFilterWrapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/rating")
public class RatingController {


    // Returns specific ratings
    @PostMapping(path ="/from_user", consumes = "application/json", produces = "application/json")
    public RatingDto[] get_ratings_from_user(@RequestBody IDFilterWrapper idFilterWrapper) {
        LightUserDto from_user = new LightUserDto(idFilterWrapper.getIdDto().getId());
        return from_user.get_ratings(idFilterWrapper.getFilterDto());
    }

    // Returns specific rating
    @PostMapping(path ="/id", consumes = "application/json", produces = "application/json")
    public RatingDto get_rating_by_id(@RequestBody IDDto idDto) {
        return new RatingDto(idDto.getId());
    }

    // Returns avf rating of user
    @PostMapping(path ="/avg_rating", consumes = "application/json", produces = "application/json")
    public float[] get_avg_rating_by_id(@RequestBody IDDto idDto) {
        JSONArray arr = SQLConnector.sql_get(Query.get_avg_rating(idDto.getId()));
        float[] res = new float[2];
        try {
            res[0] = arr.getJSONObject(0).getFloat("rating");
            res[1] = arr.getJSONObject(0).getInt("total_count");
        } catch (JSONException x) {
            res[0] = -1;
            res[1] = 0;
        }
        return res;
    }

    // Creates a new rating
    @PostMapping(path ="/new", consumes = "application/json", produces = "application/json")
    public ResponseEntity create_new_rating(@RequestHeader("session_key") String session_key, @RequestBody RatingDto ratingDto) {
        SessionKey sk = new SessionKey(session_key);
        new RatingDto(sk, ratingDto);
        return ResponseEntity.ok().build();
    }

    // checks if rating already exists
    @PostMapping(path ="/does_rating_exist", consumes = "application/json", produces = "application/json")
    public int does_rating_exist(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.does_rating_exist(sk.getUser_id(), idDto.getId()));
        if(arr.length() > 0) {
            return arr.getJSONObject(0).getInt("rating");
        } else {
            return -1;
        }
    }

    // delete specific rating
    @PostMapping(path ="/delete_by_exact_id", consumes = "application/json", produces = "application/json")
    public ResponseEntity delete_rating_by_id(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        RatingDto rating = new RatingDto(idDto.getId());
        rating.delete(sk.getUser_id());
        return ResponseEntity.ok().build();
    }

    // delete specific rating
    @PostMapping(path ="/delete", consumes = "application/json", produces = "application/json")
    public ResponseEntity delete_rating(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        SQLConnector.sql_post(Query.delete_Ratingv2(sk.getUser_id(), idDto.getId()));
        return ResponseEntity.ok().build();
    }


}
