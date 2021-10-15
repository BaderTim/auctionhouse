package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.error.MissingPermissionException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Timestamp;

public class RatingDto {

    private int rating_id;
    private int user_id;
    private int creator_user_id;
    private int rating;
    private String comment;
    private long unix_creation_time;
    private String first_name;
    private String last_name;

    public RatingDto() {}

    public RatingDto(int rating_id, int user_id, int creator_user_id, int rating, String comment, long unix_creation_time) {
        this.rating_id = rating_id;
        this.user_id = user_id;
        this.creator_user_id = creator_user_id;
        this.rating = rating;
        this.comment = comment;
        this.unix_creation_time = unix_creation_time;
    }

    public RatingDto(int rating_id, int user_id, String first_name, String last_name, int creator_user_id, int rating, String comment, long unix_creation_time) {
        this.rating_id = rating_id;
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.creator_user_id = creator_user_id;
        this.rating = rating;
        this.comment = comment;
        this.unix_creation_time = unix_creation_time;
    }

    public RatingDto(int id) {
        JSONArray arr = SQLConnector.sql_get(Query.get_rating_by_id(id));
        if(arr.length() == 0) {
            throw new InvalidUserDataException("Cannot find any rating with this id.");
        }
        JSONObject obj = arr.getJSONObject(0);
        this.rating_id = obj.getInt("rating_id");
        this.user_id = obj.getInt("user_id");
        this.first_name = obj.getString("first_name");
        this.last_name = obj.getString("last_name");
        this.creator_user_id = obj.getInt("creator_user_id");
        this.rating = obj.getInt("rating");
        this.comment = obj.getString("comment");
        this.unix_creation_time = ((Timestamp)obj.get("unix_time")).getTime();
    }

    public RatingDto(SessionKey sk, RatingDto ratingDto) {
        this.unix_creation_time = System.currentTimeMillis();
        if(ratingDto.getRating() >= 0 && ratingDto.getRating() <= 5) {
            this.rating = ratingDto.getRating();
        } else {
            throw new InvalidArgumentsException("Rating must be between 0 and 5.");
        }
        if(ratingDto.getComment() != null) {
            if(ratingDto.getComment().length() > 200) {
                throw new InvalidArgumentsException("Rating comment cannot have more than 200 characters.");
            }
            this.comment = ratingDto.getComment();
        }
        this.user_id = ratingDto.getUser_id();
        this.creator_user_id = sk.getUser_id();
        if(user_id == creator_user_id) {
            throw new InvalidArgumentsException("You cannot rate yourself.");
        }
        if(SQLConnector.sql_get(Query.does_rating_exist(this.creator_user_id, this.user_id)).length() > 0) {
            throw new InvalidArgumentsException("You have rated this user already. Please remove your old rating before creating a new one.");
        }
        SQLConnector.sql_post(Query.create_rating(this.user_id, this.creator_user_id, this.rating, this.comment));
        this.rating_id = -1;
    }

    public void delete(int deleter_user_id) {
        if(deleter_user_id != this.creator_user_id) {
            throw new MissingPermissionException("You cannot remove other peoples ratings.");
        }
        SQLConnector.sql_post(Query.delete_Rating(this.rating_id));
    }


    public int getRating() {
        return rating;
    }

    public int getRating_id() {
        return rating_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public long getUnix_creation_time() {
        return unix_creation_time;
    }

    public String getComment() {
        return comment;
    }

    public int getCreator_user_id() {
        return creator_user_id;
    }

    public String getFirst_name() {
        return this.first_name;
    }

    public String getLast_name() {
        return this.last_name;
    }
}
