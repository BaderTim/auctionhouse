import React from "react";

import {NavLink} from "react-router-dom";

export default class NotFound extends React.Component {


    render() {

        return(
            <div className="Chat">
                <div className="jumbotron imprint-jumbo">
                    <h1 className="display-4">Error 404</h1>
                    <p className="lead">Page not found.</p>
                    <hr/>
                    <p className="lead">The page you are looking for does not exist. It seems like you have entered a wrong or outdated URL.</p>
                    <NavLink className="btn btn-primary btn-lg" to="/">Back to title page</NavLink>
                    <NavLink className="btn btn-secondary btn-lg" style={{marginLeft: "20px"}} to="/contact">Contact us</NavLink>
                </div>
            </div>
        )
    }

}