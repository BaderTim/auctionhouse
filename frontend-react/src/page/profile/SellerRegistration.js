import React from "react";

import "./sellerregistration.css";
import {NavLink, withRouter} from "react-router-dom";
import $ from 'jquery'
import {loadStripe} from '@stripe/stripe-js';

class SellerRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            has_error: false,
            seller_account_status: "none",
            seller_account_status_loading: false,
            stripe_session: "",
            stripe: null
        }
    }

    async componentDidMount() {
        this.setState({error: null, is_loading: true, has_error: false, seller_account_status: "none", seller_account_status_loading: false, stripe_session: "", stripe: null})
        if(this.props.match.params.stripe_session) {
            this.send_checkout_session().then(() => null)
        } else {
            this.get_seller_account_status().then(() => null)
        }
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.sellerregistration-jumbo').addClass("sellerregistration-small-jumbo")
        } else {
            $('div.jumbotron.sellerregistration-jumbo').removeClass("sellerregistration-small-jumbo")
        }
    }

    render() {

        return(
            <div className="SellerRegistration">
                <div className="jumbotron sellerregistration-jumbo">
                    { this.props.match.params.success ? (
                        this.props.match.params.stripe_session ? (
                            <div>
                                <h4 className="display-4">One moment please....</h4>
                            </div>
                        ) : (
                            <div className="error-text">
                                {this.update_jumbo(false)}
                                {this.state.seller_account_status === 1 ? (
                                    window.location.href = "/profile/seller-account"
                                ) : (
                                    <div>
                                    <h1 className="display-4">Something went wrong.</h1>
                                    <hr/>
                                    <p className="lead red">Something went wrong while trying to verify your card. Please try again or contact us.</p>
                                    <button onClick={() => {window.location.href = "/profile/seller-registration"}} className="btn btn-primary btn-lg">Try again</button>
                                    <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/contact">Contact us</NavLink>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        this.state.is_loading ?
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
                                (<div className="sellerregistration-content">
                                        {this.update_jumbo(true)}
                                        <h1 className="display-4">Seller Registration</h1>
                                        <p className="lead">If you wish to create your own auctions you need to register as seller. <br/>
                                        You can do this in less than 5 minutes by creating a seller account and then verifying it by adding a valid credit card. <br/>
                                        <strong>Registering as seller on dw-auction is free of charge.</strong>
                                        </p>
                                        <hr/>
                                        {this.state.seller_account_status === -1 ?
                                            (<div>{this.state.seller_account_status_loading ? (<div className="d-flex justify-content-center" style={{marginLeft: "30px",width: "54px", height: "33px"}}><div className="spinner-border text-primary"  role="status"></div></div>) :
                                                    (<button className="btn btn-primary" onClick={event => {this.create_seller_account()}}>Create seller account</button>)}</div>
                                            ) :
                                            (this.state.seller_account_status === 1 ?
                                                (<p>You are already verified.</p>) :
                                                (<div style={{display: "grid"}}>
                                                    <p className="lead">Please verify your Identity by registering a Credit Card via Stripe:</p>
                                                    {this.state.stripe_session_loading ? (
                                                        <div className="d-flex justify-content-center" style={{marginLeft: "50px",width: "54px", height: "33px"}}><div className="spinner-border text-primary"  role="status"></div></div>
                                                    ) : (
                                                        <button className="btn btn-primary" style={{width: "300px"}} onClick={async event => {
                                                            await this.get_stripe_session();
                                                            if(this.state.error) {
                                                                return
                                                            }
                                                            const stripe = await loadStripe('pk_test_51IF5DCGXT5tgmfQyl6rSoWBPDWPWyCAKsbazCKhOMsyWezqofo7t630TKS6DTOpRfWUUpZdcVhlSUZesQGNL0r1N00IMVJdODi');
                                                            await stripe.redirectToCheckout({
                                                                // Make the id field from the Checkout Session creation API response
                                                                // available to this file, so you can provide it as argument here
                                                                // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                                                                sessionId: this.state.stripe_session})
                                                        }}>Continue</button>
                                                    )}
                                                    <span className="text-mute" style={{marginTop: "4px", width: "300px"}}>By clicking Continue I agree to the Terms & Conditions of dw-auction.com</span>
                                                </div>))}
                                    </div>
                                )
                            }</div>) // end of main part

                    )}
                </div>
            </div>
        )
    }

    async send_checkout_session() {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
            body: this.props.match.params.stripe_session
        };
        await fetch(this.props.session.ip+'/account/seller/registration/checkout_session', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    console.log(nice_error[1])
                } else {
                    if(this.props.session.seller_id > 0) {
                        window.location.href = "/profile/seller-account"
                        return null;
                    }
                    console.log(this.props.session)
                    let temp_session = this.props.session;
                    temp_session.seller_id = data;
                    this.props.overwrite_session(temp_session);
                    console.log(this.props.session)
                    window.location.href = "/seller/id/"+data
                    return null;
                }
                window.location.href = "/profile/seller-registration/error"
            })
            .catch(error => {
                console.error('There was an error!', error);
                window.location.href = "/profile/seller-registration/error"
            });

    }

    async get_stripe_session() {
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key},
        };
        this.setState({stripe_session_loading: true})
        await fetch(this.props.session.ip+'/account/seller/registration/get_stripe_session', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    await this.setState({stripe_session_loading: false})
                } else {
                    await this.setState({stripe_session: data.session})
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({stripe_session_loading: false})
            });
    }

    create_seller_account() {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
        };
        this.setState({seller_account_status_loading: true})
        fetch(this.props.session.ip+'/account/seller/registration/create_seller_account', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    await this.setState({seller_account_status: 0})
                }
                this.setState({seller_account_status_loading: true})
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({seller_account_status_loading: true})
            });

    }


    async get_seller_account_status() {
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key},
        };
        this.setState({is_loading: true})
        await fetch(this.props.session.ip+'/account/seller/registration/get_seller_account_status', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                } else {
                    this.setState({seller_account_status: data})
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


}
export default withRouter(SellerRegistration);