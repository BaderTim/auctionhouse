import React from "react";

import "./auctionList.css";

export default class AuctionList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            starting_point: 0, // starting point from title page list
        }
    }



    render() {

        return(
            <div className="AuctionListElement">
                <div className="card-deck">
                    {this.props.children}
                </div>
            </div>
        )
    }

}