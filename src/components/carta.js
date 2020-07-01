import React, { Component } from "react";
import {Document, Page } from 'react-pdf';
import Grid from '@material-ui/core/Grid';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';

export default class App extends Component {

  componentDidMount(){
    console.log(document.cookie);
    if(document.cookie == ""){
      document.cookie = "visit=1;"
    }
    else {
      console.log(document.cookie[6]);
      let current = Number(document.cookie[6]);
      if(current == 5){
        swal("Felicidades", "Has ganado un cupon", "success");
      }
      let newVisit = current+1;
      document.cookie = `visit=${newVisit}`;
    }
    
  }
  state = { numPages: null, pageNumber: 1, pdf: null };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  onSelectFile = (e) => {
    this.setState({
        pdf: e.target.files[0]
    });
  }

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div className="main">
        <Grid container direction="row">
            <Grid item xs={12}>
                <nav className="center-bottons">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowLeftIcon />}
                        onClick={this.goToPrevPage}
                        className="btn-margin"
                        disabled={this.state.pageNumber == 1? true: false}
                    >
                        Previo
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowRightIcon />}
                      onClick={this.goToNextPage}
                      className="btn-margin"
                      disabled={this.state.pageNumber < numPages? false: true}
                    >
                        Siguiente
                    </Button>
                </nav>
                <div style={{ width: window.innerWidth }}>
                    <Document
                      file={process.env.PUBLIC_URL + 'carta-desayunos.pdf'}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                    <Page pageNumber={pageNumber} width={window.innerWidth} onScroll={this.goToNextPage}/>
                    </Document>
                </div>
                <p>
                    Pagina {pageNumber} de {numPages}
                </p>
            </Grid>
        </Grid>
      </div>
    );
  }
}