import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trastero-grande',
  templateUrl: './grande.html',
  styleUrls: ['./grande.css']
})
export class Grande {

  currentIndex = 0;

  images = [
    'assets/img/grande1.jpg',
    'assets/img/grande2.jpg',
    'assets/img/grande3.jpg'
  ];

  constructor(private router: Router) {}

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(i: number) {
    this.currentIndex = i;
  }

  rent() {
    this.router.navigate(['/rent']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}