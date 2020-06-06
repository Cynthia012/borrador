import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  formPost: FormGroup;
  bd;

  constructor(private afBD: AngularFirestore, private afAuth: AngularFireAuth) {
    this.formPost = new FormGroup({
      message: new FormControl('', Validators.required),
    });
    this.bd = this.afBD.firestore;
   }

  ngOnInit(): void {
  }

  postear(){
    this.afAuth.currentUser.then((user) => {
      this.bd.collection(`usuarios/${user.uid}/posts`).add({
        mensaje: this.formPost.value.message,
        autor: user.displayName,
        hora: firebase.firestore.FieldValue.serverTimestamp()
      });
    }).then((res) => {
      console.log('posteo');
      this.formPost.reset();
    }).catch((err) => {
      console.log(err);
    });
  }

}
