import React, { Component } from 'react';
import firebase from "../firebase/config";
import Menu from './menu';

export default class Dashboard extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: null,
			allowed: ["admin@frida.mx", "ctellezesp.develop@gmail.com", "ctellezesp@gmail.com", "tellezalberto990@gmail.com"]
		}
	}

	componentWillMount(){
		firebase.auth.onAuthStateChanged(user => {
			console.log(user);
			if(user == null)
				this.props.history.push('/');
			else if(!this.state.allowed.includes(user.email))
				this.props.history.push('/not-found');
			this.setState({user: user.email});
		});

	}


	render(){
		return(
			<div className="row">
				<Menu />
				<h4>Dashboard</h4>
				<h5>{this.state.user}</h5>
			</div>
		)
	}
}