import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { RegistrationDataModel } from '../../admin/admin-list-registrations/registration-data-model';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api-service';
import { CommonService } from '../../../services/common-service';
import { DialogService } from '../../../services/dialog-service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-portal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBar,
    CommonModule,
  ],
  templateUrl: './public-portal.html',
  styleUrl: './public-portal.css',
})
export class PublicPortal implements OnInit {
    isMenuOpen: boolean = false;
  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private commonService: CommonService,
    private router: Router
  ) {}
  displayedColumns: string[] = [
    'name',
    'status',
    'address',
    'gender',
    'dob',
    'maritalStatus',
    'mobile',
    'email',
    'aadhaar',
    'subCaste',
    'qualification',
    'fatherName',
    'motherName',
  ];
  dataSource = new MatTableDataSource<RegistrationDataModel>();
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
    this.apiService.get<any>('api/public/members', params).subscribe({
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
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  redirect(route: string, fragment: string = "") {
    this.isMenuOpen = false;
    this.router.navigate([route],{fragment: fragment});
  }
}
