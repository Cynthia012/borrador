import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { LoginComponent } from './component/login/login.component';
import { CreateAccountComponent } from './component/create-account/create-account.component';
import { PostComponent } from './component/post/post.component';

// Forms Reactive
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoadingComponent } from './component/loading/loading.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PerfilComponent,
    LoginComponent,
    CreateAccountComponent,
    PostComponent,
    LoadingComponent,
    PrivacidadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
