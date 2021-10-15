package com.baderundletters.auktionshaus.backendjavaserver;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Static {

    public static int verification_state = 2;

    public static String password_salt = "SJDAHDSAUHD§2437d727odPD)=SAdgsa%&/SDsbadsp)(§Ad33ad*'SDsjad";

    public static boolean b64_check(String base64)  {
        String pattern = "^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$";
        Pattern r = Pattern.compile(pattern);
        Matcher m;
        if(base64.contains(",")) {
            m =r.matcher(base64.split(",")[1]);
        } else {
            m = r.matcher(base64);
        }
        if (m.find()) {
            return true;
        }
        return false;
    }

    public static void delete_user_globally(int user_id) {
        // TODO: remove names and user data, replace with ids?
    }
}
