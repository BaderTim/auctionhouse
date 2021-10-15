import React from "react";

//fehler beheben 
export default class BanButton extends React.Component {
//<BanButton session={this.props.session} userid={6} banned={true}/>
    constructor(props) {
        super(props);
        this.state = {
            userid:this.props.userid,
            banned:this.props.banned,
            message:"123",
            error:"",
        };
    }

    
     banUser(e)
    {
        let requestOptions = {
            method: 'POST',
            headers: { 'Accept':'application/json',
                        'Content-Type': 'application/json',
                        'session_key':this.props.session.key,
            },
            body: JSON.stringify({
                idDto: {
                    id: this.state.userid
                  },
                  messageDto: {
                    author_user_id: this.props.session.user_id,
                    message: this.state.message,
                  }
            })};
        
        
        fetch(this.props.session.ip+'/account/admin/ban', requestOptions)
            .then(async response => {
                let data = await response.json();
                // check for error response
                if(response.status === 200)
                {
                    this.setState({banned:true})
                }
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                    if(nice_error[1] === "This user has been banned already.")
                    {
                        this.setState({banned:true});
                    }
                    else{
                    this.setState({banned:false});}
                   
                    
                } else if (response.ok){
                    alert("User was banned succesfully")
                    this.setState({banned:true});
                }
                console.log(data)
                
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({banned:false});
            });

    }
     unbanUser(e)
    {
        let requestOptions = {
            method: 'POST',
            headers: { 'Accept':'application/json',
                        'Content-Type': 'application/json',
                        'session_key':this.props.session.key,
            },
            body: JSON.stringify({
                id:this.state.userid
            })};
        
        
        fetch(this.props.session.ip+'/account/admin/unban', requestOptions)
            .then(async response => {
                let data = await response.json();
                
                // check for error response
                
                if (!response.ok) {
                    const nice_error = data.error.split(/ (.+)/)
                    this.setState({error: nice_error})
                    alert(nice_error[1]);
                    if(nice_error[1] === "The user you are trying to unban is not banned.")
                    {
                        this.setState({banned:false});
                    }
                    else{
                    this.setState({banned:true});}

                } else {
                    alert("User was unbanned succesfully")
                    this.setState({banned:false});
                }
                console.log(data)
                
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.setState({error: error.name+": "+error.message})
                this.setState({banned:true});
            });
    }
    render(){
        return(
            <div>
                {this.state.banned?
                (
                    <button type="button" onClick={(event=>this.unbanUser(event))} class="btn btn-success">Unban User</button>
                ):
                (
                    <button type="button" onClick={(event=>this.banUser(event))} class="btn btn-danger">Ban User</button>
                )

                }
            </div>
        )
    }
}