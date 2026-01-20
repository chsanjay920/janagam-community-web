import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Layout } from './layout/layout';
import { PublicPortal } from './public-portal/public-portal';
import { JoinCommunity } from './join-community/join-community';


export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Layout },
    { path: 'login', component: Login },
    { path: 'explore', component: PublicPortal },
    { path: 'register', component: JoinCommunity },
    { path: '**', redirectTo: 'dashboard' },
];
