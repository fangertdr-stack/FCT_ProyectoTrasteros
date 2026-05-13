import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trastero-mediano',
  templateUrl: './mediano.html',
  styleUrls: ['./mediano.css']
})
export class Mediano {

  // variable para controlar la imagen actual en el carrusel
  currentIndex = 0;

  // array de imágenes para el carrusel
  images = [
    'assets/img/mediano1.jpg',
    'assets/img/mediano2.jpg',
    'assets/img/mediano3.jpg'
  ];

  constructor(private router: Router) { }


  // metodos para navegar por el carrusel
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  // metodo para ir a la imagen anterior en el carrusel
  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  // metodo para ir a una imagen especifica en el carrusel
  goTo(i: number) {
    this.currentIndex = i;
  }

  // metodo para navegar a la pagina de alquiler con el tamaño del trastero seleccionado
  rent() {
  this.router.navigate(['/rent'], {
    queryParams: { tamanio: 'mediano' }
  });
}

// metodo para volver a la pagina principal
  goBack() {
    this.router.navigate(['/']);
  }
}
