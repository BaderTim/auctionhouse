import React from "react";
import $ from "jquery";
import "./filter.css";

export default class UserFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            sorting_order: "🡻",
            search_by_name: "",
          
        })
    }

    async handleReset() {
        await this.setState({
            sorting_order: "🡻",
            search_by_name: "",
        });
        $("#filter_search_form").val("");
        this.handleRefresh();
    }

     handleRefresh() {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        let filter = {
            sorting_order: (this.state.sorting_order === "🡹" ? ("ASC") :("DESC")),
            search_by_name: this.state.search_by_name,
        };
        this.props.refresh_handler(filter);
    }

    async onSortingOrderClick(event) {
        if(this.props.is_loading !== 0) {
            this.props.add_alert({type: "danger", size: "sm", text: "Please wait until loading is done."})
            return;
        }
        if(this.state.sorting_order === "🡻") {
            await this.setState({sorting_order: "🡹"})
        } else {
            await this.setState({sorting_order: "🡻"})
        }
        this.handleRefresh();
    }




   
    render() {
        //  --PROPS--
        //  handleState
        return(<div className="filter-container">
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown" style={{height: "35px"}}>
                <span onClick={() => {this.handleReset()}} style={{fontSize: "25px", marginRight: "20px", cursor: "pointer"}}>↺</span>
                <button type="button" className="btn btn-primary" onClick={event => (this.onSortingOrderClick(event))}>{this.state.sorting_order}</button>

            </div>
            
            <div className="input-group mb-3" style={{maxWidth: "300px"}}>
                <input type="text" id="filter_search_form" className="form-control" placeholder="Find auction"
                       aria-label="Recipient's username" aria-describedby="button-addon2" defaultValue={this.state.search_by_name} onChange={(event => {this.setState({search_by_name: event.target.value})})}/>
                <button className="btn btn-outline-success" type="button" id="button-addon2" onClick={() => {this.handleRefresh();}}>Search</button>
            </div>
        </div>);
    }

}