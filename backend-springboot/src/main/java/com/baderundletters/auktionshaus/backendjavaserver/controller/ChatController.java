package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDFilterWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.MessageListingWrapper;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.MessageWrapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/chat")
public class ChatController {

    // Get messages from chat with partner user
    @PostMapping(path ="/get_messages", consumes = "application/json", produces = "application/json")
    public MessageDto[] get_chat_with_user(@RequestHeader String sessionKey, @RequestBody IDFilterWrapper idFilterWrapper) {
        SessionKey sk = new SessionKey(sessionKey);
        ChatDto chat = new ChatDto(sk.getUser_id(), idFilterWrapper.getIdDto().getId());
        return chat.get_messages(idFilterWrapper.getFilterDto());
    }

    // send new message
    @PostMapping(path ="/send_message", consumes = "application/json", produces = "application/json")
    public ResponseEntity send_message(@RequestHeader String sessionKey, @RequestBody MessageWrapper messageWrapper) {
        SessionKey sk = new SessionKey(sessionKey);
        ChatDto chat = new ChatDto(sk.getUser_id(), messageWrapper.getIdDto().getId());
        chat.send(new MessageDto(messageWrapper.getMessageDto(), sk));
        return ResponseEntity.ok().build();
    }

    // get unread message listings
    @GetMapping(path = "/get_unread_listings", produces = "application/json")
    public MessageListingWrapper[] get_unread_listings(@RequestHeader String sessionKey) {
        SessionKey sk = new SessionKey(sessionKey);
        JSONArray arr = SQLConnector.sql_get(Query.get_unread_messages(sk.getUser_id()));
        MessageListingWrapper[] res = new MessageListingWrapper[arr.length()];
        for(int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            res[i] = new MessageListingWrapper(new LightUserDto(obj.getInt("author_user_id")), obj.getInt("unread_count"));
        }
        return res;
    }

    // get all chats from user
    @PostMapping(path = "/get_all_chats", consumes = "application/json", produces = "application/json")
    public LightUserDto[] get_all_chats(@RequestHeader String sessionKey, @RequestBody FilterDto filterDto) {
        SessionKey sk = new SessionKey(sessionKey);
        JSONArray arr = SQLConnector.sql_get(Query.get_all_chats(sk.getUser_id(), new FilterDto(filterDto)));
        LightUserDto[] res = new LightUserDto[arr.length()];
        for(int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            try {
                res[i] = new LightUserDto(obj.getInt("user_id"));
            }catch (InvalidUserDataException x) {
                res[i] = new LightUserDto(obj.getInt("user_id"), false, "deleted", "deleted", "unknown", false);
            }
        }
        return res;
    }

}
