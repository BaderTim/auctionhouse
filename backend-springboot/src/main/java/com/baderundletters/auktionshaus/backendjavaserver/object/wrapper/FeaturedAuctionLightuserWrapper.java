package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.BetDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;

public class FeaturedAuctionLightuserWrapper {

    private AuctionResponse auctionResponse;
    private String featured_type; // featured, hot, new
    private LightUserDto seller;

    public FeaturedAuctionLightuserWrapper() {}

    public FeaturedAuctionLightuserWrapper(AuctionResponse auctionResponse, String featured_type, LightUserDto seller) {
        this.auctionResponse = auctionResponse;
        this.featured_type = featured_type;
        this.seller = seller;
    }

    public AuctionResponse getAuctionResponse() {return this.auctionResponse;}

    public String getFeatured_type() {return this.featured_type;}

    public LightUserDto getSeller() {return this.seller;}

}
