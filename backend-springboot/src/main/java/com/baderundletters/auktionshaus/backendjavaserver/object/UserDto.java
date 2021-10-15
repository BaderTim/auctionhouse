package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailHandler;
import com.baderundletters.auktionshaus.backendjavaserver.email.EmailTemplate;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Timestamp;

public class UserDto {

    private String email;
    private String password;

    private String first_name;
    private String last_name;
    private String phone_number;
    private String birth_date;

    private String house_number;
    private String street_name;
    private String address_addition;
    private int postal_code;
    private String city;
    private String country;


    private String profile_picture;
    private String description;

    private long unix_creation_time;
    private int user_id;

    private boolean admin;

    // for deserialization - DO NOT USE
    public UserDto() {}

    public UserDto(int id) {
        JSONArray ua = SQLConnector.sql_get(Query.get_full_user_data_by_id(id));
        if(ua.length() < 1) {
            throw new InvalidArgumentsException("Could not find user with id "+id+".");
        }
        JSONObject user = ua.getJSONObject(0);
        this.user_id = id;
        this.email = "-";
        this.password = "-";
        this.first_name = user.getString("first_name");
        this.last_name = user.getString("last_name");
        this.phone_number = "-";
        this.birth_date = "-";
        this.house_number = "-";
        this.street_name = "-";
        this.postal_code = 0;
        this.city = "-";
        this.country = user.getString("country");
        this.address_addition = "-";
        this.description = user.getString("description");
        this.unix_creation_time = ((Timestamp)user.get("unix_creation_time")).getTime();
        this.admin = user.getBoolean("admin");
        if(user.getBoolean("profile_picture")) {
            ImageDto imageDto = new ImageDto(this.user_id, 0);
            try {
                this.profile_picture = imageDto.get_image(2);
            }catch (Exception x) {
                x.printStackTrace();
            }
        } else {
            this.profile_picture = "-";
        }
    }

    public UserDto(SessionKey session_key) {
        JSONArray ua = SQLConnector.sql_get(Query.get_full_user_data_by_id(session_key.getUser_id()));
        if(ua.length() < 1) {
            throw new InvalidArgumentsException("Could not find user with id "+session_key.getUser_id()+".");
        }
        JSONObject user = ua.getJSONObject(0);
        this.user_id = session_key.getUser_id();
        this.admin = session_key.isAdmin();
        this.email = user.getString("email");
        this.password = "-";
        this.first_name = user.getString("first_name");
        this.last_name = user.getString("last_name");
        this.phone_number = user.getString("phone_number");
        this.birth_date = user.getString("birth_date");
        this.house_number = user.getString("house_number");
        this.street_name = user.getString("street_name");
        this.postal_code = user.getInt("postal_code");
        this.city = user.getString("city");
        this.country = user.getString("country");
        this.address_addition = user.getString("address_addition");
        this.description = user.getString("description");
        this.unix_creation_time = ((Timestamp)user.get("unix_creation_time")).getTime();
        ImageDto imageDto = new ImageDto(this.user_id, 0);
        if(user.getBoolean("profile_picture")) {
            try {
                this.profile_picture = imageDto.get_image(2);
            } catch (Exception x) {
                x.printStackTrace();
            }
        } else {
            this.profile_picture = "";
        }
    }

    public UserDto(RegisterDto registerDto) {
        this.email = registerDto.getEmail();
        this.password = registerDto.getPassword();
        this.first_name = registerDto.getFirst_name();
        this.last_name = registerDto.getLast_name();
        this.phone_number = registerDto.getPhone_number();
        this.birth_date = registerDto.getBirth_date();
        this.house_number = registerDto.getHouse_number();
        this.street_name = registerDto.getStreet_name();
        this.postal_code = registerDto.getPostal_code();
        this.city = registerDto.getCity();
        this.country = registerDto.getCountry();
        this.address_addition = registerDto.getAddress_addition();
        this.profile_picture = "";
        this.description = "";
        this.unix_creation_time = 0;
        SQLConnector.sql_post(Query.add_user(this.password, this.email, this.first_name, this.last_name, this.phone_number, this.birth_date, this.street_name, this.house_number, this.address_addition, this.postal_code, this.city, this.country, this.description, false));
        this.user_id = SQLConnector.sql_get(Query.get_user_id_by_email(this.email)).getJSONObject(0).getInt("user_id");
        this.admin = false;
        EmailHandler.send_email(this.email, "Welcome to dw-auction", EmailTemplate.register.replace("user_name", this.first_name));
    }


    public void edit(UserDto changed_user) {
        if(changed_user.getPassword() != null) {
            this.password = changed_user.getPassword().hashCode()+"";
        } else {
            this.password = SQLConnector.sql_get(Query.get_password(this.user_id)).getJSONObject(0).getString("password");
        }
        if(changed_user.getPostal_code() != 0) {
            if (changed_user.getPostal_code() < 1) {
                throw new InvalidArgumentsException("Postal code is too short.");
            }
            this.postal_code = changed_user.getPostal_code();
        }
        if(changed_user.getEmail() != null) {
            // TODO: Email change possible????
            if(changed_user.getEmail().length() < 4 || !changed_user.getEmail().contains("@")) {
                throw new InvalidArgumentsException("Email is too short or missing '@' symbol.");
            }
            this.email = changed_user.getEmail();
        }
        if(changed_user.getFirst_name() != null) {
            if (changed_user.getFirst_name().length() < 2) {
                throw new InvalidArgumentsException("First name is too short.");
            }
            this.first_name = changed_user.getFirst_name();
        }
        if(changed_user.getLast_name() != null) {
            if (changed_user.getLast_name().length() < 2) {
                throw new InvalidArgumentsException("Last name is too short.");
            }
            this.last_name = changed_user.getLast_name();
        }
        if(changed_user.getPhone_number() != null) {
            if (changed_user.getPhone_number().length() < 5 || !changed_user.getPhone_number().contains("+")) {
                throw new InvalidArgumentsException("Phone number is too short or missing country code.");
            }
            this.phone_number = changed_user.getPhone_number();
        }
        if(changed_user.getBirth_date() != null) {
            if (changed_user.getBirth_date().length() < 5) {
                throw new InvalidArgumentsException("Birth date is too short.");
            }
            this.birth_date = changed_user.getBirth_date();
        }
        if(changed_user.getHouse_number() != null) {
            if (changed_user.getHouse_number().length() < 1) {
                throw new InvalidArgumentsException("House number is too short.");
            }
            this.house_number = changed_user.getHouse_number();
        }
        if(changed_user.getStreet_name() != null) {
            if (changed_user.getStreet_name().length() < 2) {
                throw new InvalidArgumentsException("Street name is too short.");
            }
            this.street_name = changed_user.getStreet_name();
        }
        if(changed_user.getAddress_addition() != null) {
            this.address_addition = changed_user.getAddress_addition();
        }
        if(changed_user.getCity() != null) {
            if (changed_user.getCity().length() < 2) {
                throw new InvalidArgumentsException("City name is too short.");
            }
            this.city = changed_user.getCity();
        }
        if(changed_user.getCountry() != null) {
            if (changed_user.getCountry().length() < 2) {
                throw new InvalidArgumentsException("Country name is too short.");
            }
            this.country = changed_user.getCountry();
        }
        if(changed_user.getDescription() != null) {
            this.description = changed_user.getDescription();
        }
        // saves images that have been updated, then notes existing images in database by boolean values
        ImageDto imageDto = new ImageDto(this.user_id, 0);
        boolean new_profile_picture = false;
        if(this.profile_picture.length() > 0) {
            new_profile_picture = true;
        }
        if(changed_user.getProfile_picture() != null) {
            if (!Static.b64_check(changed_user.getProfile_picture())) {
                throw new InvalidArgumentsException("Profile picture is invalid (corrupted?).");
            }
            new_profile_picture = true;
            this.profile_picture = changed_user.getProfile_picture();
            imageDto.save_image(changed_user.getProfile_picture(), 2);
        }
        SQLConnector.sql_post(Query.update_user(this.user_id, this.password,  this.first_name, this.last_name, this.phone_number, this.birth_date, this.street_name, this.house_number, this.address_addition, this.postal_code, this.city, this.country, this.description, new_profile_picture));
        this.password = "-";
    }




    public long getUnix_creation_time() {return unix_creation_time;}

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public int getPostal_code() {
        return postal_code;
    }

    public String getAddress_addition() {
        return address_addition;
    }

    public String getBirth_date() {
        return birth_date;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getHouse_number() {
        return house_number;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public String getStreet_name() {
        return street_name;
    }

    public String getProfile_picture() {return profile_picture;}

    public String getDescription() {return description;}

    public int getUser_id() {return user_id;}

    public boolean Is_admin() {
        return admin;
    }
}
