package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.SessionKey;
import org.json.JSONArray;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/statistic")
public class StatisticController {

    // gets count of all users
    @GetMapping(path ="/total_users")
    public int user_count(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_total_users()).getJSONObject(0).getInt("count");
    }

    // gets count of all sellers
    @GetMapping(path ="/total_sellers")
    public int seller_count(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_total_sellers()).getJSONObject(0).getInt("count");
    }

    // gets count of all banned users
    @GetMapping(path ="/total_banned_users")
    public int banned_user_count(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_total_banned_users()).getJSONObject(0).getInt("count");
    }

    // gets count of all auctions
    @GetMapping(path ="/get_total_auctions")
    public int auction_count(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_total_auctions()).getJSONObject(0).getInt("count");
    }

    // gets count of all auctions
    @PostMapping(path ="/get_total_auctions_from_seller")
    public int auction_count_from_seller(@RequestBody IDDto id) {
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_seller_id(id.getId()));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("User is not registered as seller.");
        }
        return SQLConnector.sql_get(Query.get_total_auctions_from_seller(id.getId())).getJSONObject(0).getInt("count");
    }

    // gets count of all bets
    @GetMapping(path ="/get_total_bets")
    public int bet_count(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_total_bets()).getJSONObject(0).getInt("count");
    }

    // gets average count of bets per auction
    @GetMapping(path ="/avg_bets")
    public int average_bets(@RequestHeader("session_key") String session_key) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        return SQLConnector.sql_get(Query.get_average_bets()).getJSONObject(0).getInt("avg");
    }

    // TODO: advanced statistics

}
