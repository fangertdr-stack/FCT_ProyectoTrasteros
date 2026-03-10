import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-errors',
  imports: [MatIconModule,MatCardModule],
  templateUrl: './errors.html',
  styleUrl: './errors.css',
})
export class Errors {

  constructor(private nav : NavigationService) {}

  // Metodo para volver a la pagina principal
  volverAtras(){
    this.nav.goBack();
  }

}
