import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    // Placeholder for login logic
    // For now, we'll just navigate to the contacts page
    this.router.navigate(['/contacts']);
  }

  loginAsGuest(): void {
    // Navigate to contacts as guest
    this.router.navigate(['/contacts']);
  }
  
  // Helper methods for template
  protected hasError(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected getErrorMessage(controlName: 'email' | 'password'): string {
    const control = this.form.controls[controlName];
    
    if (control.hasError('required')) {
      return `This field is required.`;
    }
    
    if (controlName === 'email' && control.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    
    if (controlName === 'password' && control.hasError('minlength')) {
      return 'Password must be at least 6 characters.';
    }
    
    return '';
  }
}