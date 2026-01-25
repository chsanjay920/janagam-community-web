import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  imports: [],
  templateUrl: './admin-profile.html',
})
export class AdminProfile {
  userData:any;
  ngOnInit(): void {
    const d = sessionStorage.getItem('userData');
    debugger
    this.userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  }
}
