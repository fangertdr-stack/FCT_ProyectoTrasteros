import { Component, OnInit, inject, signal } from '@angular/core';
import { TrasteroService } from '../../services/trasteroService';
import { Trastero } from '../../models/trastero';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css']
})
export class UserPage implements OnInit {

  private trasteroService = inject(TrasteroService);
  private router = inject(Router);


  trastero = signal<Trastero[]>([]);
  usuarioId: number | null = null;



  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {

    if (typeof window === 'undefined') return;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.init();
      });

    // primera carga
    this.init();
  }

  private init(): void {

    const userRaw = localStorage.getItem('id_usuario');




    console.log('USER RAW:', userRaw);

    if (!userRaw) {
      this.error.set('No hay usuario logueado');
      this.cargando.set(false);
      return;
    }

    this.usuarioId = Number(userRaw);

    console.log('USER ID:', this.usuarioId);

    this.loadTrasteros();
  }

  private loadTrasteros(): void {

    if (!this.usuarioId) return;

    console.log('LLAMANDO API...');

    this.cargando.set(true);

    this.trasteroService.getMisTrasteros(this.usuarioId)
      .subscribe({
        next: (data) => {

          console.log('RESPUESTA API:', data);

          this.trastero.set(Array.isArray(data) ? data : []);

          this.cargando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error cargando datos');
          this.cargando.set(false);
        }
      });
  }

  calcularPrecioTotal(t: Trastero): number {

    // valido que las fechas existan para evitar error si no hay fechas devuelve 0 porque se declararon
    //en la interfaz que podia no existir fechas
    if(!t.fechaInicio || !t.fecha_fin){
      return 0
    }

    //convierto string a objeto date
  const inicio = new Date(t.fechaInicio);
  const fin = new Date(t.fecha_fin);

  //creo constante meses que es un calculo de años pero calculado en meses con el +1 incluyo el primer mes
  const meses =
    (fin.getFullYear() - inicio.getFullYear()) * 12 +
    (fin.getMonth() - inicio.getMonth());

    //devuelve numero de meses por el precio mensual del trastero
  return meses * t.precio;
}

  goBack() {
    this.router.navigate(['']);
  }
}
