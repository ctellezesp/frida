import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from "../firebase/config";
import swal from 'sweetalert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import { FaGoogle } from "react-icons/fa";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

    componentDidMount(){
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
            console.log(res.user.name);
            swal("Bienvenido!", "Has ingresado al sistema", "success");
        })
        .catch(err => {
            console.log(err);
            swal("Error", "Por favor revisa tu usuario o contraseña", "error");
        });
    }

    authUser(){
        if(this.state.user === "" || this.state.password === "") {
            swal("Datos no encontrados", "Ningún dato puede estar vacio", "error");
        }
        else {
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
        
    }

    render(){
       return( 
            <div className="main">
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                        Frida
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Por favor introduce tu nombre de usuario y contraseña
                    </Typography>
                    <Fab color="secondary" variant="extended" onClick={this.authGoogle}>
                        <FaGoogle style={{marginRight: 10}}/>
                        Iniciar sesión con Google
                    </Fab>
                </Grid>
                <Paper>
                    <Grid container direction="column" justify="center" alignItems="stretch" style={{marginTop: 20}}>
                        <Grid item xs={12} lg={12} style={{paddingRight: 20, paddingLeft: 20}}>
                            <TextField
                                fullWidth
                                id="username"
                                label="Usuario"
                                margin="normal"
                                variant="outlined"
                                onChange={this.myUser}
                            />
                        </Grid>
                        <Grid item xs={12} lg={12} style={{paddingRight: 20, paddingLeft: 20}}>
                            <TextField
                                fullWidth
                                id="password"
                                type="password"
                                label="Contraseña"
                                margin="normal"
                                variant="outlined"
                                onChange={this.myPsw}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container direction="row" justify="flex-end" alignItems="center">
                    <Button variant="contained" color="primary" style={{margin: 20}} onClick={this.authUser}>
                        Ingresar
                    </Button>
                </Grid>
            </div>
        );
    }
}