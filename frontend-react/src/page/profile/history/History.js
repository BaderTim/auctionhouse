import React from "react";

import "./history.css";
import {NavLink} from "react-router-dom";

export default class History extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        return(
            <div className="BetHistory">
                <div className="jumbotron bethistory-jumbo bethistory-small-jumbo">
                    <div className="bethistory-content">
                        <NavLink className="btn btn-danger btn-lg" style={{margin: "auto", height: "7vw", width: "100%", display: "flex",}} to="/profile/history/auctions"><p style={{margin: "auto", fontSize: "4vw"}}>Auction History</p></NavLink>
                        <div style={{margin: "30px 0 30px 0", display: "flex", justifyContent: "space-around"}}>
                            <hr style={{minWidth: "45%"}} />
                            <p className="lead">or</p>
                            <hr style={{minWidth: "45%"}} />
                        </div>
                        <NavLink className="btn btn-primary btn-lg" style={{margin: "auto", height: "7vw", width: "100%", display: "flex"}} to="/profile/history/bets"><p style={{margin: "auto", fontSize: "4vw"}}>Bet History</p></NavLink>
                    </div>
                </div>
            </div>
        )
    }

}