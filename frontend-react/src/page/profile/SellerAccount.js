import React from "react";

import "./history/bethistory.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import {loadStripe} from "@stripe/stripe-js";

export default class SellerAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: 3,
            payment_methods: [],
            invoices: [],
            seller_data: null,
            stripe_session: null,
        }
    }

    async componentDidMount() {
        await this.setState({error: null, is_loading: 3, payment_methods: [], invoices: [], seller_data: null, stripe_session: null})
        this.get_payment_methods().then(() => null);
        this.get_seller_data().then(() => null);
        this.get_invoices().then(() => null);
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
                        (<div className="bethistory-content">
                            {this.update_jumbo(true)}
                            <h1 className="display-4">Seller Account</h1>
                            <p className="lead">
                                This page gives you an overview over your upcoming payments and your payment methods. You can also see invoices up to 6 months in the past.
                            </p>
                            <hr/>
                            {this.state.is_loading > 0 ?
                                // loading part
                                (<div className="d-flex justify-content-center" style={{marginTop: "50px"}}>
                                    {this.update_jumbo(false)}
                                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"/>
                                    </div>) :
                                (<div>
                                    <div style={{display: "flex", alignItems: "flex-end"}}>
                                        <h2 className="display-2" style={{margin: "unset"}}>
                                            {(this.get_debt()+"").length === 1 ? (this.get_debt()+".00 €") : (
                                                <div>{(this.get_debt()+"").split(".")[1].length < 2 ?
                                                    (this.get_debt()+"0") :
                                                    (this.get_debt())} €</div>)}
                                        </h2>
                                        <div style={{width: "20px"}}/>
                                        <h4 style={{marginBottom: "10px"}}>fees due to the 1st of {this.getMonthName(new Date(new Date().getFullYear(), new Date().getMonth()+1, 1).getMonth())}.</h4>
                                    </div>
                                    <div style={{height: "20px"}}></div>
                                    <p className="lead"> Each month your active payment method will be automatically debited with your total fees.</p>
                                    <div style={{height: "10px"}}></div>
                                    {this.state.payment_methods.length > 0 ? (<div>
                                        <h2>Payment Methods</h2>
                                        <table className="table">
                                            <thead className="table-dark">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Brand</th>
                                                <th scope="col">Card Number</th>
                                                <th scope="col">Expires</th>
                                                <th scope="col">Card E-Mail</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.payment_methods.map((data, id) => this.handle_payment_map(data, id))}
                                            </tbody>
                                            </table>
                                            <div style={{display: "flex"}}>
                                            <button className="btn btn-primary" onClick={async event => {
                                                if(!window.confirm("Do you really want to add another payment method?")) {
                                                    return;
                                                }
                                                await this.get_stripe_session();
                                                if(this.state.error) {
                                                    return
                                                }
                                                const stripe = await loadStripe('pk_test_51IF5DCGXT5tgmfQyl6rSoWBPDWPWyCAKsbazCKhOMsyWezqofo7t630TKS6DTOpRfWUUpZdcVhlSUZesQGNL0r1N00IMVJdODi');
                                                await stripe.redirectToCheckout({sessionId: this.state.stripe_session})
                                            }}>Add Payment Method</button>
                                                <p style={{marginLeft: "40px"}}><strong>Tip:<br/></strong>You can edit your payment method by adding the new/correct version and removing the old one afterwards.</p>
                                            </div>
                                            <div style={{height: "50px"}}></div>
                                            <div style={{display: "flex", alignItems: "flex-end"}}>
                                                <h2>Invoices</h2>
                                                <div style={{width: "10px"}}/>
                                                <p style={{marginBottom: "10px"}}>(latest 6)</p>
                                            </div>
                                            <table className="table">
                                                <thead className="table-dark">
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Date of Issue</th>
                                                    <th scope="col">Invoice Number</th>
                                                    <th scope="col">Auctions</th>
                                                    <th scope="col">Photo Albums</th>
                                                    <th scope="col">Additional Images</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Paid</th>
                                                    <th scope="col">Download</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.invoices.map((data, id) => this.handle_invoice_map(data, id))}
                                                </tbody>
                                            </table>
                                        </div>)
                                        :
                                        (<div>
                                            <br/>
                                            <p className="lead fw-bold">It looks like you don't have any active payment methods.</p>
                                            <br/>
                                            <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
                                        </div>)}
                                </div>)
                            }
                        </div>)// end of error
                    }
                </div>
            </div>
        )
    }


    handle_payment_map(data, id) {
        return (
            <tr key={id} className={data.id === this.state.seller_data.payment_id ? ("table-success") : ("")}>
            <th scope="row">{id+1}</th>
            <td>{data.card.brand}</td>
            <td>**** **** **** {data.card.last4}</td>
            <td>{data.card.expMonth}/{data.card.expYear}</td>
            <td>{data.billingDetails.email}</td>
            <td>{data.billingDetails.name}</td>
            <td>
                {data.id === this.state.seller_data.payment_id ? (
                    <div style={{display: "flex"}}>
                        <p style={{height: "22px", width: "120px", margin: "unset", color: "darkgreen", paddingLeft:"30px"}}>active</p>
                        <div style={{width: "10px"}}/>
                        <button className="btn btn-danger" style={{height: "22px", width: "120px", textAlign: "center", padding: "unset"}} onClick={async event => {await this.remove_payment_method(data.id)}} disabled>Remove</button>
                    </div>
                ) : (
                    <div style={{display: "flex"}}>
                        <button className="btn btn-success" style={{height: "22px", width: "120px", padding: "unset"}} onClick={async event => {await this.edit_payment_method(data.id)}}>Set as active</button>
                        <div style={{width: "10px"}}/>
                        <button className="btn btn-danger" style={{height: "22px", width: "120px", padding: "unset"}} onClick={async event => {await this.remove_payment_method(data.id)}}>Remove</button>
                    </div>
                )}
            </td>
        </tr>);
    }


    handle_invoice_map(data, id) {
        return (
            data.status !== "draft" ? (
                    <tr key={id} className={data.paid ? ("table-success") : ("table-danger")}>
                        <th scope="row">{id+1}</th>
                        <td>{new Date(data.created*1000).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td>{data.number}</td>
                        <td>{data.lines.data[2].quantity}</td>
                        <td>{data.lines.data[1].quantity}</td>
                        <td>{data.lines.data[0].quantity}</td>
                        <td>{data.total > 100 ? ((data.total+"").slice(0, (data.total+"").length-2)+"."+(data.total+"").slice((data.total+"").length-2, (data.total+"").length)) : ("0."+data.total)} €</td>
                        <td>{data.paid ? ("✔") : ("✖")}</td>
                        <td>
                            {(data.status === "paid" || data.status === "void") ? (
                                <button className="btn btn-light" style={{height: "22px", width: "120px", padding: "unset"}} onClick={async event => {window.open(data.invoicePdf, '_blank')}}>Download</button>
                            ) : (
                                <button className="btn btn-danger" style={{height: "22px", width: "120px", padding: "unset"}} onClick={async event => {window.open(data.hostedInvoiceUrl, '_blank')}}>Pay now</button>
                            )}
                        </td>
                    </tr>
                ) : (
                <tr key={id} className="table-warning">
                    <th scope="row">{id+1}</th>
                    <td>{new Date(data.created*1000).toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td><strong>Processing</strong></td>
                    <td>{data.lines.data[2].quantity}</td>
                    <td>{data.lines.data[1].quantity}</td>
                    <td>{data.lines.data[0].quantity}</td>
                    <td>{data.total > 100 ? ((data.total+"").slice(0, (data.total+"").length-2)+"."+(data.total+"").slice((data.total+"").length-2, (data.total+"").length)) : ("0."+data.total)} €</td>
                    <td>⚙</td>
                    <td><button className="btn btn-light" style={{height: "22px", width: "120px", padding: "unset"}} onClick={async event => {window.open(data.invoicePdf, '_blank')}} disabled>Download</button></td>
                </tr>
                )
            );
    }

    get_debt() {
        return (this.state.seller_data.auction*0.5+this.state.seller_data.photo_album*2.0+this.state.seller_data.additional_image*0.1);
    }


    async remove_payment_method(id) {
        if(this.state.payment_methods.length < 2) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot remove your only payment method."})
            return
        }
        if(!window.confirm("Do you really want to remove this card?")) {
            return;
        }
        this.setState({is_loading: 1})
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
            body: id
        };
        await fetch(this.props.session.ip+'/account/seller/payment_method/detatch', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    console.log(nice_error[1])
                    this.setState({is_loading: 0})
                } else {
                    await this.componentDidMount();
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.props.add_alert({type: "danger", size: "md", text: error, header: "Whoops, something went wrong :(", subtext: new Date().toUTCString()})
                this.setState({is_loading: 0})
            });
    }

    async edit_payment_method(id) {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
            body: id
        };
        this.setState({is_loading: 1})
        await fetch(this.props.session.ip+'/account/seller/payment_method/prefer', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                    console.log(nice_error[1])
                    this.setState({is_loading: 0})
                } else {
                    await this.componentDidMount();
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.props.add_alert({type: "danger", size: "md", text: error, header: "Whoops, something went wrong :(", subtext: new Date().toUTCString()})
                this.setState({is_loading: 0})
            });
    }

    async get_payment_methods() {
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
        };
        fetch(this.props.session.ip+'/account/seller/payment_methods', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    this.setState({payment_methods: data,is_loading: this.state.is_loading - 1})
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    async get_invoices() {
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
        };
        fetch(this.props.session.ip+'/account/seller/invoices', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    this.setState({invoices: data,is_loading: this.state.is_loading - 1})
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
            });
    }

    async get_seller_data() {
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json'},
        };
        fetch(this.props.session.ip+'/account/seller/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    this.setState({seller_data: data, is_loading: this.state.is_loading - 1})
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({is_loading: this.state.is_loading-1})
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


    getMonthName(monthIndex){
        //An array containing the name of each month.
        var months = [
            "January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October",
            "November", "December"
        ];
        return months[monthIndex];
    }


}