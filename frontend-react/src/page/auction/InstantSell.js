import React from "react";
//this.props.match.params.auctionid
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import { withRouter } from 'react-router-dom';

import BettingField from "./BettingField";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


class InstantSell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            has_error: false,
            auctionId: this.props.match.params.auctionid,
            auction:{
                auction_id: 0,
                seller_id: 0,
                title: "",
                description: "",
                amount: 0,
                item_type: "",
                auction_type: "",
                starting_price: 0,
                currency: "",
                current_price: 0,
                unix_ending_time: 0,
                unix_starting_time: 0,
                unix_creation_time: 0,
                thumbnail: null,
                images: [],
                bank_transfer: null,
                paypal: null,
                cash: null,
                international: null,
                country: "",
                cost: 0

            },
            auctionOnWachlist:false,
            bet:false,
            active_pic:null,
            contactSeller:false,
            sellerUserId:null,
            seller:{
                first_name:null,
                last_name:null,
                country:null,
                description:null
            }
        }
    }
    

    componentDidMount() {
        
        this.setState({error: null})
        if(this.props.session.key===""||this.props.session.key===null)
        {var requestOptions = {
            method: 'Post',
            headers: {  'Accept':'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify({id:this.state.auctionId})
        };}
        else{
             var requestOptions = {
                method: 'Post',
                headers: {  'Accept':'application/json',
                'Content-Type': 'application/json',       
                    'session_key': this.props.session.key},
                body: JSON.stringify({id:this.state.auctionId})};
        }
        this.setState({is_loading: true})
        fetch(this.props.session.ip+'/auctions/id', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);

                } else {
                    this.setState({auction:{

                            auction_id: data.auction_id,
                            seller_id: data.seller_id,
                            title: data.title,
                            description: data.description,
                            amount: data.amount,
                            item_type: data.item_type,
                            auction_type: data.auction_type,
                            starting_price: data.starting_price,
                            currency: data.currency,
                            current_price: data.current_price,
                            unix_ending_time: data.unix_ending_time,
                            unix_starting_time: data.unix_starting_time,
                            unix_creation_time: data.unix_creation_time,
                            thumbnail: data.thumbnail,
                            images: data.images,
                            bank_transfer: data.bank_transfer,
                            paypal: data.paypal,
                            cash: data.cash,
                            international: data.international,
                            country: data.country,
                            cost: data.cost

                        }

                    
                    })
                    if(data.images!==null)
                   { this.setState({active_pic: data.images[0]})
                    }
                    
                    let requestOptions2 = {
                        method: 'POST',
                        headers: { "accept": "application/json",'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            
                                id:this.state.auction.seller_id
                                
                              
                        })
                        };
                        console.log(this.props.auction_id)
                      
                    fetch(this.props.session.ip+"/account/seller/id", requestOptions2)
                        .then(async response => {
                            const data = await response.json();
                            // check for error response
                            if (!response.ok) {
                                console.log(data)
                                //this.setState({error: nice_error})
                               
                            } else {
                               
                                this.setState({sellerUserId: Number(data.id)})
                                
                                let requestOptions3 = {
                                    method: 'POST',
                                    headers: { "accept": "application/json",'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        
                                            id:this.state.sellerUserId,
                                          
                                    })
                                    };
                                    
                                  
                                fetch(this.props.session.ip+"/account/user/id", requestOptions3)
                                    .then(async response => {
                                        const data = await response.json();
                                        // check for error response
                                        if (!response.ok) {
                                            console.log(data)
                                            //this.setState({error: nice_error})
                                           
                                        } else {
                                           
                                            this.setState({seller:{
                                                first_name:data.first_name,
                                                last_name:data.last_name,
                                                country:data.country,
                                                description:data.description,
                                                
                                            }})
                                            this.aucionOnWatchlist();
                                        }
                            
                                    })
                                    .catch(error => {
                                        console.error('There was an error!', error);
                                        this.setState({error: error.name+": "+error.message})
                                       
                                    });
                
                            }
                
                        })
                        .catch(error => {
                            console.error('There was an error!', error);
                            this.setState({error: error.name+": "+error.message})
                           
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
    
    async aucionOnWatchlist(){
        let requestOptions = {
            method: 'POST',
            headers: { "accept": "application/json",'Content-Type': 'application/json' , 'session_key':this.props.session.key},
            body: JSON.stringify({
                
                    id:this.state.auction.auction_id
                    
                  
            })
            };
            fetch(this.props.session.ip+"/watchlist/is_auction_on_watchlist_for_xena_i_hope_it_works_lol", requestOptions)
                                    .then(async response => {
                                        const data = await response.json();
                                        // check for error response
                                        if (!response.ok) {
                                            console.log(data)
                                            //this.setState({error: nice_error})
                                           
                                        } else {
                                           if(data==true){
                                            this.setState({ aucionOnWatchlist:true
                                                
                                            })
                                        }
                                        }
                            
                                    })
                                    .catch(error => {
                                        console.error('There was an error!', error);
                                        this.setState({error: error.name+": "+error.message})
                                       
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
            <div className="Auction">
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
                            ( <div>{(this.props.session.user_id==-1)?
                                    ( // not logged in auction
                                        <div className="about-content">
                                            {this.update_jumbo(true)}
                                            <h1 className="display-4">{this.state.auction.title}</h1>

                                            <hr/>
                                            <div class="card" style={{marginBottom:"15px"}}>
                                                <h5 class="card-header">Item Information</h5>
                                                <div class="card-body"  >
                                                <div className="list-and-picture">
                                                    <ul className="list-group list-group-flush small-list-left">
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Description :</span>{this.state.auction.description}
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Amount:</span><span>{this.state.auction.amount}</span>
                                                        </li>
                                                        
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Item type:</span><NavLink to={"/"+ this.state.auction.item_type}>{this.state.auction.item_type}</NavLink>
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Payment:</span>{this.state.auction.paypal?("Paypal, "):("")}{this.state.auction.bank_transfer?("Bank transfer, "):("")}{this.state.auction.cash?("Cash "):("")}
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Shipping:</span>{this.state.auction.international?("International Shipping from " + this.state.auction.country):("Only national shipping in "+ this.state.auction.country)}
                                                        </li>
                                                        <li className="list-group-item" style={{padding: "0"}}/>
                                                    </ul>
                                                   
                                                </div>
                                                </div>
                                                </div>
                                                <div class="card" style={{marginBottom:"15px"}}>
                                                <h5 class="card-header">Seller Information</h5>
                                                <div class="card-body"  >
                                                <div className="list-and-picture">
                                                    <ul className="list-group list-group-flush small-list-left">
                                                    <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Name:</span>{this.state.seller.first_name+" "+this.state.seller.last_name}
                                                        </li>   
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Country:</span>{this.state.seller.country}
                                                        </li>   
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Description:</span>{this.state.seller.description}
                                                        </li>
                                                        </ul>
                                                        </div>
                                                </div></div>
                                            <div className="jumbo-footer">
                                                <span className="text-muted">last refresh: <strong>{new Date(this.state.server_time).toLocaleString()}</strong> [{this.state.server_time}]</span>
                                            </div>
                                        </div>
                                    ):( <div>
                                        <div className="about-content">
                                            {this.update_jumbo(true)}
                                            <h1 className="display-4">{this.state.auction.title}</h1>
                                        

                                            <hr/>
                                            
                                            <div>
                                            <div class="container" style={{paddingBottom:"10px"}}>
                                            <div class="row">
                                                <div class="col">
                                                    <Images handler={(c)=>{this.setState({active_pic: c})}} images={this.state.auction.images} />
                                                </div>
                                                    <div  class="col-9">
                                                    <TransformWrapper
                                                    defaultScale={1}
                                                    defaultPositionX={200}
                                                    defaultPositionY={100}>
                                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                    <React.Fragment>
                                                        
                                                        <TransformComponent>   
                                                            <img   alt="profile_picture" style={{height: "300px", maxWidth:"auto"}} 
                                                                src={this.state.auction.images[0] != null && this.state.auction.images[0]!= ""  ? (this.state.active_pic) : (window.location.origin + "/images/design/empty_profile_picture.png")}></img>
                                                        </TransformComponent>
                                                        <div className="tools" style={{marginTop:"10px"}} >
                                                        <button class="btn btn-secondary" style={{marginRight:"5px"}} onClick={zoomIn}>+</button>
                                                        <button class="btn btn-secondary" style={{marginRight:"5px"}} onClick={zoomOut}>-</button>
                                                        <button class="btn btn-secondary" style={{marginRight:"5px"}} onClick={resetTransform}>x</button>
                                                        </div>
                                                        </React.Fragment>
                                                        )}
                                                    </TransformWrapper>
                                                    </div>
                                                    </div>
                                                </div>
                                             </div>           
                                             <hr/>
                                             <div>{Number(this.state.auction.endingTime)>Number(Date.now())?
                                               ( <div class="card" style={{marginBottom:"15px"}}>
                                                <h5 class="card-header">Betting Area</h5>
                                                <div class="card-body"  >
                                                <BettingField currency={this.state.auction.currency} auction_id={this.state.auctionId} session={this.props.session} currentPrice={this.state.auction.current_price} endingTime={this.state.auction.unix_ending_time}/>
                                                <div class="row mb-3">
                                                <div className="col-md-6" >
                                                           <div>{ this.state.auctionOnWachlist?(
                                                               <button className="btn btn-secondary" onClick={(event => this.removeFromWatchlist(event))}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                               <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                                           </svg> Remove from watchlist </button>
                                                           ):( <button className="btn btn-secondary" onClick={(event => this.addToWatchlist(event))}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                                <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                                            </svg> Add to watchlist </button>)}</div>
                                                            </div></div>
                                                </div></div>):(<div class="alert alert-danger" role="alert">
                                                        The auction has ended already
                                                        </div>)
                                                
                                                
                                                }
                                                </div>

                                                
                                             <div class="card" style={{marginBottom:"15px"}}>
                                                <h5 class="card-header">Item Information</h5>
                                                <div class="card-body"  >
                                                <div className="list-and-picture">
                                                    <ul className="list-group list-group-flush small-list-left">
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Description :</span>{this.state.auction.description}
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Amount:</span><span>{this.state.auction.amount}</span>
                                                        </li>
                                                        
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Item type:</span><NavLink to={"/"+ this.state.auction.item_type}>{this.state.auction.item_type}</NavLink>
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Payment:</span>{this.state.auction.paypal?("Paypal, "):("")}{this.state.auction.bank_transfer?("Bank transfer, "):("")}{this.state.auction.cash?("Cash "):("")}
                                                        </li>
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Shipping:</span>{this.state.auction.international?("International Shipping from " + this.state.auction.country):("Only national shipping in "+ this.state.auction.country)}
                                                        </li>
                                                        <li className="list-group-item" style={{padding: "0"}}/>
                                                    </ul>
                                                   
                                                </div>
                                            
                                                    </div>
                                                    </div>
                                                <div></div>
                                                <div class="card" style={{marginBottom:"15px"}}>
                                                <h5 class="card-header">Seller Information</h5>
                                                <div class="card-body"  >
                                                <div className="list-and-picture">
                                                    <ul className="list-group list-group-flush small-list-left">
                                                    <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Name:</span>{this.state.seller.first_name+" "+this.state.seller.last_name}
                                                        </li>   
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Country:</span>{this.state.seller.country}
                                                        </li>   
                                                        <li className="list-group-item"><span
                                                            className="text-muted profile-list-annotation">Description:</span>{this.state.seller.description}
                                                        </li>
                                                    <form className="row g-3">
                                                    <div className="mb-3" style={{paddingLeft: "16px"}}>
                                                        <label htmlFor="message" className="form-label">Contact seller</label>
                                                        <textarea className="form-control" id="message" placeholder="Message to seller"
                                                                onChange={(e) => {(e.target.value === null ?
                                                                    (e.target.parentElement.setAttribute("class", "mb-3")) :
                                                                    (e.target.parentElement.setAttribute("class", "mb-3 was-validated")))}} required/>
                                                        <div className="invalid-feedback">Please provide a message for the seller.</div>
                                                    </div>
                                                    </form>
                                                    <li className="list-group-item"> {this.state.contactSeller ? (
                                                            <button className="btn btn-primary" disabled>Loading....</button>
                                                        ) : (
                                                            <button className="btn btn-primary" onClick={(event => this.contactSeller(event))}>Contact Seller</button>
                                                        )}</li>
                                                    
                                                        
                                                        
                                                        
                                                    </ul>
                                                   
                                                </div>
                                            
                                                    </div>
                                                    </div>
                                                <div></div> 

                                            <div className="jumbo-footer">
                                                <span className="text-muted">last refresh: <strong>{new Date(this.state.server_time).toLocaleString()}</strong> [{this.state.server_time}]</span>
                                            </div>
                                        </div>
                                        
                                    </div>)}
                                
                                </div>

                            )
                        }</div>) // end of main part
                    }
                </div>
            </div>
        )
    }
    async contactSeller(event){
        event.target.parentElement.firstElementChild.setAttribute("class", "row g-3 was-validated");
        let message= this.state.auction.title+": "+$("#message").val();
        this.setState({contactSeller:true});
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                
                    idDto: {
                      "id": this.state.auction.seller_id
                    },
                    messageDto: {
                      "author_user_id": this.props.session.user_id,
                      "message": message,
                      
                    }
                  
            })};
            fetch(this.props.session.ip+"/chat/send_message", requestOptions)
            .then(async response => {
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    if(!nice_error.includes("Could not find partner account.")) {
                        this.setState({error: nice_error})
                        alert(nice_error[1]);
                        this.setState({contactSeller: false});
                    }
                } else {
                    
                    alert("You succesfully send a message to the seller")
                    this.setState({contactSeller: false});
                }
              
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({contactSeller: false});
            }); 
            

    }
    async removeFromWatchlist(event){
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.auction.auction_id
            })
        };
            fetch(this.props.session.ip+"/watchlist/remove", requestOptions)
            .then(async response => {
                let data= await response;
                if (!response.ok) {
                    //this.setState({error: nice_error})
                    alert("Remove from watchlist failed, try again!");
                    this.setState({auctionOnWachlist:true})
                } else {
                    this.setState({auctionOnWachlist:false})
                    alert("Remove from watchlist  suceedet")
                }
              
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
               
            }); 

    }
    async addToWatchlist(event)
    {
        let requestOptions = {
            method: 'POST',
            headers: {'session_key': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.auction.auction_id
            })
        };
            fetch(this.props.session.ip+"/watchlist/add", requestOptions)
            .then(async response => {
                let data= await response;
                if(response.status=="500")
                {
                    alert("already addet to your watchlist")
                    this.setState({aucionOnWatchlist:true})
                }
                else if (!response.ok) {
                    //this.setState({error: nice_error})
                    alert("Add to watchlist failed, try again!");
                    this.setState({auctionOnWachlist:false})
                } else {
                    this.setState({auctionOnWachlist:true})
                    alert("Add to watchlist  succeedet")
                }
              
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
               
            }); 
        

    }
    

}
export default withRouter(InstantSell);

const Images = (props) => {
    console.log(props.images);
  const images = props.images.map((image) => {
    return ( <div style={{marginBottom: "5px", maxWidth:"69px",maxHeight:"61px",textAlign:"center" ,backgroundColor: "white",borderStyle: "groove", borderColor:"blue"}}><img    style={{ verticalAlign:"middle",maxWidth:"69px",maxHeight:"59px"}} onClick={()=>props.handler(image)}  src={image} alt=""  /></div>);
  });

  return <div style={{paddingBottom: "16px"}}>{images}</div>;
};