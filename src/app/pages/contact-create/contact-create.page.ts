import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-create-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-create.page.html',
  styleUrl: './contact-create.page.css'
})
export class ContactCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly contactsService = inject(ContactsService);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    otherId: ['', [Validators.required]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contactsService.create(this.form.getRawValue());
    this.toastr.success('Contact has been added.', 'Success');
    void this.router.navigate(['/contacts']);
  }

  protected hasError(controlName: 'name' | 'mobile' | 'email' | 'otherId'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected getErrorMessage(controlName: 'name' | 'mobile' | 'email' | 'otherId'): string {
    const control = this.form.controls[controlName];

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (controlName === 'email' && control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    return '';
  }
}
