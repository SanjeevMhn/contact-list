import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css'
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    // Check if passwords match
    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }
    
    // Placeholder for register logic
    // For now, we'll just navigate to the login page
    this.router.navigate(['/login']);
  }
  
  // Helper methods for template
  protected hasError(controlName: 'name' | 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected getErrorMessage(controlName: 'name' | 'email' | 'password' | 'confirmPassword'): string {
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
    
    if (controlName === 'confirmPassword' && control.hasError('mismatch')) {
      return 'Passwords do not match.';
    }
    
    return '';
  }
}