import React from "react";

import "../../css/all.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import TextField from "@material-ui/core/TextField";
import moment from "moment";

export default class CreateAuction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auction_cost: 0.5,
            img_cost: 0,
            feature_cost: 0,
            is_auction: true, // false --> instant sell
            starting_time: new Date(),
            server_time: 0,
            creating_auction: false,
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
            $('div.jumbotron.all-jumbo').addClass("all-small-jumbo")
        } else {
            $('div.jumbotron.all-jumbo').removeClass("all-small-jumbo")
        }
    }

    render() {

        return(
            <div className="Chat">
                <div className="jumbotron all-jumbo">
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
                                    <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/about">about us</NavLink>
                                </div>
                            ) : // main part
                            (  <div className="all-content">
                                    {this.update_jumbo(true)}
                                    <h1 className="display-4">Create Auction</h1>
                                    <p className="lead">The base cost is 0.5€ per auction. After your 4th image, every new image costs another 0.10€ extra. <br/>
                                        Photo albums higher the base cost to 2€ but give you 6 images for free instead.<br/>
                                        You can have up to 12 images in total.</p>
                                    <hr/>
                                    <div>
                                    <form className="row g-3">

                                        <div className="col-md-6" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="input_title" className="form-label">Title</label>
                                            <input type="text" className="form-control" id="input_title" aria-describedby="input_title"
                                                   onChange={(e) => {(e.target.value === null ?
                                                       (e.target.parentElement.setAttribute("class", "col-md-6")) :
                                                       (e.target.parentElement.setAttribute("class", "col-md-6 was-validated")))}} required/>
                                            <div id="input_title_feedback" className="invalid-feedback">Please provide a valid title name.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="select_currency" className="form-label">Currency</label>
                                            <select className="form-select" id="select_currency" aria-describedby="select_currency" required>
                                                <option value="eur">€ Euro</option>
                                                <option value="usd">$ US Dollar</option>
                                            </select>
                                            <div id="select_currency_feedback" className="invalid-feedback">Please select a valid currency.</div>
                                        </div>
                                        <div className="col-md-3" >
                                            <label htmlFor="input_starting_price" className="form-label">Starting Price</label>
                                            <input type="text" className="form-control" id="input_starting_price" aria-describedby="input_starting_price"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       (/^(([1-9][0-9]*(,|\.)[0-9]{1})|[1-9][0-9]*)$/.test(e.target.value) ?
                                                           (this.handleStartingPriceChange(e)) :
                                                           (e.target.setAttribute("class", "form-control is-invalid"))))}} required/>
                                            <div id="input_starting_price_feedback" className="invalid-feedback">Please provide a valid starting price like '10' or '25.5'.</div>

                                        </div>
                                        <div className="mb-3" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="validationTextarea" className="form-label">Description</label>
                                            <textarea className="form-control" id="validationTextarea" placeholder="Textarea for description"
                                                      onChange={(e) => {(e.target.value === null ?
                                                          (e.target.parentElement.setAttribute("class", "mb-3")) :
                                                          (e.target.parentElement.setAttribute("class", "mb-3 was-validated")))}} required/>
                                            <div className="invalid-feedback">Please provide a valid description for your item.</div>
                                        </div>

                                        <div className="col-md-3" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="select_auction_type">Auction Type</label>
                                            <select className="form-select" id="select_auction_type" aria-label="select_auction_type"
                                                    onChange={event => {
                                                        (event.target.value === "auction" ? (this.setState({is_auction: true})) : (this.setState({is_auction: false})))
                                                    }} required>
                                                <option value="auction">Auction</option>
                                                <option value="instant_sell">Instant Buy Listing</option>
                                            </select>
                                            <div className="invalid-feedback">You need to select your auction type.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="select_item_type">Item Type</label>
                                            <select className="form-select" id="select_item_type" required aria-label="select_item_type"
                                                    onChange={event => {
                                                        (event.target.value === "photo_album" ? (this.setState({auction_cost: 2})) : (this.setState({auction_cost: 0.5})))
                                                    }}>
                                                <option value="">Choose item type...</option>
                                                <option value="ww1">WW1</option>
                                                <option value="ww2">WW2</option>
                                                <option value="photo_album">Photo Album</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <div className="invalid-feedback">You need to set your item type.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="input_amount" className="form-label">Amount</label>
                                            <input type="text" className="form-control" defaultValue="1" id="input_amount" aria-describedby="input_amount"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       (/^([0-9]+)$/.test(e.target.value) ?
                                                           (Number(e.target.value) > 0 && Number(e.target.value) < 1000 ?
                                                               (e.target.setAttribute("class", "form-control is-valid")) :
                                                               (e.target.setAttribute("class", "form-control is-invalid"))) :
                                                           (e.target.setAttribute("class", "form-control is-invalid"))))}} required/>
                                            <div id="input_amount_feedback" className="invalid-feedback">Please provide a valid item amount between 1 and 999.</div>
                                        </div>

                                        <div className="mb-3" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="upload_thumbnail" className="form-label">Select your thumbnail</label>
                                            <input id="upload_thumbnail" className="form-control"  type="file" required/>
                                            <div className="invalid-feedback">You need to set a thumbnail for this auction.</div>
                                        </div>
                                        <div className="mb-3" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="upload_images" className="form-label">Select your photos</label>
                                            <input id="upload_images" className="form-control"  type="file" multiple required
                                                   onChange={(e) => {
                                                       const imgs = $("#upload_images").get(0).files.length-4;
                                                       if(imgs > 0) {
                                                            this.setState({img_cost: imgs*0.1})
                                                       } else {
                                                           this.setState({img_cost: 0})
                                                       }
                                                   }}/>
                                            <div className="invalid-feedback">You need to select at least one photo.</div>
                                        </div>

                                    </form>
                                    {this.state.is_auction ? (
                                        <div style={{marginLeft: "3px", marginBottom: "30px", marginTop: "10px"}}>
                                            <TextField
                                                id="starting_time"
                                                label="Starting Time"
                                                type="datetime-local"
                                                defaultValue={moment().add("1", "hours").format('YYYY-MM-DD')+"T"+moment().add("1", "hours").format('HH:mm')}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField style={{marginLeft:"30px"}}
                                                id="ending_time"
                                                label="Ending Time"
                                                type="datetime-local"
                                                defaultValue={moment().add("5", "days").format('YYYY-MM-DD')+"T"+moment().add("1", "hours").add("5", "days").format('HH:mm')}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    ) : (null)}
                                    <h6 style={{marginTop: "10px", marginLeft: "0px"}}>Shipping & Payment</h6>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" value="" id="check_national" checked disabled/>
                                        <label className="form-check-label" htmlFor="check_national">National</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{paddingLeft: "20px"}}>
                                        <input type="checkbox" className="form-check-input" id="radio_international" name="checkbox-stacked" required/>
                                        <label className="form-check-label" htmlFor="radio_international">International</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{paddingLeft: "20px"}}/>
                                    <div className="form-check form-check-inline" style={{paddingLeft: "20px"}}>
                                        <input type="checkbox" className="form-check-input" id="check_cash" name="checkbox-stacked" required/>
                                        <label className="form-check-label" htmlFor="check_cash">Cash</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{paddingLeft: "20px"}}>
                                        <input type="checkbox" className="form-check-input" id="check_bank_transfer" name="checkbox-stacked" required/>
                                        <label className="form-check-label" htmlFor="check_bank_transfer">Bank Transfer</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{paddingLeft: "20px"}}>
                                        <input type="checkbox" className="form-check-input" id="check_paypal" name="checkbox-stacked" required/>
                                        <label className="form-check-label" htmlFor="check_paypal">PayPal</label>
                                    </div>

                                    <div style={{height: "20px"}}/>

                                    <form className="was-validated">

                                        <h6><strong>Cost</strong></h6>
                                        <input id="cost_display" style={{width: "80px", marginBottom: "20px"}} className="form-control" type="text"
                                               value={(this.state.auction_cost === 2 ? (
                                                   this.state.img_cost >= 0.2 ? (this.state.auction_cost+this.state.img_cost-0.2+this.state.feature_cost) : (this.state.auction_cost+this.state.feature_cost)
                                               ) : (this.state.auction_cost+this.state.img_cost+this.state.feature_cost)).toFixed(2)+" €"}
                                               aria-label="Disabled input" disabled/>

                                        <h6 style={{paddingBottom: "5px"}}>Conditions</h6>
                                        <div className="form-check mb-3">
                                            <input type="checkbox" className="form-check-input" id="checkbox_terms_and_conditions" required/>
                                            <label className="form-check-label" htmlFor="checkbox_terms_and_conditions">I have read the the Terms & Conditions and agree with them.</label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input type="checkbox" className="form-check-input" id="checkbox_rules" required/>
                                            <label className="form-check-label" htmlFor="checkbox_rules">I will accept the outcome of this auction and hand out my item to the winner or else I will get banned from dw-auction.</label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input type="checkbox" className="form-check-input" id="checkbox_payment_reminder" required/>
                                            <label className="form-check-label" htmlFor="checkbox_payment_reminder">I acknowledge that creating this auction will cost me money. The exact amount will be added to my debt-account and debited at the end of the month. I am are also renouncing my right of withdrawal since this is a digital process that cannot be undone.</label>
                                        </div>

                                    </form>
                                        {this.state.creating_auction ? (
                                            <button className="btn btn-primary" disabled>Loading....</button>
                                        ) : (
                                            <button className="btn btn-primary" onClick={(event => this.handleSubmit(event))}>Submit form</button>
                                        )}


                                    </div>



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

    handleStartingPriceChange(e) {
        e.target.setAttribute("class", "form-control is-valid");
        e.target.value = e.target.value.replace(",", ".");
    }


    async handleSubmit(e) {
        e.target.parentElement.firstElementChild.setAttribute("class", "row g-3 was-validated");
        let auction = {}
        if($("#input_title").val() === "" || $("#input_title").val().length > 200) {
            //alert("Invalid title.");
            this.props.add_alert({type: "danger", size: "sm", text: "Invalid title.", header: "", subtext: ""})
            return;
        }
        auction["title"] = $("#input_title").val();
        if(!/^(eur|usd)$/.test($("#select_currency").val())) {
            //alert("Currency is invalid.");
            this.props.add_alert({type: "danger", size: "sm", text: "Currency is invalid."})
            return;
        }
        auction["currency"] = $("#select_currency").val();
        if($("#input_starting_price.form-control.is-valid").length < 1) {
            //alert("Starting price is invalid.");
            this.props.add_alert({type: "danger", size: "sm", text: "Starting price is invalid."})
            return;
        }
        auction["starting_price"] = $("#input_starting_price.form-control.is-valid").val();
        if($("#validationTextarea").val() === "" || $("#validationTextarea").val().length > 1000) {
            //alert("Invalid description.")
            this.props.add_alert({type: "danger", size: "sm", text: "Invalid description."})
            return;
        }
        auction["description"] = $("#validationTextarea").val();
        auction["auction_type"] = $("#select_auction_type").val();
        if(Number($("#select_item_type").val()) < 1) {
            //alert("Item type is invalid.");
            this.props.add_alert({type: "danger", size: "sm", text: "Item type is invalid."})
            return;
        }
        auction["item_type"] = $("#select_item_type").val();
        if(Number($("#input_amount").val()) < 1 || Number($("#input_amount").val()) > 999) {
            //alert("Amount is invalid.");
            this.props.add_alert({type: "danger", size: "sm", text: "Amount is invalid."})
            return;
        }
        auction["amount"] = $("#input_amount").val();
        if($("#upload_thumbnail").get(0).files.length < 1) {
            //alert("Thumbnail is missing.");
            this.props.add_alert({type: "danger", size: "sm", text: "Thumbnail is missing.."})
            return;
        }
        if(((4 * Math.ceil((((await readFileAsync($("#upload_thumbnail").get(0).files[0])).length - 'data:image/png;base64,'.length) / 3))*0.5624896334383812)/1000) > 4000) {
            //alert("Image size cannot be larger than 4000 KB (4 MB).");
            this.props.add_alert({type: "danger", size: "sm", text: "Image size cannot be larger than 4000 KB (4 MB)."})
            return;
        }
        auction["thumbnail"] = await readFileAsync($("#upload_thumbnail").get(0).files[0]);
        if($("#upload_images").get(0).files.length < 1) {
            //alert("You need at least one image.");
            this.props.add_alert({type: "danger", size: "sm", text: "You need at least one image."})
            return;
        }
        if($("#upload_images").get(0).files.length > 12) {
            //alert("You cannot upload more than 12 images.");
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot upload more than 12 images."})
            return;
        }
        let files = $("#upload_images").get(0).files;
        let base64_imgs = [];
        for(let i = 0; i < files.length; i++) {
            let base64String = await readFileAsync(files[i]);
            let stringLength = base64String.length - 'data:image/png;base64,'.length;
            let sizeInKB = (4 * Math.ceil((stringLength / 3))*0.5624896334383812)/1000;
            if(sizeInKB > 4000) {
                //alert("Image size cannot be larger than 4000 KB (4 MB).");
                this.props.add_alert({type: "danger", size: "sm", text: "Image size cannot be larger than 4000 KB (4 MB)."})
                return;
            }
            base64_imgs.push(base64String);
        }
        auction["images"] = base64_imgs;
        if(auction["auction_type"] === "auction") {
            if (new Date($("#starting_time").val()) < new Date(new Date().getTime() + 90 * 1000)) {
                //alert("Starting time needs to be at least 2 minutes ahead.");
                this.props.add_alert({type: "danger", size: "sm", text: "Starting time needs to be at least 2 minutes ahead."})
                return;
            }
            if (new Date($("#starting_time").val()) > new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)) {
                //alert("Starting time cannot be greater than 1 day.");
                this.props.add_alert({type: "danger", size: "sm", text: "Starting time cannot be greater than 1 day."})
                return;
            }
            auction["starting_time"] = new Date($("#starting_time").val()).getTime();
            if (new Date($("#ending_time").val()) > new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60)) {
                //alert("Ending time cannot be greater than 7 days.");
                this.props.add_alert({type: "danger", size: "sm", text: "Ending time cannot be greater than 7 days."})
                return;
            }
            if (new Date($("#ending_time").val()) < new Date(new Date($("#starting_time").val()).getTime() + 2 * 24 * 60 * 60 * 1000 - 1000 * 60)) {
                //alert("Ending time needs to be at least 2 days greater than starting time.");
                this.props.add_alert({type: "danger", size: "sm", text: "Ending time needs to be at least 2 days greater than starting time."})
                return;
            }
            auction["ending_time"] = new Date($("#ending_time").val()).getTime();
        }
        if ($("#check_cash:checked, #check_bank_transfer:checked, #check_paypal:checked").length < 1) {
            //alert("You need to select at least one payment method.");
            this.props.add_alert({type: "danger", size: "sm", text: "You need at least one payment method."})
            return;
        }
        auction["cash"] = ($("#check_cash:checked").length > 0);
        auction["bank_transfer"] = ($("#check_bank_transfer:checked").length > 0);
        auction["paypal"] = ($("#check_paypal:checked").length > 0);
        auction["international"] = ($("#radio_international:checked").length > 0);
        if($("#checkbox_terms_and_conditions:checked, #checkbox_rules:checked, #checkbox_payment_reminder:checked").length != 3) {
            //alert("Please agree to our conditions.");
            this.props.add_alert({type: "danger", size: "sm", text: "Please agree to our conditions."})
            return;
        }
        console.log(auction);
        this.create_auction(auction);
    }


    create_auction(auction) {
        this.setState({creating_auction: true})
        const path = "/auctions/create";
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "auction_type": auction.auction_type,
                "bank_transfer": auction.bank_transfer,
                "cash": auction.cash,
                "amount": auction.amount,
                "currency": auction.currency,
                "description": auction.description,
                "images": auction.images,
                "international": auction.international,
                "item_type": auction.item_type,
                "paypal": auction.paypal,
                "starting_price": auction.starting_price,
                "thumbnail": auction.thumbnail,
                "title": auction.title,
                "unix_ending_time": auction.ending_time,
                "unix_starting_time": auction.starting_time
            })
        };
        fetch(this.props.session.ip+path, requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    //this.setState({error: nice_error})
                    //alert(nice_error[1]);
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    console.log(data.id)
                    this.setState({creating_auction: false})
                    window.location.href = "/auction/id/"+data.id;
                }
                this.setState({creating_auction: false});
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({creating_auction: false})
            });
    }

}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}