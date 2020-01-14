import React, {Component} from 'react';
import Menu from '../menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "../../firebase/config";
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class RegistrarGasto extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: '',
            cantidad: 0,
            descripcion: ''
        }
        this.save = this.save.bind(this);
        this.myCant = this.myCant.bind(this);
        this.myDesc = this.myDesc.bind(this);
    }

    componentDidMount() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        this.setState({
            date: `${year}-${month}-${day}`
        });
    }

    myCant(event) {
        this.setState({
            cantidad: event.target.value
        });
    }

    myDesc(event) {
        this.setState({
            descripcion: event.target.value
        });
    }

    save() {
        if(this.state.cantidad === 0 || this.state.descripcion === "") {
            swal("Error", "Ningún dato puede estar vacio", "error");
        } else {
            firebase.db.collection("gastos").add(this.state)
            .then(() => {
                swal("Gasto agregado", "El gasto ha sido agregado correctamente", "success")
                .then(() => {
                    this.props.history.push("/dashboard");
                });
            })
            .catch(err => {
                console.log(err);
                swal("Error", "Ha ocurrido un error", "error");
            });
        }
    }

    render() {
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h3" gutterBottom>
                        Registrar Gasto
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Por favor introduce los datos siguientes:
                    </Typography>
                </Grid>
                <Paper style={{margin: 20, background: '#eee', padding: 10}}>
                    <TextField fullWidth id="cant" label="Cantidad" variant="outlined" type="number" style={{paddingBottom: 20}} onChange={this.myCant} />
                    <TextField fullWidth id="desc" label="Descripcion" variant="outlined" type="text" multiline={true} rows={4} rowsMax={6} onChange={this.myDesc}/>
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