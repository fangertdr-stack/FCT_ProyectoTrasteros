import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';
import { Errors } from './pages/errors/errors';
import { ListUser } from './pages/users/list-user/list-user';
import { adminGuard } from './core/admin-guard';
import { RentPage } from './pages/rent-page/rent-page';
import { EditUser } from './pages/users/edit-user/edit-user';
import { ContactPage } from './pages/contact-page/contact-page';

export const routes: Routes = [

  { path: '', component: MainPage },

  { path: 'login', component: LoginComponent },

  { path: 'admin', component: AdminPage, canActivate: [adminGuard] },

  { path: 'users', component: ListUser },

  { path: 'edit-user/:id', component: EditUser },

  { path: 'rent', component: RentPage },

  { path: 'contact', component: ContactPage },

  { path: '**', component: Errors }

];
