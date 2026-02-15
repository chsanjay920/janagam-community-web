import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  @Input() rating: number = 0;
  @Input() maxStars: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: number = 24;

  @Output() ratingChange = new EventEmitter<number>();

  hoverValue: number = 0;

  setRating(value: number): void {
    if (this.readonly) return;

    this.rating = value;
    this.ratingChange.emit(this.rating);
  }

  setHover(value: number): void {
    if (!this.readonly) {
      this.hoverValue = value;
    }
  }

  clearHover(): void {
    this.hoverValue = 0;
  }

  getStarFill(index: number): string {
    const current = this.hoverValue || this.rating;

    if (current >= index + 1) {
      return 'full';
    } else if (current > index && current < index + 1) {
      return 'half';
    } else {
      return 'empty';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
