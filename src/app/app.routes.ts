import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';
import { Errors } from './pages/errors/errors';
import { UsersCrud } from './services/users-crud';
import { ListUser } from './pages/users/list-user/list-user';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPage},
  { path: 'users', component: ListUser},
  { path: '', component: MainPage},
  { path: '**', component: Errors}
];
