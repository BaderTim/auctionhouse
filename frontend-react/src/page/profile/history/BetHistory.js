import React from "react";

import "./bethistory.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import AuctionList from "../../../component/auction/AuctionList";
import AuctionListElement from "../../../component/auction/AuctionListElement";
import Filter from "../../../component/utils/Filter";
import LoadMore from "../../../component/utils/LoadMore";

export default class BetHistory extends React.Component {

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
            $('div.jumbotron.bethistory-jumbo').addClass("bethistory-small-jumbo")
        } else {
            $('div.jumbotron.bethistory-jumbo').removeClass("bethistory-small-jumbo")
        }
    }

    render() {

        return(
            <div className="BetHistory">
                <div className="jumbotron bethistory-jumbo">
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
                        (<div className="bethistory-content">
                            {this.update_jumbo(true)}
                            <h1 className="display-4">Bet history</h1>
                            <p className="lead">Here you can see your entire betting history.</p>
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
                                            <p className="lead fw-bold">It looks like you did not place any bets yet.</p>
                                            <br/>
                                            <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
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
        fetch(this.props.session.ip+'/account/user/get_all_my_bets', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    console.log(data)
                    let auctions = data.auctionResponse;
                    let sellers = data.seller;
                    let bets = data.betDto;
                    let raw_stack = [];
                    for(let i = 0; i < bets.length; i++) {
                        let current_auction = null;
                        let current_seller = null;
                        for(let a = 0; a < auctions.length; a++) {
                            if(auctions[a].auction_id === bets[i].auction_id) {
                                current_auction = auctions[a];
                                current_seller = sellers[a];
                            }
                        }
                        let currency = ((current_auction.currency === "eur") ? '€' : '$');
                        let is_auction = false;
                        if(current_auction.auction_type === "auction") {
                            is_auction = true;
                        }
                        raw_stack.push({
                            auction_id: current_auction.auction_id,
                            auction: is_auction,
                            seller_id: current_auction.seller_id,
                            thumbnail: current_auction.thumbnail,
                            title: ""+current_auction.current_price+ " " + currency +" "+ current_auction.title,
                            description: current_auction.description,
                            bet: bets[i].price,
                            current_price: current_auction.current_price,
                            name: current_seller.first_name[0] + ". "+current_seller.last_name,
                            currency: currency,
                            expiring_date: current_auction.unix_ending_time,
                            betting_date: bets[i].timestamp,
                            creation_date: current_auction.unix_creation_time,
                        })
                    }

                    let bet_stack = [];
                    var stack_size = Math.floor((bets.length / 3), 0);
                    stack_size = ((bets.length % 3 !== 0) ? stack_size + 1: stack_size);
                    for(let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for(let x = i*3; x < i*3+3; x++) {
                            if(x >= bets.length) { // spacer auction
                                new_stack.push({auction_id: -1, seller_id: -1, thumbnail: null, title: "spacer", description: "", badge_type: "danger", badge_name: "xx", name: "", expiring_date: 0, starting_date: 0,})
                            } else {
                                new_stack.push(raw_stack[x]); // real auction
                            }
                        }
                        bet_stack.push(new_stack);
                    }
                    console.log(bet_stack)
                    console.log(data)
                    this.setState({auctions: bet_stack});
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
        await fetch(this.props.session.ip+'/account/user/get_all_my_bets', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    if(data.betDto.length === 0) {
                        await this.setState({end: true})
                        return;
                    }
                    let raw_stack = [];

                    for(let x = 0; x < this.state.auctions.length; x++) {
                        for(let y = 0; y < this.state.auctions[x].length; y++) {
                            if(this.state.auctions[x][y].auction_id !== -1) {
                                raw_stack.push(this.state.auctions[x][y]);
                            }
                        }
                    }
                    console.log(data)
                    let auctions = data.auctionResponse;
                    let sellers = data.seller;
                    let bets = data.betDto;
                    for(let i = 0; i < bets.length; i++) {
                        let current_auction = null;
                        let current_seller = null;
                        for(let a = 0; a < auctions.length; a++) {
                            if(auctions[a].auction_id === bets[i].auction_id) {
                                current_auction = auctions[a];
                                current_seller = sellers[a];
                            }
                        }
                        let currency = ((current_auction.currency === "eur") ? '€' : '$');
                        let is_auction = false;
                        if(current_auction.auction_type === "auction") {
                            is_auction = true;
                        }
                        raw_stack.push({
                            auction_id: current_auction.auction_id,
                            auction: is_auction,
                            seller_id: current_auction.seller_id,
                            thumbnail: current_auction.thumbnail,
                            title: ""+current_auction.current_price+ " " + currency +" "+ current_auction.title,
                            description: current_auction.description,
                            bet: bets[i].price,
                            current_price: current_auction.current_price,
                            name: current_seller.first_name[0] + ". "+current_seller.last_name,
                            currency: currency,
                            expiring_date: current_auction.unix_ending_time,
                            betting_date: bets[i].timestamp,
                            creation_date: current_auction.unix_creation_time,
                        })
                    }

                    let bet_stack = [];
                    var stack_size = Math.floor((raw_stack.length / 3), 0);
                    stack_size = ((raw_stack.length % 3 !== 0) ? stack_size + 1: stack_size);
                    for(let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for(let x = i*3; x < i*3+3; x++) {
                            if(x >= raw_stack.length) { // spacer auction
                                new_stack.push({auction_id: -1, seller_id: -1, thumbnail: null, title: "spacer", description: "", badge_type: "danger", badge_name: "xx", name: "", expiring_date: 0, starting_date: 0,})
                            } else {
                                new_stack.push(raw_stack[x]); // real auction
                            }
                        }
                        bet_stack.push(new_stack);
                    }
                    console.log(bet_stack)
                    console.log(data)
                    this.setState({auctions: bet_stack,offset: starting_offset});
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }

}