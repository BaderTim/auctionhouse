import React from "react";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import BanButton from "./BanButton";

export default class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            has_error: false,
            total_users:0,
            total_sellers:0,
            total_banned_users:0,
            total_bets:0,
            total_auctions:0
        }
    }

    componentDidMount() {
        this.setState({error: null})
        let requestOptions = {
            method: 'GET',
            headers: {'session_key': this.props.session.key},
        };
        this.setState({is_loading: true})
        fetch(this.props.session.ip+'/statistic/total_users', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                } else {
                   this.setState({total_users:data})
                   
                     fetch(this.props.session.ip+'/statistic/total_sellers', requestOptions)
                        .then(async response => {
                            const data2 = await response.json();
                            // check for error response
                            if (!response.ok) {
                                const nice_error = data2.error.split(/ (.+)/)
                                this.setState({error: nice_error})
                                alert(nice_error[1]);
                            } else {
                            this.setState({total_sellers:data2})
                            
                                 fetch(this.props.session.ip+'/statistic/total_banned_users', requestOptions)
                                    .then(async response => {
                                        const data3 = await response.json();
                                        // check for error response
                                        if (!response.ok) {
                                            const nice_error = data3.error.split(/ (.+)/)
                                            this.setState({error: nice_error})
                                            alert(nice_error[1]);
                                        } else {
                                        this.setState({total_banned_users:data3})
                                        
                                             fetch(this.props.session.ip+'/statistic/get_total_bets', requestOptions)
                                                .then(async response => {
                                                    const data4 = await response.json();
                                                    // check for error response
                                                    if (!response.ok) {
                                                        const nice_error = data4.error.split(/ (.+)/)
                                                        this.setState({error: nice_error})
                                                        alert(nice_error[1]);
                                                    } else {
                                                    this.setState({total_bets:data4})
                                                    
                                                         fetch(this.props.session.ip+'/statistic/get_total_auctions', requestOptions)
                                                            .then(async response => {
                                                                const data5 = await response.json();
                                                                // check for error response
                                                                if (!response.ok) {
                                                                    const nice_error = data5.error.split(/ (.+)/)
                                                                    this.setState({error: nice_error})
                                                                    alert(nice_error[1]);
                                                                } else {
                                                                this.setState({total_auctions:data5})
                                                                
                                    
                                                                }
                                                                console.log(data5)
                                                                
                                                            })
                                                            .catch(error => {
                                                                console.error('There was an error!', error);
                                                                this.setState({error: error.name+": "+error.message})
                                                                this.setState({is_loading: false})
                                                            });
                        
                                                    }
                                                    console.log(data4)
                                                    
                                                })
                                                .catch(error => {
                                                    console.error('There was an error!', error);
                                                    this.setState({error: error.name+": "+error.message})
                                                    this.setState({is_loading: false})
                                                });
            
            
                                        }
                                        console.log(data3)
                                        
                                    })
                                    .catch(error => {
                                        console.error('There was an error!', error);
                                        this.setState({error: error.name+": "+error.message})
                                        this.setState({is_loading: false})
                                    });

                            }
                            console.log(data2)
                            
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                            this.setState({error: error.name+": "+error.message})
                            this.setState({is_loading: false})
                        });

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
                                    <h1 className="display-4">Statistic</h1>
                                    <p className="lead">Overview over all statistics</p>
                                    <hr/>
                                    <div class="card-group">
                                        <div class="card"style={{width: "18rem", marginLeft:"15px"}} >
                                        
                                        <div class="card-body">
                                            <h5 class="card-title">Total Users</h5>
                                            <h2 >{this.state.total_users}</h2>
                                            <p class="card-text">Amount of Users on auction-dw</p>
                                            <NavLink exact to="/statistics/allusers" className="navbar-brand" className="btn btn-primary">View all users</NavLink>
                                        </div>
                                        </div>
                                        <div class="card"style={{width: "18rem", marginLeft:"15px"}} >
                                        
                                        <div class="card-body">
                                            <h5 class="card-title">Total Sellers</h5>
                                            <h2 >{this.state.total_sellers}</h2>
                                            <p class="card-text">Amount of Sellers on auction-dw</p>
                                            <NavLink to="/statistics/allusers" className="navbar-brand" className="btn btn-primary">View all sellers</NavLink>
                                        </div>
                                        </div>
                                        <div class="card"style={{width: "18rem", marginLeft:"15px"}} >
                                        <div class="card-body">
                                            <h5 class="card-title">Total Banned users</h5>
                                            <h2 >{this.state.total_banned_users}</h2>
                                            <p class="card-text">Amount of banned Users on auction-dw</p>
                                            <NavLink  to="/statistics/allusers" className="navbar-brand" className="btn btn-primary">View all banned users</NavLink>
                                        </div>
                                        </div>

                                    </div>
                                    <div class="card-group" style={{marginTop:"15px"}}>
                                        <div class="card"style={{width: "18rem", marginLeft:"15px"}} >
                                        
                                        <div class="card-body">
                                            <h5 class="card-title">Total Auction</h5>
                                            <h2 >{this.state.total_auctions}</h2>
                                            <p class="card-text">Amount of Auctions on auction-dw</p>
                                            <NavLink  to="/statistics/allauctions" className="navbar-brand" className="btn btn-primary">View all auctions</NavLink>
                                        </div>
                                        </div>
                                        <div class="card"style={{width: "18rem", marginLeft:"15px"}} >
                                        
                                        <div class="card-body">
                                            <h5 class="card-title">Total Bets</h5>
                                            <h2 >{this.state.total_bets}</h2>
                                            <p class="card-text">Amount of Bets on auction-dw</p>
                                            
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

}