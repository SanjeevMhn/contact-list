import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Contact } from '../../models/contact.model';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-detail-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-detail.page.html',
  styleUrl: './contact-detail.page.css'
})
export class ContactDetailPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly contactsService = inject(ContactsService);

  protected readonly isEditing = signal(false);
  protected readonly contact = signal<Contact | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    otherId: ['', [Validators.required]]
  });

  constructor() {
    this.loadContact();
  }

  protected startEdit(): void {
    const currentContact = this.contact();
    if (!currentContact) {
      return;
    }

    this.form.setValue({
      name: currentContact.name,
      mobile: currentContact.mobile,
      email: currentContact.email,
      otherId: currentContact.otherId
    });
    this.isEditing.set(true);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
  }

  protected save(): void {
    const currentContact = this.contact();
    if (!currentContact) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedContact = this.contactsService.update(currentContact.id, this.form.getRawValue());
    if (!updatedContact) {
      return;
    }

    this.contact.set(updatedContact);
    this.isEditing.set(false);
    this.toastr.success('Contact has been updated.', 'Success');
  }

  protected async deleteContact(): Promise<void> {
    const currentContact = this.contact();
    if (!currentContact) {
      return;
    }

    const result = await Swal.fire({
      title: 'Delete contact?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    const deleted = this.contactsService.delete(currentContact.id);
    if (deleted) {
      this.toastr.success('Contact has been deleted.', 'Deleted');
      void this.router.navigate(['/contacts']);
    }
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

  private loadContact(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (!contactId) {
      return;
    }

    const foundContact = this.contactsService.getById(contactId);
    if (!foundContact) {
      return;
    }

    this.contact.set(foundContact);
  }
}
