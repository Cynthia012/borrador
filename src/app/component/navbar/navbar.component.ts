import { Component, OnInit } from '@angular/core';

//import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  bandera: boolean;
  userName: string;
  photoURL: string;
  userUid: any;

  currenUser: any;

  constructor(private aAuth: AngularFireAuth) {
    this.aAuth.onAuthStateChanged((user) => {
      this.onAuthStateChange(user);
    });
    this.aAuth.currentUser.then((user) => {
      this.currenUser = user;
      console.log(user);
    });
    if (this.currenUser) {
      this.upUser(this.currenUser);
    }
    //this.singOut();
  }

  ngOnInit(): void {
  }


  onAuthStateChange(user) {
    if (user) {
      this.upUser(user);
    }
  }

  singOut() {
    this.aAuth.signOut().then((res) => {
      console.log('se cerro sesion');
      console.log(res);
      this.cleanUser();
    })
      .catch((err) => {
        console.log('ocurrio un error\n', err);
      });
  }

  upUser(user) {
    this.bandera = true;
    this.photoURL = user.photoURL;
    this.userName = user.displayName;
    this.userUid = user.uid;
    console.log(this.userName);
  }

  cleanUser() {
    this.userName = '';
    this.photoURL = '';
    this.bandera = false;
    this.userUid = null;
  }

}
