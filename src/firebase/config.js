import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAJC1fKzN4xH_l-Q-6M30zXtKiBXzzPc3M",
    authDomain: "cafetefrida.firebaseapp.com",
    databaseURL: "https://cafetefrida.firebaseio.com",
    projectId: "cafetefrida",
    storageBucket: "cafetefrida.appspot.com",
    messagingSenderId: "935483694980",
    appId: "1:935483694980:web:9f88f484a0289a9f1087d1"
}

class Firebase{

  constructor(){
      firebase.initializeApp(config);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.storage = firebase.storage();
      this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }
}

export default new Firebase();