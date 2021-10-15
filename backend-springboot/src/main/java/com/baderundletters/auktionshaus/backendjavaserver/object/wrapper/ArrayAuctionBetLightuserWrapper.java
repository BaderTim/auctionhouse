package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.BetDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;

public class ArrayAuctionBetLightuserWrapper {

    private AuctionResponse[] auctionResponse;
    private LightUserDto[] seller;
    private BetDto[] betDto;

    public ArrayAuctionBetLightuserWrapper() {}

    public ArrayAuctionBetLightuserWrapper(AuctionResponse[] auctionResponse, LightUserDto[] seller, BetDto[] betDto) {
        this.auctionResponse = auctionResponse;
        this.betDto = betDto;
        this.seller = seller;
    }

    public AuctionResponse[] getAuctionResponse() {return this.auctionResponse;}

    public LightUserDto[] getSeller() {return this.seller;}

    public BetDto[] getBetDto() {return this.betDto;}
}
