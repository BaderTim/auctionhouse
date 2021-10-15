package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.database.Config;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.error.MissingPermissionException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceCollection;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class SellerDto {

    private int seller_id;
    private int user_id;
    private float auction;
    private float photo_album;
    private float additional_image;
    private String payment_id;
    private boolean is_validated;
    private String stripe_id;

    // for deserialization - DO NOT USE
    public SellerDto() {}

    public SellerDto(SessionKey session_key) {
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(session_key.getUser_id()));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("Not registered as seller.");
        }
        JSONObject object = arr.getJSONObject(0);
        if(!object.getBoolean("is_validated")) {
            throw new MissingPermissionException("Your registration process is not finished yet.");
        }
        this.seller_id = object.getInt("seller_id");
        this.auction = object.getFloat("auction");
        this.photo_album = object.getFloat("photo_album");
        this.additional_image = object.getFloat("additional_image");
        this.payment_id = object.getString("payment_id");
        this.stripe_id = object.getString("stripe_id");
        this.is_validated = true;
        this.user_id = session_key.getUser_id();
    }

    public SellerDto(int seller_id) {
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_seller_id(seller_id));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("Not registered as seller.");
        }
        JSONObject object = arr.getJSONObject(0);
        if(!object.getBoolean("is_validated")) {
            throw new MissingPermissionException("Your registration process has not finished yet. Please add a valid payment method.");
        }
        this.is_validated = true;
        this.seller_id = object.getInt("seller_id");
        this.auction = object.getFloat("auction");
        this.photo_album = object.getFloat("photo_album");
        this.additional_image = object.getFloat("additional_image");
        this.payment_id = object.getString("payment_id");
        this.stripe_id = object.getString("stripe_id");
        this.user_id = object.getInt("user_id");
    }

    public SellerDto(int seller_id, int user_id, int auction, int photo_album, int additional_image, String stripe_id) {
        this.is_validated = true;
        this.seller_id = seller_id;
        this.auction = auction;
        this.photo_album = photo_album;
        this.additional_image = additional_image;
        this.payment_id = "censored";
        this.stripe_id = stripe_id;
        this.user_id = user_id;
    }

    public SellerDto censor_payment_id() {
        this.payment_id = "censored";
        return this;
    }

    public boolean has_open_invoices() {
        Stripe.apiKey = Config.stripe_api_key;
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("status", "draft");
            params.put("customer", stripe_id);
            InvoiceCollection drafted_invoices = Invoice.list(params);
            if(drafted_invoices.getData().size() > 0) {
                return true;
            }
            params.put("status", "open");
            params.put("customer", stripe_id);
            InvoiceCollection open_invoices = Invoice.list(params);
            if(open_invoices.getData().size() > 0) {
                return true;
            }
            params.put("status", "uncollectible");
            params.put("customer", stripe_id);
            InvoiceCollection uncollectible_invoices = Invoice.list(params);
            if(uncollectible_invoices.getData().size() > 0) {
                return true;
            }
            return false;
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong while trying to check your ongoing invoices. Please try again.");
        }
    }

    public LightUserDto user_data() {
        JSONArray arr = SQLConnector.sql_get(Query.get_lightuser_by_seller_id(seller_id));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("Not registered as seller.");
        }
        JSONObject object = arr.getJSONObject(0);
        int user_id = object.getInt("user_id");
        boolean admin = object.getBoolean("admin");
        String first_name = object.getString("first_name");
        String last_name = object.getString("last_name");
        String country = object.getString("country");
        Boolean profile_picture = object.getBoolean("profile_picture");
        return new LightUserDto(user_id, admin, first_name, last_name, country, profile_picture);
    }


    public int getSeller_id() {
        return seller_id;
    }

    public int getUser_id() {return user_id;}

    public float getAdditional_image() {
        return additional_image;
    }

    public float getAuction() {
        return auction;
    }

    public float getPhoto_album() {
        return photo_album;
    }

    public String getPayment_id() {
        return payment_id;
    }

    public boolean isIs_validated() {
        return is_validated;
    }
}
