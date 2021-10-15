package com.baderundletters.auktionshaus.backendjavaserver.database;

import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.sql.*;


public class SQLConnector {

    public static void start_jdbc_ssl_initializer() {
        // WIP
    }

    private static String options = ""; //"&serverSslCert="+path_to_cert;

    public static JSONArray sql_get(String sql) {
        String connectionUrl = "jdbc:mysql://"+ Config.database_ip+":3306/"
                        + "auctionhouse"
                        + "?user=auctionhouse_guest"
                        + "&password="+Config.auctionhouse_guest_password+options;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(connectionUrl);
            Statement statement = connection.createStatement();
            statement.executeQuery(sql);
            JSONArray res = ResultSetConverter.convert(statement.getResultSet());
            if(res.length() > 0) {
                connection.close();
            }
            return res;
        }
        // Handle any errors that may have occurred.
        catch (SQLException | JSONException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Internal database error. Please contact a administrator.");
        }
    }

    public static void sql_post(String sql) {
        String connectionUrl = "jdbc:mysql://"+ Config.database_ip+":3306/"
                + "auctionhouse"
                + "?user=auctionhouse_user"
                + "&password="+Config.auctionhouse_user_password+options;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(connectionUrl);
            Statement statement = connection.createStatement();
            statement.executeUpdate(sql);
            connection.close();
        }
        // Handle any errors that may have occurred.
        catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Internal database error. Please contact a administrator.");
        }
    }

    public static void multiple_sql_posts(String[] sql) {
        String connectionUrl = "jdbc:mysql://"+ Config.database_ip+":3306/"
                + "auctionhouse"
                + "?user=auctionhouse_user"
                + "&password="+Config.auctionhouse_user_password;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(connectionUrl);
            Statement statement = connection.createStatement();
            for(int i = 0; i < sql.length; i++) {
                statement.addBatch(sql[i]);
            }
            statement.executeBatch();
            connection.close();
        }
        // Handle any errors that may have occurred.
        catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Internal database error. Please contact a administrator.");
        }
    }

    public static JSONArray sql_multiple_get(String sql, int amount) {
        String connectionUrl = "jdbc:mysql://"+ Config.database_ip+":3306/"
                + "auctionhouse"
                + "?user=auctionhouse_user"
                + "&password="+Config.auctionhouse_user_password+"&allowMultiQueries=true";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(connectionUrl);
            Statement statement = connection.createStatement();
            statement.executeQuery(sql);
            for(int i = 0; i < amount-1; i++) {
                statement.getMoreResults();
            }
            JSONArray res = ResultSetConverter.convert(statement.getResultSet());
            if(res.length() > 0) {
                connection.close();
            }
            return res;
        }
        // Handle any errors that may have occurred.
        catch (SQLException | JSONException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Internal database error. Please contact a administrator.");
        }
    }

}
