import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ContactCreatePage } from './contact-create.page';
import { ContactsService } from '../../services/contacts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  template: ''
})
class DummyRouteComponent {}

describe('ContactCreatePage', () => {
  const contactsServiceMock = {
    create: vi.fn()
  };
  const toastrMock = {
    success: vi.fn()
  };

  beforeEach(async () => {
    contactsServiceMock.create.mockReset();
    toastrMock.success.mockReset();

    await TestBed.configureTestingModule({
      imports: [ContactCreatePage],
      providers: [
        provideRouter([{ path: 'contacts', component: DummyRouteComponent }]),
        { provide: ContactsService, useValue: contactsServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactCreatePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(ContactCreatePage);
    const component = fixture.componentInstance;

    (component as any).submit();

    expect(contactsServiceMock.create).not.toHaveBeenCalled();
  });

  it('submits valid form, creates contact, and shows toast', () => {
    const fixture = TestBed.createComponent(ContactCreatePage);
    const component = fixture.componentInstance;

    (component as any).form.setValue({
      name: 'Sam Doe',
      mobile: '+1 222',
      email: 'sam@example.com',
      otherId: 'sam_1'
    });

    (component as any).submit();

    expect(contactsServiceMock.create).toHaveBeenCalledWith({
      name: 'Sam Doe',
      mobile: '+1 222',
      email: 'sam@example.com',
      otherId: 'sam_1'
    });
    expect(toastrMock.success).toHaveBeenCalledWith('Contact has been added.', 'Success');
  });

  it('returns proper email validation message', () => {
    const fixture = TestBed.createComponent(ContactCreatePage);
    const component = fixture.componentInstance;

    (component as any).form.controls.email.setValue('bad-email');
    (component as any).form.controls.email.markAsTouched();

    expect((component as any).hasError('email')).toBe(true);
    expect((component as any).getErrorMessage('email')).toBe('Please enter a valid email address.');
  });
});
