import React, {Component} from 'react';
import CreatableSelect from 'react-select/creatable';
import Menu from '../menu';
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
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ImageUploader from 'react-images-upload';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });


export default class RegistrarProductos extends Component{
    constructor(props){
        super(props);
        this.state = {
            nombre: '',
            categorias: [],
            categoria: undefined,
            descripcion: '',
            precio: '',
            isLoading: false,
            src: null,
            crop: {
                unit: '%',
                width: 30,
                aspect: 4 / 3,
            },
            croppedImageUrl: null,
            imgCrop: ''
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

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () =>
            this.setState({ src: reader.result })
          );
          reader.readAsDataURL(e.target.files[0]);
        }
      };
    
      // If you setState the crop in here you should return false.
      onImageLoaded = image => {
        this.imageRef = image;
      };
    
      onCropComplete = crop => {
        this.makeClientCrop(crop);
      };
    
      onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
      };
    
      async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            crop,
            'newFile.jpeg'
          );
          this.setState({ croppedImageUrl });
          console.log(croppedImageUrl);
        }
      }
    
      getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
    
        return new Promise((resolve, reject) => {
          console.log("Convert to blob...");
          console.log(canvas);
          canvas.toBlob(blob => {
            if (!blob) {
              //reject(new Error('Canvas is empty'));
              console.error('Canvas is empty');
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
          }, 'image/jpeg');
          let img = canvas.toDataURL("image/png");
          this.setState({
              imgCrop: img
          });
        });
    }

    uploadFile = async () => {
        let data = {
            "file": this.state.imgCrop,
            "upload_preset": "ouf8b7zl",
        }
        const res = await fetch('https://api.cloudinary.com/v1_1/ddp3psjjj/image/upload', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json'
          },
        })
        const file = await res.json();
        console.log(file);
        console.log(file.secure_url);
        //setImage(file.secure_url)
        //setLargeImage(file.eager[0].secure_url)
    }

    save() {
        if(this.state.nombre === "" || this.state.categoria === "" || this.state.precio === "") {
            swal("Datos no validos", "Ningún dato puede estar vacio", "error");
        } else {
            console.log(this.state);
            let uploadTask = firebase.storage.ref().child(`images/${this.state.nombre}.png`).putString(this.state.imgCrop, 'data_url', {
                contentType: 'image/jpeg',
              });
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
            }, function(error) {
                console.log(error);
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                });
            });
            firebase.storage.ref().child(`carta/${this.state.name}`).putString(this.state.imgCrop, 'base64', {contentType: 'image/png'})
            .then(res => {
                console.log(res);
                console.log('Uploaded a base64url string!');
            })
            .catch(err => {
                console.log(err);
            });
            debugger;
            let toSave = {
                nombre: this.state.nombre,
                categoria: (typeof this.state.categoria == "string") ? this.state.categoria : this.state.categoria.value,
                descripcion: this.state.descripcion,
                precio: this.state.precio
            }
            firebase.db.collection("productos").add(toSave)
            .then(() => {
                swal("Producto agregado", `${this.state.nombre} ha sido agregado correctamente`, "success")
                .then(() => {
                    this.props.history.push("/lista-productos");
                })
            })
            .catch(err => {
                console.log(err);
                swal("Error", "Por favor, intentalo otra vez", "error");
            });
        }
    }

    

    render() {
        return(
            <div className="main">
                <Menu />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h3" gutterBottom>
                        Registrar Producto
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Por favor introduce los datos siguientes:
                    </Typography>
                </Grid>
                <Paper>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Grid item xs={12} lg={8}>
                            <input accept="image/*" className="no-show" id="icon-button-file" type="file" onChange={this.onSelectFile} />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                            {this.state.src && (
                                <ReactCrop
                                    src={this.state.src}
                                    crop={this.state.crop}
                                    ruleOfThirds
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            {this.state.croppedImageUrl && (
                                <img alt="Crop" style={{ maxWidth: '100%' }} src={this.state.croppedImageUrl} />
                            )}
                        </Grid>
                    </Grid>
                    
                </Paper>
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
                            placeholder="Selecciona la categoria"
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
                        Registrar
                    </Button>
                </Grid>
            </div>
        );
    }
}