import { UserService } from './../../service/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth'; // firebase authentication
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import * as firebase from 'firebase/app';
import sweetAlert from 'sweetalert';

import { Router } from '@angular/router';


// herramientas de administracion de usuarios: cambio de contrase;a etc
// https://firebase.google.com/docs/auth/unity/manage-users?hl=es-419#set_a_users_email_address 





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  flagLoading: boolean = false;
  bandera: boolean = false;
  mensaje = 'Bienvenido! Inicia Sesion!';
  bd;

  constructor(private userService: UserService, private afAuth: AngularFireAuth, private router: Router, private afBD: AngularFirestore ) {
    this.formLogin = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', Validators.required)
    });
    this.afAuth.onAuthStateChanged((user) => {
      this.onAuthStateChange(user);
    });
    this.bd = this.afBD.firestore;
    // this.userService.updateUser();
   }

  ngOnInit(): void {
  }

  onAuthStateChange(user){
    if (user){
      this.bandera = true;
      this.mensaje = `Bienvenido ${user.displayName}! Debes cerrar sesion para iniciar con otra cuenta`;
    }
    else {
      this.bandera = false;
      this.mensaje = 'Bienvenido! Inicia Sesion!';
    }
  }



  loginIn(){
    this.flagLoading = true;
    this.afAuth.signInWithEmailAndPassword(this.formLogin.value.correo, this.formLogin.value.contrasena)
    .then( (res) => {
      this.userService.updateUser();
      this.flagLoading = false;
      this.router.navigate(['/perfil']);
    })
    .catch((err) => {
      this.flagLoading = false;
      if (err.code === 'auth/user-not-found'){
        sweetAlert('Error', 'El usuario no se ha encontrado', 'error');
      }
      else if (err.code === 'auth/wrong-password'){
        sweetAlert('Error', 'La contrasena es incorrecta, intenta de nuevo', 'error');
      }
    });
  }

  doGoogleLogin(){
    this.flagLoading = true;
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
          this.addUserToDB(res.user);
          this.flagLoading = false;
          this.router.navigate(['/perfil']);
        }, err => {
          console.log(err);
          reject(err);
        });
    });

  }

  doFacebookLogin(){
    this.flagLoading = true;
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
          this.addUserToDB(res.user);
          this.flagLoading = false;
          this.router.navigate(['/perfil']);
        }, err => {
          console.log(err);
          reject(err);
        });
      this.flagLoading = true;
      this.router.navigate(['/perfil']);
    });
  }

  addUserToDB(user){
    this.bd.collection('usuarios').doc(user.uid).set({
      nombre: user.displayName,
      correo: user.email,
      fotoURL: user.photoURL,
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp() // registra el tiempo

    })
      .then((res) => {
        console.log('usuario agregado a la base de datos');
        this.userService.updateUser();
      })
      .catch((err) => {
        console.log(err);
      });
  }


  singout(){
    this.afAuth.signOut().then((res) => {
      console.log('se cerro en logincomponent');
    });
  }

}
