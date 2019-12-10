import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Menu from '../menu';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import TodayIcon from '@material-ui/icons/Today';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import swal from 'sweetalert';
import firebase from "../../firebase/config";

export default class ListaProductos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorias: [],
            productos: []
        }
        this.delete = this.delete.bind(this);
  }

    componentDidMount() {
        firebase.db.collection("productos").get()
        .then(res => {
            let options = [];
            res.docs.forEach(product => options.push(product.data().categoria));
            options = options.filter((item, index) => options.indexOf(item) === index);
            options.forEach(option => this.setState({
                categorias: [...this.state.categorias, option],
                productos: [...this.state.productos, {
                    categoria: option,
                    items: res.docs.filter(item => item.data().categoria == option)
                }]
            }));
        });
    }


    delete(product){
        swal({
            title: "¿Quieres eliminar esta carta?",
            text: "Una vez que lo elimines no podrás recuperar la información",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                firebase.db.collection("productos").doc(product).delete()
                .then(() => {
                    swal("Producto Eliminado", "El producto se ha eliminado correctamente", "success");
                })
            } else {
              swal("Eliminación Cancelada");
            }
        });
    }

    render() {
        
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="flex-end" alignItems="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{margin: 20}}
                        startIcon={<AddIcon />}
                        disabled={this.state.christmas}
                        onClick={() => this.props.history.push('/registrar-producto')}
                    >
                        Registrar Producto
                    </Button>
                </Grid>
                <Grid container direction="column" justify="center" alignItems="stretch">
                    <Grid item xs={12}>
                        {this.state.productos.length ? this.state.productos.map((cat, index) => {
                            return(
                                <div style={{width: '100%'}} key={index}>
                                    <ExpansionPanel>
                                        <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        >
                                        <Typography>{cat.categoria}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{width: '100%'}}>
                                            <List dense={true} style={{width: '90%'}}>
                                                {cat.items.map((item, index) => {
                                                    return(
                                                        <ListItem key={index}>
                                                            <ListItemAvatar>
                                                                <Avatar>
                                                                <RestaurantIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={item.data().nombre}
                                                                secondary={`$ ${item.data().precio}`}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton edge="end" aria-label="edit" onClick={(e) => this.props.history.push(`editar-producto/${item.ref.id}`)}>
                                                                    <EditIcon style={{color: 'blue'}} />
                                                                </IconButton>
                                                                <IconButton edge="end" aria-label="delete" onClick={(e) => this.delete(item.ref.id)}>
                                                                    <DeleteIcon style={{color: 'red'}} />
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>
                            );
                        }): <Typography variant="h5" gutterBottom>No hay productos</Typography>}
                    </Grid>
                </Grid>
            </div>
        );
    }

}