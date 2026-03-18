import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { Upload } from './features/upload/upload';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'upload', 
    component: Upload,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];