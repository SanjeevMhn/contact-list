import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/contact.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-list-page',
  imports: [RouterLink],
  templateUrl: './contact-list.page.html',
  styleUrl: './contact-list.page.css'
})
export class ContactListPage {
  private readonly contactsService = inject(ContactsService);
  private readonly toastr = inject(ToastrService);
  protected readonly searchTerm = signal('');
  private readonly sortAscending = signal<boolean>(true);
  protected readonly showFavoritesOnly = signal(false);

  protected readonly contacts = this.contactsService.latestContacts;
  protected readonly filteredContacts = computed(() => {
    let contacts = this.contacts();
    
    // Filter by favorites if enabled
    if (this.showFavoritesOnly()) {
      contacts = contacts.filter((contact: Contact) => contact.favorite);
    }
    
    // Filter by search term
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) {
      return contacts;
    }
    
    return contacts.filter((contact: Contact) => 
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

   toggleFavorite(contact: Contact): void {
     const updatedContact = this.contactsService.toggleFavorite(contact.id);
     if (updatedContact) {
       if (updatedContact.favorite) {
         this.toastr.success('Added to Favorites', 'Success');
       } else {
         this.toastr.success('Removed from Favorites', 'Success');
       }
     }
   }

  toggleFavoritesView(): void {
    this.showFavoritesOnly.set(!this.showFavoritesOnly());
  }
}
