import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import PeopleIcon from '@material-ui/icons/People';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import { decorator } from '@babel/types';
import '../index.css';
import swal from 'sweetalert';
import firebase from "../firebase/config";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    title: {
        flexGrow: 1,
        marginLeft: 10
    }
  });

export default function Menu(props) {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(false)
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    useEffect(() => {
      if(firebase.auth.currentUser)
        setAuth(true);
    })

  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <ChildCareIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Cartas" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Cartas" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <TrendingFlatIcon />
          </ListItemIcon>
          <ListItemText primary="Salir" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  const fullList = side => (
    <div
      className={classes.fullList}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List component="nav" aria-label="main mailbox folders">
        <Link to="lista-usuarios"><ListItem button style={{color: 'black'}}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItem></Link>
        <Link to="lista-ventas"><ListItem button style={{color: 'black'}}>
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Ventas" />
        </ListItem></Link>
        <Link to="lista-gastos"><ListItem button style={{color: 'black'}}>
          <ListItemIcon>
            <ShoppingBasketIcon />
          </ListItemIcon>
          <ListItemText primary="Gastos" />
        </ListItem></Link>
        <Link to="lista-productos"><ListItem button style={{color: 'black'}}>
          <ListItemIcon>
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Productos" />
        </ListItem></Link>
        <Link to="/dashboard"><ListItem button style={{color: 'black'}}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem></Link>
        {auth?<ListItem button onClick={SignOut}>
          <ListItemIcon>
            <TrendingFlatIcon />
          </ListItemIcon>
          <ListItemText primary="Salir" />
        </ListItem>: ''}
      </List>
      <Divider />
    </div>
  );

  function SignOut() {
    firebase.auth.signOut()
    .then(() => {
      swal("Sesión Cerrada", "Tu sesión se ha cerrado correctamente", "success")
      .then(() => {
        window.location.href = "/";
      });
    })
    .catch(err => {
      console.log(err);
      swal("Error", "no se ha podido cerrar sesión, intente otra vez", "error");
    });
    
  }

    return(
        <AppBar position="static">
            <Toolbar>
                <Hidden lgUp>
                    <Icon edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('top', true)}>
                    menu
                    </Icon>
                </Hidden>
                <Typography variant="h6" className={classes.title}>
                Frida
                </Typography>
                <Hidden mdDown>
                    <Link to="/dashboard"><Button startIcon={<DashboardIcon/>} color="inherit">Dashboard</Button></Link>
                    <Link to="/lista-usuarios"><Button startIcon={<PeopleIcon/>} color="inherit">Usuarios</Button></Link>
                    <Link to="/lista-ventas"><Button startIcon={<AttachMoneyIcon/>} color="inherit">Ventas</Button></Link>
                    <Link to="/lista-gastos"><Button startIcon={<ShoppingBasketIcon/>} color="inherit">Gastos</Button></Link>
                    <Link to="/lista-productos"><Button startIcon={<RestaurantIcon/>} color="inherit">Productos</Button></Link>
                    {auth ? <Button startIcon={<TrendingFlatIcon/>} onClick={SignOut} color="inherit">Salir</Button>: ''}
                </Hidden>
                
            </Toolbar>
            <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList('left')}
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="top"
        open={state.top}
        onClose={toggleDrawer('top', false)}
        onOpen={toggleDrawer('top', true)}
      >
        {fullList('top')}
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="bottom"
        open={state.bottom}
        onClose={toggleDrawer('bottom', false)}
        onOpen={toggleDrawer('bottom', true)}
      >
        {fullList('bottom')}
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        onOpen={toggleDrawer('right', true)}
      >
        {sideList('right')}
      </SwipeableDrawer>
        </AppBar>
    );
}