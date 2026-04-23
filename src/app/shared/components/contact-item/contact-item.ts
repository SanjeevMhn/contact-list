import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;
  @Output() favoriteToggled = new EventEmitter<Contact>();

  toggleFavorite(): void {
    this.favoriteToggled.emit(this.contact);
  }
}
