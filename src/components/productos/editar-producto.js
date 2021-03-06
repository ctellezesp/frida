import React, {Component} from 'react';
import Menu from '../menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
import firebase from "../../firebase/config";
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

export default class EditarProductos extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            nombre: '',
            categorias: [],
            categoria: '',
            descripcion: '',
            precio: '',
            isLoading: true
        }
        this.myNombre = this.myNombre.bind(this);
        this.myCategoria = this.myCategoria.bind(this);
        this.myDesc = this.myDesc.bind(this);
        this.myPrecio = this.myPrecio.bind(this);
        this.save = this.save.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    componentDidMount() {
        firebase.db.collection("productos").get()
        .then(res => {
            let options = [];
            res.docs.forEach(product => options.push(product.data().categoria));
            options = options.filter((item, index) => options.indexOf(item) === index);
            options.forEach(option => this.setState({
                categorias: [...this.state.categorias, createOption(option)]
            }));
        });

        firebase.db.collection("productos").doc(this.state.id).get()
        .then(res => {
            this.setState({
                nombre: res.data().nombre,
                categoria: res.data().categoria.toString(),
                descripcion: res.data().descripcion,
                precio: res.data().precio,
                isLoading: false
            });
            console.log(this.state.categoria);
        })
    }

    handleCreate(inputValue) {
        this.setState({ isLoading: true });
        console.group('Option created');
        console.log('Wait a moment...');
        setTimeout(() => {
          const { categorias } = this.state;
          const newOption = createOption(inputValue);
          console.log(newOption);
          console.groupEnd();
          this.setState({
            isLoading: false,
            categorias: [...this.state.categorias, newOption],
            categoria: newOption,
          });
        }, 1000);
        console.log(this.state.categorias);
      };

    myNombre(event) {
        this.setState({
            nombre: event.target.value
        });
    }

    myCategoria(value) {
        console.log(value);
        this.setState({
            categoria: value
        });
    }

    myDesc(event) {
        this.setState({
            descripcion: event.target.value
        });
    }

    myPrecio(event) {
        this.setState({
            precio: Number(event.target.value)
        })
    }

    save() {
        if(this.state.nombre === "" || this.state.categoria === "" || this.state.precio === "") {
            swal("Datos no validos", "Ningún dato puede estar vacio", "error");
        } else {
            let toSave = {
                nombre: this.state.nombre,
                categoria: (typeof this.state.categoria == "string") ? this.state.categoria : this.state.categoria.value,
                descripcion: this.state.descripcion,
                precio: this.state.precio
            }
            firebase.db.collection("productos").doc(this.state.id).set(toSave, {merge: true})
            .then(() => {
                swal("Producto Actualizado", `${this.state.nombre} ha sido actualizado correctamente`, "success")
                .then(() => {
                    this.props.history.push("/lista-productos");
                })
            })
            .catch(err => {
                console.log(err);
                swal("Error", "Por favor, intentalo otra vez", "error");
            })
        }
    }

    render() {
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h3" gutterBottom>
                        {this.state.nombre}
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
                            id="nombre"
                            label="Nombre"
                            margin="normal"
                            variant="outlined"
                            onChange={this.myNombre}
                            value={this.state.nombre}
                            defaultValue={this.state.nombre}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} style={{paddingRight: 20, paddingLeft: 0}}>
                        <TextField
                            required
                            fullWidth
                            id="precio"
                            label="Precio"
                            margin="normal"
                            variant="outlined"
                            onChange={this.myPrecio}
                            type="number"
                            value={this.state.precio}
                            defaultValue={this.state.precio}
                        />
                    </Grid>
                    <Grid item xs={12} md={8} style={{paddingRight: 20, paddingLeft: 20}}>
                        <TextField
                            fullWidth
                            id="descripcion"
                            label="Descripción"
                            margin="normal"
                            variant="outlined"
                            onChange={this.myDesc}
                            value={this.state.descripcion}
                            defaultValue={this.state.descripcion}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} style={{paddingRight: 20, paddingLeft: 0, paddingTop: 5}}>
                        <Typography variant="caption" display="block" gutterBottom>
                            Categoria
                        </Typography>
                        <CreatableSelect
                            isClearable
                            isDisabled={this.state.isLoading}
                            isLoading={this.state.isLoading}
                            onChange={this.myCategoria}
                            onCreateOption={this.handleCreate}
                            options={this.state.categorias}
                            value={this.state.categoria}
                            placeholder={this.state.categoria}
                        />
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
                        Editar
                    </Button>
                </Grid>
            </div>
        );
    }
}