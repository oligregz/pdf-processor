import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';
import { UploadComponent } from './features/upload/upload.component';
import { DownloadComponent } from './features/download/download.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'upload', 
    component: UploadComponent,
    canActivate: [authGuard]
  },
  { path: 'download/:id', component: DownloadComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];