package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;

public class RegisterDto {

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


    public RegisterDto(String email, String password, String first_name, String last_name, String phone_number, String birth_date,
                       String house_number, String street_name, String address_addition, int postal_code, String city, String country) {
        this.email = email;
        this.password = password.hashCode()+"";
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.birth_date = birth_date;
        this.house_number = house_number;
        this.street_name = street_name;
        this.postal_code = postal_code;
        this.city = city;
        this.country = country;
        this.address_addition = address_addition;
    }

    public void initialize() {
        if(email.length() < 4 || !email.contains("@")) {
            throw new InvalidArgumentsException("Email is too short or missing '@' symbol.");
        } else if (password.length() < 2) {
            throw new InvalidArgumentsException("Password is too short.");
        } else if (first_name.length() < 2) {
            throw new InvalidArgumentsException("First name is too short.");
        } else if (last_name.length() < 2) {
            throw new InvalidArgumentsException("Last name is too short.");
        } else if (phone_number.length() < 5 || !phone_number.contains("+")) {
            throw new InvalidArgumentsException("Phone number is too short or missing country code.");
        } else if (birth_date.length() < 5) {
            throw new InvalidArgumentsException("Birth date is too short.");
        } else if (house_number.length() < 1) {
            throw new InvalidArgumentsException("House number is too short.");
        } else if (street_name.length() < 2) {
            throw new InvalidArgumentsException("Street name is too short.");
        } else if (postal_code < 1) {
            throw new InvalidArgumentsException("Postal code is too short.");
        } else if (city.length() < 2) {
            throw new InvalidArgumentsException("City name is too short.");
        } else if (country.length() < 2) {
            throw new InvalidArgumentsException("Country name is too short.");
        }
        if(SQLConnector.sql_get(Query.search_email(email)).length() > 0) {
            throw new InvalidUserDataException("This email is already in use.");
        }
        new UserDto(this);
    }

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

}
