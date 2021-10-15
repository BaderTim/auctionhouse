import React from "react";

import "./history/auctionhistory.css";
import {NavLink, withRouter} from "react-router-dom";
import $ from 'jquery'
import AuctionList from "../../component/auction/AuctionList";
import AuctionListElement from "../../component/auction/AuctionListElement";

class RatingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ratings: [],
            is_loading: 2,
            has_error: false,
        }
    }

    componentDidMount() {
        this.setState({error: null, is_loading: 2, ratings: []});
        this.get_user_data().then(() => null);
        this.get_ratings().then(() => null);
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
                    {this.state.is_loading ?
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
                            (<div className="bethistory-content">
                                    {this.update_jumbo(true)}
                                    <h1 className="display-4">Ratings for {this.state.user.first_name} {this.state.user.last_name}</h1>
                                    <p className="lead">Here you can see what other people's experience were with this person.</p>
                                    <hr/>
                                    <div style={{height: "10px"}}/>
                                    <div>
                                        {this.state.ratings.length > 0 ? (this.state.ratings.map(function (data, id) {
                                            return <div key={id} style={{marginBottom: "30px"}}><AuctionList>
                                                {data.map(function (subdata, subid) {
                                                    return <AuctionListElement
                                                        rating={true}
                                                        key={subid}
                                                        description={subdata.description ? (subdata.description) : ("This user did not write a comment.")}
                                                        badge_type={subdata.rating > 3 ? ("success") : (subdata.rating > 1 ? ("warning"): ("danger"))}
                                                        badge_name={subdata.rating}
                                                        creation_date={"Created at "+new Date(subdata.creation_date).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' })}
                                                        name={subdata.first_name[0] + ". "+subdata.last_name}
                                                        user_id={subdata.user_id}
                                                    />
                                                })}
                                            </AuctionList></div>
                                        })) : (
                                            <div>
                                                <br/>
                                                <p className="lead fw-bold">It looks like you did not create any auctions yet.</p>
                                                <br/>
                                                <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
                                            </div>
                                        )}
                                    </div>
                            </div>
                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }
    async get_user_data() {
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"id": Number(this.props.match.params.profile_id)})
        };
        fetch(this.props.session.ip+'/account/user/id', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
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
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    async get_ratings() {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filterDto: {"amount": 12,"offset": 0, "sorting_order": "DESC", "order_by": "unix_creation_time",},
                idDto: {"id": Number(this.props.match.params.profile_id)}
            })
        };
        fetch(this.props.session.ip+'/rating/from_user', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error[1]+" ("+new Date(Number(nice_error[0])).toUTCString()+")"})
                } else {
                    let new_ratings = [];
                    for(let i = 0; i < data.length; i++) {
                        new_ratings.push({
                            user_id: data[i].creator_user_id,
                            description: data[i].comment,
                            creation_date: data[i].unix_creation_time,
                            first_name: data[i].first_name,
                            last_name: data[i].last_name,
                            rating: data[i].rating
                        })
                    }

                    let rating_stack = [];
                    var stack_size = Math.floor((data.length / 3), 0);
                    stack_size = ((data.length % 3 !== 0) ? stack_size + 1: stack_size);
                    for(let i = 0; i < stack_size; i++) {
                        var new_stack = [];
                        for(let x = i*3; x < i*3+3; x++) {
                            if(x >= data.length) { // spacer auction
                                new_stack.push({user_id: -1, description: "", first_name: "", last_name: "", rating: 0, creation_date: 0})
                            } else {
                                new_stack.push(new_ratings[x]); // real auction
                            }
                        }
                        rating_stack.push(new_stack);
                    }
                    console.log(rating_stack)
                    console.log(data)
                    this.setState({ratings: rating_stack});
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

}
export default withRouter(RatingPage);