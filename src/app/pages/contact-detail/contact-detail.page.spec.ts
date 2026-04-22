import { convertToParamMap } from '@angular/router';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import Swal from 'sweetalert2';
import { vi } from 'vitest';

import { ContactDetailPage } from './contact-detail.page';
import { ContactsService } from '../../services/contacts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  template: ''
})
class DummyRouteComponent {}

describe('ContactDetailPage', () => {
  const contact = {
    id: 'abc-123',
    name: 'Jane Doe',
    mobile: '+1 999',
    email: 'jane@example.com',
    otherId: 'jane_1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const contactsServiceMock = {
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  const toastrMock = {
    success: vi.fn()
  };

  beforeEach(async () => {
    contactsServiceMock.getById.mockReset();
    contactsServiceMock.update.mockReset();
    contactsServiceMock.delete.mockReset();
    toastrMock.success.mockReset();

    contactsServiceMock.getById.mockReturnValue(contact);

    await TestBed.configureTestingModule({
      imports: [ContactDetailPage],
      providers: [
        provideRouter([{ path: 'contacts', component: DummyRouteComponent }]),
        {
          provide: ContactsService,
          useValue: contactsServiceMock
        },
        {
          provide: ToastrService,
          useValue: toastrMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: contact.id })
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create and load contact from route id', () => {
    const fixture = TestBed.createComponent(ContactDetailPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(contactsServiceMock.getById).toHaveBeenCalledWith(contact.id);
    expect((fixture.componentInstance as any).contact()?.id).toBe(contact.id);
  });

  it('startEdit populates form and enters edit mode', () => {
    const fixture = TestBed.createComponent(ContactDetailPage);
    const component = fixture.componentInstance;

    (component as any).startEdit();

    expect((component as any).isEditing()).toBe(true);
    expect((component as any).form.getRawValue()).toEqual({
      name: contact.name,
      mobile: contact.mobile,
      email: contact.email,
      otherId: contact.otherId
    });
  });

  it('save updates contact and remains on detail page', () => {
    const fixture = TestBed.createComponent(ContactDetailPage);
    const component = fixture.componentInstance;
    (component as any).startEdit();
    (component as any).form.setValue({
      name: 'Jane Updated',
      mobile: '+1 555',
      email: 'jane.updated@example.com',
      otherId: 'jane_updated'
    });

    contactsServiceMock.update.mockReturnValue({
      ...contact,
      ...(component as any).form.getRawValue()
    });

    (component as any).save();

    expect(contactsServiceMock.update).toHaveBeenCalledWith(contact.id, {
      name: 'Jane Updated',
      mobile: '+1 555',
      email: 'jane.updated@example.com',
      otherId: 'jane_updated'
    });
    expect((component as any).isEditing()).toBe(false);
    expect(toastrMock.success).toHaveBeenCalledWith('Contact has been updated.', 'Success');
  });

  it('deleteContact deletes after confirmation and shows toast', async () => {
    const fixture = TestBed.createComponent(ContactDetailPage);
    const component = fixture.componentInstance;

    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as any);
    contactsServiceMock.delete.mockReturnValue(true);

    await (component as any).deleteContact();

    expect(contactsServiceMock.delete).toHaveBeenCalledWith(contact.id);
    expect(toastrMock.success).toHaveBeenCalledWith('Contact has been deleted.', 'Deleted');
  });
});
