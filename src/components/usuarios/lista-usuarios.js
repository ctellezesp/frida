import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Menu from '../menu';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import swal from 'sweetalert';
import firebase from "../../firebase/config";

export default class ListaUsuarios extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        firebase.db.collection("usuarios").get()
        .then(res => {
            this.setState({
                data: res.docs
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.data !== this.state.data) {
            firebase.db.collection("usuarios").get()
            .then(res => {
                this.setState({
                    data: res.docs
                });
            });
        }
      }

    delete(user){
        swal({
            title: "¿Quieres eliminar a este niño?",
            text: "Una vez que lo elimines no podrás recuperar la información",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                firebase.db.collection("usuarios").doc(user).delete()
                .then(() => {
                    swal("Usuario Eliminado", "El usuario se ha eliminado correctamente", "success");
                })
            } else {
              swal("Eliminación Cancelada");
            }
        });
    }

    render(){
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="flex-end" alignItems="flex-end">
                    <Link to="/crear-usuario"><Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{margin: 20}}
                        startIcon={<AddIcon />}
                    >
                        Agregar Usuario
                    </Button></Link>
                </Grid>
                <Grid container direction="column" justify="center" alignItems="stretch">
                    <Grid item xs={12}>
                        <Paper style={{width: '100%', overflowX: 'auto'}}>
                            <Table stickyHeader style={{minWidth: 'auto'}} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">Correo</TableCell>
                                    <TableCell align="left">Rol</TableCell>
                                    <TableCell align="left">Editar</TableCell>
                                    <TableCell align="left">Eliminar</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.data.length ? this.state.data.map((row, index) => {
                                    return(
                                        <TableRow key={index}>
                                            <TableCell align="left">{row.data().correo}</TableCell>
                                            <TableCell align="left">{row.data().rol}</TableCell>
                                            <TableCell align="left">
                                                <Link to={`editar-usuario/${row.ref.id}`}><IconButton aria-label="edit">
                                                    <EditIcon fontSize="small" color="primary" />
                                                </IconButton></Link>
                                            </TableCell>
                                            <TableCell align="left">
                                                <IconButton aria-label="delete" onClick={() => this.delete(row.ref.id)}>
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }): <TableRow><TableCell><Typography variant="h5" gutterBottom>No hay usuarios</Typography></TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}