import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { ContactListPage } from './contact-list.page';
import { ContactsService } from '../../services/contacts.service';
import { ToastrService } from 'ngx-toastr';
import { Contact } from '../../models/contact.model';

describe('ContactListPage', () => {
  const contactsServiceMock = {
    latestContacts: signal<Contact[]>([]),
    toggleFavorite: vi.fn()
  };
  const toastrMock = {
    success: vi.fn()
  };

  beforeEach(async () => {
    contactsServiceMock.latestContacts = signal<Contact[]>([]);
    contactsServiceMock.toggleFavorite.mockReset();
    toastrMock.success.mockReset();

    await TestBed.configureTestingModule({
      imports: [ContactListPage],
      providers: [
        provideRouter([]),
        { provide: ContactsService, useValue: contactsServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactListPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize with ascending sort (oldest first)', () => {
    const fixture = TestBed.createComponent(ContactListPage);
    const component = fixture.componentInstance;
    expect(component.getSortIndicator()).toBe('↑');
  });

  it('should toggle sort order when toggleSort is called', () => {
    const fixture = TestBed.createComponent(ContactListPage);
    const component = fixture.componentInstance;
    
    // Initial state should be ascending
    expect(component.getSortIndicator()).toBe('↑');
    
    // After first toggle, should be descending
    component.toggleSort();
    expect(component.getSortIndicator()).toBe('↓');
    
    // After second toggle, should be ascending again
    component.toggleSort();
    expect(component.getSortIndicator()).toBe('↑');
  });

   it('should return contacts sorted by updatedAt in ascending order by default', () => {
     const now = new Date();
     contactsServiceMock.latestContacts.set([
       {
         id: '1',
         name: 'Oldest Contact',
         mobile: '111',
         email: 'oldest@example.com',
         otherId: 'oldest_id',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         favorite: false
       },
       {
         id: '2',
         name: 'Newest Contact',
         mobile: '222',
         email: 'newest@example.com',
         otherId: 'newest_id',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
         favorite: false
       }
     ] as Contact[]);

     const fixture = TestBed.createComponent(ContactListPage);
     fixture.detectChanges();

     const element = fixture.nativeElement as HTMLElement;
     expect(element.querySelectorAll('.contact-link').length).toBe(2);
     // First contact should be the oldest (since we're sorting ascending)
     expect(element.querySelectorAll('.contact-link')[0]?.textContent).toContain('Oldest Contact');
     expect(element.querySelectorAll('.contact-link')[1]?.textContent).toContain('Newest Contact');
   });

   it('should sort contacts in descending order when toggled', () => {
     const now = new Date();
     contactsServiceMock.latestContacts.set([
       {
         id: '1',
         name: 'Oldest Contact',
         mobile: '111',
         email: 'oldest@example.com',
         otherId: 'oldest_id',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         favorite: false
       },
       {
         id: '2',
         name: 'Newest Contact',
         mobile: '222',
         email: 'newest@example.com',
         otherId: 'newest_id',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
         favorite: false
       }
     ] as Contact[]);

     const fixture = TestBed.createComponent(ContactListPage);
     fixture.detectChanges();

     // Click to toggle sort
     const sortButton = fixture.nativeElement.querySelector('.sort-btn') as HTMLElement;
     sortButton.click();
     fixture.detectChanges();

     const element = fixture.nativeElement as HTMLElement;
     expect(element.querySelectorAll('.contact-link').length).toBe(2);
     // First contact should now be the newest (since we're sorting descending)
     expect(element.querySelectorAll('.contact-link')[0]?.textContent).toContain('Newest Contact');
     expect(element.querySelectorAll('.contact-link')[1]?.textContent).toContain('Oldest Contact');
   });

  it('should return contacts sorted by updatedAt in descending order when toggled', () => {
    const now = new Date();
    contactsServiceMock.latestContacts.set([
      {
        id: '1',
        name: 'Oldest Contact',
        mobile: '111',
        email: 'oldest@example.com',
        otherId: 'oldest_1',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        favorite: false
      },
      {
        id: '2',
        name: 'Newest Contact',
        mobile: '222',
        email: 'newest@example.com',
        otherId: 'newest_2',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        favorite: false
      },
      {
        id: '3',
        name: 'Middle Contact',
        mobile: '333',
        email: 'middle@example.com',
        otherId: 'middle_3',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        favorite: false
      }
    ]);

    const fixture = TestBed.createComponent(ContactListPage);
    const component = fixture.componentInstance;
    
    // Toggle to descending order (since default is now ascending)
    component.toggleSort();
    fixture.detectChanges();

    // Access the sortedContacts signal through the component
    const sortedContacts = component['sortedContacts']();

    expect(sortedContacts.length).toBe(3);
    // Should be ordered: newest (1 day ago), middle (2 days ago), oldest (3 days ago)
    expect(sortedContacts[0].id).toBe('2');
    expect(sortedContacts[0].name).toBe('Newest Contact');
    expect(sortedContacts[1].id).toBe('3');
    expect(sortedContacts[1].name).toBe('Middle Contact');
    expect(sortedContacts[2].id).toBe('1');
    expect(sortedContacts[2].name).toBe('Oldest Contact');
  });

  it('should maintain sort order when filtering contacts', () => {
    const now = new Date();
    contactsServiceMock.latestContacts.set([
      {
        id: '1',
        name: 'Alice Smith',
        mobile: '111',
        email: 'alice@example.com',
        otherId: 'alice_1',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        favorite: false
      },
      {
        id: '2',
        name: 'Bob Jones',
        mobile: '222',
        email: 'bob@example.com',
        otherId: 'bob_2',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        favorite: false
      },
      {
        id: '3',
        name: 'Charlie Brown',
        mobile: '333',
        email: 'charlie@example.com',
        otherId: 'charlie_3',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        favorite: false
      }
    ]);

    const fixture = TestBed.createComponent(ContactListPage);
    const component = fixture.componentInstance;
    
    // With ascending order as default
    fixture.detectChanges();
    
    // Filter for contacts with "Bob" in name
    component.setSearchTerm('Bob');
    fixture.detectChanges();

    // Access the sortedContacts signal through the component
    const sortedContacts = component['sortedContacts']();

    expect(sortedContacts.length).toBe(1);
    expect(sortedContacts[0].id).toBe('2');
    expect(sortedContacts[0].name).toBe('Bob Jones');
  });
});