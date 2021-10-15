package com.baderundletters.auktionshaus.backendjavaserver.controller.account;


import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailHandler;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailTemplate;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.MessageWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.SellerLightuserWrapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value="/account/admin")
public class AdminController {


    // Bans user from the system
    @PostMapping(path ="/ban", consumes = "application/json", produces = "application/json")
    public ResponseEntity ban_user(@RequestHeader("session_key") String session_key, @RequestBody MessageWrapper messageWrapper) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        LightUserDto culprit = new LightUserDto(messageWrapper.getIdDto().getId());
        culprit.ban(admin_sk);
        return ResponseEntity.ok().build();
    }

    // Get all sellers
    @PostMapping(path ="/get_all_sellers", consumes = "application/json", produces = "application/json")
    public SellerLightuserWrapper[] get_all_sellers(@RequestHeader("session_key") String session_key, @RequestBody FilterDto filterDto) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        JSONArray arr = SQLConnector.sql_get(Query.get_all_validated_sellers_with_username(new FilterDto(filterDto)));
        SellerLightuserWrapper[] res = new SellerLightuserWrapper[arr.length()];
        for(int i = 0; i < res.length; i++) {
            JSONObject obj = arr.getJSONObject(i);
            res[i] = new SellerLightuserWrapper(
                    new SellerDto(obj.getInt("seller_id"), obj.getInt("user_id"), obj.getInt("auction"), obj.getInt("photo_album"), obj.getInt("additional_image"), obj.getString("stripe_id")),
                    new LightUserDto(obj.getInt("user_id"), obj.getBoolean("admin"), obj.getString("first_name"), obj.getString("last_name"), obj.getString("country"), false)
            );
        }
        return res;
    }

    @PostMapping(path ="/get_all_banned_users", consumes = "application/json", produces = "application/json")
    public LightUserDto[] get_all_banned_users(@RequestHeader String sessionKey, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(sessionKey);
        sk.admin_verify();
        JSONArray arr = SQLConnector.sql_get(Query.get_all_banned_users(new FilterDto(filterDto)));
        LightUserDto[] res = new LightUserDto[arr.length()];
        for(int i = 0; i < res.length; i++) {
            JSONObject obj = arr.getJSONObject(i);
            res[i] = new LightUserDto(obj.getInt("user_id"), obj.getBoolean("admin"), obj.getString("first_name"), obj.getString("last_name"), obj.getString("country"), false);
        }
        return res;
    }

    @PostMapping(path ="/get_all_users", consumes = "application/json", produces = "application/json")
    public LightUserDto[] get_all_users(@RequestHeader String sessionKey, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(sessionKey);
        sk.admin_verify();
        JSONArray arr = SQLConnector.sql_get(Query.get_all_users(new FilterDto(filterDto)));
        LightUserDto[] res = new LightUserDto[arr.length()];
        for(int i = 0; i < res.length; i++) {
            JSONObject obj = arr.getJSONObject(i);
            res[i] = new LightUserDto(obj.getInt("user_id"), obj.getBoolean("admin"), obj.getString("first_name"), obj.getString("last_name"), obj.getString("country"), false);
        }
        return res;
    }

    @PostMapping(path ="/end_auction", consumes = "application/json", produces = "application/json")
    public ResponseEntity end_auctions(@RequestHeader String sessionKey, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(sessionKey);
        sk.admin_verify();
        AuctionDto auctionDto = new AuctionDto(idDto.getId());
        SQLConnector.sql_post(Query.end_auction(idDto.getId()));
        LightUserDto seller = auctionDto.get_auction_Seller();
        LightUserDto highest_bettor = auctionDto.get_highest_bettor();
        ChatDto chatDto = new ChatDto(sk.getUser_id(), seller.getUser_id());
        chatDto.send(new MessageDto(String.format("Your auction [%s] has been ended by an administrator. It seems like you have violated our terms and services.", auctionDto.getTitle()), auctionDto.get_auction_Seller()));
        EmailHandler.send_email(new UserDto(seller.getUser_id()).getEmail(), "Your auction has been banned", EmailTemplate.banned_auction_creator.replace("user_name", seller.getFirst_name()).replace("auction_title", auctionDto.getTitle()));
        ChatDto chatDto2 = new ChatDto(sk.getUser_id(), highest_bettor.getUser_id());
        chatDto2.send(new MessageDto(String.format("The auction [%s], on which you were the highest bettor, has been ended by an administrator. We are sorry for that. It looks like the creator of this auction has violated our terms and conditions.", auctionDto.getTitle()), auctionDto.get_highest_bettor()));
        EmailHandler.send_email(new UserDto(highest_bettor.getUser_id()).getEmail(), "The auction you were betting on has been banned", EmailTemplate.banned_auction_highest_bettor.replace("user_name", highest_bettor.getFirst_name()).replace("auction_title", auctionDto.getTitle()));
        return ResponseEntity.ok().build();
    }



    @PostMapping(path ="/reopen_instant_buy", consumes = "application/json", produces = "application/json")
    public ResponseEntity reopen_instant_buy(@RequestHeader String sessionKey, @RequestBody IDDto idDto) {
        SessionKey sk = new SessionKey(sessionKey);
        sk.admin_verify();
        AuctionDto auction = new AuctionDto(idDto.getId());
        auction.reopen_instant_buy(sk);
        return ResponseEntity.ok().build();
    }

    // sends email to user
    @PostMapping(path ="/send_email")
    public ResponseEntity send_email() {
        EmailHandler.send_email("xena.letters@web.de", "Welcome to dw-auction", EmailTemplate.register.replace("user_name", "Xena"));
        return ResponseEntity.ok().build();
    }

    // Unbans user from the system
    @PostMapping(path ="/unban", consumes = "application/json", produces = "application/json")
    public ResponseEntity unban_user(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        LightUserDto wrong_culprit = new LightUserDto(idDto.getId());
        wrong_culprit.unban(admin_sk);
        return ResponseEntity.ok().build();
    }

}
