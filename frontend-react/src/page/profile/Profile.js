import React from "react";

import "./profile.css";
import {NavLink, Redirect} from "react-router-dom";
import $ from 'jquery'
import {decode as base64_decode, encode as base64_encode} from 'base-64';

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                address_addition: "",
                birth_date: "",
                city: "",
                country: "",
                description: "",
                email: "",
                first_name: "",
                house_number: "",
                last_name: "",
                password: "",
                phone_number: "",
                postal_code: 0,
                profile_picture: "",
                street_name: "",
                unix_creation_time: 0,
                user_id: 0,
            },
            selectedFile:null,
            followers: 0, // TODO: get followers
            is_loading: true,
            has_error: false,
            on_edit: false,
            failedEditing:false
        }
    }

    updateProfile(event)
    {

        this.setState({on_edit:false});
        this.setState({is_loading:true});
        let phone_number =$("#phone-number").val();
        let description = $("#description").val();
        let street= $("#street-name").val();
        let house_number= $("#house-number").val();
        let adress_add =$("#adress-addition").val();
        let city=$("#city").val();
        let postal_code=$("#postal-code").val();
        let country=$("#country").val();

        if(phone_number=="")
        {
            phone_number=this.state.user.phone_number;
        }
        if(description=="")
        {
            description=this.state.user.description;
        }
        if(street=="")
        {
            street=this.state.user.street;
        }
        if(house_number=="")
        {
            house_number=this.state.user.house_number;
        }
        if(adress_add=="")
        {
            adress_add=this.state.user.address_addition;
        }
        if(city=="")
        {
            city=this.state.user.city;
        }
        if(postal_code=="")
        {

            postal_code=this.state.user.postal_code;
        }
        if(country=="")
        {
            country=this.state.user.country;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'session_key':this.props.session.key },

            body: JSON.stringify({
                address_addition: adress_add,
                city: city,
                country: country,
                description:description,
                house_number: house_number,
                phone_number:phone_number,
                postal_code: postal_code,
                profile_picture:this.state.user.profile_picture,
                street_name: street,
            })
        };
        fetch(this.props.session.ip+'/account/user/edit', requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    alert(nice_error[1]);

                } else {

                    this.setState({is_loading: false})
                    this.setState({on_edit: false})
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
                            password: data.password,
                            phone_number: data.phone_number,
                            postal_code: data.postal_code,
                            profile_picture:data.profile_picture,
                            street_name: data.street_name,
                            unix_creation_time: data.unix_creation_time,
                            user_id: data.user_id},});
                }
                console.log(data)
                this.setState({is_loading: false});
                this.setState({on_edit: false});
                this.setState({has_error: false});
                
            })

            .catch(error => {
                console.error('There was an error!', error);
                alert(error);
                this.setState({is_loading: false})
                this.setState({on_edit: false})
            });




    }

    componentDidMount() {
        this.setState({error: null})
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key},
        };
        this.setState({is_loading: true})
        fetch(this.props.session.ip+'/account/user/', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
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
                            password: data.password,
                            phone_number: data.phone_number,
                            postal_code: data.postal_code,
                            profile_picture: data.profile_picture,
                            street_name: data.street_name,
                            unix_creation_time: data.unix_creation_time,
                            user_id: data.user_id
                        },});
                }
                console.log(this.state.user)
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
            $('div.jumbotron.prof-jumbo').addClass("prof-small-jumbo")
        } else {
            $('div.jumbotron.prof-jumbo').removeClass("prof-small-jumbo")
        }
    }

    fileSelectedHandler = async (event)=>{
        this.setState({
            selectedFile: event.target.files[0]
        })
        const base64= await this.convertBase64(event.target.files[0]);
        this.setState({user:{
                profile_picture: base64,
            }})
    }
    convertBase64=(file)=>{
        return new Promise((resolve,reject)=>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload=()=>{
                resolve(fileReader.result);
            };
            fileReader.onerror=(error)=>
                reject(error);

        })
    }

    render() {

        return(
            <div className="Profile">
                <div className="jumbotron prof-jumbo">
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
                            (//not editing
                                <div>{!(this.state.on_edit) ? (
                                <div className="profile-content">
                                    {this.update_jumbo(true)}
                                <h1 className="display-4">Hello, {this.state.user.first_name}!</h1>
                                <p className="lead">{this.state.user.description ? (this.state.user.description) : ("Welcome to your profile! Here you can edit your appearance and manage your account.")}</p>
                                <div className="list-and-picture">
                                    <ul className="list-group list-group-flush small-list-left">
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">First Name:</span><span>{this.state.user.first_name}</span>
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Last Name:</span>{this.state.user.last_name}
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Birth Date:</span>{this.state.user.birth_date}
                                        </li>
                                        <li className="list-group-item"><span
                                            className="text-muted profile-list-annotation">Phone Number:</span>{this.state.user.phone_number}
                                        </li>
                                        <li className="list-group-item" style={{padding: "0"}}/>
                                    </ul>
                                    <img className="small-list-right profile-picture-list" alt="profile_picture"
                                         src={this.state.user.profile_picture != null && this.state.user.profile_picture != ""  ? (this.state.user.profile_picture) : (window.location.origin + "/images/design/empty_profile_picture.png")}></img>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">Street Name:</span>{this.state.user.street_name}
                                    </li>
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">House Number:</span>{this.state.user.house_number}
                                    </li>
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">Address Addition:</span>{this.state.user.address_addition}
                                    </li>
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">City:</span>{this.state.user.city}
                                    </li>
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">Postal Code:</span>{this.state.user.postal_code}
                                    </li>
                                    <li className="list-group-item"><span
                                        className="text-muted profile-list-annotation">Country:</span>{this.state.user.country}
                                    </li>
                                    <li className="list-group-item">
                                        
                                        <div className="profile-edit-container">
                                            
                                            <button className="profile-edit secret-button" onClick={()=>{this.setState({on_edit:true})}}>
                                                <span>Edit profile </span>
                                                <svg width="20px" height="20px" viewBox="0 0 18 18" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                                <div className="jumbo-footer">
                                    <button className="secret-button"><span className="text-muted">{this.state.followers} Followers</span></button>
                                </div>
                            </div>
                                    )://editing

                                    <div> {this.state.on_edit?
                                        (<div className="profile-content">
                                            {this.update_jumbo(true)}
                                            <h1 className="display-4">Hello, {this.state.user.first_name}!</h1>
                                            <p className="lead">Here you can edit your appearance!</p>


                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Description:</span>
                                                    <textarea id="description" rows="4" cols="50" name="description" placeholder={this.state.user.description} />
                                                </li>

                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Phone Number:</span>
                                                    <input id="phone-number" type="tel" name="phone-number" placeholder={this.state.user.phone_number}/>
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Street Name:</span>
                                                    <input id="street-name" type="text" name="street-name" placeholder={this.state.user.street_name}/>

                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">House Number:</span>
                                                    <input id="house-number" type="number" name="house-number" placeholder={this.state.user.house_number} />
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Address Addition:</span>
                                                    <input id="adress-addition" type="text" name="adress-addition" placeholder={this.state.user.address_addition} />
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">City:</span>
                                                    <input id="city" type="text" name="city" placeholder={this.state.user.city} />
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Postal Code:</span>
                                                    <input id="postal-code" type="number" name="postal-code" placeholder={this.state.user.postal_code} />
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Country:</span>
                                                    <input id="country" type="text" name="country" placeholder={this.state.user.country} />
                                                </li>
                                                <li className="list-group-item"><span
                                                    className="text-muted profile-list-annotation">Profile Picture:</span>
                                                    <input type="file" accept="image/*" onChange={this.fileSelectedHandler}/>
                                                </li>

                                                <li className="list-group-item">

                                                    <div className="profile-edit-container">

                                                        <button className="profile-edit secret-button" onClick={this.updateProfile.bind(this) }>
                                                            <span>Finished editing </span>
                                                            <svg width="20px" height="20px" viewBox="0 0 18 18" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                                                        </button>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="jumbo-footer">
                                                <button className="secret-button"><span className="text-muted">{this.state.followers} Followers</span></button>
                                            </div>

                                        </div>):(<Redirect to="/profile"/>)
                                    }</div>

                                }</div>


                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }

}