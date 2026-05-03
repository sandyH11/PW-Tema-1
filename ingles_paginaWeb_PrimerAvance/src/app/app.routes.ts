import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { AdminComponent } from './pages/admin/admin';
import { StudentComponent } from './pages/student/student';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Página principal
  {
    path: '',
    component: HomeComponent,
  },

  // Login
  {
    path: 'login',
    component: LoginComponent,
  },

  // Registro
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
  },

  {
    path: 'student',
    component: StudentComponent,
    canActivate: [authGuard],
  },
];
