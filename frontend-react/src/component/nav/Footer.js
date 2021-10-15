import React from "react";
import "./footer.css";
import {NavLink} from "react-router-dom";

export default class Footer extends React.Component{

    render() {
        return (
            <div className="Footer navbar-dark bg-dark">
                <NavLink exact className="footer-link" activeClassName="footer-current" to='/about'>About</NavLink>
                <span className="footer-spacer">|</span>
                <NavLink exact className="footer-link" activeClassName="footer-current" to='/contact'>Contact</NavLink>
                <span className="footer-spacer">|</span>
                <NavLink exact className="footer-link" activeClassName="footer-current" to='/conditions'>Terms & Conditions</NavLink>
                <span className="footer-spacer">|</span>
                <NavLink exact className="footer-link" activeClassName="footer-current" to='/imprint'>Imprint</NavLink>
                <span className="footer-spacer"></span>
                <span className="copyright-notice">© dw-auction GmbH, {new Date().getFullYear()}</span>
            </div>
        );
    }
}