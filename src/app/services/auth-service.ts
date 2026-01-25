import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLoggedIn()
  {
    return sessionStorage.getItem('authToken') !== null;
  }
}
