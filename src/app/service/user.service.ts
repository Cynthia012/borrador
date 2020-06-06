import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private $user: BehaviorSubject<any> = new BehaviorSubject<any>(null);//igual a nulo
  _user: Observable<any> = this.$user.asObservable(); //_person sera un observable de un solo objeto
  aux;


  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.currentUser.then((user) => {this.aux = user; });
    this.$user.next(this.aux);
   }

   updateUser(){
    this.afAuth.currentUser.then((user) => {this.aux = user; });
    this.$user.next(this.aux);
    // console.log(this.aux);
  }

  setUser(user){
    this.$user.next(user);
    // console.log('se puso un usuario');
  }
}
