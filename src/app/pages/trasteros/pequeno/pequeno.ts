import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trastero-pequeno',
  templateUrl: './pequeno.html',
  styleUrls: ['./pequeno.css']
})
export class Pequeno {

  currentIndex = 0;

  images = [
    'assets/img/trastero1.jpg',
    'assets/img/trastero2.jpg',
    'assets/img/trastero3.jpg'
  ];

  constructor(private router: Router) {}

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  rent() {
    this.router.navigate(['/rent']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

}