package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping(value="/auctions")
public class AuctionController {

    // View auctions
    @PostMapping(path ="/", consumes = "application/json", produces = "application/json")
    public AuctionLightuserWrapper[] auctions(@RequestHeader(required = false) String session_key, @RequestBody FilterDto filterDto) {
        String country = "";
        boolean logged_in = false;
        if(session_key != null && session_key.length() > 1) {
            SessionKey sk = new SessionKey(session_key);
            country = SQLConnector.sql_get(Query.get_country_by_user_id(sk.getUser_id())).getJSONObject(0).getString("country");
            logged_in = true;
        }
        JSONArray arr = SQLConnector.sql_get(Query.filter_auctions(new FilterDto(filterDto), country));
        AuctionLightuserWrapper[] auctions = new AuctionLightuserWrapper[arr.length()];
        for(int a = 0; a < arr.length(); a++) {
            JSONObject obj = arr.getJSONObject(a);
            auctions[a] = new AuctionLightuserWrapper(new AuctionDto(false, obj.getInt("auction_id"), obj.getInt("seller_id"), obj.getString("title"), obj.getString("description"), obj.getInt("amount"), obj.getString("item_type"), obj.getString("auction_type"), obj.getFloat("starting_price"), obj.getString("currency"), obj.getFloat("current_price"), ((Timestamp)obj.get("unix_ending_time")).getTime(), ((Timestamp)obj.get("unix_starting_time")).getTime(), ((Timestamp)obj.get("unix_time")).getTime(), obj.getBoolean("bank_transfer"), obj.getBoolean("paypal"), obj.getBoolean("cash"), obj.getBoolean("international"), obj.getFloat("cost")).get_auctionResponse_listing(logged_in),
                    new LightUserDto(obj.getInt("seller_id"), false));
        }
        return auctions;
    }

    // View featured auctions
    @PostMapping(path ="/get_featured_auctions", consumes = "application/json", produces = "application/json")
    public FeaturedAuctionLightuserWrapper[] get_featured_auctions(@RequestHeader(required = false) String session_key, @RequestBody FilterDto filterDto) {
        boolean logged_in = false;
        if(session_key != null && session_key.length() > 1) {
            SessionKey sk = new SessionKey(session_key);
            logged_in = true;
        }
        FilterDto current_filter = new FilterDto(filterDto);
        int limit = current_filter.getAmount();
        int offset = current_filter.getOffset();
        JSONArray arr_hot = null;
        JSONArray arr_new = null;
        if(offset == 0) {
            arr_hot = SQLConnector.sql_get(Query.get_hottest_auctions(limit/2, 0));
            arr_new = SQLConnector.sql_get(Query.get_newest_auctions_and_instant_buys(limit/2, 0));
        } else {
            arr_hot = SQLConnector.sql_get(Query.get_hottest_auctions(limit/2, offset/2));
            arr_new = SQLConnector.sql_get(Query.get_newest_auctions_and_instant_buys(limit/2, offset/2));
        }
        FeaturedAuctionLightuserWrapper[] auctions = new FeaturedAuctionLightuserWrapper[limit];
        String type = "hot";
        for(int a = 0; a < limit; a++) {

            JSONObject obj = null;
            if(a >= arr_hot.length()) {
                type = "new";
            }
            if(a >= arr_new.length()) {
                type = "hot";
            }
            if(type.equals("hot")) {
                if(a < arr_hot.length()) {
                    obj = arr_hot.getJSONObject(a);
                    auctions[a] = new FeaturedAuctionLightuserWrapper(new AuctionDto(false, obj.getInt("auction_id"), obj.getInt("seller_id"), obj.getString("title"), obj.getString("description"), obj.getInt("amount"), obj.getString("item_type"), obj.getString("auction_type"), obj.getFloat("starting_price"), obj.getString("currency"), obj.getFloat("current_price"), ((Timestamp)obj.get("unix_ending_time")).getTime(), ((Timestamp)obj.get("unix_starting_time")).getTime(), ((Timestamp)obj.get("unix_time")).getTime(), obj.getBoolean("bank_transfer"), obj.getBoolean("paypal"), obj.getBoolean("cash"), obj.getBoolean("international"), obj.getFloat("cost")).get_auctionResponse_listing(logged_in),
                            type,new LightUserDto(obj.getInt("seller_id"), false));
                    type = "new";
                }
            } else if(type.equals("new")) {
                if(a < arr_new.length()) {
                    obj = arr_new.getJSONObject(a);
                    auctions[a] = new FeaturedAuctionLightuserWrapper(new AuctionDto(false, obj.getInt("auction_id"), obj.getInt("seller_id"), obj.getString("title"), obj.getString("description"), obj.getInt("amount"), obj.getString("item_type"), obj.getString("auction_type"), obj.getFloat("starting_price"), obj.getString("currency"), obj.getFloat("current_price"), ((Timestamp)obj.get("unix_ending_time")).getTime(), ((Timestamp)obj.get("unix_starting_time")).getTime(), ((Timestamp)obj.get("unix_time")).getTime(), obj.getBoolean("bank_transfer"), obj.getBoolean("paypal"), obj.getBoolean("cash"), obj.getBoolean("international"), obj.getFloat("cost")).get_auctionResponse_listing(logged_in),
                            type,new LightUserDto(obj.getInt("seller_id"), false));
                    type = "hot";
                }
            }
        }
        return auctions;
    }

    // get auctions from seller
    @PostMapping(path ="/from_seller", consumes = "application/json", produces = "application/json")
    public AuctionResponse[] auctions_from_seller(@RequestHeader(required = false) String session_key, @RequestBody IDFilterWrapper idFilterWrapper) {
        boolean logged_in = false;
        if(session_key != null && session_key.length() > 1) {
            SessionKey sk = new SessionKey(session_key);
            logged_in = true;
        }
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_seller_id(idFilterWrapper.getIdDto().getId()));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("User is not registered as seller.");
        }
        JSONArray arr2 = SQLConnector.sql_get(Query.filter_auctions_from_sellerid(idFilterWrapper));
        AuctionResponse[] auctions = new AuctionResponse[arr2.length()];
        for(int a = 0; a < arr2.length(); a++) {
            JSONObject obj = arr2.getJSONObject(a);
            auctions[a] = new AuctionDto(false, obj.getInt("auction_id"), obj.getInt("seller_id"), obj.getString("title"), obj.getString("description"), obj.getInt("amount"), obj.getString("item_type"), obj.getString("auction_type"), obj.getFloat("starting_price"), obj.getString("currency"), obj.getFloat("current_price"), ((Timestamp)obj.get("unix_ending_time")).getTime(), ((Timestamp)obj.get("unix_starting_time")).getTime(), ((Timestamp)obj.get("unix_time")).getTime(), obj.getBoolean("bank_transfer"), obj.getBoolean("paypal"), obj.getBoolean("cash"), obj.getBoolean("international"), obj.getFloat("cost")).get_auctionResponse_listing(logged_in);
        }
        return auctions;
    }

    // bet
    @PostMapping(path ="/bet", consumes = "application/json", produces = "application/json")
    public ResponseEntity bet(@RequestHeader String sessionKey, @RequestBody IDPriceWrapper idPriceWrapper) {
        SessionKey sk = new SessionKey(sessionKey);
        AuctionDto auction = new AuctionDto(idPriceWrapper.getIdDto().getId());
        auction.bet(new LightUserDto(sk), idPriceWrapper.getPriceDto().getPrice());
        return ResponseEntity.ok().build();
    }

    //create
    @PostMapping(path ="/create", consumes = "application/json", produces = "application/json")
    public IDDto create(@RequestHeader String sessionKey, @RequestBody AuctionDto auctionDto) {
        SessionKey sk = new SessionKey(sessionKey);
        AuctionDto auction = new AuctionDto(auctionDto, sk);
        return new IDDto(auction.getAuction_id());
    }

    // end auction
    @PostMapping(path ="/end", consumes = "application/json", produces = "application/json")
    public ResponseEntity end_auction(@RequestHeader String sessionKey, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(sessionKey);
        AuctionDto auction = new AuctionDto(idDto.getId());
        auction.end_auction(new LightUserDto(sk));
        return ResponseEntity.ok().build();
    }

    // View auction by id
    @PostMapping(path ="/id", consumes = "application/json", produces = "application/json")
    public AuctionResponse get_auction(@RequestHeader(required = false) String session_key,@RequestBody IDDto idDto) {
        boolean logged_in = false;
        if(session_key != null && session_key.length() > 1) {
            SessionKey sk = new SessionKey(session_key);
            logged_in = true;
        }
        return new AuctionDto(idDto.getId()).get_auctionResponse(logged_in);
    }

    // View bettors of auction
    @PostMapping(path ="/id/bettors", consumes = "application/json", produces = "application/json")
    public LightUserDto[] get_auction_bettors(@RequestBody IDFilterWrapper idFilterWrapper) {
        return new AuctionDto(idFilterWrapper.getIdDto().getId()).get_bettors(idFilterWrapper.getFilterDto());
    }

    // View highest bettor of auction
    @PostMapping(path ="/id/highest_bettor", consumes = "application/json", produces = "application/json")
    public LightUserDto get_highest_bettor_of_auction(@RequestBody IDDto idDto) {
        return new AuctionDto(idDto.getId()).get_highest_bettor();
    }

    // get highest bet
    @PostMapping(path ="/id/get_highest_bet", consumes = "application/json", produces = "application/json")
    public float highest_bet(@RequestBody IDDto idDto) {
        AuctionDto auction = new AuctionDto(idDto.getId());
        return auction.getCurrent_price();
    }

    // suggest price
    @PostMapping(path ="/suggest", consumes = "application/json", produces = "application/json")
    public ResponseEntity suggest_price(@RequestHeader String sessionKey, @RequestBody IDPriceWrapper idPriceWrapper) {
        SessionKey sk = new SessionKey(sessionKey);
        AuctionDto auction = new AuctionDto(idPriceWrapper.getIdDto().getId());
        auction.suggest(new LightUserDto(sk), idPriceWrapper.getPriceDto().getPrice());
        return ResponseEntity.ok().build();
    }

}
