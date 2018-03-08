import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Oauth2connectComponent } from './oauth2connect/oauth2connect.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'connect',
    component: Oauth2connectComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
