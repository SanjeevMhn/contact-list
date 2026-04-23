import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../../../models/contact.model';

import { ContactItem } from './contact-item';

describe('ContactItem', () => {
  let component: ContactItem;
  let fixture: ComponentFixture<ContactItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactItem, RouterLink],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactItem);
    component = fixture.componentInstance;
    
    // Set a mock contact for testing
    component.contact = {
      id: '1',
      name: 'Test Contact',
      mobile: '1234567890',
      email: 'test@example.com',
      otherId: 'test_id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false
    } as Contact;
    
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
