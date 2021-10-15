package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.PriceDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.TimestampDto;

public class PriceTimestampWrapper {

    public PriceDto priceDto;
    public TimestampDto timestampDto;

    public PriceTimestampWrapper() {}

    public PriceTimestampWrapper(float price, long timestamp) {
        this.priceDto.setPrice(price);
        this.timestampDto.setTimestamp(timestamp);
    }

    public TimestampDto getTimestampDto() {
        return timestampDto;
    }

    public PriceDto getPriceDto() {
        return priceDto;
    }
}
