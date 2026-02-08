import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.html',
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

