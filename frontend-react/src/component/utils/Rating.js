import React from "react";
import "./rating.css";
import $ from "jquery";
import {NavLink} from "react-router-dom";
import Popover from "@material-ui/core/Popover";


export default class Rating extends React.Component {

    constructor(props) {
        super(props);
        this.state = {anchorEl: null, isLoading: false, comment: null}
    }


    handleOpen = (event, stars) => {
        this.setState({anchorEl: event.currentTarget.parentElement, stars: stars});
    };
    handleClose = () => {
        this.setState({anchorEl: null, comment: $("#rating_comment").val()});
    };

    render() {

        // props: rating, total_ratings, seller_id, user_id, first_name, session

        return (
            <div className="d-flex justify-content-center rating-container">
                <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css' rel="stylesheet"/>
                <div className="content text-center">
                    <div className="ratings"><span className="product-rating">{this.props.rating === -1 ? ("None") : (this.props.rating)}</span><span>/5</span>
                        <div className="stars">
                            {this.render_stars()}
                        </div>
                        <Popover
                            open={Boolean(this.state.anchorEl)}
                            anchorEl={this.state.anchorEl}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                        >
                            {this.props.session.user_id === this.props.user_id ? (
                                <h4 style={{padding: "10px 10px 10px 10px"}}>You cannot rate yourself.</h4>
                            ) : (
                                <div style={{padding: "10px 10px 10px 10px"}}>
                                    <h4>Rate {this.props.first_name} <strong>{this.state.stars}</strong> stars</h4>
                                    <p className="lead" style={{marginBottom: "4px"}}>Comment:</p>
                                    <textarea id="rating_comment" className="form-control" type="text" defaultValue={this.state.comment? (this.state.comment): ("")} placeholder="optional"
                                           aria-label="default input example"/>
                                    {this.state.isLoading ? (
                                        <div className="d-flex justify-content-center" style={{width: "54px", height: "33px", marginTop: "10px"}}>
                                            <div className="spinner-border text-primary"  role="status"></div>
                                        </div>
                                    ) : (
                                        <button style={{marginTop: "10px"}} onClick={() => (this.send_rating())} className="btn btn-primary">Send</button>
                                    )}
                                </div>
                            )}
                        </Popover>
                        <div className="rating-text"><span><NavLink to={"/profile/id/"+this.props.user_id+"/ratings"}>{this.props.total_ratings} ratings</NavLink></span></div>
                    </div>
                </div>
            </div>
        );
    }

    render_stars() {
        const amount = Math.round(Number(this.props.rating));
        if(amount <= 0) {
            return (<div><i className="fa fa-star" onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star" onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star" onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        } else if(amount === 1) {
            return (<div><i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        } else if(amount === 2) {
            return (<div><i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        } else if(amount === 3) {
            return (<div><i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star"onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        } else if(amount === 4) {
            return (<div><i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star" onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        } else {
            return (<div><i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 1))}></i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 2))}>
            </i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 3))}></i> <i className="fa fa-star earned" onClick={(event) => (this.handleOpen(event, 4))}></i> <i className="fa fa-star earned"onClick={(event) => (this.handleOpen(event, 5))}></i></div>)
        }
    }

    send_rating(event) {
        if($("#rating_comment").val().length > 199) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot use more than 200 characters. Currently you have "+$("#rating_comment").val().length+"."})
            return;
        }
        this.setState({isLoading: true});
        let requestOptions = {
            method: 'POST',
            headers: {'session_key':this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({"id": this.props.user_id})
        };
        fetch(this.props.session.ip+'/rating/does_rating_exist', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    this.setState({isLoading: false});
                } else {
                    if(Number(data) !== -1) {
                        if (!window.confirm("You have rated this user with " + data + " stars already. Do you want to overwrite your old rating?")) {
                            this.props.add_alert({type: "danger", size: "sm", text: "Did not create a new rating."})
                            this.setState({isLoading: false});
                            return;
                        }
                    }}
                    fetch(this.props.session.ip+'/rating/delete', requestOptions)
                        .then(async response => {
                            // check for error response
                            if (!response.ok) {
                                const data = await response.json();
                                const nice_error = data.error.split(/ (.+)/)
                                this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()
                                })
                                this.setState({isLoading: false});
                            } else {
                                let requestOptions = {
                                    method: 'POST',
                                    headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                        "user_id": this.props.user_id,
                                        "comment": ($("#rating_comment").val() ? ($("#rating_comment").val()) : ("")),
                                        "rating": this.state.stars})};
                                fetch(this.props.session.ip+'/rating/new', requestOptions)
                                .then(async response => {
                                    // check for error response
                                    if (!response.ok) {
                                        const data = await response.json();
                                        const nice_error = data.error.split(/ (.+)/)
                                        this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                                    } else {
                                        this.handleClose();
                                        this.props.add_alert({type: "success", size: "sm", text: "You gave "+this.state.stars+" stars to "+this.props.first_name+"."})
                                    }
                                    this.setState({isLoading: false});
                                })
                                .catch(error => {
                                        console.error('There was an error!', error);
                                        this.props.add_alert({type: "danger", size: "md", text: error.message, header: "Whoops, something went wrong :(", subtext: error.name})
                                        this.setState({isLoading: false});
                                });
                            }
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                            this.props.add_alert({type: "danger", size: "md", text: error.message, header: "Whoops, something went wrong :(", subtext: error.name})
                            this.setState({isLoading: false});
                        });
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.props.add_alert({type: "danger", size: "md", text: error.message, header: "Whoops, something went wrong :(", subtext: error.name})
                this.setState({isLoading: false});
            });
    }

}