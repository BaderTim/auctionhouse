import React from "react";

import "../../css/ww1.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import AuctionList from "../../component/auction/AuctionList";
import AuctionListElement from "../../component/auction/AuctionListElement";
import Filter from "../../component/utils/Filter";
import LoadMore from "../../component/utils/LoadMore";

export default class AuctionOverview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: "ww1",
            is_loading: 1,
            has_error: false,
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
        this.setState({is_loading: 1, auctions: [], end: false, offset: 0})
        this.get_auctions().then(() => null);
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.ww1-jumbo').addClass("ww1-small-jumbo")
        } else {
            $('div.jumbotron.ww1-jumbo').removeClass("ww1-small-jumbo")
        }
    }

    render() {

        const search_icon = (<svg style={{paddingRight: "5px"}} width="26px" height="26px" viewBox="0 0 20 20" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/><path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/></svg>);

        return(
            <div className="Chat">
                <div className="jumbotron ww1-jumbo">
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
                        (<div className="profile-content">
                            {this.update_jumbo(true)}
                            <h1>Auction Overview</h1>
                            <hr/>
                            <Filter refresh_handler={this.refresh_handler} is_loading={this.state.is_loading} add_alert={this.props.add_alert}/>
                            {this.state.is_loading > 0 ?
                                // loading part
                                (<div className="d-flex justify-content-center" style={{marginTop: "50px"}}>
                                    {this.update_jumbo(false)}
                                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}}
                                         role="status"/>
                                </div>) : (<div>
                                    <div style={{height: "30px"}}/>
                                    <div>
                                        {this.state.auctions.length > 0 ? (
                                            <div>
                                                {this.state.auctions.map(function (data, id) {
                                                    return <div key={id} style={{marginBottom: "30px"}}><AuctionList>
                                                        {data.map(function (subdata, subid) {
                                                            return<div style={{width:"350px"}}> <AuctionListElement
                                                            
                                                                key={subid}
                                                                image={subdata.thumbnail}
                                                                title={subdata.title}
                                                                description={subdata.description}
                                                                badge_type={subdata.badge_type}
                                                                badge_name={subdata.badge_name}
                                                                expiring_date={subdata.auction ?
                                                                    ("Ends on " + new Date(subdata.expiring_date).toLocaleString())
                                                                    : (<strong>Instant Buy</strong>)}
                                                                starting_date={subdata.auction ?
                                                                    ("Started at " + new Date(subdata.starting_date).toLocaleDateString({
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    }))
                                                                    : ("Created at " + new Date(subdata.creation_date).toLocaleDateString({
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    }))}
                                                                name={subdata.name}
                                                                seller_id={subdata.seller_id}
                                                                auction_id={subdata.auction_id}
                                                            />
                                                            {subdata.auction?(
                                                                <div style={{marginTop:"7px", marginLeft:"17px"}}>
                                                                    
                                                                    {Number(subdata.expiring_date)>Number(Date.now())?
                                                                    (<div>
                                                                        <button type="button" class="btn btn-danger" onClick={()=>{this.endAuction(Number(subdata.auction_id)) }}>End auction</button>
                                                                    </div>):(<div></div>)
                                                                    }
                                                                    
                                                                </div>
                                                            ):(
                                                                <div  style={{marginTop:"7px", marginLeft:"17px"}}>
                                                                    {(subdata.creation_date+7776000000)==(subdata.expiring_date)?
                                                                    (
                                                                        <div> Not sold</div>
                                                                    ):(<div>
                                                                       { subdata.auction==null?
                                                                       (<div></div>):
                                                                            (<button type="button" class="btn btn-danger" onClick={()=>{this.reopenInstantSell(Number(subdata.auction_id)) }} > Reopen</button>)
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )

                                                            }
                                                            </div>
                                                        })}
                                                    </AuctionList></div>
                                                })}
                                                <div style={{height: "15px"}}/>
                                                <LoadMore end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                                <div style={{height: "15px"}}/>
                                            </div>
                                        ) : (
                                            <div>
                                                <br/>
                                                <p className="lead fw-bold" style={{textAlign: "center"}}>Could not find any auctions that fit your filter options.</p>
                                                <br/>
                                            </div>
                                        )}
                                    </div>
                                </div>) // end of loading
                            }
                        </div>)// end of error
                    }
                </div>
            </div>
        )
    }

    async reopenInstantSell(id)
    {
        
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idDto:{
                    id:id
                }
            })
        };
        fetch(this.props.session.ip+'/account/admin/reopen_instant_buy', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                    console.log("reopend successfully")
                }
                console.log(data)
               
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
               
            });

    }
    async endAuction(id)
    {
        
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idDto:{
                    id:id
                }
            })
        };
        fetch(this.props.session.ip+'/account/admin/end_auction', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                    console.log("ended successfully")
                }
                console.log(data)
               
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
               
            });

    }

    load_more = async (starting_offset) => {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": starting_offset, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter,  "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        console.log(requestOptions)
        await fetch(this.props.session.ip+'/auctions/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
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
                        let type = "warning";
                        let name = data[i].seller.country;
                        if(data[i].auctionResponse.international) {
                            type = "success";
                            name = "International";
                        }
                        let is_auction = false;
                        if(data[i].auctionResponse.auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auctionResponse.auction_id,
                            auction: is_auction,
                            seller_id: data[i].auctionResponse.seller_id,
                            thumbnail: data[i].auctionResponse.thumbnail,
                            title: ""+data[i].auctionResponse.current_price+ "" + currency +" "+ data[i].auctionResponse.title,
                            description: data[i].auctionResponse.description,
                            badge_type: type,
                            badge_name: name,
                            name: data[i].seller.first_name[0]+". "+data[i].seller.last_name,
                            expiring_date: data[i].auctionResponse.unix_ending_time,
                            starting_date: data[i].auctionResponse.unix_starting_time,
                            creation_date: data[i].auctionResponse.unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    let stack_size = Math.floor((new_auctions.length / 3), 0);
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
                    this.setState({auctions: auction_stack,offset: starting_offset});
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }

    async get_auctions(refresh) {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": 0, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter,  "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        console.log(requestOptions)
        fetch(this.props.session.ip+'/auctions/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    let new_auctions = [];
                    for(let i = 0; i < data.length; i++) {
                        let currency = ((data[i].auctionResponse.currency === "eur") ? '€' : '$');
                        let type = "warning";
                        let name = data[i].seller.country;
                        if(data[i].auctionResponse.international) {
                            type = "success";
                            name = "International";
                        }
                        let is_auction = false;
                        if(data[i].auctionResponse.auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auctionResponse.auction_id,
                            auction: is_auction,
                            seller_id: data[i].auctionResponse.seller_id,
                            thumbnail: data[i].auctionResponse.thumbnail,
                            title: ""+data[i].auctionResponse.current_price+ "" + currency +" "+ data[i].auctionResponse.title,
                            description: data[i].auctionResponse.description,
                            badge_type: type,
                            badge_name: name,
                            name: data[i].seller.first_name[0]+". "+data[i].seller.last_name,
                            expiring_date: data[i].auctionResponse.unix_ending_time,
                            starting_date: data[i].auctionResponse.unix_starting_time,
                            creation_date: data[i].auctionResponse.unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    let stack_size = Math.floor((data.length / 3), 0);
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
                    this.setState({auctions: auction_stack});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

}