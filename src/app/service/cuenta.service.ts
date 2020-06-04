import { Usuario } from './../app.component';
import { Injectable } from '@angular/core';
// autenticacion
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
public usuario: Usuario;

  constructor(private afAuth: AngularFireAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        this.info(displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData);
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });
   }

   info(displayName: string, email: string, emailVerified: boolean, photoURL: string, isAnonymous: boolean, uid: string, providerData: any): Usuario{
      /*this.usuario.displayName = displayName;
      this.usuario.email = email;
      this.usuario.emailVerified = emailVerified;
      this.usuario.photoURL = photoURL;
      this.usuario.isAnonymous = isAnonymous;
      this.usuario.uid = uid;
      this.usuario.providerData = providerData;*/
      var aux: Usuario;
      aux.displayName = displayName;
      aux.email = email;
      aux.emailVerified = emailVerified;
      aux.photoURL = photoURL;
      aux.isAnonymous = isAnonymous;
      aux.uid = uid;
      aux.providerData = providerData;
      return aux;
   }


  loginWithFB() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  loginWithGoogle() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    });
  }

  singOut() {
    firebase.auth().signOut().then(() => {
      console.log('cerro sesion');
    })
      .catch((error) => {
        console.log(error);
        console.log('error de cerrar sesion');
      });
  }
}
