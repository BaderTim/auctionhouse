import React from "react";

import "../css/conditions.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'

export default class Conditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            server_time: 0,
            is_loading: true,
            has_error: false,
        }
    }

    componentDidMount() {
        this.setState({error: null})
        let requestOptions = {
            method: 'GET',
            // headers: {'session_key': this.props.session.key},
        };
        this.setState({is_loading: true})
        fetch(this.props.session.ip+'/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                    this.setState({server_time: data})
                }
                console.log(data)
                this.setState({is_loading: false})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: false})
            });

    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.conditions-jumbo').addClass("conditions-small-jumbo")
        } else {
            $('div.jumbotron.conditions-jumbo').removeClass("conditions-small-jumbo")
        }
    }

    render() {

        return(
            <div className="Chat">
                <div className="jumbotron conditions-jumbo">
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
                                    <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/conditions">conditions us</NavLink>
                                </div>
                            ) : // main part
                            (  <div className="conditions-content">
                                    {this.update_jumbo(true)}
                                    <h1 className="display-4">Conditions</h1>
                                    <p className="lead">here could be some additional text</p>
                                    <hr/>
                                    <p className="lead">stuff</p>

                                    <div className="jumbo-footer">
                                        <span className="text-muted">last refresh: <strong>{new Date(this.state.server_time).toLocaleString()}</strong> [{this.state.server_time}]</span>
                                    </div>
                                </div>
                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }

}