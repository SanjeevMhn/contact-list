import { Routes } from '@angular/router';

import { ContactCreatePage } from './pages/contact-create/contact-create.page';
import { ContactDetailPage } from './pages/contact-detail/contact-detail.page';
import { ContactListPage } from './pages/contact-list/contact-list.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'contacts', component: ContactListPage },
  { path: 'contacts/new', component: ContactCreatePage },
  { path: 'contacts/:id', component: ContactDetailPage },
  { path: '**', redirectTo: 'login' }
];
