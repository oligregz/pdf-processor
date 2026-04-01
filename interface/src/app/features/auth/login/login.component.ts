import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

import { AuthService } from '../auth';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ILoginRequest } from '../../../shared/common/types/auth.type';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, FormsModule], 
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public email = signal<string>('');
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public isEmailValid = computed<boolean>(() => {
    const emailValue = this.email();
    if (emailValue.length === 0) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  });

  public emailError = computed<string | null>(() => {
    if (this.email().length > 0 && !this.isEmailValid()) {
      return 'Invalid e-mail format.';
    }
    return null;
  });

  public onSubmit(): void {
    if (!this.isEmailValid()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: ILoginRequest = { email: this.email() };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/upload']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Authentication failed. Please verify your e-mail.');
      }
    });
  }
}