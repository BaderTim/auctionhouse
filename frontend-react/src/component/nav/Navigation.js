import React from "react";
import "./navigation.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'

export default class Navigation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
            isLoading: false,
            profile_dropdown: false
        }
        
    }

    login(event) {
        if(!this.state.email || !this.state.password) {
            return;
        }
        let mail = $("#input-mail").val();
        let pw = $("#input-pw").val();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mail , password: pw})
        };
        this.setState({isLoading: true})
        fetch(this.props.session.ip+'/login', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    //alert(nice_error[1]);
                    this.props.add_alert({type: "danger", size: "md", header: "Login has failed.",
                        text: nice_error[1],
                        subtext: "Need help? Contact us."});
                } else {
                    this.props.session.key = data.key;
                    this.props.session.duration = Number(data.expiring_date);
                    this.props.session.user_id = data.user_id;
                    this.props.session.seller_id = data.seller_id;
                    this.props.session.admin= data.admin;
                    localStorage.setItem("auctionhouse_session", JSON.stringify(this.props.session));
                    window.location.href = "/";
                    this.forceUpdate();
                }
                console.log(data)
                this.setState({isLoading: false})
            })
            .catch(error => {
                console.error('There was an error!', error);
                alert(error);
                this.setState({isLoading: false})
            });
    }

    onInputEmailChange(event) {
        let obj = $("#input-mail");
        if(obj.val().length > 4 && obj.val().includes("@")) {
            if(!this.state.email) { // if(EmailValidator.validate(obj.val())) {
                obj.addClass("form-control-success");
                obj.addClass("nav-succ-focused");
                this.setState({email: true});
                if(this.state.password) {
                    $("#nav-login").addClass("btn-outline-success").removeClass("btn-outline-danger");
                }
            }
        } else {
            this.setState({email: false});
            obj.removeClass("form-control-success");
            obj.removeClass("nav-succ-focused");
            $("#nav-login").removeClass("btn-outline-success").addClass("btn-outline-danger");
            if(obj.val().length > 0) {
                obj.addClass("nav-focused");
            } else {
                obj.removeClass("nav-focused");
            }
        }
    }

    onInputPwChange(event) {
        let obj = $("#input-pw");
        if(obj.val().length > 3) {
            if(!this.state.password) {
                obj.addClass("form-control-success");
                obj.addClass("nav-succ-focused");
                this.setState({password: true});
                if(this.state.email) {
                    $("#nav-login").addClass("btn-outline-success").removeClass("btn-outline-danger");
                }
            }
        } else {
            this.setState({password: false});
            obj.removeClass("form-control-success");
            obj.removeClass("nav-succ-focused");
            $("#nav-login").removeClass("btn-outline-success").addClass("btn-outline-danger");
            if(obj.val().length > 0) {
                obj.addClass("nav-focused");
            } else {
                obj.removeClass("nav-focused");
            }
        }
    }

    render() {
        let house_icon = (<svg width="30px" height="30px" viewBox="0 0 18 18" className="bi bi-house-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/><path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/></svg>);
        const person_icon = (<svg width="30px" height="30px" viewBox="0 0 18 18" className="bi bi-person-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fillRule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>);
        const person_text_icon = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-person-lines-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm2 9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/></svg>);
        const chat_icon = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-chat-left-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>);
        const chat_icon2 = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-chat-square-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>)
        const hour_glass_icon = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-hourglass-split" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13s-.866-1.299-3-1.48V8.35z"/></svg>);
        const card_icon = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-credit-card-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4z"/><path fillRule="evenodd" d="M0 7v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3z"/></svg>);
        const door_icon = (<svg width="22px" height="22px" viewBox="0 0 18 18" className="bi bi-door-closed-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 1a1 1 0 0 0-1 1v13H1.5a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2a1 1 0 0 0-1-1H4zm2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>);
        const plus_icon = (<svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 18 18"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/></svg>)
        if(this.props.session.user_id === -1) {
            return this.nav_not_logged_in(house_icon, "", true);
        } else if(this.props.session.duration < Date.now()/1000) {
            return this.nav_not_logged_in(house_icon, "Session expired", false);
        } else {
            if(this.props.session.admin)
            {
                return this.nav_logged_in_admin(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, card_icon, door_icon);
            }
            else if(this.props.session.seller_id > 0) {
                return this.nav_logged_in_as_seller(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, plus_icon, door_icon);
            } else {
                return this.nav_logged_in_without_seller(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, card_icon, door_icon);
            }
        }
    }


    nav_logged_in_admin(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, card_icon, door_icon)
    {
        return(<nav className="navbar sticky-top navbar-dark bg-dark">
        <NavLink exact to="/" className="navbar-brand">{house_icon} dw-auction</NavLink>
        <div className="nav-right">
            <NavLink className="nav-item"  to="statistics"> Admin Panel</NavLink>
            <span className="nav-spacer">|</span>
            <NavLink className="nav-item" to="/profile/watchlist">Watchlist</NavLink>
                        <span className="nav-spacer">|</span>
                        <NavLink className="nav-item" to="/profile/current-bets">Current Bets</NavLink>
                        <span className="nav-spacer">|</span>
                        <button className={this.state.profile_dropdown ? ("nav-item secret-button sb-active") : ("nav-item secret-button")}
                                onClick={() => {this.state.profile_dropdown ?
                                (this.setState({profile_dropdown: false})) : (this.setState({profile_dropdown: true})) }}>
                            Profile {person_icon}
                        </button>
                        {this.state.profile_dropdown && (
                            <div className="dropdown-menu dropdown-menu-right">
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile">{person_text_icon} My Profile</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/chat">{chat_icon} Chat</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/history/bets">{hour_glass_icon} Bet History</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/seller-registration">{card_icon} Seller Registration</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <button onClick={() => {this.setState({profile_dropdown: false}); localStorage.setItem("auctionhouse_session", null); window.location.href = "/";}}
                                        className="dropdown-item secret-button logout">{door_icon} Logout</button>
                            </div>)}
        </div>
    </nav>)
    }
    nav_logged_in_without_seller(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, card_icon, door_icon) {

         return (

                <nav className="navbar sticky-top navbar-dark bg-dark">
                    <NavLink exact to="/" className="navbar-brand">{house_icon} dw-auction</NavLink>
                    <div className="nav-right">
                        <NavLink className="nav-item" to="/profile/watchlist">Watchlist</NavLink>
                        <span className="nav-spacer">|</span>
                        <NavLink className="nav-item" to="/profile/current-bets">Current Bets</NavLink>
                        <span className="nav-spacer">|</span>
                        <button className={this.state.profile_dropdown ? ("nav-item secret-button sb-active") : ("nav-item secret-button")}
                                onClick={() => {this.state.profile_dropdown ?
                                (this.setState({profile_dropdown: false})) : (this.setState({profile_dropdown: true})) }}>
                            Profile {person_icon}
                        </button>
                        {this.state.profile_dropdown && (
                            <div className="dropdown-menu dropdown-menu-right">
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile">{person_text_icon} My Profile</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/chat">{chat_icon} Chat</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/history/bets">{hour_glass_icon} Bet History</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/seller-registration">{card_icon} Seller Registration</NavLink>
                                <div className="nav-dropdown-hr"/>
                                <button onClick={() => {this.setState({profile_dropdown: false}); localStorage.setItem("auctionhouse_session", null); window.location.href = "/";}}
                                        className="dropdown-item secret-button logout">{door_icon} Logout</button>
                            </div>)}
                    </div>
                </nav>

        );
    }

    nav_logged_in_as_seller(house_icon, person_icon, person_text_icon, chat_icon, hour_glass_icon, plus_icon, door_icon) {

        return (

            <nav className="navbar sticky-top navbar-dark bg-dark">
                <NavLink exact to="/" className="navbar-brand">{house_icon} dw-auction</NavLink>
                <div className="nav-right">
                    <NavLink className="nav-item" to="/profile/watchlist">Watchlist</NavLink>
                    <span className="nav-spacer">|</span>
                    <NavLink className="nav-item" to="/profile/current-bets">Current Bets</NavLink>
                    <span className="nav-spacer">|</span>
                    <button className={this.state.profile_dropdown ? ("nav-item secret-button sb-active") : ("nav-item secret-button")}
                            onClick={() => {this.state.profile_dropdown ?
                                (this.setState({profile_dropdown: false})) : (this.setState({profile_dropdown: true})) }}>
                        Profile {person_icon}
                    </button>
                    {this.state.profile_dropdown && (
                        <div className="dropdown-menu dropdown-menu-right">
                            <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/create-auction">{plus_icon} Create Auction</NavLink>
                            <div className="nav-dropdown-hr"/>
                            <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to={"/seller/id/"+this.props.session.seller_id}>{person_text_icon} My Page</NavLink>
                            <div className="nav-dropdown-hr"/>
                            <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/chat">{chat_icon} Chat</NavLink>
                            <div className="nav-dropdown-hr"/>
                            <NavLink onClick={() => {this.setState({profile_dropdown: false})}} className="dropdown-item" to="/profile/history">{hour_glass_icon} History</NavLink>
                            <div className="nav-dropdown-hr"/>
                            <button onClick={() => {this.setState({profile_dropdown: false}); localStorage.setItem("auctionhouse_session", null); window.location.href = "/";}}
                                    className="dropdown-item secret-button logout">{door_icon} Logout</button>
                        </div>)}
                </div>
            </nav>

        );
    }

    nav_not_logged_in(house_icon, note, sign_up) {
       return (
                <nav className="navbar sticky-top navbar-dark bg-dark">
                    <NavLink exact to="/" className="navbar-brand">{house_icon} dw-auction</NavLink>
                    {sign_up ? (
                        <NavLink exact to="/registration" className="navbar-brand" className="btn btn-warning my-2 my-sm-0">{(true)?("Sign up"):("Registrierung")}</NavLink>
                    ) : ("")}
                    <div className="nav-login">
                        <span className="nav-note">{note}</span>
                        <input id="input-mail" onChange={this.onInputEmailChange.bind(this)} className="form-control mr-sm-2 nav-email" type="email" placeholder="email" aria-label="email"/>
                        <input id="input-pw" onChange={this.onInputPwChange.bind(this)} className="form-control mr-sm-2 nav-pw" type="password" placeholder="password" aria-label="password"/>
                        {this.state.isLoading ? (
                            <div className="d-flex justify-content-center" style={{width: "66px", height: "35px", marginRight: "0px"}}>
                                <div className="spinner-border text-success" style={{margin: "auto"}} role="status"></div>
                            </div>
                            ) : (
                            <button onClick={this.login.bind(this)} style={{padding: "6px 9px 6px 9px"}} id="nav-login" className="btn btn-outline-danger my-2 my-sm-0">Log in</button>
                        )}
                    </div>
                </nav>
        );
    }
}