import React from "react";
//registrierung funktioniert nicht 
//todo ,redirect, bei falscher registirerung failed to fetch 
//potenzielle todo: länder dropdown , validation ob adresse angegeben 
import "./sellerregistration.css";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import "./registration.css";
import * as EmailValidator from 'email-validator';
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Redirect } from 'react-router-dom'
import TextField from "@material-ui/core/TextField";
import moment from "moment";

export default class Registration extends React.Component {

    constructor(props) {
        super(props);
       
        this.state = {
            user: {
                address_addition: "",
                birth_date: "",
                city: "",
                country: "",
                email: "",
                first_name: "",
                house_number: "",
                last_name: "",
                password: "",
                phone_number: "",
                postal_code:"",
                street_name: "",
                passwordConfirmed: "",
                termsChecked:"",
                dspChecked:""
            },
            register:false,
            is_loading: true,
            has_error: false,
            pictures:"",
            
        }
    }
    

    onInputPwChange(event) {
        let obj = $("#password");
        let obj2 = $("#password2");
        let div =$("#pwdiv")  ;
        let div2 =$("#pw2div")  ;                                  
        if(obj.val().length > 3) {
        
                div.addClass( "col-md-12 was-validated");
       
            if(obj.val()!=obj2.val())
            {
                div2.removeClass("was-validated");
               
            }
            if(obj.val()==obj2.val())
            {
                div2.addClass("col-md-12 was-validated"); 
            }
        } else {
           
            div.removeClass("was-validated");
            if(obj.val()!=obj2.val())
            {
                div2.removeClass("was-validated");
  
        }
    }
}
    onPw2Change(event) {
        let obj = $("#password");
        let obj2 = $("#password2");
        let div2 =$("#pw2div")  ; 
        if(obj2.val().length > 3 &&(obj.val()===obj2.val())) {
          
                div2.addClass("col-md-12 was-validated"); 
            
        } else {
           
        
            div2.addClass("col-md-12"); 
           
        }
    }
   

    componentDidMount() {
            this.setState({is_loading: false})
            this.setState({has_error: false})
                
                console.log(this.props.session)
    }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.sellerregistration-jumbo').addClass("sellerregistration-small-jumbo")
        } else {
            $('div.jumbotron.sellerregistration-jumbo').removeClass("sellerregistration-small-jumbo")
        }
    }


     register(event){
        event.target.parentElement.firstElementChild.setAttribute("class", "row g-3 was-validated");
        if($("#first_name").val() === "" || $("#first_name").val().length > 50) {
            alert("Invalid first name.");
            return;
        }
        let firstName = $("#first_name").val();
        if($("#last_name").val() === "" || $("#last_name").val().length > 50) {
            alert("Invalid last name.");
            return;
        }
        let lastName = $("#last_name").val();

        var today = new Date(),
        date = [today.getFullYear()-18 , (today.getMonth()+1) , today.getDate()];

        let bday = $("#birth_date");
        let split= bday.val().split("-");
        if(!(((split[0]<date[0])&&(split[0]>1910))||((split[0]==date[0])&&(split[1]<=date[1])&&(split[2]<=date[2]))))
        {
            alert("You have to be over 18");
            return;
         }

        let birthDate = $("#birth_date").val();
        if(!EmailValidator.validate( $("#email").val())) {
            alert("Invalid email.");
            return;
        }
        let mail = $("#email").val();
        if(!isValidPhoneNumber( $("#phone_number").val())) {
            alert("Invalid phone number.");
            return;
        }
        let tel = $("#phone_number").val();
        if($("#street_name").val() === "" || $("#street_name").val().length > 150) {
            alert("Invalid street name.");
            return;
        }
        let street = $("#street_name").val();
        if($("#house_number").val() === "" || Number($("#house_number").val())<0) {
            alert("Invalid house number.");
            return;
        }
        let house_number = $("#house_number").val();
        let addressAdd = $("#adress_addition").val();
        if($("#city").val() === "" || $("#city").val().length > 150) {
            alert("Invalid city name.");
            return;
        }
        let city = $("#city").val();
        if($("#postal_code").val() === "" || Number($("#postal_code").val()) <99) {
            alert("Invalid postal code.");
            return;
        }
        let plz = $("#postal_code").val();
        if($("#country").val() === "" || $("#country").val().length > 150) {
            alert("Invalid country.");
            return;
        }
        let country = $("#country").val();

        let password = $("#password").val();
        if($("#terms:checked, #checkbox_dsp:checked").length != 2) {
            alert("Please agree to our conditions.");
            return;
        }
        this.setState({register:true})
        const requestOptions = {
            method: 'POST',
            headers: { 'Accept':'application/json',
             'Content-Type': 'application/json', },
            body: JSON.stringify({
                address_addition: addressAdd, birth_date: birthDate, city: city,country: country,email: mail,first_name: firstName,house_number: house_number,last_name: lastName,password: password, phone_number: tel,postal_code: Number( plz),street_name: street,})
        };
        
        console.log(requestOptions.body)
        console.log(this.props.session)

        fetch(this.props.session.ip+'/account/user/register', requestOptions)
            .then(async response => {
                const data = await response.json();
                
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    alert(nice_error[1]);
                    this.setState({register:false});
                    
                } else {
                    this.props.session.key = data.key;
                    this.props.session.duration = Number(data.expiring_date);
                    this.props.session.user_id = data.user_id;
                    this.props.session.seller_id = -1;
                    this.props.session.admin=data.admin;
                    localStorage.setItem("auctionhouse_session", JSON.stringify(this.props.session));
                    this.setState({register:false});
                    window.location.reload(false);                    
                }
                console.log(data)
                
            })

            .catch(error => {
                console.error('There was an error!', error);
                alert(error);
                this.setState({register:false});
            
            });

}

    render() {

        return(
            <div>{this.props.session.user_id!=-1?<Redirect to="/"/>:(
            <div className="SellerRegistration">
                <div className="jumbotron sellerregistration-jumbo">
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
                            (<div className="registration-content">
                                    {this.update_jumbo(true)}
                                    <h1 className="display-4">Registration</h1>
                                    <p className="lead">Do you want to buy or sell on dw-auction? Fill in the form to registrate yourself now!</p>
                                    <hr/>
                                    <form  className="row g-2">
                                        <div className="col-md-4" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="first_name" className="form-label">First Name:</label>
                                                    <input type="text" className="form-control" id="first_name" aria-describedby="first_name"
                                                        onChange={(e) => {(e.target.value === null ?
                                                            (e.target.parentElement.setAttribute("class", "col-md-4")) :
                                                            (e.target.parentElement.setAttribute("class", "col-md-4 was-validated")))}} required/>
                                            <div id="fist_name_feetback" className="invalid-feedback">Please provide a valid first name.</div>
                                        </div>

                                        <div className="col-md-4" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="last_name" className="form-label">Last Name:</label>
                                            <input type="text" className="form-control" id="last_name" aria-describedby="last_name"
                                                   onChange={(e) => {(e.target.value === null ?
                                                       (e.target.parentElement.setAttribute("class", "col-md-4")) :
                                                       (e.target.parentElement.setAttribute("class", "col-md-4 was-validated")))}} required/>
                                            <div id="last_name_feedback" className="invalid-feedback">Please provide a valid last name.</div>
                                        </div>
                                        <div className="col-md-4" style={{paddingLeft: "16px"}}></div>
                                        <div className="col-auto" style={{paddingLeft: "16px"}}>
                                        
                                        <TextField
                                                style={{paddingLeft: "16px"}}
                                                id="birth_date"
                                                label="Birth date:"
                                                type="date"
                                                defaultValue={moment().add("-18", "years").format('YYYY-MM-DD')}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            
                                        </div>
                                        <div className="col-md-6" style={{paddingLeft: "16px"}}></div>
                                        <div className="col-md-12" style={{paddingLeft: "16px"}}><hr/></div>
                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control"  id="email" aria-describedby="email"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       ( EmailValidator.validate(e.target.value))?
                                                               (e.target.setAttribute("class", "form-control is-valid") ):
                                                               (e.target.setAttribute("class", "form-control is-invalid")))}} required/>

                                            <div id="email_feedback" className="invalid-feedback">Please provide a valid email.</div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                            <input type="tel" className="form-control"  id="phone_number" aria-describedby="phone_number"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       ( isValidPhoneNumber(e.target.value))?
                                                               (e.target.setAttribute("class", "form-control is-valid") ):
                                                               (e.target.setAttribute("class", "form-control is-invalid")))}} required/>

                                            <div id="phone_number_feedback" className="invalid-feedback">Please provide a valid phone number.</div>
                                        </div>
                                        <div className="col-md-12" style={{paddingLeft: "16px"}}><hr/></div>
                                        <div className="col-md-6" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="street_name" className="form-label">Street Name:</label>
                                                    <input type="text" className="form-control" id="street_name" aria-describedby="street_name"
                                                        onChange={(e) => {(e.target.value === null ?
                                                            (e.target.parentElement.setAttribute("class", "col-md-6")) :
                                                            (e.target.parentElement.setAttribute("class", "col-md-6 was-validated")))}} required/>
                                            <div id="street_name_feetback" className="invalid-feedback">Please provide a valid street name.</div>
                                        </div>
                                        <div className="col-md-2">
                                            <label htmlFor="house_number" className="form-label">House Number</label>
                                            <input type="text" className="form-control" defaultValue="1" id="house_number" aria-describedby="house_number"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       (/^([0-9]+)$/.test(e.target.value) ?
                                                           (Number(e.target.value) >= 0  ?
                                                               (e.target.setAttribute("class", "form-control is-valid")) :
                                                               (e.target.setAttribute("class", "form-control is-invalid"))) :
                                                           (e.target.setAttribute("class", "form-control is-invalid"))))}} required/>
                                            <div id="house_number_feedback" className="invalid-feedback">Please provide a valid house number.</div>
                                        </div>
                                        <div className="col-md-5" style={{paddingLeft: "16px"}}>
                                            <label htmlFor="adress_addition" className="form-label">Address addition:</label>
                                            <input type="text" className="form-control" id="adress_addition" aria-describedby="adress_addition"
                                                   />
                                        </div>
                                        <div className="col-md-7" style={{paddingLeft: "16px"}}></div>
                                        <div className="col-md-2">
                                            <label htmlFor="postal_code" className="form-label">Postal code:</label>
                                            <input type="text" className="form-control" defaultValue="1" id="postal_code" aria-describedby="postal_code"
                                                   onChange={(e) => {(e.target.value === "" ?
                                                       (e.target.setAttribute("class", "form-control is-invalid")) :
                                                       (/^([0-9]+)$/.test(e.target.value) ?
                                                           (Number(e.target.value) >= 3  ?
                                                               (e.target.setAttribute("class", "form-control is-valid")) :
                                                               (e.target.setAttribute("class", "form-control is-invalid"))) :
                                                           (e.target.setAttribute("class", "form-control is-invalid"))))}} required/>
                                            <div id="postal_code_feedback" className="invalid-feedback">Please provide a valid postal code.</div>
                                        </div>
                                        <div className="col-md-5" >
                                            <label htmlFor="city" className="form-label">City:</label>
                                                    <input type="text" className="form-control" id="city" aria-describedby="city"
                                                        onChange={(e) => {(e.target.value === null ?
                                                            (e.target.parentElement.setAttribute("class", "col-md-5")) :
                                                            (e.target.parentElement.setAttribute("class", "col-md-5 was-validated")))}} required/>
                                            <div id="city_feetback" className="invalid-feedback">Please provide a valid city name.</div>
                                        </div>
                                        <div className="col-md-5" >
                                            <label htmlFor="country" className="form-label">Country:</label>
                                                    <input type="text" className="form-control" id="country" aria-describedby="country"
                                                        onChange={(e) => {(e.target.value === null ?
                                                            (e.target.parentElement.setAttribute("class", "col-md-5")) :
                                                            (e.target.parentElement.setAttribute("class", "col-md-5 was-validated")))}} required/>
                                            <div id="country_feetback" className="invalid-feedback">Please provide a valid country name.</div>
                                        </div>
                                        <div className="col-md-12" style={{paddingLeft: "16px"}}><hr/></div>
                                        <div class="col-md-12" id="pwdiv">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="Password" onChange={this.onInputPwChange.bind(this)}/>
                                        </div>
                                        
                                        <div class="col-md-12" id="pw2div">
                                            <label for="password2" >Repeat password</label>
                                            <input type="password" class="form-control" id="password2" placeholder="Password" onChange={this.onPw2Change.bind(this)}/>
                                        </div>
                                 
                          
                                        <div className="form-check mb-3" style={{paddingLeft: "16px"}}>
                                                <input type="checkbox" className="form-check-input" id="terms" required/>
                                                <label className="form-check-label" htmlFor="checkbox_terms">I have read the<NavLink  to="/conditions"> Terms & Conditions</NavLink>  and agree with them.</label>
                                        </div>
                                        <div className="form-check mb-3" style={{paddingLeft: "16px"}}>
                                                <input type="checkbox" className="form-check-input" id="checkbox_dsp" required/>
                                                <label className="form-check-label" htmlFor="checkbox_rules">I have read the<NavLink to="/conditions"> data secure policy</NavLink> and agree with them .</label>
                                        </div>
                                    
                                    </form>
                                    {this.state.register ? (
                                            <button className="btn btn-primary" disabled>Loading....</button>
                                        ) : (
                                            <button className="btn btn-primary" onClick={(event => this.register(event))}>Register</button>
                                        )}
                                        <div className="form-check mb-12" style={{paddingLeft: "16px"}}></div>
                            </div>
                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
            )}</div>
        )
    }


   
}