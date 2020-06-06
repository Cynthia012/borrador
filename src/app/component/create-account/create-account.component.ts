import { UserService } from './../../service/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// hacer validaciones customs
import { ValidatorFn, AbstractControl } from '@angular/forms';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  forma: FormGroup;
  bd;
  flagLoading: boolean = false;

  constructor(private userService: UserService, private afAuth: AngularFireAuth, private afBD: AngularFirestore, private router: Router) {
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
    this.bd = this.afBD.firestore;
    this.userService.updateUser();
  }

  ngOnInit(): void {
  }

  guardarCambios() {
    this.flagLoading = true;
    const email = this.forma.value.correo;
    const password = this.forma.value.contrasena1;
    if (email && password) {
      this.afAuth.createUserWithEmailAndPassword(email, password).then(() => {
        this.afAuth.currentUser.then((user) => {
          user.updateProfile({
            displayName: `${this.forma.value.nombre} ${this.forma.value.apellido}`,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/prueba-31882.appspot.com/o/userDefault.png?alt=media&token=df2c7f92-bbff-4f6e-b6bb-f978d9a63465'
          }).then((res) => {
            this.forma.reset();
            this.addUserToDB(user);

          }).catch((err) => {
            console.log(err);
          });
          /*user.sendEmailVerification().then( () => {
            alert('Correo mandado');
          });*/
        });
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' ', errorMessage);
          if (errorCode === 'auth/email-already-in-use') {
            sweetAlert('Error', 'El correo ya esta registrado', 'error');
          }
        });
    }
  }

  addUserToDB(user){
    this.bd.collection('usuarios').doc(user.uid).set({
      nombre: user.displayName,
      correo: user.email,
      fotoURL: user.photoURL,
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp() // registra el tiempo

    })
      .then((res) => {
        sweetAlert('Bien!', 'Ahora tienes una cuenta con nosotrooos!', 'success');
        console.log('usuario agregado a la base de datos');
        this.afAuth.signOut().then(() => {
          this.userService.updateUser();
          this.router.navigate(['login']);
        });
      })
      .catch((err) => {
        console.log(err);
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
