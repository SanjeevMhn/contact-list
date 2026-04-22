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
        updatedAt: '2026-01-01T00:00:00.000Z'
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
        updatedAt: '2026-01-01T00:00:00.000Z'
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
        updatedAt: '2026-01-01T00:00:00.000Z'
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
        updatedAt: '2026-01-01T00:00:00.000Z'
      }
    ]);

    const service = new ContactsService();
    const deleted = service.delete('abc');
    const deletedMissing = service.delete('missing-id');

    expect(deleted).toBe(true);
    expect(deletedMissing).toBe(false);
    expect(getStoredContacts().length).toBe(0);
  });
});
