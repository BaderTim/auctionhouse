import React from "react";
import $ from "jquery";
import "./alert.css";
import App from "../../App";

export default class Alert extends React.Component {

    constructor(props) {
        super(props);
        this.setState({counter: 0})
    }


    render() {
        //  --PROPS--
        //  size   :   sm md lg
        //  type   :   success, danger, warning, primary, ...
        //  header :   headline
        //  text   :   explaining text
        //  subtext:   additional text
        if(this.props.size === "sm") {
            return (<div style={{bottom: this.props.c_small*60+this.props.c_medium*150+45+"px"}} className={"alert alert-"+this.props.type} role="alert" >
                <div className="alert-container"><div>{this.props.text}</div>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"
                        onClick={e => {this.props.remove_alert(this.props.c_small+this.props.c_medium); $(".main").removeClass("dark-overlay")}}/>
                </div>
            </div>);
        } else if(this.props.size === "md") {
            return (<div style={{bottom: this.props.c_small*60+this.props.c_medium*150+20+"px"}} className={"shadow-lg p-3 mb-5 rounded alert alert-"+this.props.type} role="alert"
                    onMouseEnter={event => {$(".main").addClass("dark-overlay");
                         }}
                         onMouseLeave={event => {$(".main").removeClass("dark-overlay")}}>
                <div className="alert-container"><h4 className="alert-heading">{this.props.header}</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"
                    onClick={e => {this.props.remove_alert(this.props.c_small+this.props.c_medium); $(".main").removeClass("dark-overlay")}}/></div>
                <p>{this.props.text}</p>
                {this.props.subtext ? (<><hr/><p>{this.props.subtext}</p></>) : ("")}
            </div>);
        } else if(this.props.size === "lg") {
            return ("");
        }
    }

}