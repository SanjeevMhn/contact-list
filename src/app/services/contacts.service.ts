import { Injectable, signal, computed } from '@angular/core';

import { Contact, ContactInput } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private readonly storageKey = 'contacts';
  private readonly contactsSignal = signal<Contact[]>([]);

  constructor() {
    this.seedIfEmpty();
    // Initialize the signal with current contacts
    this.contactsSignal.set(this.readContacts());
  }

  // Signal for latest contacts (sorted by updatedAt descending)
  readonly latestContacts = computed(() => 
    [...this.contactsSignal()].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  );

  getLatestContacts(): Contact[] {
    return [...this.contactsSignal()].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  }

  getById(id: string): Contact | undefined {
    return this.readContacts().find((contact) => contact.id === id);
  }

    create(input: ContactInput): Contact {
      const contacts = this.readContacts();
      const timestamp = new Date().toISOString();

      const contact: Contact = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        mobile: input.mobile.trim(),
        email: input.email.trim(),
        otherId: input.otherId.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
        favorite: false
      };

      contacts.push(contact);
      this.writeContacts(contacts);
      // Update the signal
      this.contactsSignal.set(contacts);
      return contact;
    }

   update(id: string, input: ContactInput): Contact | undefined {
     const contacts = this.readContacts();
     const index = contacts.findIndex((contact) => contact.id === id);

     if (index < 0) {
       return undefined;
     }

     const updatedContact: Contact = {
       ...contacts[index],
       name: input.name.trim(),
       mobile: input.mobile.trim(),
       email: input.email.trim(),
       otherId: input.otherId.trim(),
       updatedAt: new Date().toISOString()
     };

     contacts[index] = updatedContact;
     this.writeContacts(contacts);
     // Update the signal
     this.contactsSignal.set(contacts);
     return updatedContact;
   }

    delete(id: string): boolean {
      const contacts = this.readContacts();
      const filteredContacts = contacts.filter((contact) => contact.id !== id);

      if (filteredContacts.length === contacts.length) {
        return false;
      }

      this.writeContacts(filteredContacts);
      // Update the signal
      this.contactsSignal.set(filteredContacts);
      return true;
    }

    toggleFavorite(id: string): Contact | undefined {
      const contacts = this.readContacts();
      const index = contacts.findIndex((contact) => contact.id === id);

      if (index < 0) {
        return undefined;
      }

      contacts[index] = {
        ...contacts[index],
        favorite: !contacts[index].favorite,
        updatedAt: new Date().toISOString()
      };

      this.writeContacts(contacts);
      // Update the signal
      this.contactsSignal.set(contacts);
      return contacts[index];
    }

    getFavoriteContacts(): Contact[] {
      return this.contactsSignal().filter(contact => contact.favorite);
    }

    private readContacts(): Contact[] {
      const rawContacts = localStorage.getItem(this.storageKey);
      if (!rawContacts) {
        return [];
      }

      try {
        const parsed = JSON.parse(rawContacts);
        const contacts = Array.isArray(parsed) ? (parsed as Contact[]) : [];
        // Ensure all contacts have a favorite property (for backward compatibility)
        return contacts.map(contact => ({
          ...contact,
          favorite: contact.favorite ?? false
        }));
      } catch {
        return [];
      }
    }

   private writeContacts(contacts: Contact[]): void {
     localStorage.setItem(this.storageKey, JSON.stringify(contacts));
     // Update the signal when writing to localStorage
     this.contactsSignal.set(contacts);
   }

   private seedIfEmpty(): void {
     if (this.readContacts().length > 0) {
       return;
     }

     const now = new Date();
     const sampleContacts: Contact[] = [
       {
         id: crypto.randomUUID(),
         name: 'Ava Johnson',
         mobile: '+1 555-0101',
         email: 'ava.johnson@example.com',
         otherId: 'ava_j',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
         favorite: false
       },
       {
         id: crypto.randomUUID(),
         name: 'Noah Smith',
         mobile: '+1 555-0142',
         email: 'noah.smith@example.com',
         otherId: 'noah_work',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
         favorite: true
       },
       {
         id: crypto.randomUUID(),
         name: 'Mia Lee',
         mobile: '+1 555-0199',
         email: 'mia.lee@example.com',
         otherId: 'mia_personal',
         createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
         updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
         favorite: false
       }
     ];

     this.writeContacts(sampleContacts);
   }
}
