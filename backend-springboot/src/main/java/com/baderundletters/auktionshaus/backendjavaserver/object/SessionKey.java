package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Date;
import java.sql.Timestamp;

public class SessionKey {

    private String key;
    private long expiring_date;
    private int user_id;
    private int seller_id;
    private boolean admin;

    // for deserialization - DO NOT USE
    public SessionKey() {}

    public SessionKey(String key) {
        JSONArray res = SQLConnector.sql_get(Query.get_session_key_data(key));
        if(res.length() < 1) {
            throw new InvalidSessionKeyException("Session key is invalid.");
        }
        if(key.contains("#verify_key_")) {
            throw new InvalidSessionKeyException("Not a Session key but a verify key needed for registration instead.");
        }
        JSONObject object = res.getJSONObject(0);
        if(((Timestamp)object.get("expiration_unix_time")).getTime() < System.currentTimeMillis()) {
            throw new InvalidSessionKeyException("Session key has expired.");
        }
        if(object.getBoolean("banned")) {
            throw new AccountBannedException("Your account has been banned from the system.");
        }
        this.key = object.getString("session_key");
        this.expiring_date = ((Timestamp)object.get("expiration_unix_time")).getTime();
        this.user_id = object.getInt("user_id");
        this.admin = object.getBoolean("admin");
        JSONArray res2 = SQLConnector.sql_get(Query.get_seller_data_by_user_id(this.user_id));
        if(res2.length() == 0) {
            this.seller_id = 0;
        } else {
            this.seller_id = res2.getJSONObject(0).getInt("seller_id");
        }
    }

    public void check_verify_key(String key) {
        JSONArray res = SQLConnector.sql_get(Query.get_session_key_data(key));
        if(res.length() < 1) {
            throw new InvalidSessionKeyException("Session key is invalid.");
        }
        if(!key.contains("#verify_key_")) {
            throw new InvalidSessionKeyException("Not a Verify key.");
        }
        JSONObject object = res.getJSONObject(0);
        if(((Timestamp)object.get("expiration_unix_time")).getTime() < System.currentTimeMillis()) {
            throw new InvalidSessionKeyException("Session key has expired.");
        }
        if(object.getBoolean("banned")) {
            throw new AccountBannedException("Your account has been banned from the system.");
        }
        this.key = object.getString("session_key");
        this.expiring_date = ((Timestamp)object.get("expiration_unix_time")).getTime();
        this.user_id = object.getInt("user_id");
        this.admin = object.getBoolean("admin");
        JSONArray res2 = SQLConnector.sql_get(Query.get_seller_data_by_user_id(this.user_id));
        if(res2.length() == 0) {
            this.seller_id = 0;
        } else {
            this.seller_id = res2.getJSONObject(0).getInt("seller_id");
        }
    }

    public SessionKey(String email, String password) {
        // get sql statement
        JSONArray res = SQLConnector.sql_get(Query.search_user_for_login_by_email_and_password(email, password));
        // check if a result has been found
        if(res.length() < 1) {
            throw new InvalidUserDataException("Invalid user data.");
        }
        // check if user is banned, get user id and admin bool;
        if(res.getJSONObject(0).getBoolean("banned")) {
            throw new AccountBannedException("Your account has been banned from the system.");
        }
        String prefix = "";
        if(res.getJSONObject(0).getInt("verified") != Static.verification_state) {
            prefix = "#verify_key_";
        }
        this.user_id = res.getJSONObject(0).getInt("user_id");
        this.admin = res.getJSONObject(0).getBoolean("admin");
        // generate key with given parameters
        int days = 5;
        long expire_timestamp = System.currentTimeMillis()+1000*60*60*24*days;
        String fragment1 = "sad32q89r"+expire_timestamp+"z0qß8239ß012iß0´(=§?EZ=?"+email+"/QSAD§)=R/(?SÜÄ'ASDlöäüjasdP*WDJsüa"+Math.random();
        String fragment2 = "Ä+djhpoah(S/D)kopaSAHD/()%7gdA"+password+"mISHD=)ahsduish"+System.currentTimeMillis()+"S/&%%DgASDG%TSA?ÜSAÀ*D;L,k°°^^^sdasdfr54"+Math.random();
        String fragment3 = "+*??`D0ßskaodl"+this.user_id+",öasd$()/T&%/T)Dsgzad"+expire_timestamp+"bhjsadbho09a8HA%S745ds&345ec!s9ds"+Math.random();
        this.key = prefix + fragment1.hashCode()+""+fragment2.hashCode()+""+fragment3.hashCode();
        // add key to database
        SQLConnector.sql_post(Query.add_session_key(this.user_id, this.key, new Timestamp(expire_timestamp)));
        // wtf did i do here and why ?!
        // this.key = SQLConnector.sql_get(Query.get_session_key_by_user_id(this.user_id)).getJSONObject(0).getString("session_key");
        this.expiring_date = expire_timestamp;
        JSONArray res2 = SQLConnector.sql_get(Query.get_seller_data_by_user_id(this.user_id));
        if(res2.length() == 0 || !res2.getJSONObject(0).getBoolean("is_validated")) {
            this.seller_id = 0;
        } else {
            this.seller_id = res2.getJSONObject(0).getInt("seller_id");
        }
    }

    public void admin_verify() {
        if(!this.admin) {
            throw new MissingPermissionException("You are not a admin.");
        }
    }

    public String getKey() {
        return this.key;
    }

    public long getExpiring_date() {
        return this.expiring_date;
    }

    public int getUser_id() {
        return this.user_id;
    }

    public boolean isAdmin() {
        return this.admin;
    }

    public int getSeller_id() {return this.seller_id;}
}
