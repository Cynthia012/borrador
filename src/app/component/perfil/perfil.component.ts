import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  bandera: boolean = false;
  myPosts: any [] = [];
  flagLoading: boolean = false;
  bd;

  constructor(private afAuth: AngularFireAuth, private router: Router, private afBD: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user){
        this.bandera = true;
        this.addMyPosts(user);
      }
      else {
        this.bandera = false;
        this.router.navigate(['login']);
      }
    });
    this.bd = this.afBD.firestore;
  }

  ngOnInit(): void {
  }

  addMyPosts(user){
    this.flagLoading = true;
    this.bd.collection(`usuarios/${user.uid}/posts`).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const {mensaje, hora, autor} = doc.data();
        console.log(`${hora}`);
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
}
