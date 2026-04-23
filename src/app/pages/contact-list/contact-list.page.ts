import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-list-page',
  imports: [RouterLink],
  templateUrl: './contact-list.page.html',
  styleUrl: './contact-list.page.css'
})
export class ContactListPage {
  private readonly contactsService = inject(ContactsService);
  private readonly searchTerm = signal('');
  private readonly sortAscending = signal<boolean>(true);

  protected readonly contacts = computed(() => this.contactsService.getLatestContacts());
  protected readonly filteredContacts = computed(() => {
    const contacts = this.contacts();
    const search = this.searchTerm().toLowerCase().trim();
    
    if (!search) {
      return contacts;
    }
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(search) ||
      contact.mobile.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.otherId.toLowerCase().includes(search)
    );
  });

  protected readonly sortedContacts = computed(() => {
    const contacts = this.filteredContacts();
    return [...contacts].sort((a, b) => {
      const dateA = Date.parse(a.updatedAt);
      const dateB = Date.parse(b.updatedAt);
      
      if (this.sortAscending()) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  });

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  toggleSort(): void {
    this.sortAscending.set(!this.sortAscending());
  }

  getSortIndicator(): string {
    return this.sortAscending() ? '↑' : '↓';
  }
}
