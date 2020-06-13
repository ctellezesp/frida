import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import firebase from "../firebase/config";
import Menu from './menu';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import DescriptionIcon from '@material-ui/icons/Description';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

export default class Dashboard extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: null,
			allowed: []
		}
	}

	componentDidMount(){
		firebase.db.collection("usuarios").get()
		.then(res => {
			let toAllow = [];
			let admins = res.docs.filter(user => user.data().rol == "admin");
			admins.forEach(admin => toAllow.push(admin.data().correo));
			this.setState({
				allowed: toAllow
			});
			firebase.auth.onAuthStateChanged(user => {
				if(user == null)
					this.props.history.push('/');
				else if(!toAllow.includes(user.email))
					this.props.history.push('/not-found');
				this.setState({user: user.email});
			});
		});
	}


	render(){
		return(
			<div className="main">
                <Menu />
                <Grid container direction="row" justify="center" alignItems="center" spacing={3} style={{marginTop: 10}}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Link to="crear-usuario"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <PersonAddIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Agregar Usuario
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Link to="lista-usuarios"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <GroupIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Lista Usuarios
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Link to="registrar-productos"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <AddCircleIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Registrar Producto
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Link to="lista-productos"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <DescriptionIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Lista Productos
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
					<Grid item xs={12} md={6} lg={6}>
                        <Link to="lista-ventas"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <AttachMoneyIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Ventas
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
					<Grid item xs={12} md={6} lg={6}>
                        <Link to="lista-gastos"><Paper style={{background: '#f5f5f5'}}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <ShoppingBasketIcon style={{ fontSize: 100 }}/>
                                    <Typography variant="h5" gutterBottom>
                                        Gastos
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper></Link>
                    </Grid>
                </Grid>
            </div>
		)
	}
}