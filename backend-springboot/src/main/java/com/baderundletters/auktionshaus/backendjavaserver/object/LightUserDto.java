package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailHandler;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailTemplate;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.error.MissingPermissionException;
import com.baderundletters.auktionshaus.backendjavaserver.error.SpamProtectionException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Timestamp;

public class LightUserDto {

    private int user_id;
    private boolean admin;
    private String first_name;
    private String last_name;
    private String country;
    private String profile_picture;

    public LightUserDto() {}

    public LightUserDto(UserDto userDto) {
        this.user_id = userDto.getUser_id();
        this.admin = userDto.Is_admin();
        this.first_name = userDto.getFirst_name();
        this.last_name = userDto.getLast_name();
        this.country = userDto.getCountry();
        this.profile_picture = userDto.getProfile_picture();
    }

    public LightUserDto(int user_id, boolean admin, String first_name, String last_name, String country, boolean profile_picture) {
        this.user_id = user_id;
        this.admin = admin;
        this.first_name = first_name;
        this.last_name = last_name;
        this.country = country;
        this.profile_picture = null;
        if(profile_picture) {
            try {
                this.profile_picture = new ImageDto(this.user_id, 0).get_image(2);
            } catch (Exception x) {
                x.printStackTrace();
                this.profile_picture = null;
            }
        }
    }

    public LightUserDto(SessionKey sk) {
        this.get_data_by_id(sk.getUser_id());
    }

    public LightUserDto(int user_id) {
        this.get_data_by_id(user_id);
    }

    public LightUserDto(int seller_id, boolean profile_picture) {
        this.get_data_by_seller_id(seller_id, profile_picture);
    }

    public void follow(LightUserDto user_to_follow) {
        JSONArray arr = SQLConnector.sql_get(Query.get_follow_object(this.user_id, user_to_follow.getUser_id()));
        if(arr.length() > 0) {
            throw new InvalidUserDataException("You are following this person already.");
        }
        SQLConnector.sql_post(Query.follow(this.user_id, user_to_follow.getUser_id()));
    }

    public void unfollow(LightUserDto user_to_unfollow) {
        JSONArray arr = SQLConnector.sql_get(Query.get_follow_object(this.user_id, user_to_unfollow.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidUserDataException("You are not following this person.");
        }
        SQLConnector.sql_post(Query.unfollow(arr.getJSONObject(0).getInt("follow_id")));
    }

    public boolean is_following_me(LightUserDto user_to_check) {
        if(SQLConnector.sql_get(Query.get_follow_object(user_to_check.getUser_id(), this.user_id)).length() > 0) {
            return true;
        }
        return false;
    }



    public LightUserDto[] get_followers(FilterDto filterDto) {
        JSONArray arr = SQLConnector.sql_get(Query.filter_followers(filterDto, this.user_id));
        LightUserDto[] followers = new LightUserDto[arr.length()];
        for(int f = 0; f < arr.length(); f++) {
            JSONObject obj = arr.getJSONObject(f);
            followers[f] = new LightUserDto(obj.getInt("user_id"),
                    obj.getBoolean("admin"),
                    obj.getString("first_name"),
                    obj.getString("last_name"),
                    obj.getString("country"),
                    obj.getBoolean("profile_picture"));
        }
        return followers;
    }

    public RatingDto[] get_ratings(FilterDto filterDto) {
        JSONArray arr = SQLConnector.sql_get(Query.filter_ratings(filterDto, this.user_id));
        RatingDto[] ratings = new RatingDto[arr.length()];
        for(int r = 0; r < arr.length(); r++) {
            JSONObject obj = arr.getJSONObject(r);
            ratings[r] = new RatingDto(obj.getInt("rating_id"), obj.getInt("user_id"), obj.getString("first_name"), obj.getString("last_name"), obj.getInt("creator_user_id"), obj.getInt("rating"), obj.getString("comment"), ((Timestamp)obj.get("unix_time")).getTime());
        }
        return ratings;
    }

    public void report(MailDto mailDto) {
        if(this.user_id == mailDto.getAuthor_user_id()) {
            throw new InvalidArgumentsException("You cannot report yourself.");
        }
        JSONArray arr = SQLConnector.sql_get(Query.get_report(mailDto.getAuthor_user_id(), this.user_id));
        if(arr.length() > 0) {
            // get latest report timestamp
            long latest_report_timestamp = 0;
            for(int a = 0; a < arr.length(); a++) {
                long temp_time = ((Timestamp)arr.getJSONObject(a).get("unix_time")).getTime();
                if(temp_time > latest_report_timestamp) {
                    latest_report_timestamp = temp_time;
                }
            }
            if(latest_report_timestamp+1000*60*60*24 > System.currentTimeMillis()) {
                throw new SpamProtectionException("You cannot report the same user twice within 24 hours.");
            }
        }
        SQLConnector.sql_post(Query.report(mailDto.getAuthor_user_id(), this.user_id, mailDto.getTitle(), mailDto.getMessage()));
    }

    public void ban(SessionKey admin_key) {
        if(admin_key.isAdmin()) {
            if(this.admin) {
                throw new MissingPermissionException("You cannot ban another administrator! Please contact the developers to perform this action.");
            }
            if(SQLConnector.sql_get(Query.is_user_banned(this.user_id)).getJSONObject(0).getBoolean("banned")) {
                throw new InvalidUserDataException("This user has been banned already.");
            }
            EmailHandler.send_email(new UserDto(this.getUser_id()).getEmail(), "You have been banned", EmailTemplate.ban_mail.replace("user_name", this.first_name).replace("ban_reason", "Violation of our Terms & Services"));
            SQLConnector.sql_post(Query.ban_hammer(true, this.user_id));
            // TODO: end all auctions
        } else {
            throw new MissingPermissionException("Only administrators can perform this action!");
        }
    }

    public void unban(SessionKey admin_key) {
        if(admin_key.isAdmin()) {
            if(this.admin) {
                throw new MissingPermissionException("You cannot unban another administrator! Please contact the developers to perform this action.");
            }
            if(!SQLConnector.sql_get(Query.is_user_banned(this.user_id)).getJSONObject(0).getBoolean("banned")) {
                throw new InvalidUserDataException("The user you are trying to unban is not banned.");
            }
            SQLConnector.sql_post(Query.ban_hammer(false, this.user_id));
        } else {
            throw new MissingPermissionException("Only administrators can perform this action!");
        }
    }

    private void get_data_by_id(int user_id) {
        JSONArray arr = SQLConnector.sql_get(Query.get_light_user_by_id(user_id));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("Could not find user.");
        }
        JSONObject object = arr.getJSONObject(0);
        this.user_id = user_id;
        this.admin = object.getBoolean("admin");
        this.first_name = object.getString("first_name");
        this.last_name = object.getString("last_name");
        this.country = object.getString("country");
        this.profile_picture = null;
        if(object.getBoolean("profile_picture")) {
            try {
                this.profile_picture = new ImageDto(user_id, 0).get_image(2);
            }catch(Exception x) {
                x.printStackTrace();
            }
        }
    }

    private void get_data_by_seller_id(int seller_id, boolean profile_picture) {
        JSONArray arr = SQLConnector.sql_get(Query.get_lightuser_by_seller_id(seller_id));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("Could not find user.");
        }
        JSONObject object = arr.getJSONObject(0);
        this.user_id = user_id;
        this.admin = object.getBoolean("admin");
        this.first_name = object.getString("first_name");
        this.last_name = object.getString("last_name");
        this.country = object.getString("country");
        this.profile_picture = null;
        if(profile_picture) {
            if (object.getBoolean("profile_picture")) {
                try {
                    this.profile_picture = new ImageDto(user_id, 0).get_image(2);
                } catch (Exception x) {
                    x.printStackTrace();
                }
            }
        }
    }

    public String getCountry() { return country; }

    public int getUser_id() {
        return user_id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public boolean isAdmin() {
        return admin;
    }
}
