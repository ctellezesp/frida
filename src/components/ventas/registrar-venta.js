import React, {Component} from 'react';
import Menu from '../menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "../../firebase/config";
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default class RegistrarVenta extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            productos: [],
            precio_total: 0,
            metodo_pago: '',
            listaProductos: [],
            categorias: [],
            activeIndex: 0,
        }
        this.addProduct = this.addProduct.bind(this);
        this.lessProduct = this.lessProduct.bind(this);
        this.moreProduct = this.moreProduct.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        this.setState({
            date: `${year}-${month}-${day}`
        });
        firebase.db.collection("productos").get()
        .then(res => {
            let options = [];
            res.docs.forEach(product => options.push(product.data().categoria));
            options = options.filter((item, index) => options.indexOf(item) === index);
            options.forEach(option => this.setState({
                categorias: [...this.state.categorias, option],
                listaProductos: [...this.state.listaProductos, {
                    categoria: option,
                    items: res.docs.filter(item => item.data().categoria == option)
                }]
            }));
        });
    }

    addProduct(prod) {
        let current = [];
        this.state.productos.forEach(prod => current.push(prod.id));
        if(current.includes(prod.id))
            swal("Producto ya agregado", "Este producto ya esta en la lista", "error");
        else {
            this.setState({
                productos: [...this.state.productos, {
                    id: prod.ref.id,
                    nombre: prod.data().nombre,
                    precio: prod.data().precio,
                    cantidad: 1
                }],
                precio_total: this.state.precio_total + prod.data().precio
            });
        }
    }

    lessProduct(ind) {
        if(this.state.productos[ind].cantidad === 1){
            swal("Invalido", "No puede haber 0 productos", "error");
        }
        else this.state.productos[ind].cantidad -= 1;
    }

    moreProduct(ind) {
        this.state.productos[ind].cantidad += 1;
    }

    save() {

    }

    render(){
        const ColoredLine = ({ color }) => (
            <hr
                style={{
                    color: color,
                    backgroundColor: color,
                    height: 2
                }}
            />
        );
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h3" gutterBottom>
                        Nueva venta
                    </Typography>
                </Grid>
                <Paper style={{margin: 20, background: '#eee', padding: 10}}>
                    <Grid container direction="row" justify="center" alignItems="stretch">
                        <Grid item xs={12} md={8}>
                        <Tabs>
                            <TabList>
                            {this.state.categorias.map((cat, index) => {
                                return <Tab key={index}>{cat}</Tab>
                            })}
                            </TabList>
                            
                            {this.state.listaProductos.map((cat, index) => {
                                return(
                                    <TabPanel key={index}>
                                        <div>
                                            <List>
                                                {cat.items.map((prod, indice) => {
                                                    return(
                                                        <ListItem key={indice}>
                                                            <ListItemAvatar onClick={(e) => this.addProduct(prod)}>
                                                            <Avatar>
                                                                <AddIcon />
                                                            </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText primary={prod.data().nombre} secondary={`$ ${prod.data().precio}`} />
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </div>
                                    </TabPanel>
                                );
                            })}
                        </Tabs>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h4">Pedido</Typography>
                            {this.state.productos.map((prod, index) => {
                                return(
                                    <div key={index}>
                                        <Grid container direction="row">
                                            <Grid item xs={4}>
                                                <span>{prod.nombre}</span>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <button onClick={(e) => this.lessProduct(index)}>-</button> <span>{prod.cantidad}</span><button onClick={(e) => this.moreProduct(index)}>+</button>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <IconButton aria-label="delete">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <ColoredLine color="black" />
                                    </div>
                                );
                            })}
                            <Typography variant="h5">
                                Cantidad total: $ {this.state.precio_total}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}