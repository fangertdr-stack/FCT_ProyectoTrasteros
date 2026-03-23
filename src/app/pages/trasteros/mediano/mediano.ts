import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trastero-mediano',
  templateUrl: './mediano.html',
  styleUrls: ['./mediano.css']
})
export class Mediano {

  currentIndex = 0;

  images = [
    'assets/img/mediano1.jpg',
    'assets/img/mediano2.jpg',
    'assets/img/mediano3.jpg'
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