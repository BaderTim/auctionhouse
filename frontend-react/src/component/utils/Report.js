import React from "react";
import "./report.css";
import $ from "jquery";
import Popover from "@material-ui/core/Popover";


export default class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {anchorEl: null, isLoading: false, description: null, title: null}
    }


    handleOpen = (event) => {
        this.setState({anchorEl: event.currentTarget.parentElement});
    };
    handleClose = () => {
        this.setState({anchorEl: null, description: $("#report_comment").val(), title: $("#report_title").val()});
    };

    render() {

        const flag = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                           className="bi bi-flag-fill" viewBox="0 0 18 18">
            <path
                d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
        </svg>)

        return (
            <span>
                <span className="report" onClick={(event) => {this.handleOpen(event)}}>{flag}</span>
                        <Popover
                            open={Boolean(this.state.anchorEl)}
                            anchorEl={this.state.anchorEl}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            {this.props.session.user_id === this.props.user_id ? (
                                <h4 style={{padding: "10px 10px 10px 10px"}}>You cannot report yourself.</h4>
                            ) : (
                                <div style={{padding: "10px 10px 10px 10px"}}>
                                    <h4>Report {this.props.first_name}</h4>
                                    <p className="lead" style={{marginBottom: "4px"}}>Problem:</p>
                                    <input id="report_title" className="form-control" type="text" defaultValue={this.state.title? (this.state.title): ("")} placeholder="What's wrong?"
                                           aria-label="default input example"/>
                                    <p className="lead" style={{margin: "4px 0 4px 0"}}>Description:</p>
                                    <textarea id="report_comment" className="form-control" type="text" defaultValue={this.state.description? (this.state.description): ("")} placeholder="Please describe the problem."
                                           aria-label="default input example"/>
                                    {this.state.isLoading ? (
                                        <div className="d-flex justify-content-center" style={{width: "54px", height: "33px", marginTop: "10px"}}>
                                            <div className="spinner-border text-primary"  role="status"></div>
                                        </div>
                                    ) : (
                                        <button style={{marginTop: "10px"}} onClick={() => (this.send_report())} className="btn btn-primary">Send</button>
                                    )}
                                </div>
                            )}
                        </Popover>
            </span>
        );
    }


    send_report(event) {
        if($("#report_title").val().length > 99) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot use more than 99 characters for the title. Currently you have "+$("#report_title").val().length+"."})
            return;
        }
        if($("#report_title").val().length < 1) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot leave the title empty."})
            return;
        }
        if($("#report_comment").val().length > 199) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot use more than 200 characters for the description. Currently you have "+$("#report_comment").val().length+"."})
            return;
        }
        if($("#report_comment").val().length < 1) {
            this.props.add_alert({type: "danger", size: "sm", text: "You cannot leave the description empty."})
            return;
        }
        this.setState({isLoading: true});
        let requestOptions = {
            method: 'POST',
            headers: {'sessionKey':this.props.session.key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "idDto": {"id": this.props.user_id},
                "mailDto": {"message": $("#report_comment").val(), "title": $("#report_title").val()}
            })
        };
        fetch(this.props.session.ip+'/report/', requestOptions)
            .then(async response => {
                // check for error response
                if (!response.ok) {
                    const data = await response.json();
                    const nice_error = data.error.split(/ (.+)/)
                    this.props.add_alert({type: "danger", size: "md", text: nice_error[1], header: "Whoops, something went wrong :(", subtext: new Date(Number(nice_error[0])).toUTCString()})
                } else {
                    this.props.add_alert({type: "primary", size: "sm", text: "You reported "+this.props.first_name+" for '"+$("#report_title").val()+"' ."})
                    this.handleClose();
                }
                this.setState({isLoading: false});
            })
            .catch(error => {
                console.error('There was an error!', error);
                this.props.add_alert({type: "danger", size: "md", text: error.message, header: "Whoops, something went wrong :(", subtext: error.name})
                this.setState({isLoading: false});
            });
    }

}