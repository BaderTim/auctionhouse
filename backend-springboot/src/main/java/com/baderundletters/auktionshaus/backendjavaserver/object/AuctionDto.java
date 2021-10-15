package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.Static;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidLocationException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Timestamp;


public class AuctionDto {

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

    private float cost;

    public AuctionDto() {}

    public AuctionDto(boolean logged_in, int auction_id, int seller_id, String title, String description,
                      int amount, String item_type, String auction_type, float starting_price,
                      String currency, float current_price, long unix_ending_time,
                      long unix_starting_time, long unix_creation_time,
                      boolean bank_transfer, boolean paypal, boolean cash, boolean international, float cost) {
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
        if(logged_in) {
            this.load_images();
        }
    }

    public AuctionDto(int auction_id)  {
        JSONObject res = null;
        try {
            res = SQLConnector.sql_get(Query.get_auction_by_id(auction_id)).getJSONObject(0);
        } catch (JSONException e) {
            throw new InternalDatabaseException("Could not find auction.");
        }
        try {
            this.auction_id = res.getInt("auction_id");
            this.seller_id = res.getInt("seller_id");
            this.unix_creation_time = ((Timestamp)res.get("unix_time")).getTime();
            this.title = res.getString("title");
            this.description = res.getString("description");
            this.currency = res.getString("currency");
            this.item_type = res.getString("item_type");
            this.auction_type = res.getString("auction_type");
            this.amount = res.getInt("amount");
            this.starting_price = (float)res.getDouble("starting_price");
            this.current_price = (float)res.getDouble("current_price");
            this.unix_starting_time = ((Timestamp)res.get("unix_starting_time")).getTime();
            this.unix_ending_time = ((Timestamp)res.get("unix_ending_time")).getTime();
            this.international = res.getBoolean("international");
            this.cash = res.getBoolean("cash");
            this.bank_transfer = res.getBoolean("bank_transfer");
            this.paypal = res.getBoolean("paypal");
        } catch (Exception x) {
            x.printStackTrace();
            throw new InternalDatabaseException(String.format("Could not find any auction with id '%s'.", auction_id));
        }
    }

    public AuctionDto(AuctionDto new_auction, SessionKey sessionKey) {
        SellerDto current_seller = new SellerDto(sessionKey);
        if(current_seller.has_open_invoices()) {
            throw new InvalidArgumentsException("You cannot create new auctions while having drafted, open or unpaid invoices. Please check your payment data under 'Profile -> My Page -> Seller Account' for more information.");
        }
        if(new_auction.getTitle().length() > 80) {
            throw new InvalidArgumentsException("Auction title cannot be longer than 80 characters.");
        }
        if(new_auction.getDescription().length() > 1000) {
            throw new InvalidArgumentsException("Description cannot be longer than 1000 characters.");
        }
        if(new_auction.getAmount() < 1 || new_auction.getAmount() > 999) {
            throw new InvalidArgumentsException("Amount must be between 1-999.");
        }
        if(!new_auction.getItem_type().equals("ww1") && !new_auction.getItem_type().equals("ww2") && !new_auction.getItem_type().equals("photo_album") && !new_auction.getItem_type().equals("other")) {
            throw new InvalidArgumentsException("Item type can either be 'other', 'photo_album', 'ww1' or 'ww2'.");
        }
        if(!new_auction.getCurrency().equals("usd") && !new_auction.getCurrency().equals("eur")) {
            throw new InvalidArgumentsException("Currency can either be 'eur' or 'usd'.");
        }
        if(!new_auction.getAuction_type().equals("auction") && !new_auction.getAuction_type().equals("instant_sell")) {
            throw new InvalidArgumentsException("Auction type can either be auction or instant_sell.");
        }
        if(new_auction.getStarting_price() < 1 || new_auction.getStarting_price() > 99999) {
            throw new InvalidArgumentsException("Starting price must be between 1-99.999 $.");
        }
        this.unix_starting_time = System.currentTimeMillis();
        this.unix_ending_time = System.currentTimeMillis()+1000L*60L*60L*24L*90L;


        if(!new_auction.getAuction_type().equals("instant_sell")) {
            if (new_auction.getUnix_starting_time() > System.currentTimeMillis() + 60 * 60 * 24 * 7 * 1000 || new_auction.getUnix_starting_time() < System.currentTimeMillis() + 60 * 1000) {
                throw new InvalidArgumentsException("Starting time must be between current_time+60seconds and current_time+7days.");
            }
            if (new_auction.getUnix_ending_time() > new_auction.getUnix_starting_time() + 60 * 60 * 24 * 8 * 1000 || new_auction.getUnix_ending_time() < new_auction.getUnix_starting_time() + 60 * 60 * 24 * 1000) {
                throw new InvalidArgumentsException("Ending time must be between starting_time+1day and starting_time+8days.");
            }
            this.unix_starting_time = new_auction.getUnix_starting_time();
            this.unix_ending_time = new_auction.getUnix_ending_time();
        }


        if (new_auction.getThumbnail() == null || !Static.b64_check(new_auction.getThumbnail())) {
            throw new InvalidArgumentsException("Thumbnail is invalid (corrupted?).");
        }
        if(new_auction.getImages().length > 12) {
            throw new InvalidArgumentsException("Images are limited to a amount of 12.");
        }
        for(int i = 0; i < new_auction.getImages().length; i++) {
            if (!Static.b64_check(new_auction.getImages()[i])) {
                throw new InvalidArgumentsException("Image "+(i+1)+" is invalid.");
            }
        }
        if(!new_auction.offersBank_transfer() && !new_auction.offersCash() && !new_auction.offersPaypal()) {
            throw new InvalidArgumentsException("At least one payment method is required.");
        }
        float auction_count = current_seller.getAuction();
        float photo_album_count = current_seller.getPhoto_album();
        float additional_image_count = current_seller.getAdditional_image();
        this.cost = (float)0.5;
        if(new_auction.getItem_type().equals("photo_album")) {
            this.cost = (float)2;
            photo_album_count++;
        } else {
            auction_count++;
        }
        if(new_auction.getImages().length > 4) {
            this.cost += (float)((new_auction.getImages().length-4)*0.1);
            additional_image_count+= (new_auction.getImages().length-4);
        }
        this.seller_id = current_seller.getSeller_id();
        this.title = new_auction.getTitle();
        this.description = new_auction.getDescription();
        this.amount = new_auction.getAmount();
        this.auction_type = new_auction.getAuction_type();
        this.item_type = new_auction.getItem_type();
        this.starting_price = new_auction.getStarting_price();
        this.currency = new_auction.getCurrency();
        this.images = null;
        this.paypal = new_auction.offersPaypal();
        this.bank_transfer = new_auction.offersBank_transfer();
        this.cash = new_auction.offersCash();
        this.international = new_auction.isInternational();
        this.unix_creation_time = System.currentTimeMillis();
        this.current_price = new_auction.getCurrent_price();

        SQLConnector.sql_post(Query.create_auction(this.seller_id, this.cost, this.title, this.description, this.currency, this.item_type, this.auction_type, this.amount, this.starting_price, this.starting_price, this.unix_starting_time, this.unix_ending_time, new_auction.getImages().length, this.international, this.cash, this.bank_transfer, this.paypal));
        this.auction_id = SQLConnector.sql_get(Query.get_auction_id_from_latest_auction_by_user(this.seller_id)).getJSONObject(0).getInt("auction_id");
        SQLConnector.sql_post(Query.update_debt(this.seller_id, auction_count, photo_album_count, additional_image_count));

        ImageDto imageDto = new ImageDto(sessionKey.getUser_id(), this.auction_id);

        imageDto.save_image(new_auction.getThumbnail(), 0);
        this.thumbnail = "";

        for(int i = 0; i < new_auction.getImages().length; i++) {
            imageDto.save_image(new_auction.getImages()[i], i+1);
            SQLConnector.sql_post(Query.upload_image(this.auction_id, i+1)); // do it one by one
        }
        // does not work (do as transaction?) SQLConnector.sql_post(Query.upload_images(this.auction_id, new_auction.getImages().length));
    }

    public AuctionResponse get_auctionResponse(boolean logged_in) {
        if(logged_in) {
            load_images();
        }
        return new AuctionResponse(logged_in, this.auction_id, this.seller_id, this.title, this.description, this.amount, this.item_type, this.auction_type, this.starting_price, this.currency, this.current_price, this.unix_ending_time, this.unix_starting_time, this.unix_creation_time, this.bank_transfer, this.paypal, this.cash, this.international, this.cost, this.thumbnail, this.images);
    }

    public AuctionResponse get_auctionResponse_listing(boolean logged_in) {
        if(logged_in) {
            ImageDto imageDto = new ImageDto(SQLConnector.sql_get(Query.get_user_id_by_seller_id(this.seller_id)).getJSONObject(0).getInt("user_id"), this.auction_id);
            try {
                this.thumbnail = imageDto.get_image(0);
            } catch (Exception x) {
                x.printStackTrace();
            }
        } else {
            this.thumbnail = null;
        }
        return new AuctionResponse(logged_in, this.auction_id, this.seller_id, this.title, this.description, this.amount, this.item_type, this.auction_type, this.starting_price, this.currency, this.current_price, this.unix_ending_time, this.unix_starting_time, this.unix_creation_time, this.bank_transfer, this.paypal, this.cash, this.international, this.cost, this.thumbnail, null);
    }

    public void end_auction(LightUserDto userDto) {
        if(this.get_auction_Seller().getUser_id() != userDto.getUser_id()) {
            throw new InvalidUserDataException("You cannot perform this action because you are not the seller at this auction.");
        }
        if(this.auction_type.equals("auction")) {
            SQLConnector.sql_post(Query.end_auction(this.auction_id));
            LightUserDto highest_bettor = this.get_highest_bettor();
            ChatDto chat = new ChatDto(this.get_auction_Seller().getUser_id(), highest_bettor.getUser_id());
            MessageDto new_message = new MessageDto(("Hello! I have manually canceled my auction '"+this.getTitle()+"' (ID: "+this.getAuction_id()+") " +
                    "before the timer ran out. You were the highest bettor which means you have now won this auction."), highest_bettor);
            chat.send(new_message);
        } else {
            SQLConnector.sql_post(Query.end_auction(this.auction_id));
        }
    }

    public void bet(LightUserDto userDto, float price) {
        user_check(userDto);
        if(this.auction_type.equals("auction")) {
            country_check(userDto);
            if(this.getUnix_starting_time() > System.currentTimeMillis()) {
                throw new InvalidArgumentsException("The auction did not start yet.");
            }
            if(this.getUnix_ending_time() < System.currentTimeMillis()) {
                throw new InvalidArgumentsException("This auction has ended already.");
            }
            if(price < this.getCurrent_price()+this.getCurrent_price()*0.01) {
                throw new InvalidArgumentsException("There has to be a price difference of greater than +1%. You have "+((price-this.getCurrent_price())/this.getCurrent_price()*100)+"%.");
            }
            if(price-0.5 < this.getCurrent_price()) {
                throw new InvalidArgumentsException("There has to be a price difference greater than +0.5"+this.get_currency_symbol()+". You have "+(price-this.getCurrent_price())+""+this.get_currency_symbol()+".");
            }
            SQLConnector.sql_post(Query.bet_on_auction(this.auction_id, userDto.getUser_id(), price));
            SQLConnector.sql_post(Query.change_current_auction_price(this.auction_id, price));
        } else {
            if(this.getUnix_ending_time() < System.currentTimeMillis()) {
                throw new InvalidArgumentsException("This instant buy listing has expired.");
            }
            SQLConnector.sql_post(Query.bet_on_auction(this.auction_id, userDto.getUser_id(), this.current_price));
            SQLConnector.sql_post(Query.end_instant_buy_listing(this.auction_id));
        }
    }

    public void reopen_instant_buy(SessionKey sk) {
        sk.admin_verify();
        SQLConnector.sql_post(Query.reopen_instant_buy_listing(this.auction_id, this.unix_creation_time+1000*60*60*24*90));
    }

    public void suggest(LightUserDto userDto, float suggested_price) {
        user_check(userDto);
        if(this.auction_type.equals("instant_sell")) {
            country_check(userDto);
            ChatDto chat = new ChatDto(userDto.getUser_id(), this.get_auction_Seller().getUser_id());
            MessageDto new_message = new MessageDto(("Hello! I am interested in your listing *"+this.getTitle()+"* (ID: "+this.getAuction_id()+") " +
                    "and would like suggest a price of "+suggested_price+get_currency_symbol()+". Please let me know if you are willing to sell your item to me for the given price."), userDto);
            chat.send(new_message);
        } else {
            throw new InvalidArgumentsException("You can only suggest prices for instant sell listings.");
        }
    }

    public LightUserDto get_auction_Seller() {
        return new SellerDto(this.seller_id).user_data();
    }

    public LightUserDto[] get_bettors(FilterDto filterDto) {
        JSONArray arr = SQLConnector.sql_get(Query.filter_bettors(filterDto, this.auction_id));
        LightUserDto[] bettors = new LightUserDto[arr.length()];
        for(int b = 0; b < arr.length(); b++) {
            JSONObject obj = arr.getJSONObject(b);
            try {
                bettors[b] = new LightUserDto(obj.getInt("user_id"),
                        obj.getBoolean("admin"),
                        obj.getString("first_name"),
                        obj.getString("last_name"),
                        obj.getString("country"),
                        obj.getBoolean("profile_picture"));
            } catch (JSONException x) {
                bettors[b] = new LightUserDto(0, false, "deleted", "deleted", "unknown", false);
            }
        }
        return bettors;
    }

    public LightUserDto get_highest_bettor() {
        return new LightUserDto(SQLConnector.sql_get(Query.get_highest_bettor(this.auction_id)).getJSONObject(0).getInt("user_id"));
    }

    public void country_check(LightUserDto userDto) {
        if(!international && !userDto.getCountry().equals(this.get_auction_Seller().getCountry())) {
            throw new InvalidLocationException("International shipping is disabled for this auction.");
        }
    }

    public void user_check(LightUserDto userDto) {
        if(this.get_auction_Seller().getUser_id() == userDto.getUser_id()) {
            throw new InvalidUserDataException("You cannot perform this action because you are the seller at this auction.");
        }
    }

    private String get_currency_symbol() {
        String cs = "€";
        if(this.getCurrency().equals("usd")) {
            cs = "$";
        }
        return cs;
    }

    private void load_images() {
        ImageDto imageDto = new ImageDto(SQLConnector.sql_get(Query.get_user_id_by_seller_id(this.seller_id)).getJSONObject(0).getInt("user_id"), this.auction_id);
        try {
            this.thumbnail = imageDto.get_image(0);
        } catch (Exception x) {
            this.thumbnail = null;
            x.printStackTrace();
        }
        JSONArray res = SQLConnector.sql_get(Query.get_images_from_auction(this.auction_id));
        this.images = new String[res.length()];
        for(int i = 0; i < res.length(); i++) {
            try {
                this.images[i] = imageDto.get_image(res.getJSONObject(i).getInt("image"));
            } catch (Exception x) {
                x.printStackTrace();
            }
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
}