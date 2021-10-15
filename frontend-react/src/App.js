import React from "react";
import $ from 'jquery'

import './css/App.css';
import 'semantic-ui-css/semantic.min.css'

import Navigation from "./component/nav/Navigation";
import Main from "./component/Main";
import Footer from "./component/nav/Footer";
import Alert from "./component/utils/Alert";


export default class App extends React.Component {


    constructor(props) {


        const ip = "api.dw-auction.com";
        // const ip = "localhost"
        super(props);
        this.state = {session: null, alerts: []};
        const local_session = localStorage.getItem("auctionhouse_session");
        if(local_session != null && JSON.parse(local_session) != null) {
            let parsed_session = JSON.parse(local_session);
            if(parsed_session.duration > Date.now()+1000*60) {
                console.log("Session found, logging in...");
                this.state.session = parsed_session;
            } else {
                console.log("Session expired.");
                this.state.session = {key: "", seller_id: 0, duration: parsed_session.duration, first_name: "", user_id: -1,  admin:parsed_session.admin,ip: "https://"+ip/*+":8443"*/, writable: true};
                this.add_alert({type: "danger", size: "sm", header: "",
                    text: "Your session has expired. Please sign in again.",
                    subtext: ""})
            }
        } else {
            console.log("No session found.");

            this.state.session = {key: "", seller_id: 0, duration: 0, first_name: "", user_id: -1,admin:false, ip: "https://"+ip+"", writable: true};
            this.add_alert({type: "primary", size: "md", header: "Disclaimer",
                text: "The focus of dw-auction.com lays on distributing a platform to history interested people trying to buy or sell historic images.",
                subtext: "THIS IS NOT A PLACE FOR RACISM OR RIGHT WING NETWORKING! Breaking our Code of Conduct will result in a permanent ban from our systems."})
            this.add_alert({type: "warning", size: "sm",
                text: "Please log in or create an account to view content like images."})
        }
    }

    async overwrite_session(session) {
        await localStorage.setItem("auctionhouse_session", JSON.stringify(session));
        await this.setState(session);
    }

    componentDidMount() {
        $('body').css('background-image', 'url(' + window.location.origin + '/images/design/background2.jpg)');
        $('body').addClass("app-background");
    }

    remove_alert = (id) => {
        let temp = this.state.alerts;
        temp.splice(id, 1);
        this.setState({alerts: temp})
    }

    add_alert = (alert_config) => {
        let temp = this.state.alerts;
        temp.push(alert_config);
        this.setState({alerts: temp})
    }


    render() {
        return (
            <div className="App">
                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                        crossOrigin="anonymous"/>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                        crossOrigin="anonymous"/>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
                      rel="stylesheet"
                      integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
                      crossOrigin="anonymous"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
                      integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
                      crossOrigin="anonymous"/>
                <div className="app-wrapper">
                    {this.state.alerts.map((data, id) => {
                        let small = 0;
                        let medium = 0;
                        for(let i = 0; i < id; i++) {
                            if(this.state.alerts[i].size === "sm") {
                                small++;
                            } else if(this.state.alerts[i].size === "md") {
                                medium++;
                            }
                        }
                        return <Alert remove_alert={this.remove_alert} key={id} c_small={small} c_medium={medium} type={data.type} size={data.size} header={data.header} subtext={data.subtext} text={data.text}/>;
                    })}
                    <div className="app-content">
                        <nav className="navbar sticky-top navbar-overlap navbar-dark bg-dark shadow-lg p-3 mb-5"/>
                        <div className="large-container">
                            <Navigation add_alert={this.add_alert} session={this.state.session}/>
                            <div className="main container">
                                <Main overwrite_session={this.overwrite_session} add_alert={this.add_alert} session={this.state.session}/>
                            </div>
                        </div>
                        <Footer className="shadow-lg p-3 mb-5"/>
                    </div>
                    <div className="app-background" style={{backgroundImage: 'url(' + window.location.origin + '/images/design/background2.jpg)'}}/>
                </div>
            </div>
        );
    }
}