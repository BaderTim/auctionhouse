package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.AuctionLightuserWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDFilterWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDPriceWrapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping(value="/watchlist")
public class WatchlistController {

    // View auctions from watchlist
    @PostMapping(path ="/", consumes = "application/json", produces = "application/json")
    public AuctionLightuserWrapper[] get_watchlist_auctions(@RequestHeader String session_key, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(session_key);
        String country = SQLConnector.sql_get(Query.get_country_by_user_id(sk.getUser_id())).getJSONObject(0).getString("country");
        JSONArray arr = SQLConnector.sql_get(Query.get_watchlist_auctions(sk.getUser_id(), country, new FilterDto(filterDto)));
        AuctionLightuserWrapper[] auctions = new AuctionLightuserWrapper[arr.length()];
        for(int a = 0; a < arr.length(); a++) {
            JSONObject obj = arr.getJSONObject(a);
            AuctionDto current_auction = new AuctionDto(obj.getInt("auction_id"));
            auctions[a] = new AuctionLightuserWrapper(current_auction.get_auctionResponse_listing(true),
                    new LightUserDto(current_auction.getSeller_id(), false));
        }
        return auctions;
    }

    // add auction to watchlist
    @PostMapping(path ="/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity add_auction_to_watchlist(@RequestHeader String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        if(SQLConnector.sql_get(Query.is_auction_in_watchlist(sk.getUser_id(), idDto.getId())).length() > 0) {
            throw new InvalidArgumentsException("This auction has been added to your watchlist already.");
        }
        if(SQLConnector.sql_get(Query.watchlist_size(sk.getUser_id())).length() > 20) {
            throw new InvalidArgumentsException("You cannot have more than 20 auctions in your watchlist.");
        }
        SQLConnector.sql_post(Query.add_auction_to_watchlist(sk.getUser_id(), idDto.getId()));
        return ResponseEntity.ok().build();
    }

    // is auction in watchlist?
    @PostMapping(path ="/is_auction_on_watchlist_for_xena_i_hope_it_works_lol", consumes = "application/json", produces = "application/json")
    public boolean is_auction_on_watchlist(@RequestHeader String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        return SQLConnector.sql_get(Query.is_auction_in_watchlist(sk.getUser_id(), idDto.getId())).length() > 0;
    }

    // remove auction from watchlist
    @PostMapping(path ="/remove", consumes = "application/json", produces = "application/json")
    public ResponseEntity remove_auction_from_watchlist(@RequestHeader String session_key, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(session_key);
        if(SQLConnector.sql_get(Query.is_auction_in_watchlist(sk.getUser_id(), idDto.getId())).length() < 1) {
            throw new InvalidArgumentsException("Could not find this auction in your watchlist.");
        }
        SQLConnector.sql_post(Query.remove_auction_from_watchlist(sk.getUser_id(), idDto.getId()));
        return ResponseEntity.ok().build();
    }



}
