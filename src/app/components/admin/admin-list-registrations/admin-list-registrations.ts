import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
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
  dataSource = new MatTableDataSource<RegistrationDataModel>();
  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;
  statusFilter = '';
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  sortActive = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterValue = '';

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
    if (this.statusFilter) {
      params = params.set('status', this.statusFilter);
    }
    this.apiService.get<any>('api/admin/registrations', params).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.totalRows = res.count;
        this.loading = false; // hide loader after data is set
      },
      error: () => {
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
  onStatusFilterChange(value: string) {
    this.statusFilter = value;
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
      case 'Edit':
        this.editDetails(row);
        break;
      case 'Approve':
        this.approveRegistration(row._id);
        break;
      case 'Reject':
        this.rejectRegistration(row._id);
        break;
      case 'Delete':
        this.confirmDelete(row);
        break;
    }
  }
  confirmDelete(row: any): void {
    this.dialogService.openDialog({
      dialogType: 'Warning',
      title: 'Delete Registration?',
      message: `This will permanently remove ${this.getFullName(row)} from the Registration List.`,
      buttons: ['Cancel', 'Delete'],
      actions: [
        () => {},
        () => this.deleteRegistration(row._id),
      ],
    });
  }
  deleteRegistration(registrationId: string): void {
    this.apiService.delete<any>(`api/admin/registration/${registrationId}`).subscribe({
      next: () => {
        this.loadData();
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Registration Deleted!',
          message: 'The registration has been deleted successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
      error: () => {
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Delete Failed!',
          message: 'Unable to delete the registration. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
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
  editDetails(registrationData: any): void {
    const dialogRef = this.dialogService.editRegistration({
      record: registrationData,
      mode: 'admin',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
