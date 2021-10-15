package com.baderundletters.auktionshaus.backendjavaserver.database;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import com.baderundletters.auktionshaus.backendjavaserver.object.FilterDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.IDFilterWrapper;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class Query {

    private static void secure(String input) {
        input.toLowerCase();
        if(input.contains("drop ")) {
            throw new InternalDatabaseException("Characters and words like 'drop ' are not allowed.");
        } else if(input.contains("delete ")) {
            throw new InternalDatabaseException("Characters and words like 'delete ' are not allowed.");
        } else if(input.contains("insert ")) {
            throw new InternalDatabaseException("Characters and words like 'insert ' are not allowed.");
        } else if(input.contains("update ")) {
            throw new InternalDatabaseException("Characters and words like 'update ' are not allowed.");
        } else if(input.contains("select ")) {
            throw new InternalDatabaseException("Characters and words like 'select ' are not allowed.");
        } else if(input.contains("=")) {
            throw new InternalDatabaseException("Characters and words like '=' are not allowed.");
        } else if(input.contains(";")) {
            throw new InternalDatabaseException("Characters and words like ';' are not allowed.");
        }  else if(input.contains("'")) {
            throw new InternalDatabaseException("Characters and words like ' are not allowed.");
        } else if(input.contains("\"")) {
            throw new InternalDatabaseException("Characters and words like \" are not allowed.");
        } else if(input.contains("´")) {
            throw new InternalDatabaseException("Characters and words like ´ are not allowed.");
        } else if(input.contains("`")) {
            throw new InternalDatabaseException("Characters and words like ` are not allowed.");
        }
    }

    public static int booleanToInt(boolean value) {
        // Convert true to 1 and false to 0.
        return value ? 1 : 0;
    }




    //
    // SELLER
    //
    public static String get_all_validated_sellers() {
        return String.format("SELECT * FROM seller WHERE is_validated = 1 AND (auction > 0 OR photo_album > 0)");
    }
    public static String get_all_validated_sellers_with_username(FilterDto filterDto) {
        return String.format("SELECT seller.*, user.first_name, user.last_name, user.email, user.admin, user.country FROM seller JOIN user USING(user_id) " +
                "WHERE is_validated = 1 AND (first_name LIKE '%s' OR last_name LIKE '%s') " +
                "ORDER BY unix_validation_time %s LIMIT %s OFFSET %s", filterDto.getSearch_by_name(), filterDto.getSearch_by_name(), filterDto.getSorting_order(), filterDto.getAmount(), filterDto.getOffset());
    }
    public static String reset_seller_debt(int seller_id) {
        return String.format("UPDATE seller SET auction = 0, photo_album = 0, additional_image = 0 WHERE seller_id = %s", seller_id);
    }

    public static String get_seller_data_by_user_id(int user_id) {
        return String.format("SELECT * FROM seller WHERE user_id = %s", user_id);
    }
    public static String get_seller_data_by_seller_id(int seller_id) {
        return String.format("SELECT * FROM seller WHERE seller_id = %s", seller_id);
    }
    public static String add_seller(int user_id) {
        return String.format("INSERT INTO seller (user_id) VALUES (%s)", user_id);
    }
    public static String unverify_seller(int seller_id) {
        return String.format("UPDATE seller SET is_validated = 0 WHERE seller_id = %s", seller_id);
    }
    public static String verify_seller(int user_id) {
        return String.format("UPDATE seller SET is_validated = 1, unix_validation_time = CURRENT_TIMESTAMP WHERE user_id = %s", user_id);
    }
    public static String update_debt(int seller_id, float auction, float photo_album, float additional_image) {
        return String.format("UPDATE seller SET auction = %s, photo_album = %s, additional_image = %s WHERE seller_id = %s", auction, photo_album, additional_image, seller_id);
    }

    // STRIPE
    public static String save_stripe_id(String stripe_id, int user_id) {
        return String.format("UPDATE seller SET stripe_id = '%s' WHERE user_id = %s", stripe_id, user_id);
    }
    public static String save_payment_id(String payment_id, int user_id) {
        return String.format("UPDATE seller SET payment_id = '%s' WHERE user_id = %s", payment_id, user_id);
    }



    //
    // USER
    //
    public static String update_user(int user_id, String password, String first_name, String last_name, String phone_number, String birth_date, String street_name, String house_number,
                                  String address_addition, int postal_code, String city, String country, String description, boolean profile_picture) {
        secure_user_data(first_name, last_name, phone_number, birth_date, street_name, house_number, address_addition, city, country, description);
        return String.format("UPDATE user SET password = '%s', first_name = '%s', last_name = '%s', phone_number = '%s'," +
                        "birth_date = '%s', street_name = '%s', house_number = '%s', address_addition = '%s'," +
                        "postal_code = '%s', city = '%s', country = '%s', description = '%s', profile_picture = '%s' WHERE user_id = %s",
                password, first_name, last_name, phone_number, birth_date,
                street_name, house_number, address_addition, postal_code, city, country, description, booleanToInt(profile_picture), user_id);
    }
    private static void secure_user_data(String first_name, String last_name, String phone_number, String birth_date, String street_name,
                                         String house_number, String address_addition, String city, String country, String description) {
        secure(first_name);
        secure(last_name);
        secure(phone_number);
        secure(birth_date);
        secure(street_name);
        secure(phone_number);
        secure(address_addition);
        secure(city);
        secure(house_number);
        secure(country);
        secure(description);
    }

    public static String add_user(String password, String email, String first_name, String last_name, String phone_number, String birth_date, String street_name, String house_number,
                                  String address_addition, int postal_code, String city, String country, String description, boolean profile_picture) {
        secure(email);
        secure_user_data(first_name, last_name, phone_number, birth_date, street_name, house_number, address_addition, city, country, description);
        return String.format("INSERT INTO user (password, email, first_name, last_name, " +
                "phone_number, birth_date, street_name, house_number, address_addition, " +
                "postal_code, city, country, description, profile_picture) VALUES " +
                "('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
                password, email, first_name, last_name, phone_number, birth_date,
                street_name, house_number, address_addition, postal_code, city, country, description, booleanToInt(profile_picture));
    }

    public static String get_full_user_data_by_id(int user_id) {
        return String.format("SELECT * FROM user WHERE user_id = '%s'", user_id);
    }

    public static String get_lightuser_by_seller_id(int seller_id) {
        return String.format("SELECT user.user_id, user.admin, user.first_name, user.last_name, user.country, user.profile_picture FROM user JOIN seller WHERE seller.user_id = user.user_id AND seller.seller_id = %s", seller_id);
    }

    public static String get_user_id_by_seller_id(int seller_id) {
        return String.format("SELECT seller.user_id FROM seller WHERE seller.seller_id = %s", seller_id);
    }

    public static String get_user_id_by_email(String email) {
        return String.format("SELECT user_id FROM user WHERE email LIKE '%s'", email);
    }

    public static String get_password(int user_id) {
        return String.format("SELECT password FROM user WHERE user_id = %s", user_id);
    }

    public static String get_country_by_user_id(int user_id) {
        return String.format("SELECT country FROM user WHERE user_id = %s", user_id);
    }

    public static String search_email(String email) {
        secure(email);
        return String.format("SELECT email FROM user WHERE email LIKE '%s'", email);
    }

    public static String change_password(String password, int user_id) {
        return String.format("UPDATE user SET password = '%s' WHERE user_id = %s", password, user_id);
    }

    public static String search_user_for_login_by_email_and_password(String email, String password) {
        secure(email);
        return String.format("SELECT user_id, banned, admin, verified FROM user WHERE email LIKE '%s' AND password LIKE '%s'", email, password);
    }

    public static String change_email(String email, int user_id) {
        return String.format("UPDATE user SET email = '%s' WHERE user_id = %s", email, user_id);
    }

    public static String is_user_banned(int user_id) {
        return String.format("SELECT banned FROM user WHERE user_id = %s", user_id);
    }

    public static String ban_hammer(boolean ban, int user_id) {
        return String.format("UPDATE user SET banned = %s WHERE user_id = %s", booleanToInt(ban), user_id);
    }

    public static String filter_users(FilterDto filter) {
        secure(filter.getSearch_by_name());
        return String.format("SELECT * FROM user WHERE first_name LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", filter.getSearch_by_name(), filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    public static String filter_current_bets(int user_id, FilterDto filter) {
        String order_by = filter.getOrder_by();
        if(!order_by.equals("NULL")) {
            order_by = "bet."+order_by;
        }
        return String.format("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY','')); " +
                "SELECT bet.bet_id, bet.user_id, bet.auction_id, MAX(bet.amount) AS 'amount', bet.unix_time FROM bet JOIN auction USING(auction_id) WHERE user_id = %s AND CURRENT_TIMESTAMP < auction.unix_ending_time GROUP BY bet.auction_id ORDER BY %s %s LIMIT %s OFFSET %s", user_id, order_by, filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }


    public static String filter_all_my_bets(int user_id, FilterDto filter) {
        String order_by = filter.getOrder_by();
        if(!order_by.equals("NULL")) {
            order_by = "bet."+order_by;
        }
        return String.format("SELECT bet.* FROM bet WHERE user_id = %s ORDER BY %s %s LIMIT %s OFFSET %s", user_id, order_by, filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    //
    // LIGHTUSER
    //
    public static String get_light_user_by_id(int user_id) {
        return String.format("SELECT user_id, admin, first_name, last_name, country, profile_picture FROM user WHERE user_id = '%s'", user_id);
    }

    public static String get_follow_object(int user_id_x, int to_follow_user_id_y) {
        return String.format("SELECT * FROM follow WHERE user_id = %s AND to_follow_user_id = %s", user_id_x, to_follow_user_id_y);
    }

    public static String unfollow(int follow_id) {
        return String.format("DELETE FROM follow WHERE follow_id = %s", follow_id);
    }

    public static String get_follow_count(int user_id) {
        return String.format("SELECT COUNT(*) AS 'count' FROM follow WHERE to_follow_user_id = %s", user_id);
    }

    public static String is_following_user(int follower, int to_follow) {
        return String.format("SELECT follow_id FROM follow WHERE user_id = %s AND to_follow_user_id = %s", follower, to_follow);
    }

    public static String follow(int user_id_x, int to_follow_user_id_y) {
        return String.format("INSERT INTO follow (user_id, to_follow_user_id) VALUES (%s, %s)", user_id_x, to_follow_user_id_y);
    }

    public static String filter_followers(FilterDto filter, int user_id) {
        secure(filter.getSearch_by_name());
        return String.format("SELECT user.user_id, user.admin, user.first_name, user.last_name, user.country, user.profile_picture FROM user JOIN follow WHERE user.user_id = follow.user_id AND follow.to_follow_user_id = %s AND user.last_name LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", user_id, filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    public static String get_report(int user_id, int reported_user_id) {
        return String.format("SELECT * FROM report WHERE user_id = %s AND reported_user_id = %s", user_id, reported_user_id);
    }

    public static String report(int user_id, int reported_user_id, String problem, String description) {
        secure(problem);
        secure(description);
        return String.format("INSERT INTO report (user_id, reported_user_id, problem, description) VALUES (%s, %s, '%s', '%s')", user_id, reported_user_id, problem, description);
    }

    public static String get_all_banned_users(FilterDto filterDto) {
        return String.format("SELECT user_id, first_name, last_name, country, admin, unix_creation_time FROM user"
                +" WHERE banned = 1 AND (first_name LIKE '%s' OR last_name LIKE '%s') " +
                        "ORDER BY unix_creation_time %s LIMIT %s OFFSET %s", filterDto.getSearch_by_name(), filterDto.getSearch_by_name(), filterDto.getSorting_order(), filterDto.getAmount(), filterDto.getOffset());
    }

    public static String get_all_users(FilterDto filterDto) {
        return String.format("SELECT user_id, first_name, last_name, country, admin, unix_creation_time FROM user"
                +" WHERE (first_name LIKE '%s' OR last_name LIKE '%s') " +
                "ORDER BY unix_creation_time %s LIMIT %s OFFSET %s", filterDto.getSearch_by_name(), filterDto.getSearch_by_name(), filterDto.getSorting_order(), filterDto.getAmount(), filterDto.getOffset());
    }


    //
    // SESSION KEY
    //
    public static String get_session_key_by_user_id(int user_id) {
        return String.format("SELECT * FROM session WHERE user_id = %s", user_id);
    }

    public static String add_session_key(int user_id, String session_key, Timestamp expire_unix_time) {
        return String.format("INSERT INTO session (session_key, user_id, expiration_unix_time) VALUES ('%s', '%s', '%s')", session_key, user_id, expire_unix_time);
    }

    public static String get_session_key_data(String session_key) {
        secure(session_key);
        return String.format("SELECT session.*, user.banned, user.admin FROM session JOIN user WHERE session.user_id = user.user_id AND session_key LIKE '%s'", session_key);
    }


    //
    // AUCTION
    //
    public static String get_auction_by_id(int auction_id) {
        return String.format("SELECT * FROM auction WHERE auction_id = %s", auction_id);
    }

    public static String create_auction(int seller_id, float cost, String title, String description, String currency, String item_type, String auction_type, int amount, float starting_price, float current_price, long unix_starting_time, long unix_ending_time, int image_count, boolean international, boolean cash, boolean bank_transfer, boolean paypal) {
        return String.format("INSERT INTO auction (seller_id, cost, title, description, currency, item_type, auction_type, amount, starting_price, current_price, unix_starting_time, unix_ending_time, image_count, international, cash, bank_transfer, paypal) VALUES (%s, %s, '%s', '%s', '%s', '%s', '%s', %s, '%s', '%s', '%s', '%s', '%s', %s, %s, %s, %s)", seller_id, cost, title, description, currency, item_type, auction_type, amount, starting_price, current_price, new Timestamp(unix_starting_time), new Timestamp(unix_ending_time), image_count, booleanToInt(international), booleanToInt(cash), booleanToInt(bank_transfer), booleanToInt(paypal));
    }

    public static String get_auction_id_from_latest_auction_by_user(int seller_id) {
        return String.format("SELECT auction_id FROM auction WHERE seller_id = %s ORDER BY `unix_time` DESC LIMIT 1", seller_id);
    }

    public static String get_country_from_auction(int auction_id) {
        return String.format("SELECT country FROM user JOIN seller USING(user_id) JOIN auction USING(seller_id) WHERE auction_id = %s", auction_id);
    }

    public static String end_auction(int auction_id) {
        return String.format("UPDATE auction SET unix_ending_time = CURRENT_TIMESTAMP WHERE auction_id = %s", auction_id);
    }
    public static String get_highest_bettor(int auction_id) {
        return String.format("SELECT * FROM `bet` WHERE auction_id = %s ORDER BY amount DESC LIMIT 1", auction_id);
    }
    public static String filter_auctions(FilterDto filter, String country) {
        secure(filter.getSearch_by_name());
        String auction_type = "auction";
        if(filter.isIs_instant_sell()) {
            auction_type = "instant_sell";
        }
        if(filter.isActive()) {
            if(filter.isIs_instant_sell()) { // cancel out unix time
                return String.format("SELECT auction.* FROM auction JOIN seller USING(seller_id) JOIN user USING(user_id) WHERE (user.country LIKE '%s' OR international IS %s) AND (auction.title LIKE '%s' OR auction.description LIKE '%s') AND auction.item_type LIKE '%s' AND auction.auction_type LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", country, filter.isInternational(), filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getItem_type(), auction_type, filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
            }
            return String.format("SELECT auction.* FROM auction JOIN seller USING(seller_id) JOIN user USING(user_id) WHERE (user.country LIKE '%s' OR international IS %s) AND CURRENT_TIMESTAMP < auction.unix_ending_time AND (auction.title LIKE '%s' OR auction.description LIKE '%s') AND auction.item_type LIKE '%s' AND auction.auction_type LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", country, filter.isInternational(), filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getItem_type(), auction_type, filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
        }
        return String.format("SELECT auction.* FROM auction JOIN seller USING(seller_id) JOIN user USING(user_id) WHERE (user.country LIKE '%s' OR international IS %s) AND (auction.title LIKE '%s' OR auction.description LIKE '%s') AND auction.item_type LIKE '%s' AND auction.auction_type LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", country, filter.isInternational(), filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getItem_type(), auction_type, filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }
    public static String filter_auctions_from_sellerid(IDFilterWrapper idFilterWrapper) {
        FilterDto filter = idFilterWrapper.getFilterDto();
        int seller_id = idFilterWrapper.getIdDto().getId();
        return String.format("SELECT auction.* FROM auction WHERE (seller_id = %s) AND (auction.title LIKE '%s' OR auction.description LIKE '%s') AND auction.item_type LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", seller_id, filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getItem_type(), filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }
    public static String filter_bettors(FilterDto filter, int auction_id) {
        secure(filter.getSearch_by_name());
        return String.format("SELECT user_id, admin, first_name, last_name, country, profile_picture FROM user RIGHT JOIN bet USING (user_id) WHERE auction_id = %s GROUP BY user_id ORDER BY %s %s LIMIT %s OFFSET %s", auction_id, filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }
    public static String bet_on_auction(int auction_id, int user_id, float amount) {
        return String.format("INSERT INTO bet (auction_id, user_id, amount) VALUES (%s, %s, '%s')", auction_id, user_id, amount);
    }
    public static String change_current_auction_price(int auction_id, float new_price) {
        return String.format("UPDATE auction SET current_price = '%s' WHERE auction_id = %s", new_price, auction_id);
    }

    public static String get_newest_auctions_and_instant_buys(int limit, int offset) {
        return String.format("SELECT * FROM `auction` WHERE auction_type LIKE 'instant_sell' OR auction_type LIKE 'auction' AND unix_ending_time > CURRENT_TIMESTAMP ORDER BY unix_time DESC LIMIT %s OFFSET %s", limit, offset);
    }

    public static String get_hottest_auctions(int limit, int offset) {
        return String.format("SELECT auction.*, COUNT(bet.bet_id) AS 'bet_count' FROM `auction` JOIN bet USING(auction_id) WHERE auction_type LIKE 'auction' AND unix_ending_time > CURRENT_TIMESTAMP GROUP BY auction_id ORDER BY bet_count DESC LIMIT %s OFFSET %s", limit, offset);
    }

    public static String end_instant_buy_listing(int auction_id) {
        return String.format("UPDATE auction SET unix_ending_time = CURRENT_TIMESTAMP WHERE auction_id = %s", auction_id);
    }

    public static String reopen_instant_buy_listing(int auction_id, long new_ending_time) {
        return String.format("UPDATE auction SET unix_ending_time = %s WHERE auction_id = %s", new_ending_time, auction_id);
    }

    

    //
    // RATING
    //
    public static String get_rating_by_id(int rating_id) {
        return String.format("SELECT rating.*, user.first_name, user.last_name FROM rating, user WHERE rating_id = %s AND rating.creator_user_id = user.user_id", rating_id);
    }

    public static String create_rating(int user_id, int creator_user_id, int rating, String comment) {
        return String.format("INSERT INTO rating (user_id, creator_user_id, rating, comment) VALUES (%s, %s, %s, '%s')", user_id, creator_user_id, rating, comment);
    }

    public static String delete_Rating(int rating_id) {
        return String.format("DELETE FROM rating WHERE rating_id = %s", rating_id);
    }

    public static String delete_Ratingv2(int creator_id, int user_id) {
        return String.format("DELETE FROM rating WHERE user_id = %s AND creator_user_id = %s", user_id, creator_id);
    }

    public static String filter_ratings(FilterDto filter, int user_id) {
        secure(filter.getSearch_by_name());
        return String.format("SELECT rating.*, user.first_name, user.last_name FROM rating, user WHERE rating.creator_user_id = user.user_id AND comment LIKE '%s' AND rating.user_id = %s ORDER BY %s %s LIMIT %s OFFSET %s", filter.getSearch_by_name(), user_id, filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    public static String does_rating_exist(int creator_id, int user_id) {
        return String.format("SELECT * FROM rating WHERE creator_user_id = %s AND user_id = %s", creator_id, user_id);
    }

    public static String get_avg_rating(int user_id) {
        return String.format("SELECT ROUND(AVG(rating.rating), 1) AS 'rating', COUNT(*) AS 'total_count' FROM rating WHERE user_id = %s", user_id);
    }


    //
    // STATISTICS
    //
    public static String get_total_users() {
        return "SELECT COUNT(user_id) AS 'count' FROM user";
    }
    public static String get_total_sellers() {
        return "SELECT COUNT(seller_id) AS 'count' FROM seller";
    }
    public static String get_total_banned_users() {
        return "SELECT COUNT(user_id) AS 'count' FROM user WHERE banned = 1";
    }
    public static String get_total_auctions() {
        return "SELECT COUNT(auction_id) AS 'count' FROM auction";
    }
    public static String get_total_bets() {
        return "SELECT COUNT(bet_id) AS 'count' FROM bet";
    }
    public static String get_average_bets() {
        return "SELECT AVG(bets_per_auction.count) AS 'avg' FROM (SELECT COUNT(bet_id) AS 'count' FROM bet GROUP BY auction_id) AS bets_per_auction";
    }
    public static String get_total_auctions_from_seller(int seller_id) {
        return String.format("SELECT COUNT(auction_id) AS 'count' FROM `auction` WHERE seller_id = %s", seller_id);
    }


    //
    // IMAGES
    //
    public static String upload_images(int auction_id, int images) {
        String output = "";
        for(int i = 0; i < images; i++) {
            output += String.format("INSERT INTO image (auction_id, image) VALUES (%s, %s); ", auction_id, i+1);
        }
        return output;
    }
    public static String upload_image(int auction_id, int image) {
        return String.format("INSERT INTO image (auction_id, image) VALUES (%s, %s)", auction_id, image);
    }
    public static String get_images_from_auction(int auction_id) {
        return String.format("SELECT * FROM image WHERE auction_id = %s", auction_id);
    }
    public static String remove_image(int image_id) {
        return String.format("DELETE FROM image WHERE image_id = %s", image_id);
    }

    //
    // Watchlist
    //
    public static String get_watchlist_auctions(int user_id, String country, FilterDto filter) {
        return String.format("SELECT auction.* FROM auction JOIN seller USING(seller_id) JOIN user USING(user_id) JOIN watchlist USING(auction_id) WHERE watchlist.user_id = %s AND (user.country LIKE '%s' OR international IS %s) AND (auction.title LIKE '%s' OR auction.description LIKE '%s') AND auction.item_type LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", user_id, country, filter.isInternational(), filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getItem_type(), filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    public static String is_auction_in_watchlist(int user_id, int auction_id) {
        return String.format("SELECT * FROM watchlist WHERE user_id = %s AND auction_id = %s", user_id, auction_id);
    }
    public static String watchlist_size(int user_id) {
        return String.format("SELECT watchlist_id FROM watchlist WHERE user_id = %s", user_id);
    }
    public static String remove_auction_from_watchlist(int user_id, int auction_id) {
        return String.format("DELETE FROM watchlist WHERE user_id = %s AND auction_id = %s", user_id, auction_id);
    }
    public static String add_auction_to_watchlist(int user_id, int auction_id) {
        return String.format("INSERT INTO watchlist (user_id, auction_id) VALUES (%s, %s)", user_id, auction_id);
    }

    //
    // VERIFICATION
    //

    public static String get_verification_keys_from_user(int user_id) {
        return String.format("SELECT * FROM verification_key WHERE user_id = %s", user_id);
    }

    public static String get_user_data_and_verification_status_by_key(String key) {
        return String.format("SELECT verified, first_name, email, user_id FROM verification_key JOIN user USING(user_id) WHERE key_content LIKE '%s'", key);
    }

    public static String get_verification_key_data_by_key(String key) {
        return String.format("SELECT * FROM verification_key WHERE key_content LIKE '%s'", key);
    }

    public static String set_verification_status_by_user(int user_id, int verified) {
        return String.format("UPDATE user SET verified = %s WHERE user_id = %s", verified, user_id);
    }

    public static String add_verification_key(String key, String intent, int user_id) {
        return String.format("INSERT INTO verification_key (key_content, intent, user_id) VALUES ('%s', '%s', %s)", key, intent, user_id);
    }

    public static String delete_verification_key(String key) {
        return String.format("DELETE FROM verification_key WHERE key_content = '%s'", key);
    }

    public static String get_verification_status(int user_id) {
        return String.format("SELECT verified FROM user WHERE user_id = %s", user_id);
    }

    public static String delete_verification_keys() {
        return String.format("DELETE FROM verification_key WHERE unix_creation_time < CURRENT_TIMESTAMP-60*60*48");
    }

    public static String delete_unverified_users() { // verification by using prime numbers, 2 for email and 3 for sms
        return String.format("DELETE FROM user WHERE unix_creation_time < CURRENT_TIMESTAMP-60*60*240 AND verified < %s", Static.verification_state);
    }


    //
    // MISCELLANEOUS.. how tf do you write that
    //

    public static String send_chat_message(int author_user_id, int recipient_user_id, String message) {
        return String.format("INSERT INTO chat (author_user_id, recipient_user_id, message) VALUES (%s, %s, '%s')", author_user_id, recipient_user_id, message);
    }
    public static String get_messages(int author_user_id, int partner_user_id, FilterDto filterDto) {
        return String.format("SELECT * FROM chat WHERE (author_user_id = %s AND recipient_user_id = %s) " +
                "OR (author_user_id = %s AND recipient_user_id = %s) ORDER BY unix_time %s LIMIT %s OFFSET %s", author_user_id, partner_user_id, partner_user_id, author_user_id, filterDto.getSorting_order(), filterDto.getAmount(), filterDto.getOffset());
    }
    public static String mark_message_as_seen(int chat_id) {
        return String.format("UPDATE chat SET seen = 1 WHERE chat_id = %s", chat_id);
    }
    public static String get_unread_messages(int user_id) {
        return String.format("SELECT author_user_id, COUNT(chat_id) AS unread_count FROM chat WHERE recipient_user_id = %s AND seen = 0 GROUP BY author_user_id", user_id);
    }
    public static String get_all_chats(int user_id, FilterDto filterDto) {
        return String.format("SELECT user_id, MAX(unix_time) AS unix_time FROM (SELECT author_user_id AS user_id, MAX(unix_time) AS unix_time " +
                "FROM chat WHERE author_user_id = %s OR recipient_user_id = %s GROUP BY user_id UNION SELECT recipient_user_id AS user_id, MAX(unix_time) AS unix_time " +
                "FROM chat WHERE author_user_id = %s OR recipient_user_id = %s GROUP BY user_id) random_table_name WHERE user_id != %s GROUP BY user_id " +
                "ORDER BY unix_time DESC LIMIT %S OFFSET %s", user_id, user_id, user_id, user_id, user_id, filterDto.getAmount(), filterDto.getOffset());
    }


    public static String get_report_by_id(int report_id) {
        return String.format("SELECT * FROM report WHERE report_id = %s", report_id);
    }
    public static String filter_reports(FilterDto filter) {
        secure(filter.getSearch_by_name());
        return String.format("SELECT * FROM report WHERE problem LIKE '%s' OR description LIKE '%s' ORDER BY %s %s LIMIT %s OFFSET %s", filter.getSearch_by_name(), filter.getSearch_by_name(), filter.getOrder_by(), filter.getSorting_order(), filter.getAmount(), filter.getOffset());
    }

    public static String get_all_ended_auctions_from_last_five_minutes() {
        return "";
    }
}
