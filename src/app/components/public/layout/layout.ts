import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StarRating } from "../../../common-components/shared/star-rating/star-rating";
import { ApiService } from '../../../services/api-service';
import { DialogService } from '../../../services/dialog-service';
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'app-layout',
  imports: [StarRating, MatProgressBarModule],
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private apiService: ApiService,
    private dialogService:DialogService
  ) {}
  isMenuOpen: boolean = false;
  productRating = 3;
  loading = false;
  ngOnInit(): void {
    this.isMenuOpen = false;
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
}
