package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.LightUserDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.SellerDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.response.AuctionResponse;

public class SellerLightuserWrapper {

    private SellerDto sellerDto;
    private LightUserDto seller;

    public SellerLightuserWrapper() {}

    public SellerLightuserWrapper(SellerDto sellerDto, LightUserDto seller) {
        this.sellerDto = sellerDto;
        this.seller = seller;
    }

    public SellerDto getSellerDto() {return this.sellerDto;}

    public LightUserDto getSeller() {return this.seller;}
}
