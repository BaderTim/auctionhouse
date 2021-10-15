import React from "react";

import "./mypage.css";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router-dom";
import $ from 'jquery'
import AuctionListElement from "../../component/auction/AuctionListElement";
import AuctionList from "../../component/auction/AuctionList";
import Rating from "../../component/utils/Rating";
import Report from "../../component/utils/Report";
import LoadMore from "../../component/utils/LoadMore";

class MyPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                country: "",
                description: "",
                first_name: "",
                last_name: "",
                profile_picture: "",
                unix_creation_time: 0,
                user_id: 0,
            },
            auctions: [],
            followers: 0,
            is_following: false,
            total_auctions: 0,
            rating: -1,
            rating_count: 0,
            is_loading: 7,
            has_error: false,
            end: false,
            base_offset: 12,
            offset: 0,
        }
    }

    componentDidMount() {
        this.setState({error: null, auctions: [], is_loading: 7})
        this.check_if_seller_exists().then(() => null);
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.prof-jumbo').addClass("prof-small-jumbo")
        } else {
            $('div.jumbotron.prof-jumbo').removeClass("prof-small-jumbo")
        }
    }

    render() {
        return(
            <div className="Profile">
                <div className="jumbotron prof-jumbo">
                    {this.state.is_loading > 0 ?
                        // loading part
                        (<div className="d-flex justify-content-center">
                            {this.update_jumbo(false)}
                            <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"/>
                        </div>) :

                        (<div>{this.state.error ? (
                            // error part
                            <div className="error-text">
                                {this.update_jumbo(false)}
                                <h1 className="display-4">Error</h1>
                                <hr/>
                                <p className="lead red">{this.state.error}</p>
                                <button onClick={() => {this.componentDidMount()}} className="btn btn-primary btn-lg">Try again</button>
                                <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/contact">Contact us</NavLink>
                            </div>
                        ) : // main part
                            (<div className="profile-content">
                                {this.update_jumbo(true)}
                                    {this.props.session.seller_id === Number(this.props.match.params.profile_id) ?
                                    ( <ul className="nav justify-content-end">
                                            <li className="nav-item">
                                                <NavLink className="nav-link btn btn-primary" role="button" to="/profile">My Profile</NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink className="nav-link btn btn-primary" role="button" to="/profile/seller-account">Seller Account</NavLink>
                                            </li>
                                        </ul> ) : ("")}
                                <div className="description-rating-inline">
                                    <div style={{minWidth: "60%"}}>
                                        <h1 className="display-4">{this.state.user.first_name} {this.state.user.last_name}</h1>
                                        <p style={{marginLeft: "10px"}} className="lead">{this.state.user.description ? (this.state.user.description) : ("No description set.")} <Report add_alert={this.props.add_alert} first_name={this.state.user.first_name} user_id={this.state.user.user_id} session={this.props.session}/></p>
                                        {this.props.session.seller_id === Number(this.props.match.params.profile_id) ?
                                            (<button className="btn follow btn-primary disabled">Follow</button>) :
                                            (<>{this.state.is_following ? (
                                                <button className="btn follow btn-danger"
                                                        onClick={event => (this.unfollow(event))}
                                                >Unfollow</button>) : (
                                                <button className="btn follow btn-primary"
                                                        onClick={event => (this.follow(event))}
                                                >Follow</button>)}</>)}
                                    </div>
                                    <Rating add_alert={this.props.add_alert} first_name={this.state.user.first_name} user_id={this.state.user.user_id} session={this.props.session} rating={this.state.rating} total_ratings={this.state.rating_count} />

                                </div>
                                <div className="list-and-picture">
                                    <ul className="list-group list-group-flush small-list-left">
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Country</span><span>{this.state.user.country}</span>
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Followers</span>{this.state.followers}
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Total Auctions</span>{this.state.total_auctions}
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Registered since:</span>{new Date(this.state.user.unix_creation_time).toLocaleString()}
                                        </li>
                                        <li className="list-group-item" style={{padding: "0"}}/>
                                    </ul>
                                    <img className="small-list-right profile-picture-list" alt="profile_picture"
                                         src={this.state.user.profile_picture != null && this.state.user.profile_picture != "" && this.state.user.profile_picture != "-" ? (this.state.user.profile_picture) : (window.location.origin + "/images/design/empty_profile_picture.png")}></img>
                                </div>
                                <div style={{height: "30px"}}/>
                                <div>
                                    {this.state.auctions.map(function (data, id) {
                                        return <div key={id} style={{marginBottom: "30px"}}><AuctionList>
                                            {data.map(function (subdata, subid) {
                                                return <AuctionListElement
                                                    key={subid}
                                                    image={subdata.thumbnail}
                                                    title={subdata.title}
                                                    description={subdata.description}
                                                    badge_type={subdata.badge_type}
                                                    badge_name={subdata.badge_name}
                                                    expiring_date={subdata.auction ?
                                                        ("Ends on "+new Date(subdata.expiring_date).toLocaleString())
                                                        : (<strong>Instant Sell</strong>)}
                                                    starting_date={subdata.auction?
                                                        ("Started at "+new Date(subdata.starting_date).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' }))
                                                        : ("Created at "+new Date(subdata.creation_date).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' }))}
                                                    name={subdata.name}
                                                    seller_id={subdata.seller_id}
                                                    auction_id={subdata.auction_id}
                                                />
                                            })}
                                        </AuctionList></div>
                                    })}
                                </div>
                                    <div style={{height: "15px"}}/>
                                    <LoadMore end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                    <div style={{height: "15px"}}/>

                            </div>
                        )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }

    follow(event) {
        event.target.className = "btn follow btn-primary disabled";
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.state.user.user_id})
        };
        fetch(this.props.session.ip+'/account/follow/', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    event.target.className = "btn follow btn-primary";
                } else {
                    event.target.className = "btn follow btn-danger";
                    this.setState({is_following: true});
                    this.setState({followers: this.state.followers+1});
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    unfollow(event) {
        event.target.className = "btn follow btn-danger disabled";
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.state.user.user_id})
        };
        fetch(this.props.session.ip+'/account/follow/unfollow', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    event.target.className = "btn follow btn-danger";
                } else {
                    event.target.className = "btn follow btn-primary";
                    this.setState({is_following: false});
                    this.setState({followers: this.state.followers-1});
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

     async check_if_seller_exists() {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.props.match.params.profile_id})
        };
        fetch(this.props.session.ip+'/account/seller/id', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")", is_loading: 0})
                } else {
                    this.load_user_data(data.id).then(() => null);
                    this.get_total_auctions(this.props.match.params.profile_id).then(() => null);
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

    async load_user_data(user_id) {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": user_id})
        };
        fetch(this.props.session.ip+'/account/user/id', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    this.setState({user: {
                            country: data.country,
                            description: data.description,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            profile_picture: data.profile_picture,
                            unix_creation_time: data.unix_creation_time,
                            user_id: data.user_id
                        },});
                    this.get_auctions(this.props.match.params.profile_id).then(() => null);
                    this.get_follower_count().then(() => null);
                    this.is_following_user().then(() => null);
                    this.get_rating().then(() => null);
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

    async get_rating() {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.state.user.user_id})
        };
        fetch(this.props.session.ip+'/rating/avg_rating', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    this.setState({rating: Number(data[0]), rating_count: Number(data[1])});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

    async get_follower_count() {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.state.user.user_id})
        };
        fetch(this.props.session.ip+'/account/follow/get_follower_count', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    this.setState({followers: Number(data)});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

    async is_following_user() {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                "idDto1": {"id": this.props.session.user_id},
                "idDto2": {"id": this.state.user.user_id}})
        };
        fetch(this.props.session.ip+'/account/follow/is_following_user', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    this.setState({is_following: Boolean(data)});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }

    async get_total_auctions(seller_id) {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": seller_id})
        };
        fetch(this.props.session.ip+'/statistic/get_total_auctions_from_seller', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    this.setState({total_auctions: Number(data)});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: 0})
            });
    }
    async get_auctions(seller_id) {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filterDto: {"amount": this.state.base_offset,"offset": 0, "sorting_order": "DESC", "order_by": "unix_time",},
                idDto: {"id":seller_id}
            })
        };
        fetch(this.props.session.ip+'/auctions/from_seller', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    let new_auctions = [];
                    for(let i = 0; i < data.length; i++) {
                        let currency = ((data[i].currency === "eur") ? '€' : '$');
                        let type = "warning";
                        let name = this.state.user.country;
                        if(data[i].international) {
                            type = "success";
                            name = "International";
                        }
                        let is_auction = false;
                        if(data[i].auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auction_id,
                            auction: is_auction,
                            seller_id: seller_id,
                            thumbnail: data[i].thumbnail,
                            title: ""+data[i].current_price+ "" + currency +" "+ data[i].title,
                            description: data[i].description,
                            badge_type: type,
                            badge_name: name,
                            name: this.state.user.first_name[0]+". "+this.state.user.last_name,
                            expiring_date: data[i].unix_ending_time,
                            starting_date: data[i].unix_starting_time,
                            creation_date: data[i].unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    var stack_size = Math.floor((data.length / 3), 0);
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
                this.setState({is_loading: 0})
            });
    }


    load_more = async (starting_offset) => {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                filterDto: {
                    "amount": this.state.base_offset,
                    "offset": starting_offset,
                    "sorting_order": "DESC",
                    "order_by": "unix_time",
                },
                idDto: {"id": this.props.match.params.profile_id}
            })
        };
        await fetch(this.props.session.ip + '/auctions/from_seller', requestOptions)
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

                    for (let i = 0; i < data.length; i++) {
                        let currency = ((data[i].currency === "eur") ? '€' : '$');
                        let type = "warning";
                        let name = this.state.user.country;
                        if (data[i].international) {
                            type = "success";
                            name = "International";
                        }
                        let is_auction = false;
                        if (data[i].auction_type === "auction") {
                            is_auction = true;
                        }
                        new_auctions.push({
                            auction_id: data[i].auction_id,
                            auction: is_auction,
                            seller_id: this.props.match.params.profile_id,
                            thumbnail: data[i].thumbnail,
                            title: "" + data[i].current_price + "" + currency + " " + data[i].title,
                            description: data[i].description,
                            badge_type: type,
                            badge_name: name,
                            name: this.state.user.first_name[0] + ". " + this.state.user.last_name,
                            expiring_date: data[i].unix_ending_time,
                            starting_date: data[i].unix_starting_time,
                            creation_date: data[i].unix_creation_time,
                        })
                    }

                    let auction_stack = [];
                    var stack_size = Math.floor((new_auctions.length / 3), 0);
                    stack_size = ((new_auctions.length % 3 !== 0) ? stack_size + 1 : stack_size);
                    for (let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for (let x = i * 3; x < i * 3 + 3; x++) {
                            if (x >= new_auctions.length) { // spacer auction
                                new_stack.push({
                                    auction_id: -1,
                                    seller_id: -1,
                                    thumbnail: null,
                                    title: "spacer",
                                    description: "",
                                    badge_type: "danger",
                                    badge_name: "xx",
                                    name: "",
                                    expiring_date: 0,
                                    starting_date: 0,
                                })
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
                this.setState({error: error.name + ": " + error.message})
            });
    }
}
export default withRouter(MyPage);