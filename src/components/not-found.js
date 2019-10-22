import React, { Component } from 'react';
import firebase from "../firebase/config";

export default class NotFound extends Component{
	constructor(props){
		super(props);
		this.state = {
			logged: false
		}
		this.authOut = this.authOut.bind(this);
		this.entrar = this.entrar.bind(this);
	}

	componentWillMount(){
        firebase.auth.onAuthStateChanged(user => {
            if(user) {
            	this.setState({
            		logged: true
            	});
            }
        });
    }

    authOut(){
        firebase.auth.signOut()
        .then(() => {
            this.setState({user: null});
            this.props.history.push('/');
        });
    }

    entrar(){
    	this.props.history.push('/');
    }

	render(){
		let boton;
		if(this.state.logged)
			boton = <a className="waves-effect waves-light btn red" onClick={this.authOut}><i className="material-icons left">done</i>Ingresar con otro usuario</a>
		else boton = <a className="waves-effect waves-light btn red" onClick={this.entrar}><i className="material-icons left">done</i>Ingresar</a>
		return(
			<div className="row center-align">
				<h2>La página a la que intentas acceder no existe</h2>
				{boton}
			</div>
		)
	}
}