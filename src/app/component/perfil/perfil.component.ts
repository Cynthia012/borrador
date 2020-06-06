import { UserService } from './../../service/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  bandera: boolean = false;
  myPosts: any[] = [];
  flagLoading: boolean = false;
  bd;

  constructor(private ngZone: NgZone, private afAuth: AngularFireAuth, private router: Router, private afBD: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.ngZone.run(() => { // para que cuando se refresque la pagina, no se pierda el ususario
          this.addMyPosts(user);
        });
      }
      else {
        this.cleanUser();
        this.router.navigate(['login']);
      }
    });
    this.bd = this.afBD.firestore;
    // this.userService.updateUser();
  }

  ngOnInit(): void {
  }

  addMyPosts(user) {
    this.bandera = true;
    this.flagLoading = true;
    this.bd.collection(`usuarios/${user.uid}/posts`).onSnapshot((querySnapshot) => {
      this.myPosts = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const { mensaje, hora, autor } = doc.data();
        this.myPosts.push({
          id,
          mensaje,
          hora: new Date(hora * 1000),
          autor
        });
      });
      this.flagLoading = false;
    });
  }

  cleanUser(){
    this.bandera = false;
    this.myPosts = [];
  }

}
