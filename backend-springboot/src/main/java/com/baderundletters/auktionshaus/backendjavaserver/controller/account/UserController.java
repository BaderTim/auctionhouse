package com.baderundletters.auktionshaus.backendjavaserver.controller.account;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailHandler;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailTemplate;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.ArrayAuctionBetLightuserWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.AuctionBetLightuserWrapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping(value="/account/user")
public class UserController {

    // Get your own user data
    @GetMapping(path ="/")
    public UserDto my_account(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        return new UserDto(sk);
    }

    // reset password
    @PostMapping(path ="/password/reset")
    public ResponseEntity reset_password(@RequestHeader String code, String email, String new_password) {
        JSONArray code_arr = SQLConnector.sql_get(Query.get_user_data_and_verification_status_by_key(code));
        if (code_arr.length() == 0) {
            throw new InvalidArgumentsException("Wrong code.");
        }
        if(!code_arr.getJSONObject(0).getString("email").equals(email)) {
            throw new InvalidArgumentsException("Wrong E-Mail");
        }
        if(new_password.length() < 3) {
            throw new InvalidArgumentsException("Password is too short.");
        }
        SQLConnector.sql_post(Query.change_password(new_password.hashCode()+"", code_arr.getJSONObject(0).getInt("user_id")));
        SQLConnector.sql_post(Query.delete_verification_key(code));
        return ResponseEntity.ok().build();
    }

    // Forgot password: sends reset link if email exists
    @PostMapping(path ="/password/forgot")
    public ResponseEntity forgot_password(@RequestHeader("email") String email) {
        JSONArray arr_mail = SQLConnector.sql_get(Query.get_user_id_by_email(email));
        if(arr_mail.length() == 1) {
            int user_id = arr_mail.getJSONObject(0).getInt("user_id");
            String code = "password-reset-"+UUID.randomUUID().toString()+email.hashCode();
            JSONArray arr = SQLConnector.sql_get(Query.get_verification_keys_from_user(user_id));
            SQLConnector.sql_post(Query.add_verification_key(code, "password_reset", user_id));
            for(int i = 0; i < arr.length(); i++) {
                if(arr.getJSONObject(i).getString("intent").equals("password_reset")) {
                    SQLConnector.sql_post(Query.delete_verification_key(arr.getJSONObject(i).getString("key_content")));
                    break;
                }
            }
            String email_content = EmailTemplate.forgot_password.replace("password_reset_link", "https://dw-auction.com/forgot-password/code/"+code);
            EmailHandler.send_email(email, "Your password reset link", email_content);
        }
        return ResponseEntity.ok().build();
    }

    // confirm email change
    @PostMapping(path ="/email/confirm_change")
    public ResponseEntity confirm_change(@RequestHeader String code) {
        JSONArray code_arr = SQLConnector.sql_get(Query.get_verification_key_data_by_key(code));
        if (code_arr.length() == 0) {
            throw new InvalidArgumentsException("Wrong code.");
        }
        int user_id = code_arr.getJSONObject(0).getInt("user_id");
        String email = code_arr.getJSONObject(0).getString("intent");
        SQLConnector.sql_post(Query.change_email(email, user_id));
        SQLConnector.sql_post(Query.delete_verification_key(code));;
        EmailHandler.send_email(email, "Your E-Mail change was successful", EmailTemplate.success_email_change);
        return ResponseEntity.ok().build();
    }

    // Change e-mail: sends confirm link if email exists
    @PostMapping(path ="/email/reset")
    public ResponseEntity email_reset(@RequestHeader String email, String session_key) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr_mail = SQLConnector.sql_get(Query.get_user_id_by_email(email));
        if(arr_mail.length() == 1) {
            throw new InvalidArgumentsException("E-Mail is already in use.");
        }
        String code = "email-change-"+UUID.randomUUID().toString()+email.hashCode();
        JSONArray arr = SQLConnector.sql_get(Query.get_verification_keys_from_user(sk.getUser_id()));
        SQLConnector.sql_post(Query.add_verification_key(code, email, sk.getUser_id()));
        for(int i = 0; i < arr.length(); i++) {
            if(arr.getJSONObject(i).getString("key_content").contains("email-change-")) {
                SQLConnector.sql_post(Query.delete_verification_key(arr.getJSONObject(i).getString("key_content")));
                break;
            }
        }
        String email_content = EmailTemplate.email_change.replace("confirmation_link", "https://dw-auction.com/change-email/code/"+code);
        EmailHandler.send_email(email, "Please confirm your E-Mail change", email_content);

        return ResponseEntity.ok().build();
    }

    // Get verify code by email
    @GetMapping(path ="/verify/get_code") // needs verify key - verify key is generated by session key if user is not verified yet but gets treated as one
    public ResponseEntity get_verification_code_via_email(@RequestHeader String verify_key, String type) {
        SessionKey sk = new SessionKey();
        sk.check_verify_key(verify_key);
        if(!type.equals("sms") && !type.equals("email")) {
            throw new InvalidArgumentsException("Type can either be email or sms");
        }
        if(type.equals("email")) {
            JSONArray arr = SQLConnector.sql_get(Query.get_verification_keys_from_user(sk.getUser_id()));
            String code = "email-"+UUID.randomUUID().toString();
            SQLConnector.sql_post(Query.add_verification_key(code, "registration_email", sk.getUser_id()));
            for(int i = 0; i < arr.length(); i++) {
                if(arr.getJSONObject(i).getString("intent").equals("registration_email")) {
                    SQLConnector.sql_post(Query.delete_verification_key(arr.getJSONObject(i).getString("key_content")));
                    break;
                }
            }
            String email = SQLConnector.sql_get(Query.get_full_user_data_by_id(sk.getUser_id())).getJSONObject(0).getString("email");
            String email_content = EmailTemplate.verification_mail.replace("verification_link", "https://dw-auction.com/verify/code/"+code);
            EmailHandler.send_email(email, "Please verify your E-Mail", email_content);
        } else if(type.equals("sms")) {
            String code = (verify_key.hashCode()+"").substring(0, 5);
            JSONArray arr = SQLConnector.sql_get(Query.get_verification_keys_from_user(sk.getUser_id()));
            SQLConnector.sql_post(Query.add_verification_key(code, "registration_sms", sk.getUser_id()));
            for(int i = 0; i < arr.length(); i++) {
                if(arr.getJSONObject(i).getString("intent").equals("registration_sms")) {
                    SQLConnector.sql_post(Query.delete_verification_key(arr.getJSONObject(i).getString("key_content")));
                    break;
                }
            }
            // TODO: send SMS Code
        }

        return ResponseEntity.ok().build();
    }

    // Get verification status
    @GetMapping(path ="/verify/status")
    public int verify_status(@RequestHeader("verify_key") String verify_key) {
        SessionKey sk = new SessionKey();
        sk.check_verify_key(verify_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_verification_status(sk.getUser_id()));
        if(arr.length() < 1) {
            throw new InvalidArgumentsException("Could not find user in database.");
        }
        return arr.getJSONObject(0).getInt("verified");
    }



    // Verify user
    @PostMapping(path ="/verify")
    public ResponseEntity verify(@RequestHeader String verification_code) {
        JSONArray arr = SQLConnector.sql_get(Query.get_user_data_and_verification_status_by_key(verification_code));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Wrong verification key.");
        }
        int user_id = arr.getJSONObject(0).getInt("user_id");
        int verified = arr.getJSONObject(0).getInt("verified");
        String email_intent = "";
        String email_subject = "";
        if(verification_code.contains("email-")) {
            verified += 2;
            if(verified == Static.verification_state) {
                email_intent = "Your E-Mail verification has been successful. Your account is now verified.";
            } else {
                email_intent = "Your E-Mail verification has been successful. IMPORTANT: Please also verify your phone number.";
            }
            email_subject = "E-Mail verification success";
        } else {
            verified +=3;
            if(verified == Static.verification_state) {
                email_intent = "Your SMS verification has been successful. Your account is now verified.";
            } else {
                email_intent = "Your SMS verification has been successful. IMPORTANT: Please also verify your E-Mail address.";
            }
            email_subject = "SMS verification success";
        }
        String mail_content = EmailTemplate.success_verification.replace("verify_intent", email_intent).replace("first_name", arr.getJSONObject(0).getString("first_name"));
        EmailHandler.send_email(arr.getJSONObject(0).getString("email"), email_subject, mail_content);
        SQLConnector.sql_post(Query.set_verification_status_by_user(user_id, verified));
        SQLConnector.sql_post(Query.delete_verification_key(verification_code));

        return ResponseEntity.ok().build();
    }


    // Get user by id
    @PostMapping(path ="/id", consumes = "application/json", produces = "application/json")
    public UserDto get_account(@RequestBody IDDto idDto) {
        return new UserDto(idDto.getId());
    }

    // Deletes account, returns 200 if done
    @PostMapping(path ="/delete", consumes = "application/json", produces = "application/json")
    public ResponseEntity delete(@RequestHeader("session_key") String session_key, @RequestBody DeleteDto deleteDto) {
        SessionKey sk = new SessionKey(session_key);
        deleteDto.delete(sk, "user");
        return ResponseEntity.ok().build();
    }

    // Returns user when done
    @PostMapping(path ="/edit", consumes = "application/json", produces = "application/json")
    public UserDto edit(@RequestHeader("session_key") String session_key, @RequestBody UserDto changed_user_dto) {
        SessionKey sk = new SessionKey(session_key);
        UserDto current_user = new UserDto(sk);
        current_user.edit(changed_user_dto);
        return current_user;
    }

    // Returns session key if new login data is valid
    @PostMapping(path ="/register", consumes = "application/json", produces = "application/json")
    public SessionKey register(@RequestBody RegisterDto registerDto) {
        registerDto.initialize();
        return new SessionKey(registerDto.getEmail(), registerDto.getPassword());
    }

    // get my current bets
    @PostMapping(path ="/get_my_current_bets", consumes = "application/json", produces = "application/json")
    public AuctionBetLightuserWrapper[] get_my_current_bets(@RequestHeader("session_key") String session_key, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_multiple_get(Query.filter_current_bets(sk.getUser_id(), new FilterDto(filterDto)), 2);
        AuctionBetLightuserWrapper[] auctionBetWrappers = new AuctionBetLightuserWrapper[arr.length()];
        for(int a = 0; a < arr.length(); a++) {
            JSONObject obj = arr.getJSONObject(a);
            AuctionDto auction = new AuctionDto(obj.getInt("auction_id"));
            auctionBetWrappers[a] = new AuctionBetLightuserWrapper(
                    auction.get_auctionResponse_listing(true),
                    new BetDto(obj.getFloat("amount"), ((Timestamp)obj.get("unix_time")).getTime(),obj.getInt("user_id")),
                    new LightUserDto(auction.getSeller_id(), false));
        }
        return auctionBetWrappers;
    }

    // get all my bets
    @PostMapping(path ="/get_all_my_bets", consumes = "application/json", produces = "application/json")
    public ArrayAuctionBetLightuserWrapper get_all_my_bets(@RequestHeader("session_key") String session_key, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.filter_all_my_bets(sk.getUser_id(),new FilterDto(filterDto)));
        // auctions
        ArrayList<Integer> auction_ids = new ArrayList();
        for(int i = 0; i < arr.length(); i++) {
            if(!auction_ids.contains(arr.getJSONObject(i).getInt("auction_id"))) {
                auction_ids.add(arr.getJSONObject(i).getInt("auction_id"));
            }
        }
        AuctionResponse[] auctions = new AuctionResponse[auction_ids.size()];
        for(int a = 0; a < auction_ids.size(); a++) {
            auctions[a] = new AuctionDto(auction_ids.get(a)).get_auctionResponse_listing(true);
        }
        LightUserDto[] sellers = new LightUserDto[auction_ids.size()];
        for(int l = 0; l < auction_ids.size(); l++) {
            sellers[l] = new LightUserDto(auctions[l].getSeller_id(), false);
        }
        BetDto[] bets = new BetDto[arr.length()];
        for(int b = 0; b < arr.length(); b++) {
            JSONObject obj = arr.getJSONObject(b);
            bets[b] = new BetDto(obj.getFloat("amount"), ((Timestamp)obj.get("unix_time")).getTime(),obj.getInt("user_id"), obj.getInt("auction_id"));
        }
        return new ArrayAuctionBetLightuserWrapper(auctions, sellers, bets);
    }
}
