import { UserService } from './../../service/user.service';
import { Component, OnInit, NgZone } from '@angular/core';

// import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  // tslint:disable-next-line: variable-name
  sub_user: Subscription;
  bandera: boolean;
  userName: string;
  photoURL: string;
  userUid: any;

  currenUser: any;

  constructor(private aAuth: AngularFireAuth, private userService: UserService, private ngZone: NgZone) {
    this.aAuth.onAuthStateChanged((user) => {
      this.onAuthStateChange(user);
    });
    this.aAuth.currentUser.then((user) => {
      this.currenUser = user;
    });
    if (this.currenUser) {
      console.log(this.currenUser);
      this.upUser(this.currenUser);
    }
    this.suscribeToUser();
  }

  ngOnInit(): void {
  }


  suscribeToUser(){
    this.sub_user = this.userService._user.subscribe((user) => {
      if (user){
        this.ngZone.run(() => { // para cuando se refresca la pagina, no se pierda el usuario
          console.log(user);
          this.upUser(user);
        });
      }
      else{
        this.cleanUser();
      }
    });
  }



  onAuthStateChange(user) {
    if (user) {
      this.upUser(user);
    }
  }

  singOut() {
    this.aAuth.signOut().then((res) => {
      console.log(res);
      this.cleanUser();
    })
      .catch((err) => {
        console.log('ocurrio un error\n', err);
      });
    this.userService.updateUser();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.sub_user){
      this.sub_user.unsubscribe();
    }
  }

  upUser(user) {
    this.bandera = true;
    this.photoURL =  user.photoURL;
    this.userName =  user.displayName;
    this.userUid =   user.uid;
  }

  cleanUser() {
    this.userName = '';
    this.photoURL = '';
    this.bandera = false;
    this.userUid = null;
  }

}
