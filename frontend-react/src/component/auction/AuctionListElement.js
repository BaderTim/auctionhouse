import React from "react";

import "./auctionListElement.css";
import {NavLink} from "react-router-dom";

export default class AuctionListElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const user = (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                           className="bi bi-person-square" viewBox="0 0 18 18">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path
                d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
        </svg>)

        if(this.props.history) { // bet history, rating, auction listing --> small changes
            return ( // new: bet, current_price, history, currency       deprecated: badge_type, badge_name
                <div
                    className={this.props.auction_id === -1 ? ("card auction-listing card-spacer") : ("card auction-listing")}>
                    <NavLink to={"/auction/id/" + this.props.auction_id} className="auction-listing-link">
                        <div>
                            <span
                                className={"badge badge-" + (this.props.bet >= this.props.current_price ? ("success"): ("danger"))
                                + " card-auction-badge"}>{this.props.bet +""+ this.props.currency}</span>
                            <small className="text-muted card-auction-end">{this.props.expiring_date}</small>
                        </div>
                        <div className="card-body" style={{paddingTop: "10px"}}>
                            <h4 className="card-title">{this.props.title}</h4>
                            {this.props.image ? (
                                <img src={this.props.image} className="card-img-top" style={{marginBottom: "15px"}}
                                     alt="thumbnail"/>) : ("")}
                            <p className="card-text">{this.props.description}</p>
                        </div>
                    </NavLink>
                    <div className="card-footer">
                        <small className="text-muted card-auction-start">{this.props.starting_date}</small>
                        <NavLink componentclass='span' to={"/seller/id/" + this.props.seller_id}
                                 className="card-auction-user">{user} {this.props.name}</NavLink>
                    </div>
                </div>
            )
        } else if(this.props.rating) { // rating
            return (<div className={this.props.user_id === -1 ? ("card auction-listing card-spacer") : ("card auction-listing")}>
                    <div>
                        <span className={"badge badge-" + this.props.badge_type + " card-auction-badge"}>{this.props.badge_name}</span>
                        <small className="text-muted card-auction-end">{this.props.creation_date}</small>
                    </div>
                    <div className="card-body" style={{paddingTop: "10px"}}>
                        <p className="card-text">{this.props.description}</p>
                    </div>
                <div className="card-footer">
                    <NavLink componentclass='span' to={"/profile/chat/" + this.props.user_id}
                             className="card-auction-user">{user} {this.props.name}</NavLink>
                </div>
            </div>)
        } else { // actual auction listing
            return (
                <div
                    className={this.props.auction_id === -1 ? ("card auction-listing card-spacer") : ("card auction-listing")}>
                    <NavLink to={"/auction/id/" + this.props.auction_id} className="auction-listing-link">
                        <div>
                            <span
                                className={"badge badge-" + this.props.badge_type + " card-auction-badge"}>{this.props.badge_name}</span>
                            <small className="text-muted card-auction-end">{this.props.expiring_date}</small>
                        </div>
                        <div className="card-body" style={{paddingTop: "10px"}}>
                            <h4 className="card-title">{this.props.title}</h4>
                            {this.props.image ? (
                                <img src={this.props.image} className="card-img-top" style={{marginBottom: "15px"}}
                                     alt="thumbnail"/>) : ("")}
                            <p className="card-text">{this.props.description ? (this.props.description.length > 140 ? (this.props.description.slice(0, 140)+"...") : (this.props.description)) : ("")}</p>
                        </div>
                    </NavLink>
                    <div className="card-footer">
                        <small className="text-muted card-auction-start">{this.props.starting_date}</small>
                        <NavLink componentclass='span' to={"/seller/id/" + this.props.seller_id}
                                 className="card-auction-user">{user} {this.props.name}</NavLink>
                    </div>
                </div>
            )
        }
    }

}