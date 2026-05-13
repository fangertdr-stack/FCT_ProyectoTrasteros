import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trastero-pequeno',
  templateUrl: './pequeno.html',
  styleUrls: ['./pequeno.css']
})
export class Pequeno {

  // variable para controlar la imagen actual en el carrusel
  currentIndex = 0;

  // array de imagenes para el carrusel
  images = [
    'assets/img/trastero1.jpg',
    'assets/img/trastero2.jpg',
    'assets/img/trastero3.jpg'
  ];

  constructor(private router: Router) { }

  // metodo para navegar por el carrusel
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  // metodo para ir a una imagen especifica en el carrusel
  goTo(index: number) {
    this.currentIndex = index;
  }

  // metodo para navegar a la pagina de alquiler con el tamaño del trastero seleccionado
  rent() {
  this.router.navigate(['/rent'], {
    queryParams: { tamanio: 'pequeño' }
  });
}

// metodo para volver a la pagina principal
  goBack() {
    this.router.navigate(['/']);
  }

}
