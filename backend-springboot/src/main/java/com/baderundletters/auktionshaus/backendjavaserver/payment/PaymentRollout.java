package com.baderundletters.auktionshaus.backendjavaserver.payment;

import com.baderundletters.auktionshaus.backendjavaserver.database.Config;
import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InternalDatabaseException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceItem;
import com.stripe.model.PaymentMethod;
import com.stripe.param.InvoiceItemCreateParams;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class PaymentRollout {

    JSONArray seller;
    private String tax_rate = "txr_1IFiGmGXT5tgmfQydfTgmiZ9";
    private String auction_item = "price_1IGNMcGXT5tgmfQywPC3igQ5";
    private String photo_album_item = "price_1IGNLdGXT5tgmfQy4IgU4Tgm";
    private String additional_image_item = "price_1IFgxqGXT5tgmfQyQcygp2zu";

    public PaymentRollout() {
        this.seller = SQLConnector.sql_get(Query.get_all_validated_sellers());
    }

    public void start() {
        System.out.println("---------STARTING PAYMENT ROLL OUT---------");
        for(int i = 0; i < seller.length(); i++) {
            try {
                JSONObject obj = seller.getJSONObject(i);
                try {
                    this.create_invoice(obj);
                    SQLConnector.sql_post(Query.reset_seller_debt(obj.getInt("seller_id")));
                } catch (StripeException x) {
                    System.out.println("PAYMENT_ROLLOUT_ERROR: Something went wrong trying to create the invoice for seller " + obj.getInt("seller_id"));
                } catch (Exception x) {
                    x.printStackTrace();
                    System.out.println("PAYMENT_ROLLOUT_ERROR: Could not reset debt of seller " + obj.getInt("seller_id"));
                }
            } catch(Exception x) {
                System.out.println("PAYMENT_ROLLOUT_ERROR: Found empty seller data.");
            }
        }
        System.out.println("---------FINISHED PAYMENT ROLL OUT---------");
    }

    private void create_invoice(JSONObject obj) throws StripeException {
        Stripe.apiKey = Config.stripe_api_key;
        String stripe_id = obj.getString("stripe_id");
        String payment_id = obj.getString("payment_id");
        Long auction_quantity = Long.valueOf(obj.getInt("auction"));
        Long photo_album_quantity = Long.valueOf(obj.getInt("photo_album"));
        Long additional_images_quantity = Long.valueOf(obj.getInt("additional_image"));

            // auctions
            InvoiceItemCreateParams invoiceItemParams =
                    InvoiceItemCreateParams.builder()
                            .setCustomer(stripe_id)
                            .setCurrency("eur")
                            .setQuantity(auction_quantity)
                            .setPrice(auction_item)
                            .setDescription("Auctions created by you")
                            .addTaxRate(tax_rate)
                            .build();
            InvoiceItem.create(invoiceItemParams);

            // photo_albums
            InvoiceItemCreateParams invoiceItemParams2 =
                    InvoiceItemCreateParams.builder()
                            .setCustomer(stripe_id)
                            .setCurrency("eur")
                            .setQuantity(photo_album_quantity)
                            .setPrice(photo_album_item)
                            .setDescription("Photo Albums created by you")
                            .addTaxRate(tax_rate)
                            .build();
            InvoiceItem.create(invoiceItemParams2);

            // images
            InvoiceItemCreateParams invoiceItemParams3 =
                    InvoiceItemCreateParams.builder()
                            .setCustomer(stripe_id)
                            .setCurrency("eur")
                            .setQuantity(additional_images_quantity)
                            .setPrice(additional_image_item)
                            .setDescription("Additional image slots")
                            .addTaxRate(tax_rate)
                            .build();
            InvoiceItem.create(invoiceItemParams3);


            // invoice
            Map<String, Object> params = new HashMap<>();
            params.put("customer", stripe_id);
            params.put("auto_advance", true);
            params.put("collection_method", "charge_automatically");
            params.put("default_payment_method", payment_id);

        Invoice new_invoice = Invoice.create(params);
    }

}
