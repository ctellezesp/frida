import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "../firebase/config";
import './styles/menu.css';

export default class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            logged: false,
            user: null
        }
        this.authOut = this.authOut.bind(this);
    }

    componentWillMount(){
        firebase.auth.onAuthStateChanged(user => {
            this.setState({
                user: user
            })
            if(user)
                this.setState({
                    logged: true
                });
        });

    }

    authOut(){
        firebase.auth.signOut()
        .then(() => {
            this.setState({user: null});
        });
    }

    render() {
        let logout;
        if(this.state.logged)
            logout = <li onClick={this.authOut}>Logout</li>;
        else logout = '';
        return (
            <div className="navbar-fixed">
                <nav className="blue">
                    <div className="nav-wrapper">
                        <a href="#!" className="brand-logo">Frida</a>
                        <ul className="right hide-on-med-and-down">
                            {logout}
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}