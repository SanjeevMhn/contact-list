import { Injectable } from '@angular/core';

import { Contact, ContactInput } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private readonly storageKey = 'contacts';

  constructor() {
    this.seedIfEmpty();
  }

  getLatestContacts(): Contact[] {
    return this.readContacts().sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
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
      updatedAt: timestamp
    };

    contacts.push(contact);
    this.writeContacts(contacts);
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
    return updatedContact;
  }

  delete(id: string): boolean {
    const contacts = this.readContacts();
    const filteredContacts = contacts.filter((contact) => contact.id !== id);

    if (filteredContacts.length === contacts.length) {
      return false;
    }

    this.writeContacts(filteredContacts);
    return true;
  }

  private readContacts(): Contact[] {
    const rawContacts = localStorage.getItem(this.storageKey);
    if (!rawContacts) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawContacts);
      return Array.isArray(parsed) ? (parsed as Contact[]) : [];
    } catch {
      return [];
    }
  }

  private writeContacts(contacts: Contact[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
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
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Noah Smith',
        mobile: '+1 555-0142',
        email: 'noah.smith@example.com',
        otherId: 'noah_work',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Mia Lee',
        mobile: '+1 555-0199',
        email: 'mia.lee@example.com',
        otherId: 'mia_personal',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString()
      }
    ];

    this.writeContacts(sampleContacts);
  }
}
