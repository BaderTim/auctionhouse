package com.baderundletters.auktionshaus.backendjavaserver.object.response;


import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;

public class AuctionResponse {
    private int auction_id;
    private int seller_id;
    private String title;
    private String description;
    private int amount;
    private String item_type;
    private String auction_type;
    private float starting_price;
    private String currency;
    private float current_price;
    private long unix_ending_time;
    private long unix_starting_time;
    private long unix_creation_time;
    private String thumbnail;
    private String[] images;

    private boolean bank_transfer;
    private boolean paypal;
    private boolean cash;

    private boolean international;
    private String country;

    private float cost;

    public AuctionResponse() {}

    public AuctionResponse(boolean logged_in, int auction_id, int seller_id, String title, String description,
                      int amount, String item_type, String auction_type, float starting_price,
                      String currency, float current_price, long unix_ending_time,
                      long unix_starting_time, long unix_creation_time,
                      boolean bank_transfer, boolean paypal, boolean cash, boolean international, float cost, String thumbnail, String[] images) {
        this.auction_id = auction_id;
        this.seller_id = seller_id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.item_type = item_type;
        this.auction_type = auction_type;
        this.starting_price = starting_price;
        this.currency = currency;
        this.auction_type = auction_type;
        this.current_price = current_price;
        this.unix_ending_time = unix_ending_time;
        this.unix_starting_time = unix_starting_time;
        this.unix_creation_time = unix_creation_time;
        this.bank_transfer =  bank_transfer;
        this.paypal = paypal;
        this.cash = cash;
        this.international = international;
        this.cost = cost;
        this.thumbnail = null;
        this.images = null;
        this.country = SQLConnector.sql_get(Query.get_country_from_auction(this.auction_id)).getJSONObject(0).getString("country");
        if(logged_in) {
            this.thumbnail = thumbnail;
            this.images = images;
        }
    }

    public long getUnix_ending_time() { return unix_ending_time; }
    public boolean isPaypal() { return paypal; }
    public boolean isCash() { return cash; }
    public boolean isBank_transfer() { return bank_transfer; }
    public int getSeller_id() { return seller_id; }
    public String getCurrency() { return currency; }
    public String getTitle() { return title; }
    public long getUnix_creation_time() { return unix_creation_time; }
    public boolean offersBank_transfer() { return bank_transfer; }
    public float getCurrent_price() { return current_price; }
    public boolean offersCash() { return cash; }
    public boolean offersPaypal() { return paypal; }
    public float getStarting_price() { return starting_price; }
    public int getAmount() { return amount; }
    public boolean isInternational() { return international; }
    public int getAuction_id() { return auction_id; }
    public long getUnix_starting_time() { return unix_starting_time; }
    public String getAuction_type() { return auction_type; }
    public String getDescription() { return description; }
    public String getThumbnail() { return thumbnail; }
    public String getItem_type() { return item_type; }
    public String[] getImages() { return images; }
    public float getCost() { return cost; }
    public String getCountry() {return country;}
}
