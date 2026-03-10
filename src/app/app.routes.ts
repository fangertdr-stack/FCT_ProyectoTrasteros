import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';
import { Errors } from './pages/errors/errors';
import { UsersCrud } from './services/users-crud';
import { ListUser } from './pages/users/list-user/list-user';
import { adminGuard } from './core/admin-guard';
import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { RentPage } from './pages/rent-page/rent-page';
import { EditUser } from './pages/users/edit-user/edit-user';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPage, canActivate: [adminGuard] },
  { path: 'users', component: ListUser},
  { path: 'rent', component: RentPage},
  { path: '', component: MainPage},
  { path: 'edit-user/:id', component: EditUser },

  { path: '**', component: Errors}
];
