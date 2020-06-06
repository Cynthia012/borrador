import { PrivacidadComponent } from './privacidad/privacidad.component';
import { CreateAccountComponent } from './component/create-account/create-account.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { LoginComponent } from './component/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'createAccount', component: CreateAccountComponent},
  {path: 'privacidad', component: PrivacidadComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
