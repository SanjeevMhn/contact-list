export interface Contact {
  id: string;
  name: string;
  mobile: string;
  email: string;
  otherId: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

export type ContactInput = Pick<Contact, 'name' | 'mobile' | 'email' | 'otherId'>;
