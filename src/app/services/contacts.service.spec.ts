import { ContactsService } from './contacts.service';
import { Contact } from '../models/contact.model';

describe('ContactsService', () => {
  const storageKey = 'contacts';

  const setStoredContacts = (contacts: Contact[]): void => {
    localStorage.setItem(storageKey, JSON.stringify(contacts));
  };

  const getStoredContacts = (): Contact[] => {
    return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Contact[];
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('seeds initial contacts when storage is empty', () => {
    const service = new ContactsService();

    const contacts = service.getLatestContacts();

    expect(contacts.length).toBe(3);
    expect(contacts.map((c) => c.name)).toContain('Ava Johnson');
  });

    it('creates a new contact and persists trimmed values', () => {
     setStoredContacts([
       {
         id: '1',
         name: 'Jane',
         mobile: '111',
         email: 'jane@example.com',
         otherId: 'j_1',
         createdAt: '2026-01-01T00:00:00.000Z',
         updatedAt: '2026-01-01T00:00:00.000Z',
         favorite: false
       }
     ]);

     const service = new ContactsService();
     const created = service.create({
       name: '  Sam  ',
       mobile: '  +1 123  ',
       email: '  sam@example.com  ',
       otherId: '  sam_id  '
     });

     const stored = getStoredContacts();
      expect(stored.length).toBe(2);
      expect(created.name).toBe('Sam');
      expect(created.mobile).toBe('+1 123');
      expect(created.email).toBe('sam@example.com');
      expect(created.otherId).toBe('sam_id');
    });

    it('gets contact by id', () => {
     setStoredContacts([
       {
         id: 'abc',
         name: 'Alex',
         mobile: '123',
         email: 'alex@example.com',
         otherId: 'alex_1',
         createdAt: '2026-01-01T00:00:00.000Z',
         updatedAt: '2026-01-01T00:00:00.000Z',
         favorite: false
       }
     ]);

     const service = new ContactsService();
     const found = service.getById('abc');

     expect(found?.name).toBe('Alex');
   });

    it('updates an existing contact and persists changes', () => {
     setStoredContacts([
       {
         id: 'abc',
         name: 'Alex',
         mobile: '123',
         email: 'alex@example.com',
         otherId: 'alex_1',
         createdAt: '2026-01-01T00:00:00.000Z',
         updatedAt: '2026-01-01T00:00:00.000Z',
         favorite: false
       }
     ]);

     const service = new ContactsService();
     const updated = service.update('abc', {
       name: '  Alex Updated ',
       mobile: ' 456 ',
       email: ' alex.updated@example.com ',
       otherId: ' alex_2 '
     });

      const stored = getStoredContacts();
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Alex Updated');
      expect(updated?.mobile).toBe('456');
      expect(stored[0].email).toBe('alex.updated@example.com');
      expect(stored[0].otherId).toBe('alex_2');
    });

    it('deletes a contact by id and returns status', () => {
     setStoredContacts([
       {
         id: 'abc',
         name: 'Alex',
         mobile: '123',
         email: 'alex@example.com',
         otherId: 'alex_1',
         createdAt: '2026-01-01T00:00:00.000Z',
         updatedAt: '2026-01-01T00:00:00.000Z',
         favorite: false
       }
     ]);

     const service = new ContactsService();
     const deleted = service.delete('abc');
     const deletedMissing = service.delete('missing-id');

     expect(deleted).toBe(true);
     expect(deletedMissing).toBe(false);
     expect(getStoredContacts().length).toBe(0);
   });

   it('returns contacts sorted by updatedAt in descending order (newest first)', () => {
     const now = new Date();
     setStoredContacts([
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
         otherId: 'middle_1',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         favorite: false
       }
     ]);

    const service = new ContactsService();
    const contacts = service.getLatestContacts();

    expect(contacts.length).toBe(3);
    // Should be ordered: newest (1 day ago), middle (2 days ago), oldest (3 days ago)
    expect(contacts[0].id).toBe('2');
    expect(contacts[0].name).toBe('Newest Contact');
    expect(contacts[1].id).toBe('3');
    expect(contacts[1].name).toBe('Middle Contact');
    expect(contacts[2].id).toBe('1');
    expect(contacts[2].name).toBe('Oldest Contact');
  });

  it('maintains original order for contacts with identical updatedAt timestamps', () => {
    const timestamp = new Date().toISOString();
    setStoredContacts([
      {
        id: '1',
        name: 'First Contact',
        mobile: '111',
        email: 'first@example.com',
        otherId: 'first_1',
        createdAt: timestamp,
        updatedAt: timestamp,
        favorite: false 
      },
      {
        id: '2',
        name: 'Second Contact',
        mobile: '222',
        email: 'second@example.com',
        otherId: 'second_2',
        createdAt: timestamp,
        updatedAt: timestamp,
        favorite: false 
      },
      {
        id: '3',
        name: 'Third Contact',
        mobile: '333',
        email: 'third@example.com',
        otherId: 'third_3',
        createdAt: timestamp,
        updatedAt: timestamp,
        favorite: false 
      }
    ]);

    const service = new ContactsService();
    const contacts = service.getLatestContacts();

    expect(contacts.length).toBe(3);
    // With identical timestamps, sort should be unstable but we expect original order to be maintained
    // (though not guaranteed by JS sort, Array.sort is stable in modern browsers)
    expect(contacts[0].id).toBe('1');
    expect(contacts[0].name).toBe('First Contact');
    expect(contacts[1].id).toBe('2');
    expect(contacts[1].name).toBe('Second Contact');
    expect(contacts[2].id).toBe('3');
    expect(contacts[2].name).toBe('Third Contact');
  });
});
