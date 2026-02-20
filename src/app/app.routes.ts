import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';
import { Errors } from './pages/errors/errors';
import { UsersCrud } from './services/users-crud';
import { ListUser } from './pages/users/list-user/list-user';
<<<<<<< HEAD
import { adminGuard } from './core/admin-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPage, canActivate: [adminGuard] },
=======
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
>>>>>>> 5ed046ca9e184f1e192f711b7927d3ffd21b6e65
  { path: 'users', component: ListUser},
  { path: '', component: MainPage},
  { path: '**', component: Errors}
];
