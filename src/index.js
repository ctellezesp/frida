import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';

//Componentes
import Login from './components/login';
import Dashboard from './components/dashboard';
import NotFound from './components/not-found';
import PanelVendedor from './components/panel-vendedor';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title: 'Frida'
        }
    }

    render() {
        return (
            <Router>
                <Route path="/" exact component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/panel-vendedor" component={PanelVendedor} />
                <Route path="/not-found" component={NotFound} />
            </Router>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);