import React from "react";

import {NavLink} from "react-router-dom";
import $ from 'jquery'
import UserFilter from "../../component/utils/UserFilter";
import UserListElement from "./UserListElement";

import LoadMore from "../../component/utils/LoadMore";
export default class UserOverview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            server_time: 0,
            is_loading: true,
            has_error: false,
            isActive:"allusers",
            users:[],
            filter:{
                amount: 50,
                offset: 0,
                search_by_name: "",
                sorting_order: ""
              }
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
    async getUsers(active)
    {
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filterDto:{
                    
                        amount: this.state.filter.amount,
                        offset: this.state.filter.offset,
                        search_by_name: this.state.filter.search_by_name,
                        sorting_order: this.state.filter.sorting_order
                      
                }
            })}
        
        this.setState({error: null})
        this.setState({is_loading: true});
        if( active==="allusers")
        {
            fetch(this.props.session.ip+'/account/admin/get_all_users', requestOptions)
             .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                const nice_error = data.error.split(/ (.+)/)
                this.setState({error: nice_error})
                alert(nice_error[1]);
            } else {
                
                let new_users = [];
                    for(let i = 0; i < data.length; i++) {
                        let admin= data[i].admin;
                        let country = data[i].country;
                        let first_name = data[i].first_name;
                        let last_name = data[i].first_name;
                        let profile_picture = data[i].profile_picture;
                        let user_id= data[i].user_id;
                        console.log(this.props.session.key)
                        new_users.push({
                            admin: admin,
                            country: country,
                            first_name:first_name,
                            last_name:last_name,
                            profile_picture: profile_picture,
                            user_id: user_id

                        })
                    }

                   
                    console.log(new_users)
                    console.log(data)
                    this.setState({users:[]})
                     this.setState({users: new_users})
                
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
         else if(active==="allsellers")
        {

            let requestOptions2 = {
                method: 'POST',
                headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filterDto:{
                        
                            amount: this.state.filter.amount,
                            offset: this.state.filter.offset,
                            search_by_name: this.state.filter.search_by_name,
                            sorting_order: this.state.filter.sorting_order
                          
                    }
                })}
            fetch(this.props.session.ip+'/account/admin/get_all_sellers', requestOptions2)
             .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                const nice_error = data.error.split(/ (.+)/)
                this.setState({error: nice_error})
                alert(nice_error[1]);
            } else {
                console.log("data"+data)
                let new_users = [];
                    for(let i = 0; i < data.length; i++) {
                        let admin= data[i].seller.admin;
                        let country = data[i].seller.country;
                        let first_name = data[i].seller.first_name;
                        let last_name = data[i].seller.first_name;
                        let profile_picture = data[i].seller.profile_picture;
                        let user_id= data[i].seller.user_id;
                        
                        new_users.push({
                            admin: admin,
                            country: country,
                            first_name:first_name,
                            last_name:last_name,
                            profile_picture: profile_picture,
                            user_id: user_id

                        })
                    }

                   
                    console.log(new_users)
                    console.log(data)
                    this.setState({users:[]})
                     this.setState({users: new_users})
                
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
        else if(active==="allbanned"){
           
            fetch(this.props.session.ip+'/account/admin/get_all_banned_users', requestOptions)
             .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                const nice_error = data.error.split(/ (.+)/)
                this.setState({error: nice_error})
                alert(nice_error[1]);
            } else {
                
                let new_users = [];
                    for(let i = 0; i < data.length; i++) {
                        let admin= data[i].admin;
                        let country = data[i].country;
                        let first_name = data[i].first_name;
                        let last_name = data[i].last_name;
                        let profile_picture = data[i].profile_picture;
                        let user_id= data[i].user_id;
                        
                        new_users.push({
                            admin: admin,
                            country: country,
                            first_name:first_name,
                            last_name:last_name,
                            profile_picture: profile_picture,
                            user_id: user_id

                        })
                    }

                   
                    console.log(new_users)
                    
                    this.setState({users:[]})
                     this.setState({users: new_users})

                
            }
          
            this.setState({is_loading: false})
        })
        .catch(error => {
            console.error('There was an error!', error);
            this.setState({error: error.name+": "+error.message})
            this.setState({is_loading: false})
        });
        }
        console.log(this.state.users)
        }

    update_jumbo(make_smaller) { // small = true, big = false
        if(make_smaller) {
            $('div.jumbotron.about-jumbo').addClass("about-small-jumbo")
        } else {
            $('div.jumbotron.about-jumbo').removeClass("about-small-jumbo")
        }
    }


    

    render() {

        return(
            <div className="Chat">
                <div className="jumbotron about-jumbo">
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
                            (  <div className="about-content">

                                    {this.update_jumbo(true)}
                                    
                                    <h1 className="display-4">User Overvies</h1>
                                    <p className="lead">
                                        Overview over all users. You can ban users if you wish to.
                                    </p>
                                    <hr/>
                                    <UserFilter refresh_handler={this.refresh_handler} is_loading={this.state.is_loading} add_alert={this.props.add_alert} />
                                    <div class="card" style={{marginBottom:"15px"}}>
                                    <h5 class="card-header">
                                            <ul class="nav nav-tabs">
                                                <li class="nav-item">
                                                    {this.state.isActive==="allusers"?
                                                       ( <button  class="nav-link active" aria-current="page" onClick={()=>{ this.setState({isActive:"allusers"}); this.getUsers("allusers") }}>All Users </button>)
                                                       :(
                                                        <button class="nav-link " aria-current="page" onClick={()=>{ this.setState({isActive:"allusers"});this.getUsers("allusers")
                                                    }}>All Users </button>
                                                       )}
                                                </li>
                                                <li class="nav-item">
                                                    {this.state.isActive==="allsellers"?
                                                       ( <button  class="nav-link active" aria-current="page" onClick={()=>{ this.setState({isActive:"allsellers"});this.getUsers("allsellers")
                                                    }}>All Sellers </button>)
                                                       :(
                                                        <button  class="nav-link " aria-current="page" onClick={()=>{ this.setState({isActive:"allsellers"});this.getUsers("allsellers")
                                                    }}>All Sellers </button>
                                                       )}
                                                </li>
                                                <li class="nav-item">
                                                    {this.state.isActive==="allbanned"?
                                                       ( <button  class="nav-link active" aria-current="page" onClick={()=>{ this.setState({isActive:"allbanned"}); this.getUsers("allbanned") }}>All banned users  </button>)
                                                       :(
                                                        <button  class="nav-link " aria-current="page" onClick={()=>{ this.setState({isActive:"allbanned"}); this.getUsers("allbanned") }}>All banned users </button>
                                                       )}
                                                </li>
                                                </ul>
                                        </h5>
                                        <div class="card-body"  >
                                        
                                        <div>
                                    {this.state.users.length > 0 ? (<div style={{marginTop: "25px"}}>
                                        <Elements session ={this.props.session} users= {this.state.users}/>
                                        <div style={{height: "15px"}}/>
                                        <LoadMore end={this.state.end} load_more={this.load_more} offset={this.state.offset} base_offset={this.state.base_offset}/>
                                        <div style={{height: "15px"}}/>
                                    </div>)
                                        :
                                        (<div>
                                            <br/>
                                            <p className="lead fw-bold">There are no users in the database.</p>
                                            <br/>
                                            <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
                                        </div>)}
                                </div>

                                        </div></div>
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

const Elements = (props) => {
    console.log(props.users);
  const listItems = props.users.map((user) => {
      
    return (<UserListElement
        session={props.session}
        user_id={user.user_id}
        profile_picture={user.profile_picture}
        first_name={user.first_name}
        last_name={user.last_name}
        country={user.country}
        
                                                />);
  });

  return (<div>
                {listItems}
            </div>);
            };
