import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import firebase from "../firebase/config";
import swal from 'sweetalert';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
            allowed: ["admin@frida.mx", "ctellezesp.develop@gmail.com", "ctellezesp@gmail.com", "tellezalberto990@gmail.com"]
        }
        this.authGoogle = this.authGoogle.bind(this);
        this.authUser = this.authUser.bind(this);
        this.myUser = this.myUser.bind(this);
        this.myPsw = this.myPsw.bind(this);
    }

    componentWillMount(){
        firebase.auth.onAuthStateChanged(user => {
            if(user) {
                console.log(user);
                if(this.state.allowed.includes(user.email))
                    this.props.history.push('/dashboard');
                else if(user.email == "empleado@frida.mx")
                    this.props.history.push('/panel-vendedor');
                else
                    this.props.history.push('/not-found');
            }
        });
    }

    myUser(event){
        this.setState({
            user: event.target.value
        })
    }

    myPsw(event){
        this.setState({
            password: event.target.value
        })
    }


    authGoogle(){
        firebase.auth.signInWithPopup(firebase.googleProvider)
        .then(res => {
            console.log(res.user.email);
            console.log(res.user.name)
            swal("Bienvenido!", "Has ingresado al sistema", "success");
        })
        .catch(err => {
            console.log(err);
            swal("Error", "Por favor revisa tu usuario o contraseña", "error");
        });
    }

    authUser(){
        let username = this.state.user + '@frida.mx';
        firebase.auth.signInWithEmailAndPassword(username, this.state.password)
        .then(res => {
            console.log(res.user.email);
            swal("Bienvenido!", "Has ingresado al sistema", "success");

        })
        .catch(err => {
            console.log(err);
            swal("Error", "Por favor revisa tu usuario o contraseña", "error");
        });
    }

    render(){
       return( 
       <div className="row">
            <div className="col s12 l8 offset-l2">
                <div className="card">
                    <h4 className="center-align">Login</h4>
                    <p className="center-align">Introduce tu nombre de usuario y contraseña.</p>
                    <div className="row">
                        <div className="col s12 l10 offset-l1 center-align">
                            <a className="waves-effect waves-light btn red" onClick={this.authGoogle}><i className="material-icons left">done</i>Entrar con Google</a>
                        </div>
                        <div className="input-field col s12 l10 offset-l1">
                            <i className="material-icons prefix">account_circle</i>
                            <input id="user" type="text" className="validate" onChange={this.myUser} />
                            <label htmlFor="user">Usuario</label>
                        </div>
                        <div className="input-field col s12 l10 offset-l1">
                            <i className="material-icons prefix">vpn_key</i>
                            <input id="contraseña" type="password" className="validate" onChange={this.myPsw} />
                            <label htmlFor="contraseña">Contraseña</label>
                        </div>
                    </div>
                </div>
                <a className="waves-effect waves-light btn right" onClick={this.authUser}><i className="material-icons left">done</i>Entrar</a>
            </div>
        </div>);
    }
}