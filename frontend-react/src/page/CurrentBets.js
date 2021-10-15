import React from "react";

import "../css/currentBets.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import AuctionList from "../component/auction/AuctionList";
import AuctionListElement from "../component/auction/AuctionListElement";
import Filter from "../component/utils/Filter";
import LoadMore from "../component/utils/LoadMore";

export default class CurrentBets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: 1,
            has_error: false,
            auctions: [],
            end: false,
            base_offset: 12,
            offset: 0,
            filter: {
                sorting_order: "DESC",
                sorting_filter: "unix_time",
                search_by_name: "",
                is_instant_sell: false,
                international: true,
                active: true
            }
        }
    }

    refresh_handler = async (filter) => {
        await this.setState({is_loading: 1, auctions: [], filter: filter, end: false, offset: 0})
        await this.get_auctions(true).then(() => null);
    }

    componentDidMount() {
        this.setState({error: null, auctions: [], is_loading: 1, end: false, offset: 0})
        this.get_auctions().then(() => null);
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.currentBets-jumbo').addClass("currentBets-small-jumbo")
        } else {
            $('div.jumbotron.currentBets-jumbo').removeClass("currentBets-small-jumbo")
        }
    }

    render() {

        return(
            <div className="BetHistory">
                <div className="jumbotron currentBets-jumbo">
                    {this.state.error ? (
                            // error part
                            <div className="error-text">
                                {this.update_jumbo(false)}
                                <h1 className="display-4">Error</h1>
                                <hr/>
                                <p className="lead red">{this.state.error}</p>
                                <button onClick={() => {
                                    this.componentDidMount()
                                }} className="btn btn-primary btn-lg">Try again
                                </button>
                                <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/contact">Contact
                                    us</NavLink>
                            </div>
                        ) : // main part
                        (<div className="currentBets-content">
                            {this.update_jumbo(true)}
                            <h1 className="display-4">Current Bets</h1>
                            <p className="lead">Here you can check on your ongoing bets and manage them.</p>
                            <hr/>
                            <div style={{height: "10px"}}/>
                            <Filter disable_active_auctions={true} refresh_handler={this.refresh_handler} is_loading={this.state.is_loading} add_alert={this.props.add_alert}/>
                            {this.state.is_loading > 0 ?
                                // loading part
                                (<div className="d-flex justify-content-center" style={{marginTop: "50px"}}>
                                    {this.update_jumbo(false)}
                                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}}
                                         role="status"/>
                                </div>) : (<div>

                                    {this.state.auctions.length > 0 ? (<div style={{marginTop: "25px"}}>{this.state.auctions.map(function (data, id) {
                                            return <div key={id} style={{marginBottom: "30px"}}><AuctionList>
                                                {data.map(function (subdata, subid) {
                                                    return <AuctionListElement
                                                        key={subid}
                                                        image={subdata.thumbnail}
                                                        title={subdata.title}
                                                        description={subdata.description}
                                                        bet={subdata.bet}
                                                        current_price={subdata.current_price}
                                                        history={true}
                                                        currency={subdata.currency}
                                                        expiring_date={subdata.auction ?
                                                            ("Bet placed at "+new Date(subdata.betting_date).toLocaleString())
                                                            : (<strong>Instant Sell</strong>)}
                                                        starting_date={subdata.auction ?
                                                            ("End: "+new Date(subdata.expiring_date).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' }))
                                                            : (<strong>Instant Sell</strong>)}
                                                        name={subdata.name}
                                                        seller_id={subdata.seller_id}
                                                        auction_id={subdata.auction_id}
                                                    />
                                                })}
                                            </AuctionList></div>
                                        })}
                                        <div style={{height: "15px"}}/>
                                        <LoadMore end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                        <div style={{height: "15px"}}/>
                                        </div>)
                                        :
                                        (<div>
                                            <br/>
                                            <p className="lead fw-bold">It looks like you don't have any bets placed on active auctions.</p>
                                            <br/>
                                            <NavLink className="btn btn-secondary btn-lg" to="/">Back to title page</NavLink>
                                            <NavLink className="btn btn-primary btn-lg" style={{marginLeft: "20px"}} to="/profile/history/bets">View bet history</NavLink>
                                        </div>)}


                                </div>)
                            }
                        </div>)// end of error
                    }
                </div>
            </div>
        )
    }



    async get_auctions() {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": 0, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter, "item_type": this.state.type, "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        fetch(this.props.session.ip+'/account/user/get_my_current_bets', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    let new_auctions = [];
                    for(let i = 0; i < data.length; i++) {
                        let currency = ((data[i].auctionResponse.currency === "eur") ? '€' : '$');
                        let is_auction = false;
                        if(data[i].auctionResponse.auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auctionResponse.auction_id,
                            auction: is_auction,
                            seller_id: data[i].auctionResponse.seller_id,
                            thumbnail: data[i].auctionResponse.thumbnail,
                            title: ""+data[i].auctionResponse.current_price+ " " + currency +" "+ data[i].auctionResponse.title,
                            description: data[i].auctionResponse.description,
                            bet: data[i].betDto.price,
                            current_price: data[i].auctionResponse.current_price,
                            name: data[i].seller.first_name[0] + ". "+data[i].seller.last_name,
                            currency: currency,
                            expiring_date: data[i].auctionResponse.unix_ending_time,
                            betting_date: data[i].betDto.timestamp,
                            creation_date: data[i].auctionResponse.unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    var stack_size = Math.round((data.length / 3), 0);
                    stack_size = ((data.length % 3 !== 0) ? stack_size + 1: stack_size);
                    for(let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for(let x = i*3; x < i*3+3; x++) {
                            if(x >= data.length) { // spacer auction
                                new_stack.push({auction_id: -1, seller_id: -1, thumbnail: null, title: "spacer", description: "", badge_type: "danger", badge_name: "xx", name: "", expiring_date: 0, starting_date: 0,})
                            } else {
                                new_stack.push(new_auctions[x]); // real auction
                            }
                        }
                        auction_stack.push(new_stack);
                    }
                    console.log(auction_stack)
                    console.log(data)
                    this.setState({auctions: auction_stack});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    load_more = async (starting_offset) => {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": starting_offset, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter, "item_type": this.state.type, "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        await fetch(this.props.session.ip+'/account/user/get_my_current_bets', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    if(data.length === 0) {
                        await this.setState({end: true})
                        return;
                    }
                    let new_auctions = [];

                    for(let x = 0; x < this.state.auctions.length; x++) {
                        for(let y = 0; y < this.state.auctions[x].length; y++) {
                            if(this.state.auctions[x][y].auction_id !== -1) {
                                new_auctions.push(this.state.auctions[x][y]);
                            }
                        }
                    }
                    for(let i = 0; i < data.length; i++) {
                        let currency = ((data[i].auctionResponse.currency === "eur") ? '€' : '$');
                        let is_auction = false;
                        if(data[i].auctionResponse.auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auctionResponse.auction_id,
                            auction: is_auction,
                            seller_id: data[i].auctionResponse.seller_id,
                            thumbnail: data[i].auctionResponse.thumbnail,
                            title: ""+data[i].auctionResponse.current_price+ " " + currency +" "+ data[i].auctionResponse.title,
                            description: data[i].auctionResponse.description,
                            bet: data[i].betDto.price,
                            current_price: data[i].auctionResponse.current_price,
                            name: data[i].seller.first_name[0] + ". "+data[i].seller.last_name,
                            currency: currency,
                            expiring_date: data[i].auctionResponse.unix_ending_time,
                            betting_date: data[i].betDto.timestamp,
                            creation_date: data[i].auctionResponse.unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    var stack_size = Math.round((new_auctions.length / 3), 0);
                    stack_size = ((new_auctions.length % 3 !== 0) ? stack_size + 1: stack_size);
                    for(let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for(let x = i*3; x < i*3+3; x++) {
                            if(x >= new_auctions.length) { // spacer auction
                                new_stack.push({auction_id: -1, seller_id: -1, thumbnail: null, title: "spacer", description: "", badge_type: "danger", badge_name: "xx", name: "", expiring_date: 0, starting_date: 0,})
                            } else {
                                new_stack.push(new_auctions[x]); // real auction
                            }
                        }
                        auction_stack.push(new_stack);
                    }
                    console.log(auction_stack)
                    console.log(data)
                    this.setState({auctions: auction_stack,offset: starting_offset});
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }

}