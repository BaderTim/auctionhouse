package com.baderundletters.auktionshaus.backendjavaserver.object;

public class IDDto {

    private int id;

    public IDDto() {}

    public IDDto(int id) {
        this.id = id;
    }

    public IDDto(IDDto iDDto) {
        this.id = iDDto.getId();
    }

    public int getId() {
        return id;
    }

}
