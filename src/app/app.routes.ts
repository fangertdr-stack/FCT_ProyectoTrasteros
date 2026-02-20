import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';
import { Errors } from './pages/errors/errors';
import { UsersCrud } from './services/users-crud';
import { ListUser } from './pages/users/list-user/list-user';
import { Auth } from './core/auth';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [Auth],
    loadComponent: () =>
      import('./pages/admin-page/admin-page')
        .then(m => m.AdminPage)
  },
  { path: 'users', component: ListUser},
  { path: '', component: MainPage},
  { path: '**', component: Errors}
];
