import React from "react";
import $ from "jquery";
import "./filter.css";

export default class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            sorting_order: "🡻",
            sorting_filter: "unix_time",
            sorting_filter_expanded: false,
            search_by_name: "",
            is_instant_sell: false,
            international: true,
            active: true,
        })
    }

    async handleReset() {
        await this.setState({
            sorting_order: "🡻",
            sorting_filter: "unix_time",
            sorting_filter_expanded: false,
            search_by_name: "",
            is_instant_sell: false,
            international: true,
            active: true
        });
        $("#filter_search_form").val("");
        this.handleRefresh();
    }

     handleRefresh() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        let filter = {
            sorting_order: (this.state.sorting_order === "🡹" ? ("ASC") :("DESC")),
            sorting_filter: this.state.sorting_filter,
            search_by_name: this.state.search_by_name,
            is_instant_sell: this.state.is_instant_sell,
            international: this.state.international,
            active: this.state.active
        };
        this.props.refresh_handler(filter);
    }

    async onSortingOrderClick(event) {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.sorting_order === "🡻") {
            await this.setState({sorting_order: "🡹"})
        } else {
            await this.setState({sorting_order: "🡻"})
        }
        this.handleRefresh();
    }

    async onSortingFilterChosen(sorting_filter) {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        await this.setState(sorting_filter);
        await this.onSortingFilterClick();
        this.handleRefresh();
    }

    async onSortingFilterClick() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.sorting_filter_expanded) {
            await this.setState({sorting_filter_expanded: false})
        } else {
            await this.setState({sorting_filter_expanded: true})
        }
    }

    async onInstantSellClick() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.is_instant_sell) {
            await this.setState({is_instant_sell: false})
        } else {
            await this.setState({is_instant_sell: true})
        }
        this.handleRefresh();
    }

    async onInternationalClick() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.international) {
            await this.setState({international: false})
        } else {
            await this.setState({international: true})
        }
        this.handleRefresh();
    }

    async onActiveClick() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.active) {
            await this.setState({active: false})
        } else {
            await this.setState({active: true})
        }
        this.handleRefresh();
    }

    render() {
        //  --PROPS--
        //  handleState
        return(<div className="filter-container">
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown" style={{height: "35px"}}>
                <span onClick={() => {this.handleReset()}} style={{fontSize: "25px", marginRight: "20px", cursor: "pointer"}}>↺</span>
                <button type="button" className="btn btn-primary" onClick={event => (this.onSortingOrderClick(event))}>{this.state.sorting_order}</button>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" onClick={() => {this.onSortingFilterClick()}} className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Sort by
                    </button>
                    <ul className="dropdown-menu" style={this.state.sorting_filter_expanded ? ({display: "unset"}) : ({display: "none"})} aria-labelledby="btnGroupDrop1">
                        <li><button className="dropdown-item" onClick={() => {this.onSortingFilterChosen({sorting_filter: "unix_starting_time"})}}>Starting Date</button></li>
                        <li><button className="dropdown-item" onClick={() => {this.onSortingFilterChosen({sorting_filter: "unix_ending_time"})}}>Ending Date</button></li>
                        <li><button className="dropdown-item" onClick={() => {this.onSortingFilterChosen({sorting_filter: "title"})}}>Title</button></li>
                        <li><button className="dropdown-item" onClick={() => {this.onSortingFilterChosen({sorting_filter: "current_price"})}}>Current Price</button></li>
                    </ul>
                </div>
            </div>
            <div className="form-check" style={{marginTop: "8px"}}>
                {this.props.disable_active_auctions ? (
                    <input className="form-check-input" type="checkbox" disabled readOnly={true} checked={false} id="active_auctions"/>
                ) : (
                    <input className="form-check-input" type="checkbox" onChange={() => (this.onActiveClick())} readOnly={true} checked={this.state.active} id="active_auctions"/>
                )}
                <label className="form-check-label" htmlFor="active_auctions">
                    Active Auctions
                </label>
            </div>
            <div className="form-check" style={{marginTop: "8px"}}>
                <input className="form-check-input" type="checkbox" onClick={() => (this.onInternationalClick())} readOnly={true} checked={this.state.international} value="" id="international"/>
                <label className="form-check-label" htmlFor="international">Ships to me</label>
            </div>
            <div className="form-check" style={{marginTop: "8px"}}>
                <input className="form-check-input" type="checkbox" onClick={() => (this.onInstantSellClick())} readOnly={true} checked={this.state.is_instant_sell} id="instant_sell"/>
                <label className="form-check-label" htmlFor="instant_sell">Instant Buy</label>
            </div>
            <div className="input-group mb-3" style={{maxWidth: "300px"}}>
                <input type="text" id="filter_search_form" className="form-control" placeholder="Find auction"
                       aria-label="Recipient's username" aria-describedby="button-addon2" defaultValue={this.state.search_by_name} onChange={(event => {this.setState({search_by_name: event.target.value})})}/>
                <button className="btn btn-outline-success" type="button" id="button-addon2" onClick={() => {this.handleRefresh();}}>Search</button>
            </div>
        </div>);
    }

}