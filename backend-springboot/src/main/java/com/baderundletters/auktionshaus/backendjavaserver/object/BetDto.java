package com.baderundletters.auktionshaus.backendjavaserver.object;

public class BetDto {

    private int user_id;
    private float price;
    private long timestamp;
    private int auction_id;

    public BetDto() {}

    public BetDto(float price, long timestamp, int user_id) {
        this.timestamp = timestamp;
        this.price = price;
        this.user_id = user_id;
        this.auction_id = -1;
    }

    public BetDto(float price, long timestamp, int user_id, int auction_id) {
        this.timestamp = timestamp;
        this.price = price;
        this.user_id = user_id;
        this.auction_id = auction_id;
    }

    public int getAuction_id() {return this.auction_id;}

    public float getPrice() {return this.price;}

    public long getTimestamp() {return this.timestamp;}

    public int getUser_id() {return this.user_id;}

}
