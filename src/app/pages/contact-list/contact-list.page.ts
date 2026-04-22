import { Component, computed, inject } from '@angular/core';
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

  protected readonly contacts = computed(() => this.contactsService.getLatestContacts());
}
