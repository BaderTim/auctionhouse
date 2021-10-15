package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Timestamp;

public class ChatDto {

    private int user_id;
    private int partner_id;

    public ChatDto() {}

    public ChatDto(int user_id, int partner_id) {
        this.user_id = user_id;
        this.partner_id = partner_id;
        if(user_id == partner_id) {
            throw new InvalidArgumentsException("User ID cannot be the same as Partner ID.");
        }
        JSONArray arr = SQLConnector.sql_get(Query.is_user_banned(this.partner_id));
        if (arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find partner account.");
        }
        if(arr.getJSONObject(0).getBoolean("banned")) {
            // throw new InvalidUserDataException("Your partner has been banned.");
        }
    }

    public MessageDto[] get_messages(FilterDto filterDto) {
        JSONArray arr = SQLConnector.sql_get(Query.get_messages(this.getUser_id(), this.getPartner_id(), filterDto));
        MessageDto[] messages = new MessageDto[arr.length()];
        for(int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            messages[i] = new MessageDto(obj.getString("message"), obj.getInt("author_user_id"), ((Timestamp)obj.get("unix_time")).getTime());
            if(messages[i].getAuthor_user_id() == this.getPartner_id() && !obj.getBoolean("seen") && filterDto.getAmount() != 1) {
                SQLConnector.sql_post(Query.mark_message_as_seen(obj.getInt("chat_id")));
            }
        }
        return messages;
    }

    public void send(MessageDto messageDto) {
        SQLConnector.sql_post(Query.send_chat_message(this.user_id, this.partner_id, messageDto.getMessage()));
    }

    public int getUser_id() {
        return user_id;
    }

    public int getPartner_id() {
        return partner_id;
    }

}
