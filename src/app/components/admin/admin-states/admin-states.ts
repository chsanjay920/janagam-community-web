import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { CommonModule } from '@angular/common';

interface AdminStatesResponse {
  TotalMembers: number;
  PendingRegistration: number;
  ApprovedRegistration: number;
  RejectedRegistration: number;
  AverageRating: number;
  TotalRatings: number;
  VisitorsCount: number;
}
@Component({
  selector: 'app-admin-states',
  imports: [CommonModule],
  templateUrl: './admin-states.html',
})
export class AdminStates {
  usersStates: AdminStatesResponse = {
    TotalMembers: 0,
    PendingRegistration: 0,
    ApprovedRegistration: 0,
    RejectedRegistration: 0,
    AverageRating: 0,
    TotalRatings: 0,
    VisitorsCount: 0,
  };
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.getStates();
  }
  getStates() {
    this.apiService
      .get<AdminStatesResponse>('api/admin/states')
      .subscribe((response: AdminStatesResponse) => {
        this.usersStates = response;
        this.cdr.detectChanges();
      });
  }
}
