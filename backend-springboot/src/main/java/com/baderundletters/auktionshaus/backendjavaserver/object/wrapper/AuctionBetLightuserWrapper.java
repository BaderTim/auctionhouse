package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.BetDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;

public class AuctionBetLightuserWrapper {

    private AuctionResponse auctionResponse;
    private BetDto betDto;
    private LightUserDto seller;

    public AuctionBetLightuserWrapper() {}

    public AuctionBetLightuserWrapper(AuctionResponse auctionResponse, BetDto betDto, LightUserDto seller) {
        this.auctionResponse = auctionResponse;
        this.betDto = betDto;
        this.seller = seller;
    }

    public AuctionResponse getAuctionResponse() {return this.auctionResponse;}

    public BetDto getBetDto() {return this.betDto;}

    public LightUserDto getSeller() {return this.seller;}

}
