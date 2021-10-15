package com.baderundletters.auktionshaus.backendjavaserver.object;

import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

public class FilterDto {

    private String search_by_name;
    private String order_by; // time,name,price, none
    private String item_type; // ww1, ww2, other
    private String sorting_order;
    private boolean active;
    private boolean is_instant_sell;
    private int amount;
    private int offset;
    private boolean international;

    public FilterDto() {}

    public FilterDto(FilterDto filterDto) {
        if(filterDto.getSearch_by_name() != null && filterDto.getSearch_by_name() != "") {
            if(filterDto.getSearch_by_name().length() > 20) {
                throw new InvalidArgumentsException("Too many characters.");
            }
            this.search_by_name = "%"+filterDto.getSearch_by_name()+"%";
        } else {
            this.search_by_name = "%";
        }
        if(filterDto.getOrder_by() != null) {
            if(filterDto.getOrder_by().equals("unix_time")) {
                this.order_by = "unix_time";
            } else if(filterDto.getOrder_by().equals("unix_starting_time")) {
                this.order_by = "unix_starting_time";
            } else if(filterDto.getOrder_by().equals("unix_creation_time")) {
                this.order_by = "unix_creation_time";
            } else if(filterDto.getOrder_by().equals("unix_ending_time")) {
                this.order_by = "unix_ending_time";
            } else if(filterDto.getOrder_by().equals("starting_price") || filterDto.getOrder_by().equals("current_price") || filterDto.getOrder_by().equals("title") || filterDto.getOrder_by().equals("last_name")) {
                this.order_by = filterDto.getOrder_by();
            } else if(filterDto.getOrder_by().toLowerCase().equals("null") || filterDto.getOrder_by().toLowerCase().equals("none")) {
                this.order_by = "NULL";
            } else {
                throw new InvalidArgumentsException("Invalid sorting parameters. sort_by must be one of those: unix_time, unix_starting_time, unix_ending_time, unix_creation_time, title, last_name, current_price, starting_price, none");
            }
        } else {
            this.order_by = "NULL";
        }
        if(filterDto.getSorting_order() == null) {
            this.sorting_order = "ASC";
        } else if(filterDto.getSorting_order().toLowerCase().equals("asc")) {
            this.sorting_order = "ASC";
        } else if(filterDto.getSorting_order().toLowerCase().equals("desc")) {
            this.sorting_order = "DESC";
        } else {
            throw new InvalidArgumentsException("Sorting order can either be 'asc' or 'desc'.");
        }
        if(filterDto.getAmount() > 0) {
            if(filterDto.getAmount() < 20) {
                this.amount = filterDto.getAmount();
            } else {
                this.amount = 20;
            }
        } else {
            this.amount = 10;
        }
        if(filterDto.getItem_type() != null) {
            if(filterDto.getItem_type().equals("ww1") || filterDto.getItem_type().equals("ww2") || filterDto.getItem_type().equals("photo_album") || filterDto.getItem_type().equals("other")) {
                this.item_type = filterDto.getItem_type();
            } else {
                throw new InvalidArgumentsException("Item Type can either be ww1, ww2 or other. If value is unused it will filter all auction types.");
            }
        } else {
            this.item_type = "%";
        }
        this.active = filterDto.isActive();
        this.offset = filterDto.getOffset();
        this.international = filterDto.isInternational();
        this.is_instant_sell = filterDto.isIs_instant_sell();
    }


    public int getOffset() {
        return offset;
    }

    public String getSearch_by_name() {
        return search_by_name;
    }

    public String getOrder_by() {
        return order_by;
    }

    public String getSorting_order() { return sorting_order; }

    public int getAmount() {
        return amount;
    }

    public boolean isInternational() {return international;}

    public String getItem_type() {return item_type;}

    public boolean isActive() {return active;}

    public boolean isIs_instant_sell() {return is_instant_sell;}
}
