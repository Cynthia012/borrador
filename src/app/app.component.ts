import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// para hacer validaciones custom
import { ValidatorFn, AbstractControl } from '@angular/forms';


// autenticacion
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
// Administracion de usuarios https://firebase.google.com/docs/auth/web/manage-users?authuser=0

// para realtime database
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Timestamp } from 'rxjs';
// para administrar la base de datos https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  title = 'Ejemplo';

  bd = firebase.firestore();

  forma: FormGroup;
  formLogin: FormGroup;
  bandera: boolean = false;
  myPosts: any [] = [];
  // usuario: Usuario;
  photoURL: string;
  userName: string;

  constructor(private afAuth: AngularFireAuth) {
    this.forma = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena1: new FormControl('', [Validators.required, Validators.minLength(6)]),
      contrasena2: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.forma.get('contrasena2').setValidators(
      CustomValidators.equals(this.forma.get('contrasena1'))
    );

    this.formLogin = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.singOut();
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }



  onAuthStateChanged(user) {
    if (user) {
      this.photoURL = user.photoURL;
      this.bandera = true;
    }
    else {
      this.photoURL = '';
      this.bandera = false;

    }
  }

  guardarCambios(): void {
    const email = this.forma.value.correo;
    const password = this.forma.value.contrasena1;
    if (email && password) {
      // ------------------------- CREACION DE UN USUARIO ----------------------//
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        // console.log('usuario creado');
        // ----- ACTUALIZAR UN USUARIO ---------//
        const user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: `${this.forma.value.nombre} ${this.forma.value.apellido}`,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/prueba-31882.appspot.com/o/userDefault.png?alt=media&token=df2c7f92-bbff-4f6e-b6bb-f978d9a63465'
        }).then(() => {
          // console.log(`${this.forma.value.nombre} ${this.forma.value.apellido}`);
          // console.log('se Agrego el nombre correctamente');
          this.forma.reset();
          // ---------- AGREGA A LA BASE DE DATOS---------
          this.agregarABD(user);
          // ----------------------------------------------
        }).catch((error) => {
          // An error happened.
        });
        // -------- FIN ACTUALIZAR UN USUARIO ------------
        // console.log(user);
        /* ------------ AGREGAR CON UN ID AUTOMATICO EN LA BD-----------
        this.bd.collection('users').add({
          uid: firebase.auth().currentUser.uid,
          first: this.forma.value.nombre,
          last: this.forma.value.apellido,
          corre: this.forma.value.correo
        })
        .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
          ---------------------------------------------------------------
          */
        // Verificacion de e-mail
        /*firebase.auth().currentUser.sendEmailVerification().then( () => {
          alert('Correo mandado');
        });*/
        // fin Verificacion e-mail

      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' ', errorMessage);
          if (errorCode === 'auth/email-already-in-use') {
            alert('El correo ya esta registrado');
          }
        });
      // ------------------------ FIN CREACION DE UN USUARIO --------------------------
    }

  }


  doFacebookLogin() {
    let f = new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
    f.then((res) => {
      // res.user tiene toda la informacion del usuario
      // console.log(res);
      this.datosMostrarEnHTML(res);

    });
    return f;
  }

  crearConFB() {
    let f = new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
    f.then((res) => {
      // res.user tiene toda la informacion del usuario
      // console.log(res);
      this.datosMostrarEnHTML(res);
      this.agregarABD(res.user);

    });
    return f;
  }


  doGoogleLogin() {
    let user;
    let g = new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
      this.bandera = true;
    });
    g.then((res) => {
      // console.log(res.user);
      // res.user tiene toda la informacion del usuario
      this.datosMostrarEnHTML(res);
      this.leeBD(res.user);
    });
    return g;
  }

  crearConGoogle() {
    let g = new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
      this.bandera = true;
    });
    g.then((res) => {
      // console.log(res.user);
      // res.user tiene toda la informacion del usuario
      this.agregarABD(res.user);
      this.datosMostrarEnHTML(res);
    });
    return g;
  }


  agregarABD(user: any) {
    this.bd.collection('usuarios').doc(user.uid).set({
      nombre: user.displayName,
      correo: user.email,
      fotoURL: user.photoURL,
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp() // registra el tiempo

    })
      .then((res) => {
        console.log('usuario agregado a la base de datos');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  leeBD(user) {
    console.log(user);
    this.bd.collection(`usuarios/${user.uid}/posts`).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const {mensaje,hora,autor} = doc.data();
        console.log(`${mensaje} ${hora} ${autor}`);
        this.myPosts.push({
          id,
          mensaje,
          hora: new Date(hora * 1000),
          autor
        });
      });
      console.log(this.myPosts);
    });
    // console.log(x);
  }

  datosMostrarEnHTML(res) {
    this.bandera = true;
    this.photoURL = res.user.photoURL;
    this.userName = res.user.displayName;
    // console.log(res);
  }
  singOut() {
    firebase.auth().signOut().then(() => {
      console.log('cerro sesion');
      this.clearUser();
    })
      .catch((error) => {
        console.log(error);
        console.log('error de cerrar sesion');
      });
  }

  clearUser() {
    this.bandera = false;
    this.photoURL = '';
    this.userName = '';
  }

  loginIn() {
    firebase.auth().signInWithEmailAndPassword(this.formLogin.value.correo, this.formLogin.value.contrasena)
      .then((res) => {
        this.datosMostrarEnHTML(res);
        let user=firebase.auth().currentUser;
        this.leeBD(user);
        console.log('se logueo');
        // console.log(res);
      })
      .catch((error) => {
        // Handle Errors here.
        // tslint:disable-next-line: prefer-const
        let errorCode = error.code;
        // tslint:disable-next-line: prefer-const
        let errorMessage = error.message;
        console.log(errorCode, ' ', errorMessage);
      });
    
  }

}
function equalsValidator(otherControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value: any = control.value;
    const otherValue: any = otherControl.value;
    return otherValue === value ? null : { notEquals: { value, otherValue } };
  };
}

export const CustomValidators = {
  equals: equalsValidator
};

export interface Usuario {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  isAnonymous: boolean;
  uid: string;
  providerData: any;

}
