import { ViewportScroller } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import ScrollReveal from 'scrollreveal';
import Swiper from 'swiper';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
constructor(private viewportScroller: ViewportScroller,private router: Router) {}

  scrollToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
  redirect(route:string)
  {
    this.router.navigate([route]);
  }
}

