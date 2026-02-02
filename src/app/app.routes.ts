import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminPage } from './pages/admin-page/admin-page';
import { MainPage } from './pages/main-page/main-page';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPage},
  { path: '', component: MainPage}

];
