import React from "react";
import BanButton from "./BanButton";

export default class UserListElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          user_id:0,
          country:"",
          first_name:"",
          last_name:"",
          profile_picture:null,
        }
    }

    componentDidMount()
    {
      this.setState({
        user_id:this.props.user_id,
          country:this.props.country,
          first_name:this.props.first_name,
          last_name:this.props.last_name,
          profile_picture:this.props.profile_picture,
      })
    }
    render() {
       return(
           <div class="card" style={{width: "20em" , marginTop:"18px",marginLeft:"18px" ,float:"left"}}>
           <img src={this.state.pofile_picture? (this.state.profile_picture):(window.location.origin + "/images/design/empty_profile_picture.png")} class="card-img-top" alt="..."/>
           <div class="card-body">
             <h5 class="card-title">{this.props.first_name+" "+this.state.last_name}</h5>
           </div>
           <ul class="list-group list-group-flush">
             <li class="list-group-item">User ID : {this.state.user_id}</li>
             <li class="list-group-item">Country: {this.state.country}</li>
           </ul>
           <div class="card-body">
           <BanButton session={this.props.session} userid={this.state.user_id} banned={false}/>
           </div>
         </div>
       )
            
        }
    }

