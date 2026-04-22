import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ContactListPage } from './contact-list.page';
import { ContactsService } from '../../services/contacts.service';

describe('ContactListPage', () => {
  const contactsServiceMock = {
    getLatestContacts: vi.fn()
  };

  beforeEach(async () => {
    contactsServiceMock.getLatestContacts.mockReset();

    await TestBed.configureTestingModule({
      imports: [ContactListPage],
      providers: [
        provideRouter([]),
        { provide: ContactsService, useValue: contactsServiceMock }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactListPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows empty state when no contacts exist', () => {
    contactsServiceMock.getLatestContacts.mockReturnValue([]);

    const fixture = TestBed.createComponent(ContactListPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.empty')?.textContent).toContain('No contacts found');
  });

  it('renders only contact names when contacts exist', () => {
    contactsServiceMock.getLatestContacts.mockReturnValue([
      {
        id: '1',
        name: 'Alex Ray',
        mobile: '123',
        email: 'alex@example.com',
        otherId: 'alex_id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const fixture = TestBed.createComponent(ContactListPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).not.toContain('alex@example.com');
    expect(element.textContent).not.toContain('123');
  });
});
