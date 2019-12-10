import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "../../firebase/config";
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Menu from '../menu';

export default class CrearUsuario extends Component{
    constructor(props){
        super(props);
        this.state = {
            correo: '',
            rol: ''
        }
        this.myMail = this.myMail.bind(this);
        this.myRol = this.myRol.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        firebase.db.collection("usuarios").get()
		.then(res => {
			let toAllow = [];
			let admins = res.docs.filter(user => user.data().rol == "admin");
			admins.forEach(admin => toAllow.push(admin.data().correo));
			firebase.auth.onAuthStateChanged(user => {
				if(user == null)
					this.props.history.push('/');
				else if(!toAllow.includes(user.email))
					this.props.history.push('/not-found');
			});
		});
    }

    myMail(event) {
        this.setState({
            correo: event.target.value
        });
    }

    myRol(event) {
        this.setState({
            rol: event.target.value
        });
    }

    save() {
        if(this.state.correo === '' || this.state.rol === '') {
            swal("Datos no validos", "Ningún dato puede estar en vacio", "error");
        } else {
            firebase.db.collection("usuarios").add(this.state)
            .then(() => {
                swal("Usuario Agregado", `${this.state.correo} ahora es un ${this.state.rol}`, "success")
                .then(() => {
                    this.props.history.push('/lista-usuarios');
                })
            })
            .catch(err => {
                console.log(err);
                swal("Error", "Ha ocurrido un error, intentelo nuevamente", "error");
            });
        }
    }

    render() {
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h3" gutterBottom>
                        Registrar Usuario
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Por favor introduce los datos siguientes:
                    </Typography>
                </Grid>
                <Paper style={{margin: 20, background: '#eee', padding: 10}}>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={12} md={8} style={{paddingRight: 20, paddingLeft: 20}}>
                        <TextField
                            required
                            fullWidth
                            id="correo"
                            label="Correo"
                            margin="normal"
                            variant="outlined"
                            onChange={this.myMail}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} style={{paddingRight: 40, paddingLeft: 0, paddingTop: 5}}>
                        <FormControl variant="outlined" style={{width: '100%'}}>
                            <InputLabel id="demo-simple-select-outlined-label">
                            Rol
                            </InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={this.myRol}
                            >
                            <MenuItem value="">
                                <em>Selecciona el rol</em>
                            </MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                            <MenuItem value="empleado">Empleado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                </Paper>
                <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                >
                    <Button variant="contained" color="primary" style={{margin: 20}} onClick={this.save}>
                        Registrar
                    </Button>
                </Grid>
            </div>
        );
    }

}