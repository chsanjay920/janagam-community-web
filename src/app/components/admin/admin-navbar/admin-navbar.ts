import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterOutlet],
  templateUrl: './admin-navbar.html',
})
export class AdminNavbar {
  constructor(private router: Router) {}
  redirect(route: string) {
    this.router.navigate([route]);
  }
  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    this.router.navigate(['dashboard']);
  }
}
