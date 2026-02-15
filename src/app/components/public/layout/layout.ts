import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StarRating } from '../../../common-components/shared/star-rating/star-rating';
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

interface StatesResponse {
  ApprovedRegistration: number;
  AverageRating: number;
  TotalRatings: number;
  visitorsCount: number;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [StarRating, MatProgressBarModule],
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private apiService: ApiService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}
  isMenuOpen: boolean = false;
  productRating = 3;
  loading = false;
  usersStates!: StatesResponse;
  ngOnInit(): void {
    this.isMenuOpen = false;
    this.getStates();
    this.router.events
      .pipe(filter((event:any) => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlWithoutFragment = this.router.url.split('#')[0];
        this.location.replaceState(urlWithoutFragment);
      });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string) {
    this.isMenuOpen = false;
    this.viewportScroller.scrollToAnchor(sectionId);
  }
  redirect(route: string) {
    this.isMenuOpen = false;
    this.router.navigate([route]);
  }
  submitRating() {
    this.loading = true;
    this.apiService.post<any>('api/submitrating', { rating: this.productRating }).subscribe({
      next: (res) => {
        console.log('Rating submitted:', res);
        this.loading = false;
        this.dialogService.openDialog({
          dialogType: 'Success',
          title: 'Rating Submitted!',
          message: 'Your rating has been submitted successfully.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
      error: () => {
        this.loading = false;
        this.dialogService.openDialog({
          dialogType: 'Error',
          title: 'Failed to Submit Rating!',
          message: 'Failed to submit rating. Please try again.',
          buttons: ['OK'],
          actions: [() => {}],
        });
      },
    });
  }

  getStates() {
    this.loading = true;
    this.apiService.get<StatesResponse>('api/states').subscribe({
      next: (res) => {
        console.log('States response:', res);
        this.loading = false;
        this.usersStates = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('States API error:', err);
        this.cdr.detectChanges();
      },
    });
  }
}
