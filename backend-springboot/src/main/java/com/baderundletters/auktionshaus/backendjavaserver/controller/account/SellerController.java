package com.baderundletters.auktionshaus.backendjavaserver.controller.account;

import com.baderundletters.auktionshaus.backendjavaserver.database.Config;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidUserDataException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value="/account/seller")
public class SellerController {

    // Get your own seller data
    @GetMapping(path ="/")
    public SellerDto my_seller_account(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        return new SellerDto(sk);
    }

    // Get your payment methods
    @GetMapping(path ="/payment_methods")
    public Object payment_methods(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }
        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
            throw new InvalidArgumentsException("You are not verified yet. Please add a payment option.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        String stripe_id = arr.getJSONObject(0).getString("stripe_id");
        Map<String, Object> params = new HashMap<>();
        params.put("customer", stripe_id);
        params.put("type", "card");

        try {
            PaymentMethodCollection paymentMethods = PaymentMethod.list(params);
            return paymentMethods.getData();
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
        }
    }

    // Get your invoices
    @GetMapping(path ="/invoices")
    public Object invoices(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }
        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
            throw new InvalidArgumentsException("You are not verified yet. Please add a payment option.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        String stripe_id = arr.getJSONObject(0).getString("stripe_id");

        Map<String, Object> params = new HashMap<>();
        params.put("limit", 6);
        params.put("customer", stripe_id);

        try {
            InvoiceCollection invoices = Invoice.list(params);
            return invoices.getData();
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
        }
    }


    // Returns user id if seller is existing
    @PostMapping(path ="/id", consumes = "application/json", produces = "application/json")
    public IDDto if_seller_exists_return_user_id(@RequestBody IDDto id) {
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_seller_id(id.getId()));
        if(arr.length() < 1) {
            throw new InvalidUserDataException("User is not registered as seller.");
        }
        return new IDDto(new SellerDto(arr.getJSONObject(0).getInt("seller_id")).user_data().getUser_id());
    }

    // Deletes account, returns 200 if done
    @PostMapping(path ="/delete", consumes = "application/json", produces = "application/json")
    public ResponseEntity delete(@RequestHeader("session_key") String session_key, @RequestBody DeleteDto deleteDto) {
        SessionKey sk = new SessionKey(session_key);
        deleteDto.delete(sk, "seller");
        return ResponseEntity.ok().build();
    }

    @GetMapping(path="/registration/get_seller_account_status")
    public int get_seller_account_status(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            return -1;
        }
        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
            return 0;
        } else {
            return 1;
        }
    }

    //
    //@PostMapping(path ="/create-invoice",produces = "application/json")
    //    public ResponseEntity create_invoice(@RequestHeader("session_key") String session_key) {
    //        SessionKey sk = new SessionKey(session_key);
    //        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
    //        if(arr.length() == 0) {
    //            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
    //        }
    //        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
    //            throw new InvalidArgumentsException("You are not verified yet. Please add a payment option.");
    //        }
    //        Stripe.apiKey = Config.stripe_api_key;
    //        String stripe_id = arr.getJSONObject(0).getString("stripe_id");
    //        String payment_id = arr.getJSONObject(0).getString("payment_id");
    //        String tax_rate = "txr_1IFiGmGXT5tgmfQydfTgmiZ9";
    //        PaymentMethod paymentMethod = null;
    //        try {
    //
    //            // auctions
    //            InvoiceItemCreateParams invoiceItemParams =
    //                    InvoiceItemCreateParams.builder()
    //                            .setCustomer(stripe_id)
    //                            .setCurrency("eur")
    //                            .setQuantity(20L)
    //                            .setPrice("price_1IFgxXGXT5tgmfQyRHWGvpAQ")
    //                            .setDescription("Auctions created by you")
    //                            .addTaxRate(tax_rate)
    //                            .build();
    //
    //            InvoiceItem.create(invoiceItemParams);
    //
    //            // images
    //            InvoiceItemCreateParams invoiceItemParams2 =
    //                    InvoiceItemCreateParams.builder()
    //                            .setCustomer(stripe_id)
    //                            .setCurrency("eur")
    //                            .setQuantity(40L)
    //                            .setPrice("price_1IFgxqGXT5tgmfQyQcygp2zu")
    //                            .setDescription("Additional image slots")
    //                            .addTaxRate(tax_rate)
    //                            .build();
    //            InvoiceItem.create(invoiceItemParams2);
    //
    //
    //            // invoice
    //            Map<String, Object> params = new HashMap<>();
    //            params.put("customer", stripe_id);
    //            params.put("auto_advance", true);
    //            params.put("collection_method", "charge_automatically");
    //            params.put("default_payment_method", payment_id);
    //
    //            Invoice new_invoice = Invoice.create(params);
    //        } catch (Exception e) {
    //            e.printStackTrace();
    //            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
    //        }
    //        return ResponseEntity.ok().build();
    //    }

    @PostMapping(path ="/payment_method/detatch", consumes = "application/json", produces = "application/json")
    public ResponseEntity detatch_payment_method(@RequestHeader("session_key") String session_key, @RequestBody String payment_id) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }
        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
            throw new InvalidArgumentsException("You are not verified yet. Please add a payment option.");
        }
        if(arr.getJSONObject(0).getString("payment_id").equals(payment_id)) {
            throw new InvalidArgumentsException("You cannot remove your preferred payment method.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        String stripe_id = arr.getJSONObject(0).getString("stripe_id");
        Map<String, Object> params = new HashMap<>();
        params.put("customer", stripe_id);
        params.put("type", "card");
        PaymentMethodCollection paymentMethods;
        try {
            paymentMethods = PaymentMethod.list(params);
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
        }
        if(paymentMethods.getData().size() == 1) {
            throw new InvalidArgumentsException("You cannot remove your only payment method.");
        }
        PaymentMethod paymentMethod = null;
        try {
            paymentMethod = PaymentMethod.retrieve(payment_id);
            PaymentMethod updatedPaymentMethod = paymentMethod.detach();
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
        }
        return ResponseEntity.ok().build();
    }


    @PostMapping(path ="/payment_method/prefer", consumes = "application/json", produces = "application/json")
    public ResponseEntity prefer_payment_method(@RequestHeader("session_key") String session_key, @RequestBody String payment_id) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }
        if(!arr.getJSONObject(0).getBoolean("is_validated")) {
            throw new InvalidArgumentsException("You are not verified yet. Please add a payment option.");
        }
        if(arr.getJSONObject(0).getString("payment_id").equals(payment_id)) {
            throw new InvalidArgumentsException("You prefer this one already.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        PaymentMethod paymentMethod = null;
        try {
            paymentMethod = PaymentMethod.retrieve(payment_id);
            SQLConnector.sql_post(Query.save_payment_id(payment_id, sk.getUser_id()));
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong with the Stripe integration. Please try again or contact the administrators.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping(path ="/registration/create_seller_account", consumes = "application/json", produces = "application/json")
    public ResponseEntity create(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);
        if(SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id())).length() > 0) {
            throw new InvalidArgumentsException("You already have a seller account.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        Map<String, Object> params = new HashMap<>();
        params.put(
                "description", String.format("User ID %s", sk.getUser_id())
        );

        try {
            Customer customer = Customer.create(params);
            SQLConnector.sql_post(Query.add_seller(sk.getUser_id()));
            SQLConnector.sql_post(Query.save_stripe_id(customer.getId(), sk.getUser_id()));
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InternalDatabaseException("Something went wrong. Please try again or contact the administrators.");
        }
        return ResponseEntity.ok().build();
    }


    @PostMapping(path ="/registration/checkout_session", consumes = "application/json", produces = "application/json")
    public int send_checkout_session_and_get_seller_id(@RequestHeader("session_key") String session_key, @RequestBody String checkout_session) {
        SessionKey sk = new SessionKey(session_key);
        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }
        Stripe.apiKey = Config.stripe_api_key;
        try {
            Session session = Session.retrieve(checkout_session);
            //Map<String, Object> params = new HashMap<>();
            //params.put("customer", arr.getJSONObject(0).getString("stripe_id"));
            //PaymentMethod updatedPaymentMethod = paymentMethod.attach(params);
            if(!arr.getJSONObject(0).getBoolean("is_validated")) {
                SetupIntent intent = SetupIntent.retrieve(session.getSetupIntent());
                PaymentMethod paymentMethod = PaymentMethod.retrieve(intent.getPaymentMethod());
                SQLConnector.sql_post(Query.save_payment_id(paymentMethod.getId(), sk.getUser_id()));
                System.out.println("haw");
                SQLConnector.sql_post(Query.verify_seller(sk.getUser_id()));
                System.out.println("yee");
            }
            return arr.getJSONObject(0).getInt("seller_id");
        } catch (Exception e) { // StripeException
            e.printStackTrace();
            throw new InvalidArgumentsException("Invalid checkout session.");
        }
    }

    //
    @GetMapping(path ="/registration/get_stripe_session")
    public Object get_stripe_session(@RequestHeader("session_key") String session_key) {
        SessionKey sk = new SessionKey(session_key);

        JSONArray arr = SQLConnector.sql_get(Query.get_seller_data_by_user_id(sk.getUser_id()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find seller data. Please create a seller account first.");
        }

        Stripe.apiKey = Config.stripe_api_key;

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                        .setMode(SessionCreateParams.Mode.SETUP)
                        .setCustomer(arr.getJSONObject(0).getString("stripe_id"))
                        .setSuccessUrl("https://dw-auction.com/profile/seller-registration/success/{CHECKOUT_SESSION_ID}")
                        .setCancelUrl("https://dw-auction.com/profile/seller-registration/cancel")
                        .build();
        Session session = null;
        try {
            session = Session.create(params);
        } catch (StripeException e) {
            e.printStackTrace();
            throw new InvalidArgumentsException("Something went wrong.");
        }
        class stripe_session {
            private String session;
            public stripe_session(String session) {
                this.session = session;
            }
            public String getSession() {
                return this.session;
            }
        }
        return new stripe_session(session.getId());
    }



}
