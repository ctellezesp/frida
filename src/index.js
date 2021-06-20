import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


//Componentes
import Login from './components/login';
import Dashboard from './components/dashboard';
import NotFound from './components/not-found';
import PanelVendedor from './components/panel-vendedor';
import CrearUsuario from './components/usuarios/crear-usuario';
import EditarUsuario from './components/usuarios/editar-usuario';
import ListaUsuarios from './components/usuarios/lista-usuarios';
import RegistrarProductos from './components/productos/registrar-producto';
import ListaProductos from './components/productos/lista-productos';
import EditarProducto from './components/productos/editar-producto';
import RegistrarVenta from './components/ventas/registrar-venta';
import RegistrarGasto from './components/gastos/registrar-gasto';
import Carta from './components/carta';
import Cropper from './components/cropper';

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Frida'
        }
    }

    render() {
        return (
            <Router>
                <Route path="/" exact component={Carta} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/panel-vendedor" component={PanelVendedor} />
                <Route path="/crear-usuario" component={CrearUsuario} />
                <Route path="/editar-usuario/:id" component={EditarUsuario} />
                <Route path="/lista-usuarios" component={ListaUsuarios} />
                <Route path="/registrar-productos" component={RegistrarProductos} />
                <Route path="/lista-productos" component={ListaProductos} />
                <Route path="/editar-producto/:id" component={EditarProducto} />
                <Route path="/registrar-venta" component={RegistrarVenta} />
                <Route path="/registrar-gasto" component={RegistrarGasto} />
                <Route path="/carta" component={Carta} />
                <Route path="/cropper" component={Cropper} />
                <Route path="/not-found" component={NotFound} />
            </Router>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);