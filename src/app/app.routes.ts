import { Routes } from '@angular/router';
import { Login } from './components/public/login/login';
import { Layout } from './components/public/layout/layout';
import { PublicPortal } from './components/public/public-portal/public-portal';
import { AdminPortal } from './components/admin/admin-portal/admin-portal';
import { AdminListRegistrations } from './components/admin/admin-list-registrations/admin-list-registrations';
import { AdminStates } from './components/admin/admin-states/admin-states';
import { AdminProfile } from './components/admin/admin-profile/admin-profile';
import { authGuard } from './gaurds/auth-guard';
import { JoinCommunity } from './components/public/join-community/join-community';
import { CreateAdminUser } from './components/admin/create-admin-user/create-admin-user';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Layout },
  { path: 'login', component: Login },
  { path: 'explore', component: PublicPortal },
  { path: 'register', component: JoinCommunity },
  {
    path: 'admin',
    component: AdminPortal,
    children: [
      { path: '', redirectTo: 'registrations', pathMatch: 'full' },
      {
        path: 'registrations',
        component: AdminListRegistrations,
        canActivate: [authGuard],
      },
      { path: 'add-admin', component: CreateAdminUser, canActivate: [authGuard] },
      { path: 'admin-states', component: AdminStates, canActivate: [authGuard] },
      { path: 'admin-profile', component: AdminProfile, canActivate: [authGuard] },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
