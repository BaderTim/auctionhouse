package com.baderundletters.auktionshaus.backendjavaserver.object.wrapper;

import com.baderundletters.auktionshaus.backendjavaserver.object.FilterDto;
import com.baderundletters.auktionshaus.backendjavaserver.object.IDDto;

public class IDFilterWrapper {

    public FilterDto filterDto;
    public IDDto idDto;

    public IDFilterWrapper() {}

    public IDDto getIdDto() {
        return idDto;
    }

    public FilterDto getFilterDto() {
        return new FilterDto(filterDto);
    }
}
