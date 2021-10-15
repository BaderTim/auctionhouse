import React from "react";
import $ from 'jquery'

//ticker auf einesekundestellen und jsonnretun
export default class BettingField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bet:false,
            current_price:this.props.current_price,
            endingTime: this.props.endingTime,
            leftTime:null,
            timer:{
                days:null,
                hours:null,
                min:null,
                sec:null,
            }
        }

    
    }
    componentDidMount()
    {
        let endTimer=Number(this.props.endingTime)-Number(Date.now());
            this.setState({leftTime:endTimer})
            var delta = Math.abs(endTimer) / 1000;

            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = delta % 60; 
            this.setState({timer:{
                days:days,
                hours:hours,
                min:minutes,
                sec:seconds,
            }})
        this.ticker = setInterval(()=>this.tick(),1000);
    }
    componentWillUnmount()
    {
        clearInterval(this.ticker);
    }

    tick(){
        let requestOptions = {
            method: 'POST',
            headers: { "accept": "application/json",'Content-Type': 'application/json' },
            body: JSON.stringify({
                
                    id:this.props.auction_id
                  
            })
            };
            console.log(this.props.auction_id)
          
        fetch(this.props.session.ip+"/auctions/id/get_highest_bet", requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    console.log(data)
                    //this.setState({error: nice_error})
                   
                } else {
                   
                    this.setState({current_price: Number(data)})
                    
                }
    
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
               
            }); 
            let endTimer=Number(this.props.endingTime)-Number(Date.now());
            this.setState({leftTime:endTimer});
            var delta = Math.abs(endTimer) / 1000;

            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = delta % 60; 
            this.setState({timer:{
                days:days,
                hours:hours,
                min:minutes,
                sec:seconds,
            }})
        
    }
    async bet(event)
    {
        if(this.state.current_price>=$("#input_bet").val())
        {
            return;
        }
        let betInput =$("#input_bet").val();
        let requestOptions = {
            method: 'POST',
            headers: {'accept': 'application/json','sessionKey': this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idDto: {
                    id:this.props.auction_id
                  },
                  priceDto: {
                    price: betInput
                  },
            })
        };
        this.setState({bet:true});
        fetch(this.props.session.ip+"/auctions/bet", requestOptions)
            .then(async response => {
                if(response.status=="500")
                {
                    alert("Your Price have to be 1% higher than the current price")
                }
                else if (!response.ok) {
                    //this.setState({error: nice_error})
                    alert("Betting didnt work, try again!");
                } else {
                    this.setState({bet: false})
                    alert("Bet succeedet")
                }
                this.setState({bet: false});
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({bet: false})
            }); 
        

        }
        render() {
            return(
                <div>{Number(this.state.endingTime)>Number(Date.now())?
           ( <form className="was-validated" >
            
            <div class="row mb-3">
                
            <div className="col-md-6" style={{paddingLeft: "16px"}}>
                <div>{
                <label htmlFor="input_bet" className="form-label" ><strong>Ending Time:</strong><p style={{color:"red"}}>{this.state.timer.days}d {this.state.timer.hours}h {this.state.timer.min}m {Number(this.state.timer.sec).toFixed(0)}s</p></label>
                }</div>
                <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <input type="text" className="form-control" id="input_bet" placeholder={this.state.current_price} aria-describedby="input_bet"
                    onChange={(e) => 
                        
                        
                        {(($("#input_bet").val() <=this.state.current_price )?
                        (e.target.parentElement.setAttribute("class", "col-md-6")) :
                        (e.target.parentElement.setAttribute("class", "col-md-6 was-validated"))
                        )}} required/>
                        </div>
                        <div class="col-sm"><h2>{this.props.currency==="eur"?("€"):("$")}</h2></div>
                    </div>
                    </div>  
                <div id="input_bet_feedback" className="invalid-feedback" >Your bet has to be higher then the current price.</div>
             </div>
             </div>
             <div class="row mb-3">
             <div className="col-md-6" style={{paddingLeft: "16px"}}>
             {this.state.bet ? (
                        <button className="btn btn-primary" disabled>Loading....</button>
                    ) : (
                        <button className="btn btn-primary" onClick={(event => this.bet(event))}>Bet </button>
                    )}</div></div>
                    
            </form>

           )
        :
        (
            <div></div>
        )
        }</div>);}


}