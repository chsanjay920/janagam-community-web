import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DialogService } from '../../../services/dialog-service';
import { RegistrationDataModel } from './registration-data-model';
import { CommonService } from '../../../services/common-service';


@Component({
  selector: 'app-admin-list-registrations',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './admin-list-registrations.html',
})
export class AdminListRegistrations implements OnInit {
  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private commonService: CommonService
  ) {}

  displayedColumns: string[] = [
    'actions','name','status','address','gender','dob','maritalStatus','mobile','email','aadhaar','subCaste','qualification','fatherName','motherName'
  ];
  data: RegistrationDataModel[] = [];

  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  sortActive = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterValue = '';
  filterSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const apiPageNumber = this.pageIndex + 1;
    let params = new HttpParams()
      .set('pagenumber', apiPageNumber.toString())
      .set('pagesize', this.pageSize.toString())
      .set('sortby', this.sortActive)
      .set('sortdirection', this.sortDirection || 'asc');

    if (this.filterValue) {
      params = params.set('filter', this.filterValue);
    }
    this.apiService.get<any>('api/admin/registrations', params).subscribe({
      next: (res) => {
        this.data = res.data;
        this.totalRows = res.count;
        this.loading = false; // hide loader after data is set
      },
      error: () => {
        this.data = [];
        this.totalRows = 0;
        this.loading = false; // hide loader even on error
      },
    });
  }
  getFullName(el: any): string {
    return this.commonService.getRegistrantFullName(el);
  }
  getFullAddress(address: any): string {
    return this.commonService.getFullAddress(address);
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(sort: Sort) {
    this.sortActive = sort.active;
    if (this.sortActive === 'Name') {
      this.sortActive = 'firstName';
    }
    this.sortDirection = sort.direction ? (sort.direction as 'asc' | 'desc') : 'asc';
    this.pageIndex = 0;
    this.loadData();
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue = value.trim().toLowerCase();
    this.pageIndex = 0;
    this.loadData();
  }
  getClass(status: string) {
    switch (status) {
      case 'APPROVED':
        return 'status-active';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  }
  onActionClick(action: string, row: any): void {
    console.log(`Action: ${action}, Row:`, row);
    switch (action) {
      case 'View':
        this.viewDetails(row);
        break;
      case 'Approve':
        this.approveRegistration(row._id);
        break;
      case 'Reject':
        this.rejectRegistration(row._id);
        break;
    }
  }
  approveRegistration(registrationId: string): void {
    this.apiService.post<any>('api/admin/registration/approve/' + registrationId, null).subscribe({
      next: (res) => {
        console.log('Registration approved:', res);
        this.loading = false;
        this.loadData();
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Registration Approved!',
          message: 'Registration approved successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
      error: () => {
        this.loading = false;
        this.loadData();
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Failed to Approve Registration!',
          message: 'Failed to approve registration. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
  rejectRegistration(registrationId: string): void {
    this.apiService.post<any>('api/admin/registration/reject/' + registrationId, null).subscribe({
      next: (res) => {
        console.log('Registration rejected:', res);
        this.loading = false;
        this.loadData();
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Registration Rejected!',
          message: 'Registration rejected successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
      error: () => {
        this.loading = false;
        this.loadData();
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Failed to Reject Registration!',
          message: 'Failed to reject registration. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }
  viewDetails(registrationData: any): void {
    this.dialogService.viewRegistrationDetails(registrationData);
  }
}
