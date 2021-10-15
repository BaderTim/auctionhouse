import React from "react";

import "./PrivateChat.css";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router-dom";
import $ from 'jquery'
import base64coder from "../../component/utils/base64coder";
import LoadMore from "../../component/utils/LoadMore";

class PrivateChat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: 3,
            error: null,
            last_refresh: null,
            message_offset: 0,
            messages: [],
            sending_message: false,
            base_offset: 5,
            offset: 0
        }
    }

    componentDidMount() {
        if(this.state.updater_id != null) {
            clearInterval(this.state.updater_id);
        }
        this.setState({is_loading: 3, error: null, message_offset: 0, messages: [], sending_message: false, last_refresh: null})
        this.load_server_time().then(() => null);
        this.load_light_user().then(() => null);
    }

    componentWillUnmount() {
        clearInterval(this.state.updater_id);
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.chat-jumbo').addClass("chat-small-jumbo")
        } else {
            $('div.jumbotron.chat-jumbo').removeClass("chat-small-jumbo")
        }
    }


    render() {
        const chat_icon = (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                                className="bi bi-chat-left-text" viewBox="0 3 16 9">
            <path
                d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path
                d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>)
        return(
            <div className="Chat">
                <div className="jumbotron chat-jumbo">
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
                            (<div className="chat-content">
                                    {this.update_jumbo(true)}
                                    <h1 className="display-5">{chat_icon} {this.state.user.first_name} {this.state.user.last_name} <span style={{fontSize: "40%"}}>({this.state.user.country})</span></h1>
                                    <hr/>
                                    <div className="card">
                                        <div id="chat_card_body" className="card-body">
                                            <div id="chat_card_message_container">
                                                <div style={{height: "15px"}}/>
                                                <LoadMore chat={true} end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                                <div style={{height: "15px"}}/>
                                                {this.state.messages.map(function (data, id) { // partner message - your message
                                                    return (<div key={id}>{ data.author_user_id === data.user_id ? (<div className="chat-message partner-response">
                                                        <h5 className="card-title" style={{marginBottom: "2px"}}>{data.first_name} {data.last_name}</h5>
                                                        <p className="card-text" style={{marginBottom: "0px"}}>{data.message}</p>
                                                        <small className="text-muted">{new Date(data.unix_creation_time).toLocaleString()}</small>
                                                    </div>) : (<div className="chat-message your-response">
                                                        <h5 className="card-title" style={{marginBottom: "2px"}}>You</h5>
                                                        <p className="card-text" style={{marginBottom: "0px"}}>{data.message}</p>
                                                        <small className="text-muted">{new Date(data.unix_creation_time).toLocaleString()}</small>
                                                </div>)}</div>)
                                            })}</div>
                                            <div className="input-group mb-3" style={{marginTop: "25px"}}>
                                                <input  style={{zIndex: "0!important"}} id="message_box" type="text" className="form-control" placeholder="Enter message"
                                                       aria-label="Message" aria-describedby="button-addon2"/>
                                                <div className="input-group-append">
                                                    {this.state.sending_message ? (
                                                        <div style={{margin: "0px 12px 0px 6px"}} className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        <button style={{zIndex: "unset"}} className="btn btn-primary" type="button" id="button-addon2" onClick={() => {this.send_message()}}>Send</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                            </div>
                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }

    async load_light_user() {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
            body: JSON.stringify({"id": this.props.match.params.chat_id})
        };
        fetch(this.props.session.ip+'/account/user/id', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                    let profile_picture_decoded = null;
                    if(data.profile_picture) {
                        profile_picture_decoded = base64coder.decode(data.profile_picture)
                    }
                    let passport_decoded = null;
                    if(data.passport) {
                        passport_decoded = base64coder.decode(data.passport)
                    }
                    this.setState({user: {
                            address_addition: data.address_addition,
                            birth_date: data.birth_date,
                            city: data.city,
                            country: data.country,
                            description: data.description,
                            email: data.email,
                            first_name: data.first_name,
                            house_number: data.house_number,
                            last_name: data.last_name,
                            passport: passport_decoded,
                            password: data.passport,
                            phone_number: data.phone_number,
                            postal_code: data.postal_code,
                            profile_picture: profile_picture_decoded,
                            street_name: data.street_name,
                            unix_creation_time: data.unix_creation_time,
                            user_id: data.user_id
                        },});
                    this.load_messages().then(() => null);
                }
                this.setState({is_loading: this.state.is_loading-1})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

     message_updater() {
        return setInterval(async () => {
            const path = "/chat/get_messages";
            let requestOptions = {
                method: 'POST',
                headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "filterDto": {
                        "amount": this.state.base_offset,
                        "offset": 0,
                        "order_by": "unix_creation_time",
                        "sorting_order": "DESC"},
                    "idDto": {"id": this.props.match.params.chat_id}
                })
            };
            await fetch(this.props.session.ip+path, requestOptions)
                .then(async response => {
                    const data = await response.json();
                    // check for error response
                    if (!response.ok) {
                        const nice_error = data.error.split(/ (.+)/)
                        if(!nice_error.includes("Could not find partner account.")) {
                            this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Could not update messages :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                        }

                    } else {
                        if(data != null && data.length > 0) {
                            var new_message_stack = []
                            var count = 0;
                            if(this.state.messages.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    var temp_state = reverseArr(this.state.messages);
                                    if (data[i].unix_creation_time != temp_state[i - count].unix_creation_time) {
                                        var new_message = data[i];
                                        new_message.user_id = this.state.user.user_id;
                                        new_message.first_name = this.state.user.first_name;
                                        new_message.last_name = this.state.user.last_name;
                                        new_message_stack.push(new_message)
                                        count += 1;
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                var new_message = data[0];
                                new_message.user_id = this.state.user.user_id;
                                new_message.first_name = this.state.user.first_name;
                                new_message.last_name = this.state.user.last_name;
                                new_message_stack.push(new_message)
                            }
                            if(new_message_stack.length > 0) {
                                this.setState({offset:  this.state.offset+new_message_stack.length, messages: this.state.messages.concat(reverseArr(new_message_stack))})
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    this.setState({error: error.name+": "+error.message})
                });
        }, 1000);
    }

    async load_messages() {
        const path = "/chat/get_messages";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "filterDto": {
                    "amount": this.state.base_offset,
                    "offset": 0,
                    "order_by": "unix_creation_time",
                    "sorting_order": "DESC"},
                "idDto": {"id": this.props.match.params.chat_id}
            })
        };
        fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                var data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    if(!nice_error.includes("Could not find partner account.")) {
                        this.setState({error: nice_error})
                        alert(nice_error[1]);
                    }

                } else {
                    if(data != null) {
                        data = reverseArr(data);
                        for(let i = 0; i < data.length; i++) {
                            var new_message = data[i];
                            new_message.user_id = this.state.user.user_id;
                            new_message.first_name = this.state.user.first_name;
                            new_message.last_name = this.state.user.last_name;
                            this.state.messages.push(new_message)
                        }
                    }
                    this.setState({updater_id: this.message_updater()});
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
        const path = "/chat/get_messages";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "filterDto": {
                    "amount": this.state.base_offset,
                    "offset": starting_offset,
                    "order_by": "unix_creation_time",
                    "sorting_order": "DESC"},
                "idDto": {"id": this.props.match.params.chat_id}
            })
        };
        console.log(requestOptions)
        await fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                var data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    if(data != null || data.length > 0) {
                        // data = reverseArr(data);
                        let temp = reverseArr(this.state.messages);
                        for(let i = 0; i < data.length; i++) {
                            var new_message = data[i];
                            new_message.user_id = this.state.user.user_id;
                            new_message.first_name = this.state.user.first_name;
                            new_message.last_name = this.state.user.last_name;
                            temp.push(new_message)
                        }
                        await this.setState({messages: reverseArr(temp),offset: starting_offset})
                        if(data.length !== 5) {
                            await this.setState({end: true})
                        }
                    } else {
                        await this.setState({end: true})
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
            });
    }

    send_message() {
        const message = $("#message_box").val();
        this.setState({sending_message: true})
        const path = "/chat/send_message";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "messageDto": {
                    "message": message},
                "idDto": {"id": this.props.match.params.chat_id}
            })
        };
        fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    if(!nice_error.includes("Could not find partner account.")) {
                        this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    }
                } else {
                    var new_message = {
                        author_user_id: this.props.session.user_id,
                        message: message,
                        unix_creation_time: Date.now()
                    }
                    $("#message_box").val("");
                    //this.state.messages.push(new_message);
                }
                this.setState({sending_message: false})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({sending_message: false})
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
export default withRouter(PrivateChat);


function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}