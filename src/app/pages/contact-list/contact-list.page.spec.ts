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

  it('should filter contacts by name when searching', () => {
    contactsServiceMock.getLatestContacts.mockReturnValue([
      {
        id: '1',
        name: 'Alex Ray',
        mobile: '123',
        email: 'alex@example.com',
        otherId: 'alex_id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Bob Smith',
        mobile: '456',
        email: 'bob@example.com',
        otherId: 'bob_id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const fixture = TestBed.createComponent(ContactListPage);
    fixture.detectChanges();

    // Initially show all contacts
    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(2);
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).toContain('Bob Smith');

    // Search for 'Alex'
    const searchInput = element.querySelector('.search-input') as HTMLInputElement;
    searchInput.value = 'Alex';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Should only show Alex
    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).not.toContain('Bob Smith');

    // Search for 'smith' (case insensitive)
    searchInput.value = 'smith';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Should only show Bob
    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);
    expect(element.textContent).toContain('Bob Smith');
    expect(element.textContent).not.toContain('Alex Ray');

    // Clear search
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Should show all contacts again
    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(2);
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).toContain('Bob Smith');
  });

  it('should filter contacts by mobile, email, or otherId when searching', () => {
    contactsServiceMock.getLatestContacts.mockReturnValue([
      {
        id: '1',
        name: 'Alex Ray',
        mobile: '123-456-7890',
        email: 'alex@example.com',
        otherId: 'alex_work',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Bob Smith',
        mobile: '987-654-3210',
        email: 'bob@work.com',
        otherId: 'bob_personal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const fixture = TestBed.createComponent(ContactListPage);
    fixture.detectChanges();

    // Initially show all contacts
    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(2);
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).toContain('Bob Smith');

    // Search by mobile number
    const searchInput = element.querySelector('.search-input') as HTMLInputElement;
    searchInput.value = '123';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);
    expect(element.textContent).toContain('Alex Ray');
    expect(element.textContent).not.toContain('Bob Smith');

    // Search by email domain
    searchInput.value = '@work.com';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);
    expect(element.textContent).toContain('Bob Smith');
    expect(element.textContent).not.toContain('Alex Ray');

    // Search by otherId
    searchInput.value = 'personal';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);
    expect(element.textContent).toContain('Bob Smith');
    expect(element.textContent).not.toContain('Alex Ray');
  });

  it('should show empty state when no contacts match search', () => {
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

    // Initially show contact
    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.contact-link').length).toBe(1);

    // Search for non-existent term
    const searchInput = element.querySelector('.search-input') as HTMLInputElement;
    searchInput.value = 'zzz';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.empty')?.textContent).toContain('No contacts found matching your search');
  });
});
