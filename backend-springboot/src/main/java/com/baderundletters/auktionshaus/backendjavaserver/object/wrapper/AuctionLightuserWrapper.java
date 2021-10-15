package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.BetDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;

public class AuctionLightuserWrapper {

    private AuctionResponse auctionResponse;
    private LightUserDto seller;

    public AuctionLightuserWrapper() {}

    public AuctionLightuserWrapper(AuctionResponse auctionResponse, LightUserDto seller) {
        this.auctionResponse = auctionResponse;
        this.seller = seller;
    }

    public AuctionResponse getAuctionResponse() {return this.auctionResponse;}

    public LightUserDto getSeller() {return this.seller;}
}
