import React from "react";

import "./chat.css";
import {NavLink, Route} from "react-router-dom";
import $ from 'jquery'
import LoadMore from "../../component/utils/LoadMore";

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: 2,
            error: null,
            last_refresh: null,
            users_chatting_with: [],
            base_offset: 5,
            offset: 0,
            end: false,
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

    componentDidMount() {
        this.setState({is_loading: 2, error: null, users_chatting_with: []})
        this.load_server_time().then(() => null);
        this.load_chats().then(() => null);
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.chat-jumbo').addClass("chat-small-jumbo")
        } else {
            $('div.jumbotron.chat-jumbo').removeClass("chat-small-jumbo")
        }
    }

    render() {

        return(
            <div className="Chat">
                <div className="jumbotron chat-jumbo">
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
                        (<div className="chat-content">
                            {this.update_jumbo(true)}
                            <h1 className="display-4">Chat</h1>
                            <p className="lead">For making deals in the backroom, asking questions or just chatting.</p>
                            <hr/>
                            {this.state.is_loading > 0 ?
                                // loading part
                                (<div className="d-flex justify-content-center" style={{marginTop: "50px"}}>
                                    {this.update_jumbo(false)}
                                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}}
                                         role="status"/>
                                </div>) : (<div>
                                    <div style={{height: "10px"}}/>
                                    <div>
                                        {this.state.users_chatting_with.length > 0 ?
                                            (<div>{this.state.users_chatting_with.map(function(data, id) {
                                                return (
                                                    <NavLink key={id} to={"/profile/chat/"+data.user_id} className={"chat-user-listing_"+data.user_id+" text-decoration-none black"} style={{marginBottom: "30px"}}>
                                                        <div className="card mb-3">
                                                            <div className="row no-gutters" style={{maxHeight: "150px"}}>
                                                                <div className="col-md-4" style={{maxWidth: "150px", maxHeight: "150px"}}>
                                                                    <img src={data.profile_picture ? (data.profile_picture) : (window.location.origin + "/images/design/empty_profile_picture.png")} className="card-img" alt="profile_picture"/>
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">{data.first_name} {data.last_name} ({data.country})</h5>
                                                                        {data.author_id === data.user_id ? (<div>{data.message ? (<div><p className="card-text"><strong>{data.first_name}: </strong>{data.message}</p></div>) : (<p className="card-text red">ERROR: Could not load last message.</p>)}</div>) :
                                                                            (<div>{data.message ? (<div><p className="card-text font-italic"><strong>You: </strong> {data.message}</p></div>) : (<p className="card-text red">ERROR: Could not load last message.</p>)}</div>)}
                                                                        <p className="card-text"><small className="text-muted">Last message: {data.time ? (new Date(data.time).toLocaleString()) : ("0")}</small></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                    )
                                                 })}
                                                <div style={{height: "15px"}}/>
                                                <LoadMore end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                                <div style={{height: "15px"}}/>
                                            </div>) :
                                            (<div>
                                                <br/>
                                                <p className="lead fw-bold">It looks like you did not chat with any user yet.</p>
                                                <br/>
                                                <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
                                            </div>)}
                                    </div>
                                </div>) // end of loading
                            }
                        </div>)// end of error
                    }
                </div>
            </div>
        )
    }


    load_more = async (starting_offset) => {
        const path = "/chat/get_all_chats";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": starting_offset, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter, "item_type": this.state.type, "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        await fetch(this.props.session.ip+path, requestOptions)
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
                    await this.setState({temp_users_chatting_with: data, temp_loading: data.length})
                    for (let i = 0; i < data.length; i++) {
                        await this.load_last_messages_load_more(data[i], i, starting_offset);
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }

     async load_last_messages_load_more(user, count, starting_offset) {
        const path = "/chat/get_messages";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "filterDto": {
                    "amount": 1,
                    "order_by": "unix_creation_time",
                    "sorting_order": "DESC"},
                "idDto": {"id": user.user_id}
            })
        };
        await fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    if(!nice_error.includes("Could not find partner account.")) {
                        this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    }

                } else {
                    if(data != null) {
                        console.log(this.state.temp_users_chatting_with)
                        let temp = this.state.temp_users_chatting_with;
                        temp[count].message = data[0].message;
                        temp[count].time = data[0].unix_creation_time;
                        temp[count].author_id = data[0].author_user_id;
                        console.log(temp)
                        await this.setState({temp_users_chatting_with: temp, temp_loading: this.state.temp_loading-1})
                    } else {
                        let temp = this.state.temp_users_chatting_with;
                        temp[count].message = "Could not load latest message.";
                        temp[count].time = 0;
                        temp[count].author_id = 0;
                        await this.setState({temp_users_chatting_with: temp, temp_loading: this.state.temp_loading-1})
                    }
                    if(this.state.temp_loading === 0) {
                        let temp = this.state.users_chatting_with;
                        for(let i = 0; i < this.state.temp_users_chatting_with.length; i++) {
                            temp.push(this.state.temp_users_chatting_with[i]);
                        }
                        this.setState({users_chatting_with: temp, offset: starting_offset})
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }



    async load_chats() {
        const path = "/chat/get_all_chats";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                "amount": this.state.base_offset,"offset": 0, "sorting_order": this.state.filter.sorting_order, "order_by": this.state.filter.sorting_filter, "item_type": this.state.type, "active": this.state.filter.active, "is_instant_sell": this.state.filter.is_instant_sell, "search_by_name": this.state.filter.search_by_name, "international": this.state.filter.international
            })
        };
        fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    await this.setState({users_chatting_with: data})
                    if(data != null) {
                        this.setState({is_loading: this.state.is_loading+data.length})
                        for (let i = 0; i < data.length; i++) {
                            this.load_last_messages(data[i], i);
                        }
                    }
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    load_last_messages(user, count) {
        const path = "/chat/get_messages";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "filterDto": {
                    "amount": 1,
                    "order_by": "unix_creation_time",
                    "sorting_order": "DESC"},
                "idDto": {"id": user.user_id}
            })
        };
        fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    if(!nice_error.includes("Could not find partner account.")) {
                        this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    }

                } else {
                    if(data != null) {
                        let temp = this.state.users_chatting_with;
                        temp[count].message = data[0].message;
                        temp[count].time = data[0].unix_creation_time;
                        temp[count].author_id = data[0].author_user_id;
                        this.setState({users_chatting_with: temp})
                    } else {
                        let temp = this.state.users_chatting_with;
                        temp[count].message = "Could not load latest message.";
                        temp[count].time = 0;
                        temp[count].author_id = 0;
                        this.setState({users_chatting_with: temp})
                    }
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    async load_server_time() {
        let requestOptions = {
            method: 'GET',
            // headers: {'session_key': this.props.session.key},
        };
        fetch(this.props.session.ip+'/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                    this.setState({last_refresh: data})
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