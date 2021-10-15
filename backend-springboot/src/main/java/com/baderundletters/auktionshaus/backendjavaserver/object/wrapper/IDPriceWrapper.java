package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.PriceDto;

public class IDPriceWrapper {

    public PriceDto priceDto;
    public IDDto idDto;

    public IDPriceWrapper() {}

    public IDDto getIdDto() {
        return idDto;
    }

    public PriceDto getPriceDto() {
        return priceDto;
    }
}
