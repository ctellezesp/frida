import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    render(){
       return( 
       <div className="row">
            <div className="col s12 l8 offset-l2">
                <div className="card">
                    <h4 className="center-align">Login</h4>
                    <p className="center-align">Introduce tu nombre de usuario y contraseña.</p>
                    <div className="row">
                        <div className="input-field col s12 l10 offset-l1">
                            <i className="material-icons prefix">account_circle</i>
                            <input id="user" type="text" className="validate" />
                            <label htmlFor="user">Usuario</label>
                        </div>
                        <div className="input-field col s12 l10 offset-l1">
                            <i className="material-icons prefix">vpn_key</i>
                            <input id="contraseña" type="password" className="validate" />
                            <label htmlFor="contraseña">Contraseña</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}